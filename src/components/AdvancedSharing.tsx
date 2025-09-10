import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Users, Calendar, Shield, Link, QrCode, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudFile } from "@/types/file";

interface AdvancedSharingProps {
  file: CloudFile;
  onClose: () => void;
}

const AdvancedSharing = ({ file, onClose }: AdvancedSharingProps) => {
  const [shareSettings, setShareSettings] = useState({
    hasPassword: false,
    password: "",
    expiresAt: "",
    allowDownload: true,
    allowPreview: true,
    trackViews: true,
    notifyOnAccess: false,
    maxDownloads: 0,
    emails: [""]
  });

  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const linkId = Math.random().toString(36).substr(2, 10);
    const link = `${baseUrl}/shared/${linkId}`;
    setShareLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addEmailField = () => {
    setShareSettings(prev => ({
      ...prev,
      emails: [...prev.emails, ""]
    }));
  };

  const updateEmail = (index: number, email: string) => {
    setShareSettings(prev => ({
      ...prev,
      emails: prev.emails.map((e, i) => i === index ? email : e)
    }));
  };

  const removeEmail = (index: number) => {
    setShareSettings(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      <div className="text-center border-b border-border pb-4">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
          <div className="p-2 rounded-full gradient-primary">
            <Share2 className="h-5 w-5 text-primary-foreground" />
          </div>
          Compartilhamento Avançado
        </h2>
        <p className="text-muted-foreground mt-2">
          Configure opções avançadas para compartilhar "{file.name}"
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configurações de Acesso */}
        <Card className="gradient-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Segurança e Acesso
            </CardTitle>
            <CardDescription>
              Configure restrições de acesso ao arquivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Proteger com senha</Label>
                <div className="text-sm text-muted-foreground">
                  Requer senha para acessar
                </div>
              </div>
              <Switch
                checked={shareSettings.hasPassword}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, hasPassword: checked }))
                }
              />
            </div>

            <AnimatePresence>
              {shareSettings.hasPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    type="password"
                    placeholder="Digite a senha"
                    value={shareSettings.password}
                    onChange={(e) => 
                      setShareSettings(prev => ({ ...prev, password: e.target.value }))
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label>Data de expiração</Label>
              <Input
                type="datetime-local"
                value={shareSettings.expiresAt}
                onChange={(e) => 
                  setShareSettings(prev => ({ ...prev, expiresAt: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Limite de downloads (0 = ilimitado)</Label>
              <Input
                type="number"
                min="0"
                value={shareSettings.maxDownloads}
                onChange={(e) => 
                  setShareSettings(prev => ({ ...prev, maxDownloads: parseInt(e.target.value) || 0 }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card className="gradient-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Permissões
            </CardTitle>
            <CardDescription>
              Defina o que os usuários podem fazer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Permitir download</Label>
                <div className="text-sm text-muted-foreground">
                  Usuários podem baixar o arquivo
                </div>
              </div>
              <Switch
                checked={shareSettings.allowDownload}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, allowDownload: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Permitir visualização</Label>
                <div className="text-sm text-muted-foreground">
                  Usuários podem ver o arquivo online
                </div>
              </div>
              <Switch
                checked={shareSettings.allowPreview}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, allowPreview: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Rastrear visualizações</Label>
                <div className="text-sm text-muted-foreground">
                  Monitore quem acessou o arquivo
                </div>
              </div>
              <Switch
                checked={shareSettings.trackViews}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, trackViews: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificar acesso</Label>
                <div className="text-sm text-muted-foreground">
                  Receba emails quando alguém acessar
                </div>
              </div>
              <Switch
                checked={shareSettings.notifyOnAccess}
                onCheckedChange={(checked) => 
                  setShareSettings(prev => ({ ...prev, notifyOnAccess: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Convites por Email */}
      <Card className="gradient-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Convidar por Email
          </CardTitle>
          <CardDescription>
            Envie convites diretos para emails específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shareSettings.emails.map((email, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                className="flex-1"
              />
              {shareSettings.emails.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeEmail(index)}
                  className="px-3"
                >
                  ×
                </Button>
              )}
            </motion.div>
          ))}
          <Button
            variant="outline"
            onClick={addEmailField}
            className="w-full"
          >
            + Adicionar Email
          </Button>
        </CardContent>
      </Card>

      {/* Link de Compartilhamento */}
      {shareLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="gradient-card border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-primary" />
                Link de Compartilhamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Input
                  value={shareLink}
                  readOnly
                  className="border-0 bg-transparent"
                />
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className={copied ? "bg-success text-success-foreground" : ""}
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {shareSettings.expiresAt ? `Expira em ${new Date(shareSettings.expiresAt).toLocaleDateString('pt-BR')}` : 'Sem expiração'}
                </Badge>
                {shareSettings.hasPassword && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Protegido por senha
                  </Badge>
                )}
                {shareSettings.maxDownloads > 0 && (
                  <Badge variant="secondary">
                    Máx. {shareSettings.maxDownloads} downloads
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <div className="flex items-center gap-2">
          {!shareLink && (
            <Button
              onClick={generateShareLink}
              className="gradient-primary text-primary-foreground"
            >
              <Link className="h-4 w-4 mr-2" />
              Gerar Link
            </Button>
          )}
          {shareLink && (
            <Button
              className="gradient-primary text-primary-foreground"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Enviar Convites
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedSharing;