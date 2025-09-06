import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudFile } from "@/types/file";
import { Loader2 } from "lucide-react";

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
    if (!file || !newName.trim()) return;

    setIsLoading(true);
    try {
      // Pega a extensão original do arquivo
      const extension = file.name.match(/\.[^/.]+$/)?.[0] || "";
      const finalName = newName.trim() + extension;
      
      await onRename(file.id, finalName);
      onClose();
    } catch (error) {
      console.error("Erro ao renomear arquivo:", error);
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Renomear arquivo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filename">Nome do arquivo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="filename"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Digite o novo nome"
                  disabled={isLoading}
                  className="flex-1"
                  autoFocus
                />
                {extension && (
                  <span className="text-sm text-muted-foreground font-mono">
                    {extension}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p><strong>Nome atual:</strong> {file.name}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !newName.trim()}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Renomear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameFileModal;