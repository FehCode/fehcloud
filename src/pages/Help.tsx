import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ArrowLeft, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone,
  Upload,
  Download,
  Share,
  Lock,
  Settings,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      title: "Primeiros Passos",
      icon: BookOpen,
      color: "bg-blue-500/20 text-blue-600",
      articles: [
        "Como criar uma conta",
        "Fazendo seu primeiro upload",
        "Organizando arquivos em pastas",
        "Configurações básicas"
      ]
    },
    {
      title: "Upload e Download",
      icon: Upload,
      color: "bg-green-500/20 text-green-600",
      articles: [
        "Tipos de arquivo suportados",
        "Limite de tamanho de arquivos",
        "Upload de múltiplos arquivos",
        "Download em lote"
      ]
    },
    {
      title: "Compartilhamento",
      icon: Share,
      color: "bg-purple-500/20 text-purple-600",
      articles: [
        "Compartilhar arquivos por link",
        "Definir permissões de acesso",
        "Compartilhamento com senha",
        "Expiração de links"
      ]
    },
    {
      title: "Segurança",
      icon: Lock,
      color: "bg-red-500/20 text-red-600",
      articles: [
        "Criptografia de arquivos",
        "Autenticação de dois fatores",
        "Recuperação de conta",
        "Política de privacidade"
      ]
    },
    {
      title: "Conta e Planos",
      icon: CreditCard,
      color: "bg-orange-500/20 text-orange-600",
      articles: [
        "Tipos de planos disponíveis",
        "Como fazer upgrade",
        "Cancelamento de assinatura",
        "Faturamento e pagamentos"
      ]
    },
    {
      title: "Configurações",
      icon: Settings,
      color: "bg-gray-500/20 text-gray-600",
      articles: [
        "Personalizando perfil",
        "Configurações de notificação",
        "Preferências de idioma",
        "Sincronização de dispositivos"
      ]
    }
  ];

  const faqs = [
    {
      question: "Qual é o limite de armazenamento do plano gratuito?",
      answer: "O plano gratuito oferece 100 GB de armazenamento. Você pode fazer upgrade para planos pagos para ter mais espaço."
    },
    {
      question: "Posso compartilhar arquivos com pessoas que não têm conta?",
      answer: "Sim, você pode gerar links de compartilhamento que funcionam mesmo para pessoas sem conta no FehClaude."
    },
    {
      question: "Como posso recuperar arquivos excluídos?",
      answer: "Arquivos excluídos ficam na lixeira por 30 dias. Você pode restaurá-los durante esse período."
    },
    {
      question: "É possível sincronizar arquivos offline?",
      answer: "Sim, nosso aplicativo desktop permite sincronização offline. Os arquivos são sincronizados quando você volta a ficar online."
    },
    {
      question: "Como cancelar minha assinatura?",
      answer: "Você pode cancelar sua assinatura a qualquer momento nas configurações da conta. O acesso continua até o fim do período pago."
    },
    {
      question: "Meus arquivos ficam seguros?",
      answer: "Sim, todos os arquivos são criptografados com AES-256 e armazenados em servidores seguros com backup automático."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="gradient-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary text-primary-foreground">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="gradient-primary p-3 rounded-xl">
              <HelpCircle className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6">
            Como podemos{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              ajudar?
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Encontre respostas rápidas, tutoriais detalhados e entre em contato com nosso suporte.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar ajuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Categorias de Ajuda</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="gradient-card border border-border transition-smooth hover:shadow-medium cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {article}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 gradient-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma pergunta encontrada para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ainda precisa de ajuda?</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Nossa equipe de suporte está disponível 24/7 para ajudar você.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="gradient-card border border-border transition-smooth hover:shadow-medium">
              <CardHeader className="text-center">
                <div className="mx-auto gradient-primary p-3 rounded-xl w-fit mb-4">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Chat ao Vivo</CardTitle>
                <CardDescription>Resposta em até 5 minutos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Iniciar Chat</Button>
              </CardContent>
            </Card>

            <Card className="gradient-card border border-border transition-smooth hover:shadow-medium">
              <CardHeader className="text-center">
                <div className="mx-auto gradient-primary p-3 rounded-xl w-fit mb-4">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>Resposta em até 24 horas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  suporte@fehclaude.com
                </Button>
              </CardContent>
            </Card>

            <Card className="gradient-card border border-border transition-smooth hover:shadow-medium">
              <CardHeader className="text-center">
                <div className="mx-auto gradient-primary p-3 rounded-xl w-fit mb-4">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Telefone</CardTitle>
                <CardDescription>Seg-Sex, 8h às 18h</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  (11) 99999-9999
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;