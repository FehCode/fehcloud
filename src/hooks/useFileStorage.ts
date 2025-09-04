import { useState, useEffect, useCallback } from "react";
import { CloudFile, FileStats, formatFileSize } from "@/types/file";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "fehclaude_files";
const MAX_STORAGE_SIZE = 100 * 1024 * 1024; // 100MB limit for demo

export const useFileStorage = () => {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load files from localStorage
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem(STORAGE_KEY);
      if (savedFiles) {
        setFiles(JSON.parse(savedFiles));
      }
    } catch (error) {
      console.error("Error loading files from storage:", error);
      toast({
        title: "Erro ao carregar arquivos",
        description: "Não foi possível carregar os arquivos salvos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Save files to localStorage
  const saveFiles = useCallback((updatedFiles: CloudFile[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Error saving files to storage:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os arquivos. Limite de armazenamento atingido.",
        variant: "destructive",
      });
    }
  }, []);

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Add new files
  const addFiles = useCallback(async (newFiles: File[]) => {
    try {
      const currentSize = files.reduce((total, file) => total + file.size, 0);
      const newFilesSize = newFiles.reduce((total, file) => total + file.size, 0);

      if (currentSize + newFilesSize > MAX_STORAGE_SIZE) {
        toast({
          title: "Limite excedido",
          description: "Não há espaço suficiente para todos os arquivos.",
          variant: "destructive",
        });
        return false;
      }

      const cloudFiles: CloudFile[] = await Promise.all(
        newFiles.map(async (file) => {
          const data = await fileToBase64(file);
          return {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            data,
          };
        })
      );

      const updatedFiles = [...files, ...cloudFiles];
      saveFiles(updatedFiles);

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
  }, [files, saveFiles]);

  // Download file
  const downloadFile = useCallback((file: CloudFile) => {
    try {
      if (!file.data) {
        throw new Error("Dados do arquivo não encontrados");
      }

      // Convert base64 back to blob
      const byteCharacters = atob(file.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.type });
      const url = URL.createObjectURL(blob);

      // Create download link
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
  }, []);

  // Delete file
  const deleteFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    saveFiles(updatedFiles);

    toast({
      title: "Arquivo excluído",
      description: "Arquivo removido com sucesso.",
    });
  }, [files, saveFiles]);

  // Get storage statistics
  const getStats = useCallback((): FileStats => {
    const totalSize = files.reduce((total, file) => total + file.size, 0);
    const usedPercentage = (totalSize / MAX_STORAGE_SIZE) * 100;

    return {
      totalFiles: files.length,
      totalSize,
      usedPercentage: Math.min(usedPercentage, 100),
    };
  }, [files]);

  const stats = getStats();

  return {
    files,
    loading,
    addFiles,
    downloadFile,
    deleteFile,
    stats: {
      ...stats,
      totalSizeFormatted: formatFileSize(stats.totalSize),
    },
  };
};