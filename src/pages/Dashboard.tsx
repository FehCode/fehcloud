import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import { Button } from "@/components/ui/button";
import { useSupabaseFileStorage } from "@/hooks/useSupabaseFileStorage";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, FolderOpen, Share2, RotateCcw, RefreshCw } from "lucide-react";
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
        quotaBytes={stats.quotaBytes}
      />
      
      <main className="min-h-screen">
        {/* Hero Section with Quick Stats */}
        <section className="gradient-card border-b border-border shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-3xl lg:text-4xl font-bold">
                Bem-vindo ao seu{" "}
                <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  Cloud Storage
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gerencie seus arquivos com segurança, compartilhe com facilidade e colabore em tempo real.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-primary">{stats.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">Arquivos</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-primary">{stats.totalSizeFormatted}</div>
                  <div className="text-sm text-muted-foreground">Usado</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-primary">50GB</div>
                  <div className="text-sm text-muted-foreground">Limite Pro</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-primary">{Math.round(stats.usedPercentage)}%</div>
                  <div className="text-sm text-muted-foreground">Ocupado</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
          {/* Upload Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold mb-2">Upload de Arquivos</h2>
                <p className="text-muted-foreground">
                  Arraste e solte seus arquivos ou clique para selecionar. Limite de 50GB por arquivo no plano Pro.
                </p>
              </motion.div>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
            
            {/* Quick Actions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="gradient-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Criar nova pasta compartilhada"
                    tabIndex={0}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                    Nova Pasta Compartilhada
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Compartilhar arquivo"
                    tabIndex={0}
                  >
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Compartilhar Arquivo
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Ver histórico de arquivos"
                    tabIndex={0}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                    Ver Histórico
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Sincronização offline"
                    tabIndex={0}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                    Sincronização Offline
                  </Button>
                </div>
              </div>
              
              {/* Storage Usage */}
              <div className="gradient-card border border-border rounded-xl p-6" role="region" aria-label="Informações de armazenamento">
                <h3 className="font-semibold text-lg mb-4">Armazenamento</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Usado</span>
                    <span>{stats.totalSizeFormatted} de 2TB</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2" aria-label="Barra de uso de armazenamento" tabIndex={0} role="progressbar" aria-valuenow={Math.round(stats.usedPercentage)} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`Você usou ${stats.totalSizeFormatted} de 2TB`}>
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-foreground h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(stats.usedPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Plano Pro ativo - Recursos avançados disponíveis
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Files Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-2">Meus Arquivos</h2>
              <p className="text-muted-foreground">
                {files.length === 0 
                  ? "Nenhum arquivo ainda. Faça seu primeiro upload acima!"
                  : `${files.length} arquivo(s) • ${stats.totalSizeFormatted} usados • Sincronização automática ativa`
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
        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;