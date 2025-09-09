import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone,
  Globe,
  Edit3,
  Share,
  Download,
  Upload,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Activity,
  Crown,
  Settings,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: "Arquivos", value: "1,234", icon: FileText, color: "text-blue-600" },
    { label: "Downloads", value: "5,678", icon: Download, color: "text-green-600" },
    { label: "Compartilhamentos", value: "89", icon: Share, color: "text-purple-600" },
    { label: "Uploads", value: "2,345", icon: Upload, color: "text-orange-600" }
  ];

  const fileTypes = [
    { type: "Documentos", count: 456, icon: FileText, color: "bg-blue-500", percentage: 40 },
    { type: "Imagens", count: 234, icon: Image, color: "bg-green-500", percentage: 25 },
    { type: "Vídeos", count: 123, icon: Video, color: "bg-red-500", percentage: 20 },
    { type: "Áudios", count: 67, icon: Music, color: "bg-yellow-500", percentage: 10 },
    { type: "Outros", count: 45, icon: Archive, color: "bg-gray-500", percentage: 5 }
  ];

  const recentActivity = [
    { action: "Upload", file: "documento-importante.pdf", time: "2 horas atrás" },
    { action: "Compartilhamento", file: "apresentacao-vendas.pptx", time: "5 horas atrás" },
    { action: "Download", file: "relatorio-mensal.xlsx", time: "1 dia atrás" },
    { action: "Upload", file: "video-tutorial.mp4", time: "2 dias atrás" },
    { action: "Compartilhamento", file: "fotos-evento.zip", time: "3 dias atrás" }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/app">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link to="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="gradient-card border border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-4xl gradient-primary text-primary-foreground">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold">João Silva</h1>
                    <Badge className="gradient-primary text-primary-foreground">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Desenvolvedor Full-Stack</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email || 'joao@exemplo.com'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+55 11 99999-9999</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>São Paulo, BR</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Membro desde Jan 2024</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Cloud Computing</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="gradient-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${stat.color.split('-')[1]}-500/20`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="files">Arquivos</TabsTrigger>
            <TabsTrigger value="activity">Atividades</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Storage Usage */}
              <Card className="gradient-card border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Uso de Armazenamento</span>
                  </CardTitle>
                  <CardDescription>
                    75.5 GB de 2 TB utilizados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={3.8} className="h-2" />
                  
                  <div className="space-y-3">
                    {fileTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${type.color}`} />
                          <span className="text-sm">{type.type}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {type.count} arquivos ({type.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Plan Info */}
              <Card className="gradient-card border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5" />
                    <span>Plano Atual</span>
                  </CardTitle>
                  <CardDescription>
                    Plano Pro - R$ 19/mês
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Armazenamento</span>
                      <span className="font-medium">2 TB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upload máximo</span>
                      <span className="font-medium">50 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compartilhamentos</span>
                      <span className="font-medium">Ilimitado</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suporte</span>
                      <span className="font-medium">24/7</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Button className="w-full" variant="outline">
                      Gerenciar Plano
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <Card className="gradient-card border border-border">
              <CardHeader>
                <CardTitle>Distribuição de Arquivos</CardTitle>
                <CardDescription>
                  Análise dos tipos de arquivo armazenados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fileTypes.map((type, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <type.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{type.type}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {type.count} arquivos
                        </span>
                      </div>
                      <Progress value={type.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="gradient-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Atividade Recente</span>
                </CardTitle>
                <CardDescription>
                  Últimas ações realizadas na sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        activity.action === 'Upload' ? 'bg-green-500/20 text-green-600' :
                        activity.action === 'Download' ? 'bg-blue-500/20 text-blue-600' :
                        'bg-purple-500/20 text-purple-600'
                      }`}>
                        {activity.action === 'Upload' && <Upload className="h-4 w-4" />}
                        {activity.action === 'Download' && <Download className="h-4 w-4" />}
                        {activity.action === 'Compartilhamento' && <Share className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}: {activity.file}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;