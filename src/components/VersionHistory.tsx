import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { History, Download, RotateCcw, Eye, FileText, User, Calendar, FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudFile, formatFileSize } from "@/types/file";

interface FileVersion {
  id: string;
  version: number;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  isCurrentVersion: boolean;
  changeDescription?: string;
}

interface VersionHistoryProps {
  file: CloudFile;
  onRestore: (versionId: string) => void;
  onDownload: (versionId: string) => void;
  onPreview: (versionId: string) => void;
}

const VersionHistory = ({ file, onRestore, onDownload, onPreview }: VersionHistoryProps) => {
  // Mock data - em produção, isso viria da API
  const [versions] = useState<FileVersion[]>([
    {
      id: "v4",
      version: 4,
      size: file.size,
      uploadDate: file.uploadDate,
      uploadedBy: "Você",
      isCurrentVersion: true,
      changeDescription: "Versão atual"
    },
    {
      id: "v3",
      version: 3,
      size: file.size - 1024,
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: "João Silva",
      isCurrentVersion: false,
      changeDescription: "Atualização de conteúdo"
    },
    {
      id: "v2",
      version: 2,
      size: file.size - 2048,
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: "Maria Santos",
      isCurrentVersion: false,
      changeDescription: "Correções e melhorias"
    },
    {
      id: "v1",
      version: 1,
      size: file.size - 3072,
      uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: "Você",
      isCurrentVersion: false,
      changeDescription: "Versão inicial"
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Ontem";
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center border-b border-border pb-4">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
          <div className="p-2 rounded-full gradient-primary">
            <History className="h-5 w-5 text-primary-foreground" />
          </div>
          Histórico de Versões
        </h2>
        <p className="text-muted-foreground mt-2">
          Versões anteriores de "{file.name}" (últimos 30 dias)
        </p>
      </div>

      <Card className="gradient-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Informações do Arquivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Nome do arquivo</div>
              <div className="font-medium">{file.name}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Tamanho atual</div>
              <div className="font-medium">{formatFileSize(file.size)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total de versões</div>
              <div className="font-medium">{versions.length} versões</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Histórico de Versões
        </h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {versions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`gradient-card border transition-smooth hover:shadow-medium ${
                  version.isCurrentVersion ? 'border-primary/50 bg-primary/5' : 'border-border'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <FileIcon className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Versão {version.version}</span>
                            {version.isCurrentVersion && (
                              <Badge className="gradient-primary text-primary-foreground">
                                Atual
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {version.uploadedBy}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(version.uploadDate)}
                            </div>
                            <div>
                              {formatFileSize(version.size)}
                            </div>
                          </div>
                          
                          {version.changeDescription && (
                            <div className="text-sm text-muted-foreground italic">
                              {version.changeDescription}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPreview(version.id)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownload(version.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        
                        {!version.isCurrentVersion && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-orange-500/20">
                                    <RotateCcw className="h-5 w-5 text-orange-600" />
                                  </div>
                                  Restaurar Versão
                                </AlertDialogTitle>
                                <AlertDialogDescription className="pt-2">
                                  Tem certeza que deseja restaurar a <strong>Versão {version.version}</strong>? 
                                  <br />
                                  A versão atual será arquivada e você poderá restaurá-la depois.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-3">
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onRestore(version.id)}
                                  className="bg-orange-500 text-white hover:bg-orange-600"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Restaurar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Card className="gradient-card border border-border bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Política de Retenção</div>
              <div className="text-sm text-muted-foreground">
                Versões são mantidas por 30 dias no plano Pro. Após esse período, apenas a versão atual é preservada.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VersionHistory;