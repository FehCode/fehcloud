import { useState, useEffect, useCallback } from "react";
import { CloudFile, FileStats, formatFileSize } from "@/types/file";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const DEFAULT_QUOTA = 100 * 1024 * 1024 * 1024; // 100GB default (Free plan)
const SIGNED_URL_TTL_SECONDS = 600; // 10 minutes for signed URLs

export const useSupabaseFileStorage = () => {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [quotaBytes, setQuotaBytes] = useState<number>(DEFAULT_QUOTA);

  // Load files from Supabase
  const loadFiles = useCallback(async () => {
    if (!user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      // Load user quota (plan-based)
      const { data: plan, error: planError } = await supabase
        .from("user_plans")
        .select("quota_bytes")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!planError && plan?.quota_bytes) {
        setQuotaBytes(Number(plan.quota_bytes));
      }

      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading files:", error);
        toast({
          title: "Erro ao carregar arquivos",
          description: "Não foi possível carregar os arquivos salvos.",
          variant: "destructive",
        });
      } else {
        const cloudFiles: CloudFile[] = await Promise.all(
          data.map(async (file) => {
            // Get signed URL for file access
            const { data: urlData } = await supabase.storage
              .from('user-files')
              .createSignedUrl(file.storage_path, SIGNED_URL_TTL_SECONDS); // 10 min expiry
            return {
              id: file.id,
              name: file.name,
              size: file.size,
              type: file.type,
              uploadDate: file.created_at,
              url: urlData?.signedUrl,
            };
          })
        );
        setFiles(cloudFiles);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast({
        title: "Erro ao carregar arquivos",
        description: "Não foi possível carregar os arquivos salvos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Add new files
  const addFiles = useCallback(async (newFiles: File[]) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer upload de arquivos.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const currentSize = files.reduce((total, file) => total + file.size, 0);
      const newFilesSize = newFiles.reduce((total, file) => total + file.size, 0);

      if (currentSize + newFilesSize > quotaBytes) {
        toast({
          title: "Limite excedido",
          description: "Não há espaço suficiente para todos os arquivos.",
          variant: "destructive",
        });
        return false;
      }

      for (const file of newFiles) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('user-files')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast({
            title: "Erro no upload",
            description: `Falha ao fazer upload de ${file.name}.`,
            variant: "destructive",
          });
          continue;
        }

        // Save file metadata to database
        const { error: dbError } = await supabase
          .from("files")
          .insert({
            user_id: user.id,
            name: file.name,
            size: file.size,
            type: file.type,
            storage_path: filePath,
          });

        if (dbError) {
          console.error("Database error:", dbError);
          // Clean up storage file if database insert fails
          await supabase.storage.from('user-files').remove([filePath]);
          toast({
            title: "Erro no upload",
            description: `Falha ao salvar metadados de ${file.name}.`,
            variant: "destructive",
          });
          continue;
        }
      }

      // Reload files after upload
      await loadFiles();

      toast({
        title: "Upload concluído",
        description: `${newFiles.length} arquivo(s) adicionado(s) com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error("Error adding files:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload dos arquivos.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, files, quotaBytes, loadFiles]);

  // Download file
  const downloadFile = useCallback(async (file: CloudFile) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para baixar arquivos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get file record from database
      const { data: fileRecord, error: dbError } = await supabase
        .from("files")
        .select("storage_path")
        .eq("id", file.id)
        .eq("user_id", user.id)
        .single();

      if (dbError || !fileRecord) {
        throw new Error("Arquivo não encontrado");
      }

      // Download from Supabase Storage
      const { data, error } = await supabase.storage
        .from('user-files')
        .download(fileRecord.storage_path);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: `Download de "${file.name}" iniciado.`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive",
      });
    }
  }, [user]);

  // Delete file
  const deleteFile = useCallback(async (fileId: string) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para excluir arquivos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get file record from database
      const { data: fileRecord, error: dbError } = await supabase
        .from("files")
        .select("storage_path")
        .eq("id", fileId)
        .eq("user_id", user.id)
        .single();

      if (dbError || !fileRecord) {
        throw new Error("Arquivo não encontrado");
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([fileRecord.storage_path]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId)
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));

      toast({
        title: "Arquivo excluído",
        description: "Arquivo removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o arquivo.",
        variant: "destructive",
      });
    }
  }, [user]);

  // Rename file
  const renameFile = useCallback(async (fileId: string, newName: string) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para renomear arquivos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("files")
        .update({ name: newName })
        .eq("id", fileId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileId ? { ...file, name: newName } : file
        )
      );

      toast({
        title: "Arquivo renomeado",
        description: `Arquivo renomeado para "${newName}" com sucesso.`,
      });
    } catch (error) {
      console.error("Error renaming file:", error);
      toast({
        title: "Erro ao renomear",
        description: "Não foi possível renomear o arquivo.",
        variant: "destructive",
      });
    }
  }, [user]);

  // Get storage statistics
  const getStats = useCallback((): FileStats => {
    const totalSize = files.reduce((total, file) => total + file.size, 0);
    const usedPercentage = quotaBytes > 0 ? (totalSize / quotaBytes) * 100 : 0;

    return {
      totalFiles: files.length,
      totalSize,
      usedPercentage: Math.min(usedPercentage, 100),
      quotaBytes,
    };
  }, [files, quotaBytes]);

  const stats = getStats();

  return {
    files,
    loading,
    addFiles,
    downloadFile,
    deleteFile,
    renameFile,
    stats: {
      ...stats,
      totalSizeFormatted: formatFileSize(stats.totalSize),
    },
    refetch: loadFiles,
  };
};