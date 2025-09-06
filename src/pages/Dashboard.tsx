import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import { useSupabaseFileStorage } from "@/hooks/useSupabaseFileStorage";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { files, loading, addFiles, downloadFile, deleteFile, renameFile, stats } = useSupabaseFileStorage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleFileUpload = async (newFiles: File[]) => {
    await addFiles(newFiles);
  };

  if (authLoading || loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Carregando FehClaude...</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <Header
        totalFiles={stats.totalFiles}
        totalSize={stats.totalSizeFormatted}
        usedSpace={stats.usedPercentage}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold mb-2">Upload de Arquivos</h2>
            <p className="text-muted-foreground">
              Arraste e solte seus arquivos ou clique para selecionar. Máximo 10MB por arquivo.
            </p>
          </motion.div>
          <FileUpload onFileUpload={handleFileUpload} />
        </motion.section>

        {/* Files Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold mb-2">Meus Arquivos</h2>
            <p className="text-muted-foreground">
              {files.length === 0 
                ? "Nenhum arquivo ainda. Faça seu primeiro upload acima!"
                : `${files.length} arquivo(s) • ${stats.totalSizeFormatted} usados`
              }
            </p>
          </motion.div>
          
          <FileList
            files={files}
            onDownload={downloadFile}
            onDelete={deleteFile}
            onRename={renameFile}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </motion.section>
      </main>
    </motion.div>
  );
};

export default Dashboard;