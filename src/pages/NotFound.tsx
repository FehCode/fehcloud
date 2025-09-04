import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Cloud } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="gradient-primary p-4 rounded-2xl inline-block shadow-large mb-6">
            <Cloud className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
          <p className="text-muted-foreground mb-8">
            Oops! A página que você está procurando não existe no FehClaude. 
            Ela pode ter sido movida ou removida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="transition-smooth hover:shadow-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button 
            onClick={() => window.location.href = "/"} 
            className="gradient-primary text-primary-foreground shadow-medium transition-bounce hover:shadow-large"
          >
            <Home className="h-4 w-4 mr-2" />
            Ir para Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;