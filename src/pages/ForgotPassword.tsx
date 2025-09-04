import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cloud, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Por favor, digite um email válido");
      return;
    }

    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setIsLoading(false);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/login" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth mb-8">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao login</span>
            </Link>
            
            <div className="gradient-primary p-4 rounded-2xl inline-block shadow-large mb-6">
              <CheckCircle className="h-12 w-12 text-primary-foreground" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">
              Email enviado!
            </h1>
            <p className="text-muted-foreground">
              Enviamos as instruções para redefinir sua senha para <strong>{email}</strong>
            </p>
          </div>

          <Card className="gradient-card border border-border shadow-large">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Não recebeu o email? Verifique sua pasta de spam ou
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Tentar outro email
                </Button>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Lembrou da sua senha?</span>
                  <Link to="/login" className="text-primary hover:underline">
                    Fazer login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao login</span>
          </Link>
          
          <div className="gradient-primary p-4 rounded-2xl inline-block shadow-large mb-6">
            <Cloud className="h-12 w-12 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold">
            Esqueceu sua senha?
          </h1>
          <p className="text-muted-foreground mt-2">
            Digite seu email para receber as instruções de redefinição
          </p>
        </div>

        {/* Reset Form */}
        <Card className="gradient-card border border-border shadow-large">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Redefinir Senha</CardTitle>
            <CardDescription className="text-center">
              Digite o email da sua conta FehClaude
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground shadow-medium transition-bounce hover:shadow-large"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar instruções"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Lembrou da sua senha?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
              
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Criar conta gratuita
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="gradient-card border border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Precisa de ajuda?</h3>
              <p className="text-sm text-muted-foreground">
                Se você não consegue acessar sua conta, entre em contato com nosso suporte.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Contatar Suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;