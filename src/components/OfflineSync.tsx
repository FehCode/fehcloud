import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WifiOff, Wifi, Download, Upload, RefreshCw, HardDrive, Clock, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudFile, formatFileSize } from "@/types/file";

interface OfflineSyncProps {
  files: CloudFile[];
}

interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: string;
  pendingUploads: number;
  pendingDownloads: number;
  totalOfflineSize: number;
  syncProgress: number;
  isSyncing: boolean;
}

const OfflineSync = ({ files }: OfflineSyncProps) => {
  const [offlineSettings, setOfflineSettings] = useState({
    autoSync: true,
    syncOnWifiOnly: true,
    maxOfflineSize: 2, // GB
    syncInterval: 15 // minutes
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSyncTime: new Date().toISOString(),
    pendingUploads: 3,
    pendingDownloads: 1,
    totalOfflineSize: 1.2,
    syncProgress: 0,
    isSyncing: false
  });

  const [offlineFiles, setOfflineFiles] = useState<CloudFile[]>(
    files.slice(0, 5) // Mock offline files
  );

  useEffect(() => {
    const handleOnlineStatus = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const startSync = () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncProgress: 0 }));
    
    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncStatus(prev => {
        if (prev.syncProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            isSyncing: false,
            syncProgress: 100,
            pendingUploads: 0,
            pendingDownloads: 0,
            lastSyncTime: new Date().toISOString()
          };
        }
        return { ...prev, syncProgress: prev.syncProgress + 10 };
      });
    }, 500);
  };

  const toggleOfflineFile = (fileId: string) => {
    setOfflineFiles(prev => {
      const isOffline = prev.some(f => f.id === fileId);
      if (isOffline) {
        return prev.filter(f => f.id !== fileId);
      } else {
        const file = files.find(f => f.id === fileId);
        return file ? [...prev, file] : prev;
      }
    });
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Agora mesmo";
    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
            <RefreshCw className="h-5 w-5 text-primary-foreground" />
          </div>
          Sincronização Offline
        </h2>
        <p className="text-muted-foreground mt-2">
          Gerencie arquivos disponíveis offline e configurações de sincronização
        </p>
      </div>

      {/* Status da Conexão */}
      <Card className="gradient-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {syncStatus.isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              Status da Conexão
            </div>
            <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
              {syncStatus.isOnline ? "Online" : "Offline"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{syncStatus.pendingUploads}</div>
              <div className="text-muted-foreground">Uploads pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{syncStatus.pendingDownloads}</div>
              <div className="text-muted-foreground">Downloads pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{offlineFiles.length}</div>
              <div className="text-muted-foreground">Arquivos offline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatLastSync(syncStatus.lastSyncTime)}</div>
              <div className="text-muted-foreground">Última sinc.</div>
            </div>
          </div>

          {syncStatus.isSyncing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sincronizando...</span>
                <span className="text-sm text-muted-foreground">{syncStatus.syncProgress}%</span>
              </div>
              <Progress value={syncStatus.syncProgress} className="h-2" />
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Última sincronização: {formatLastSync(syncStatus.lastSyncTime)}
            </div>
            <Button
              onClick={startSync}
              disabled={syncStatus.isSyncing || !syncStatus.isOnline}
              size="sm"
              className="gradient-primary text-primary-foreground"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              {syncStatus.isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Sincronização */}
      <Card className="gradient-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações de Sincronização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sincronização automática</Label>
              <div className="text-sm text-muted-foreground">
                Sincroniza automaticamente quando conectado
              </div>
            </div>
            <Switch
              checked={offlineSettings.autoSync}
              onCheckedChange={(checked) => 
                setOfflineSettings(prev => ({ ...prev, autoSync: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Apenas no Wi-Fi</Label>
              <div className="text-sm text-muted-foreground">
                Sincroniza apenas quando conectado ao Wi-Fi
              </div>
            </div>
            <Switch
              checked={offlineSettings.syncOnWifiOnly}
              onCheckedChange={(checked) => 
                setOfflineSettings(prev => ({ ...prev, syncOnWifiOnly: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Armazenamento offline máximo: {offlineSettings.maxOfflineSize} GB</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-border rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(syncStatus.totalOfflineSize / offlineSettings.maxOfflineSize) * 100}%` }}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {syncStatus.totalOfflineSize} GB usados
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arquivos Offline */}
      <Card className="gradient-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Arquivos Disponíveis Offline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {files.slice(0, 8).map((file, index) => {
              const isOffline = offlineFiles.some(f => f.id === file.id);
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-md bg-primary/10">
                      <HardDrive className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isOffline && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Offline
                      </Badge>
                    )}
                    <Switch
                      checked={isOffline}
                      onCheckedChange={() => toggleOfflineFile(file.id)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {offlineFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <WifiOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum arquivo disponível offline</p>
              <p className="text-sm">Ative a sincronização offline para arquivos específicos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas */}
      <AnimatePresence>
        {!syncStatus.isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="gradient-card border border-warning/50 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div>
                    <div className="font-medium">Modo Offline</div>
                    <div className="text-sm text-muted-foreground">
                      Você está trabalhando offline. As alterações serão sincronizadas quando a conexão for restaurada.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OfflineSync;