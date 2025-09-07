import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudFile, getFileIcon } from "@/types/file";
import { Loader2, Edit3, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface RenameFileModalProps {
  file: CloudFile | null;
  isOpen: boolean;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => Promise<void>;
}

const RenameFileModal = ({ file, isOpen, onClose, onRename }: RenameFileModalProps) => {
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (file && isOpen) {
      // Remove a extensão do nome para facilitar a edição
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setNewName(nameWithoutExtension);
    }
  }, [file, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !newName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, digite um nome válido para o arquivo.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Pega a extensão original do arquivo
      const extension = file.name.match(/\.[^/.]+$/)?.[0] || "";
      const finalName = newName.trim() + extension;
      
      // Verifica se o nome não mudou
      if (finalName === file.name) {
        toast({
          title: "Nenhuma alteração",
          description: "O nome do arquivo não foi alterado.",
          variant: "default",
        });
        onClose();
        return;
      }
      
      await onRename(file.id, finalName);
      onClose();
      setNewName("");
    } catch (error) {
      console.error("Erro ao renomear arquivo:", error);
      toast({
        title: "Erro ao renomear",
        description: "Não foi possível renomear o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setNewName("");
    }
  };

  if (!file) return null;

  const extension = file.name.match(/\.[^/.]+$/)?.[0] || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <DialogHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    <Edit3 className="h-6 w-6 text-primary" />
                  </div>
                  <DialogTitle className="text-xl font-semibold">Renomear arquivo</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Preview do arquivo atual */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">Arquivo atual</p>
                    </div>
                  </motion.div>

                  {/* Campo de edição */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="filename" className="text-sm font-medium">
                      Novo nome do arquivo
                    </Label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="filename"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Digite o novo nome"
                          disabled={isLoading}
                          className="pl-10 h-11"
                          autoFocus
                          maxLength={100}
                        />
                      </div>
                      {extension && (
                        <div className="px-3 py-2 bg-muted rounded-md border">
                          <span className="text-sm font-mono text-muted-foreground">
                            {extension}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Preview do novo nome */}
                    {newName.trim() && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-2 bg-primary/5 rounded-md border border-primary/20"
                      >
                        <p className="text-xs text-muted-foreground mb-1">Novo nome:</p>
                        <p className="text-sm font-medium text-primary">
                          {newName.trim()}{extension}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <DialogFooter className="gap-3 pt-6 border-t">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="min-w-[100px]"
                    >
                      Cancelar
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading || !newName.trim()}
                      className="min-w-[100px]"
                    >
                      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {isLoading ? "Renomeando..." : "Renomear"}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default RenameFileModal;