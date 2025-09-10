import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FolderOpen, Plus, Users, Share2, Settings, UserPlus, Crown, Eye, Edit, Trash2, Calendar, FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudFile, formatFileSize } from "@/types/file";

interface SharedFolder {
  id: string;
  name: string;
  description: string;
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: "owner" | "editor" | "viewer";
    joinedAt: string;
  }>;
  files: CloudFile[];
  createdAt: string;
  totalSize: number;
  isPublic: boolean;
}

interface SharedFoldersProps {
  onCreateFolder: () => void;
}

const SharedFolders = ({ onCreateFolder }: SharedFoldersProps) => {
  const [folders] = useState<SharedFolder[]>([
    {
      id: "folder1",
      name: "Projeto Marketing 2024",
      description: "Materiais e recursos para campanhas de marketing",
      owner: {
        id: "user1",
        name: "João Silva",
        email: "joao@empresa.com"
      },
      members: [
        {
          id: "user1",
          name: "João Silva",
          email: "joao@empresa.com",
          role: "owner",
          joinedAt: "2024-01-15T00:00:00Z"
        },
        {
          id: "user2",
          name: "Maria Santos",
          email: "maria@empresa.com",
          role: "editor",
          joinedAt: "2024-01-16T00:00:00Z"
        },
        {
          id: "user3",
          name: "Pedro Costa",
          email: "pedro@empresa.com",
          role: "viewer",
          joinedAt: "2024-01-18T00:00:00Z"
        }
      ],
      files: [],
      createdAt: "2024-01-15T00:00:00Z",
      totalSize: 1024 * 1024 * 150, // 150MB
      isPublic: false
    },
    {
      id: "folder2",
      name: "Recursos Compartilhados",
      description: "Documentos e templates para toda a equipe",
      owner: {
        id: "user2",
        name: "Maria Santos",
        email: "maria@empresa.com"
      },
      members: [
        {
          id: "user2",
          name: "Maria Santos",
          email: "maria@empresa.com",
          role: "owner",
          joinedAt: "2024-01-10T00:00:00Z"
        },
        {
          id: "user1",
          name: "João Silva",
          email: "joao@empresa.com",
          role: "editor",
          joinedAt: "2024-01-11T00:00:00Z"
        }
      ],
      files: [],
      createdAt: "2024-01-10T00:00:00Z",
      totalSize: 1024 * 1024 * 75, // 75MB
      isPublic: true
    }
  ]);

  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<SharedFolder | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-600" />;
      case "editor":
        return <Edit className="h-3 w-3 text-blue-600" />;
      case "viewer":
        return <Eye className="h-3 w-3 text-gray-600" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleInviteMember = (folder: SharedFolder) => {
    setSelectedFolder(folder);
    setShowInviteModal(true);
  };

  const sendInvite = () => {
    // Aqui enviaria o convite
    console.log(`Enviando convite para ${newInviteEmail} para a pasta ${selectedFolder?.name}`);
    setNewInviteEmail("");
    setShowInviteModal(false);
    setSelectedFolder(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-full gradient-primary">
              <FolderOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            Pastas Compartilhadas
          </h2>
          <p className="text-muted-foreground mt-2">
            Colabore em tempo real com sua equipe
          </p>
        </div>
        
        <Button
          onClick={onCreateFolder}
          className="gradient-primary text-primary-foreground shadow-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Pasta
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{folders.length}</div>
                <div className="text-sm text-muted-foreground">Pastas compartilhadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {folders.reduce((acc, folder) => acc + folder.members.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Membros total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <FileIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatFileSize(folders.reduce((acc, folder) => acc + folder.totalSize, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Armazenamento usado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pastas */}
      <div className="space-y-4">
        <AnimatePresence>
          {folders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="gradient-card border border-border transition-smooth hover:shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{folder.name}</span>
                          {folder.isPublic && (
                            <Badge variant="secondary" className="text-xs">
                              <Share2 className="h-3 w-3 mr-1" />
                              Público
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {folder.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInviteMember(folder)}
                        className="text-primary border-primary hover:bg-primary/10"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Convidar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Informações da pasta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Criado em</div>
                        <div className="font-medium">{formatDate(folder.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Tamanho</div>
                        <div className="font-medium">{formatFileSize(folder.totalSize)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Arquivos</div>
                        <div className="font-medium">{folder.files.length} arquivos</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Proprietário</div>
                        <div className="font-medium">{folder.owner.name}</div>
                      </div>
                    </div>

                    {/* Membros */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          Membros ({folder.members.length})
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {folder.members.slice(0, 6).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{member.name}</span>
                              <Badge
                                variant="outline"
                                className={`text-xs h-5 ${getRoleColor(member.role)}`}
                              >
                                {getRoleIcon(member.role)}
                                <span className="ml-1 capitalize">{member.role}</span>
                              </Badge>
                            </div>
                          </div>
                        ))}
                        
                        {folder.members.length > 6 && (
                          <div className="flex items-center justify-center p-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
                            +{folder.members.length - 6} mais
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {folders.length === 0 && (
        <Card className="gradient-card border border-dashed border-border">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nenhuma pasta compartilhada</h3>
                <p className="text-muted-foreground">
                  Crie sua primeira pasta compartilhada para colaborar com sua equipe
                </p>
              </div>
              <Button
                onClick={onCreateFolder}
                className="gradient-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Pasta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Convite */}
      <AlertDialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              Convidar Membro
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Convide alguém para colaborar na pasta "{selectedFolder?.name}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do convidado</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Nível de acesso</Label>
              <Select defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-600" />
                      Visualizador - Pode apenas ver arquivos
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-blue-600" />
                      Editor - Pode editar e adicionar arquivos
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={sendInvite}
              className="gradient-primary text-primary-foreground"
              disabled={!newInviteEmail}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Enviar Convite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default SharedFolders;