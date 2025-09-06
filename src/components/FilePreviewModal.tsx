import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudFile, formatFileSize, getFileIcon } from "@/types/file";
import { Download, ExternalLink, X } from "lucide-react";
import { motion } from "framer-motion";

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
  const isText = file.type.startsWith('text/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');

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
          className="relative rounded-lg overflow-hidden bg-muted"
        >
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-96 mx-auto object-contain"
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
          className="relative rounded-lg overflow-hidden bg-muted h-96"
        >
          <iframe
            src={file.url}
            className="w-full h-full"
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
          className="relative rounded-lg overflow-hidden bg-muted"
        >
          <video
            controls
            className="max-w-full max-h-96 mx-auto"
            preload="metadata"
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
          className="flex flex-col items-center space-y-4 p-8"
        >
          <div className="text-6xl">🎵</div>
          <audio controls className="w-full max-w-md">
            <source src={file.url} type={file.type} />
            Seu navegador não suporta reprodução de áudio.
          </audio>
        </motion.div>
      );
    }

    // Fallback para outros tipos de arquivo
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center space-y-4 p-12 text-center"
      >
        <div className="text-6xl">{getFileIcon(file.type)}</div>
        <h3 className="text-lg font-medium">Visualização não disponível</h3>
        <p className="text-muted-foreground">
          Este tipo de arquivo não pode ser visualizado no navegador.
        </p>
        {file.url && (
          <Button
            variant="outline"
            onClick={() => window.open(file.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir em nova aba
          </Button>
        )}
      </motion.div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate pr-4">
                {file.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {formatFileSize(file.size)} • {fileDate}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(file)}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full flex items-center justify-center"
          >
            {renderPreview()}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;