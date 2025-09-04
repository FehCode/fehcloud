import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileIcon, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadStatus("uploading");
    setErrorMessage("");
    
    // Simulate upload progress
    const progressMap: Record<string, number> = {};
    
    for (const file of acceptedFiles) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`Arquivo ${file.name} excede o limite de 10MB`);
        setUploadStatus("error");
        return;
      }
      
      progressMap[file.name] = 0;
      setUploadProgress(progressMap);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        progressMap[file.name] += Math.random() * 30;
        
        if (progressMap[file.name] >= 100) {
          progressMap[file.name] = 100;
          clearInterval(progressInterval);
        }
        
        setUploadProgress({ ...progressMap });
      }, 200);
      
      // Wait for upload completion
      await new Promise(resolve => {
        const checkCompletion = () => {
          if (progressMap[file.name] >= 100) {
            resolve(null);
          } else {
            setTimeout(checkCompletion, 100);
          }
        };
        checkCompletion();
      });
    }
    
    setUploadStatus("success");
    onFileUpload(acceptedFiles);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setUploadStatus("idle");
      setUploadProgress({});
    }, 2000);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.csv'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  const isUploading = uploadStatus === "uploading";
  const uploadingFiles = Object.keys(uploadProgress);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div {...getRootProps()}>
        <motion.div
          whileHover={{ scale: isDragActive ? 1.02 : 1.01 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            scale: isDragActive ? 1.02 : 1,
          }}
          className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center
            transition-smooth cursor-pointer gradient-card
            ${isDragActive ? 'bg-accent/30 border-primary' : 'hover:bg-accent/10 border-border hover:border-primary/50'}
            ${isUploading ? 'pointer-events-none opacity-75' : ''}
          `}
        >
          <input {...getInputProps()} />
        
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {uploadStatus === "success" ? (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <CheckCircle className="h-12 w-12 text-success mx-auto" />
              </motion.div>
            ) : uploadStatus === "error" ? (
              <motion.div
                key="error"
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isDragActive ? 1.1 : 1, 
                  opacity: 1,
                  y: isDragActive ? -5 : 0
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4 }}
              >
                <Upload className="h-12 w-12 text-primary mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            animate={{
              scale: isDragActive ? 1.05 : 1
            }}
          >
            <AnimatePresence mode="wait">
              {isDragActive ? (
                <motion.p
                  key="drag-active"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-medium text-primary"
                >
                  Solte os arquivos aqui
                </motion.p>
              ) : uploadStatus === "success" ? (
                <motion.p
                  key="success-text"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-lg font-medium text-success"
                >
                  Upload concluído com sucesso!
                </motion.p>
              ) : uploadStatus === "error" ? (
                <motion.p
                  key="error-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-lg font-medium text-destructive"
                >
                  Erro no upload
                </motion.p>
              ) : (
                <motion.div
                  key="default-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-lg font-medium">Arraste arquivos aqui ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Suporte a imagens, documentos, PDFs e mais. Máximo 10MB por arquivo.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <AnimatePresence>
            {!isUploading && uploadStatus !== "success" && uploadStatus !== "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="gradient-primary text-primary-foreground shadow-medium">
                  <FileIcon className="h-4 w-4 mr-2" />
                  Selecionar Arquivos
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </motion.div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {uploadingFiles.map((fileName, index) => (
              <motion.div
                key={fileName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 gradient-card rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate">{fileName}</span>
                  <motion.span
                    key={uploadProgress[fileName]}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-xs text-muted-foreground"
                  >
                    {Math.round(uploadProgress[fileName])}%
                  </motion.span>
                </div>
                <Progress 
                  value={uploadProgress[fileName]} 
                  className="h-2"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {uploadStatus === "error" && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUpload;