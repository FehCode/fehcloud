import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cloud, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);
  // Foco automático no campo de email
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validação simples
    if (!formData.email || !formData.password) {
      setError("Preencha todos os campos.");
      setIsLoading(false);
      emailInputRef.current?.focus();
      return;
    }

  const { error } = await signIn(formData.email, formData.password);
    if (error) {
      setError(error.message);
      emailInputRef.current?.focus();
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao FehClaude."
      });
      navigate("/app");
    }
    setIsLoading(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "rememberMe") {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground mt-2">
            Entre na sua conta FehClaude
          </p>
        </div>

        {/* Login Form */}
        <Card className="gradient-card border border-border shadow-large">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>}

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
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`pl-10 ${error ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    aria-invalid={!!error}
                    aria-describedby={error ? "login-error" : undefined}
                    ref={emailInputRef}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={`pl-10 pr-10 ${error ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    aria-invalid={!!error}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span>Lembrar-me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground shadow-medium transition-bounce hover:shadow-large"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Social Login */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase bg-background px-2">
                ou entre com
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="w-full" disabled>
                <img src="/google.svg" alt="Google" className="h-5 w-5 mr-2" /> Google
              </Button>
              <Button type="button" variant="outline" className="w-full" disabled>
                <img src="/github.svg" alt="GitHub" className="h-5 w-5 mr-2" /> GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Criar conta gratuita
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <Card className="gradient-card border border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Credenciais para teste:</p>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> demo@fehclaude.com</p>
                <p><strong>Senha:</strong> demo123</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Use para explorar a plataforma sem criar conta.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Login;