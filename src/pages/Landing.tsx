import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cloud, Shield, Zap, Users, Upload, Download, Lock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="gradient-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="gradient-primary p-2 rounded-xl shadow-medium">
              <Cloud className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                FehClaude
              </h1>
              <p className="text-xs text-muted-foreground">Armazenamento em Nuvem</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
              Preços
            </Link>
            <Link to="/help" className="text-muted-foreground hover:text-foreground transition-smooth">
              Ajuda
            </Link>
            <Link to="/login">
              <Button variant="outline" className="transition-smooth">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary text-primary-foreground shadow-medium transition-bounce hover:shadow-large">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gradient-card px-4 py-2 rounded-full border border-border mb-6">
              <Star className="h-4 w-4 text-warning mr-2" />
              <span className="text-sm font-medium">Armazenamento seguro e confiável</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Seus arquivos na{" "}
              <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                nuvem
              </span>
              ,{" "}
              <br className="hidden sm:block" />
              seguros e acessíveis
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Armazene, organize e acesse seus arquivos de qualquer lugar. 
              Interface simples, segurança avançada e sincronização automática.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-large transition-bounce hover:shadow-large px-8 py-6 text-lg">
                <Upload className="h-5 w-5 mr-2" />
                Começar Gratuitamente
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Criptografia SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Dados Protegidos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Upload Rápido</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Tudo que você precisa para gerenciar seus arquivos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma solução completa de armazenamento em nuvem com recursos profissionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: "Upload Rápido",
                description: "Arraste e solte arquivos ou selecione múltiplos arquivos para upload instantâneo."
              },
              {
                icon: Shield,
                title: "Segurança Total",
                description: "Seus arquivos são protegidos com criptografia de ponta a ponta e backup automático."
              },
              {
                icon: Users,
                title: "Compartilhamento",
                description: "Compartilhe arquivos e pastas com facilidade através de links seguros."
              },
              {
                icon: Zap,
                title: "Sincronização",
                description: "Acesse seus arquivos em qualquer dispositivo com sincronização em tempo real."
              },
              {
                icon: Download,
                title: "Download Rápido",
                description: "Baixe arquivos individuais ou múltiplos com alta velocidade de transferência."
              },
              {
                icon: Lock,
                title: "Controle Total",
                description: "Defina permissões, organize em pastas e mantenha controle total dos seus dados."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 gradient-card border border-border transition-smooth hover:shadow-medium">
                <div className="gradient-primary p-3 rounded-lg inline-block mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 gradient-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Confiado por milhares de usuários</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50GB", label: "Espaço Gratuito" },
              { number: "99.9%", label: "Uptime Garantido" },
              { number: "256-bit", label: "Criptografia SSL" },
              { number: "24/7", label: "Suporte Técnico" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a milhares de usuários que já confiam no FehClaude para armazenar seus arquivos.
          </p>
          
          <Link to="/register">
            <Button size="lg" className="gradient-primary text-primary-foreground shadow-large transition-bounce hover:shadow-large px-8 py-6 text-lg">
              <Cloud className="h-5 w-5 mr-2" />
              Criar Conta Gratuita
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-4">
            Sem necessidade de cartão de crédito • Configuração em 2 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="gradient-primary p-2 rounded-lg">
              <Cloud className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-semibold">FehClaude</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground transition-smooth">Preços</Link>
            <Link to="/help" className="hover:text-foreground transition-smooth">Ajuda</Link>
            <a href="#" className="hover:text-foreground transition-smooth">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-smooth">Termos</a>
            <a href="#" className="hover:text-foreground transition-smooth">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;