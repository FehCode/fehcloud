import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudFile, formatFileSize, getFileIcon } from "@/types/file";
import { Download, ExternalLink, X, FileText, PlayCircle, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilePreviewModalProps {
  file: CloudFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: CloudFile) => void;
}

const FilePreviewModal = ({ file, isOpen, onClose, onDownload }: FilePreviewModalProps) => {
  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const isText = file.type.startsWith('text/') || file.type.includes('document') || file.type.includes('word');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  const isCode = file.type.includes('javascript') || file.type.includes('json') || file.type.includes('css') || file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.jsx');

  const fileDate = new Date(file.uploadDate).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const renderPreview = () => {
    if (isImage && file.url) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl overflow-hidden bg-muted shadow-xl"
        >
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-[500px] mx-auto object-contain rounded-xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </motion.div>
      );
    }

    if (isPDF && file.url) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl overflow-hidden bg-muted shadow-xl"
          style={{ height: '500px' }}
        >
          <iframe
            src={`${file.url}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full rounded-xl"
            title={file.name}
          />
        </motion.div>
      );
    }

    if (isVideo && file.url) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl overflow-hidden bg-muted shadow-xl"
        >
          <video
            controls
            className="max-w-full max-h-[500px] mx-auto rounded-xl"
            preload="metadata"
            poster={file.url}
          >
            <source src={file.url} type={file.type} />
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </motion.div>
      );
    }

    if (isAudio && file.url) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-6 p-12 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="p-6 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
          >
            <Music className="h-12 w-12" />
          </motion.div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{file.name}</h3>
            <p className="text-sm text-muted-foreground">Arquivo de áudio</p>
          </div>
          <audio controls className="w-full max-w-md">
            <source src={file.url} type={file.type} />
            Seu navegador não suporta reprodução de áudio.
          </audio>
        </motion.div>
      );
    }

    // Preview especial para arquivos de texto/código
    if (isText || isCode) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-6 p-12 bg-gradient-to-br from-muted/50 to-card rounded-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="p-6 rounded-full bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg"
          >
            <FileText className="h-12 w-12" />
          </motion.div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{file.name}</h3>
            <p className="text-sm text-muted-foreground">Documento de texto</p>
          </div>
          {file.url && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.open(file.url, '_blank')}
                className="transition-all hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir em nova aba
              </Button>
              <Button
                onClick={() => onDownload(file)}
                className="transition-all hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar arquivo
              </Button>
            </div>
          )}
        </motion.div>
      );
    }

    // Fallback para outros tipos de arquivo
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-6 p-12 text-center bg-gradient-to-br from-muted/30 to-card/50 rounded-xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl opacity-80"
        >
          {getFileIcon(file.type)}
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Visualização não disponível</h3>
          <p className="text-muted-foreground max-w-md">
            Este tipo de arquivo não pode ser visualizado diretamente no navegador, mas você pode baixá-lo ou abri-lo em uma nova aba.
          </p>
        </div>
        {file.url && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(file.url, '_blank')}
              className="transition-all hover:scale-105"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir em nova aba
            </Button>
            <Button
              onClick={() => onDownload(file)}
              className="transition-all hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar arquivo
            </Button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-6xl w-full max-h-[90vh] flex flex-col p-0 gap-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl font-semibold truncate pr-4 flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(file.type)}</span>
                      {file.name}
                    </DialogTitle>
                    <DialogDescription className="mt-2 flex items-center gap-4 text-sm">
                      <span className="font-medium">{formatFileSize(file.size)}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{fileDate}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                        {file.type}
                      </span>
                    </DialogDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(file)}
                        className="shadow-sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="shadow-sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-auto p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="h-full flex items-center justify-center min-h-[400px]"
                >
                  {renderPreview()}
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default FilePreviewModal;