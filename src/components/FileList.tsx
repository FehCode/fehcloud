import React, { useState } from "react";
import { Grid, List, Search, Download, Trash2, Eye, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CloudFile, formatFileSize, getFileIcon } from "@/types/file";
import { motion, AnimatePresence } from "framer-motion";
import FilePreviewModal from "./FilePreviewModal";
import RenameFileModal from "./RenameFileModal";

interface FileListProps {
  files: CloudFile[];
  onDownload: (file: CloudFile) => void;
  onDelete: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => Promise<void>;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const FileList = ({ files, onDownload, onDelete, onRename, viewMode, onViewModeChange }: FileListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [previewFile, setPreviewFile] = useState<CloudFile | null>(null);
  const [renameFile, setRenameFile] = useState<CloudFile | null>(null);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const FileItem = ({ file }: { file: CloudFile }) => {
    const fileIcon = getFileIcon(file.type);
    const fileDate = new Date(file.uploadDate).toLocaleDateString('pt-BR');

    if (viewMode === "grid") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.03, y: -5 }}
          className="group gradient-card rounded-xl border border-border p-4 transition-smooth hover:shadow-medium"
        >
          <div className="flex items-start justify-between mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="text-2xl"
            >
              {fileIcon}
            </motion.div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 shadow-sm"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-card/95 backdrop-blur-md border border-border/50 shadow-xl"
              >
                <DropdownMenuItem 
                  onClick={() => setPreviewFile(file)}
                  className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <div className="p-1.5 rounded-md bg-blue-500/20">
                    <Eye className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <span className="font-medium">Visualizar</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setRenameFile(file)}
                  className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <div className="p-1.5 rounded-md bg-orange-500/20">
                    <Edit className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                  <span className="font-medium">Renomear</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => onDownload(file)}
                  className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <div className="p-1.5 rounded-md bg-green-500/20">
                    <Download className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">Baixar</span>
                </DropdownMenuItem>
                
                <div className="h-px bg-border/50 my-1" />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      onSelect={(e) => e.preventDefault()}
                      className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-destructive/10 transition-colors text-destructive"
                    >
                      <div className="p-1.5 rounded-md bg-red-500/20">
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </div>
                      <span className="font-medium">Excluir</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-500/20">
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        Excluir arquivo
                      </AlertDialogTitle>
                      <AlertDialogDescription className="pt-2">
                        Tem certeza que deseja excluir <strong>"{file.name}"</strong>? 
                        <br />
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(file.id)} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="font-medium text-sm leading-tight truncate" title={file.name}>
              {file.name}
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{formatFileSize(file.size)}</p>
              <p>{fileDate}</p>
            </div>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ scale: 1.01, x: 5 }}
        className="group flex items-center justify-between p-4 gradient-card rounded-xl border border-border transition-smooth hover:shadow-soft"
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="text-2xl"
          >
            {fileIcon}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <h3 className="font-medium truncate" title={file.name}>
              {file.name}
            </h3>
            <div className="text-sm text-muted-foreground">
              {formatFileSize(file.size)} • {fileDate}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0, x: 20 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setPreviewFile(file)}
              className="h-8 w-8 p-0 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/20"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setRenameFile(file)}
              className="h-8 w-8 p-0 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/20"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDownload(file)}
              className="h-8 w-8 p-0 bg-green-500/10 hover:bg-green-500/20 text-green-600 border border-green-500/20"
            >
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-500/20">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  Excluir arquivo
                </AlertDialogTitle>
                <AlertDialogDescription className="pt-2">
                  Tem certeza que deseja excluir <strong>"{file.name}"</strong>? 
                  <br />
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(file.id)} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Search and View Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between gap-4"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative flex-1 max-w-md"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Files Display */}
      <AnimatePresence mode="wait">
        {filteredFiles.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-4"
            >
              📁
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-medium mb-2"
            >
              {searchTerm ? "Nenhum arquivo encontrado" : "Nenhum arquivo ainda"}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              {searchTerm 
                ? "Tente pesquisar por outro termo" 
                : "Faça upload do seu primeiro arquivo para começar"
              }
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="files"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              ${viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-2"
              }
            `}
          >
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FileItem file={file} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={onDownload}
      />
      
      <RenameFileModal
        file={renameFile}
        isOpen={!!renameFile}
        onClose={() => setRenameFile(null)}
        onRename={onRename}
      />
    </motion.div>
  );
};

export default FileList;