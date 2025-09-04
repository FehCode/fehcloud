import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cloud, Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Email inválido");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não conferem");
      return false;
    }
    if (!acceptTerms) {
      setError("Você deve aceitar os termos de uso");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password);
    
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta e faça login."
      });
      navigate("/login");
    }
    
    setIsLoading(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao início</span>
          </Link>
          
          <div className="gradient-primary p-4 rounded-2xl inline-block shadow-large mb-6">
            <Cloud className="h-12 w-12 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold">
            Crie sua conta
          </h1>
          <p className="text-muted-foreground mt-2">
            Junte-se ao FehClaude e comece a armazenar seus arquivos
          </p>
        </div>

        {/* Registration Form */}
        <Card className="gradient-card border border-border shadow-large">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Registro</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" type="text" placeholder="Seu nome completo" value={formData.name} onChange={handleInputChange} required className="pl-10" disabled={isLoading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} required className="pl-10" disabled={isLoading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleInputChange} required className="pl-10 pr-10" disabled={isLoading} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirme sua senha" value={formData.confirmPassword} onChange={handleInputChange} required className="pl-10 pr-10" disabled={isLoading} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input type="checkbox" id="terms" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="rounded border-border mt-1" disabled={isLoading} />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  Aceito os{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    política de privacidade
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-medium transition-bounce hover:shadow-large" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta gratuita"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                
              </div>
            </div>

            
          </CardContent>
        </Card>

        {/* Login link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <Card className="gradient-card border border-border">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-medium text-center mb-4">Incluído na sua conta gratuita:</h3>
              <div className="space-y-2">
                {["50GB de armazenamento gratuito", "Upload de arquivos até 10MB", "Sincronização automática", "Acesso em todos os dispositivos"].map((benefit, index) => <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>{benefit}</span>
                  </div>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Register;