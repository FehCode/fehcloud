import { Cloud, HardDrive, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { formatFileSizeToGB } from "@/types/file";

interface HeaderProps {
  totalFiles: number;
  totalSize: string;
  usedSpace: number;
  quotaBytes: number;
}

const Header = ({ totalFiles, totalSize, usedSpace, quotaBytes }: HeaderProps) => {
  const usedPercentage = Math.min(usedSpace, 100);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/");
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-card border-b border-border shadow-soft backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-primary p-2 rounded-xl shadow-medium"
            >
              <Cloud className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent"
              >
                FehClaude
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Armazenamento em Nuvem
              </motion.p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center space-x-6"
          >
            {/* Files Count Card */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-card px-4 py-3 rounded-xl border border-border/50 backdrop-blur-sm bg-card/30 shadow-medium hover:shadow-large transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <HardDrive className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Arquivos</span>
                  <span className="text-sm font-semibold text-foreground">{totalFiles}</span>
                </div>
              </div>
            </motion.div>

            {/* Storage Used Card */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-card px-4 py-3 rounded-xl border border-border/50 backdrop-blur-sm bg-card/30 shadow-medium hover:shadow-large transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Usado</span>
                  <span className="text-sm font-semibold text-foreground">{totalSize}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Storage Progress Card */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-card px-5 py-3 rounded-xl border border-border/50 backdrop-blur-sm bg-card/30 shadow-medium hover:shadow-large transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Capacidade</span>
                  <span className="text-sm font-semibold text-foreground">{formatFileSizeToGB(quotaBytes)}</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-28 h-2 bg-muted/60 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${usedPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${
                        usedPercentage >= 90 ? 'bg-destructive' 
                        : usedPercentage >= 70 ? 'bg-orange-500' 
                        : 'gradient-primary'
                      }`}
                    />
                  </div>
                   <div className="flex justify-between w-28 text-xs text-muted-foreground">
                     <span>0 GB</span>
                     <span>{formatFileSizeToGB(quotaBytes)}</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="gradient-primary text-primary-foreground shadow-medium transition-bounce hover:shadow-large">
                Upgrade Pro
              </Button>
            </motion.div>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.name || "Usuário"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;