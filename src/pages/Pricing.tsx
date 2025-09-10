import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para uso pessoal",
      features: [
        "100 GB de armazenamento",
        "Upload de arquivos até 5 GB",
        "Compartilhamento básico",
        "Suporte por email",
        "Acesso via web e mobile"
      ],
      popular: false,
      cta: "Começar Grátis",
      variant: "outline" as const
    },
    {
      name: "Pro",
      price: "R$ 19",
      period: "/mês",
      description: "Ideal para profissionais",
      features: [
        "2 TB de armazenamento",
        "Upload de arquivos até 50 GB",
        "Compartilhamento avançado",
        "Histórico de versões (30 dias)",
        "Suporte prioritário 24/7",
        "Sincronização offline",
        "Pastas compartilhadas ilimitadas"
      ],
      popular: true,
      cta: "Começar Teste Grátis",
      variant: "default" as const
    }
  ];

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
          <h1 className="text-5xl font-bold mb-6">
            Escolha o plano ideal para{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              você
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Planos flexíveis que crescem com suas necessidades. Comece grátis e faça upgrade quando precisar.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative gradient-card border transition-smooth hover:shadow-medium ${
                  plan.popular ? 'border-primary shadow-large scale-105' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
                    {plan.name === "Pro" && <Zap className="h-6 w-6 text-primary" />}
                    {plan.name === "Business" && <Crown className="h-6 w-6 text-primary" />}
                    <span>{plan.name}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <div className="p-1 rounded-full bg-success/20">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/register">
                    <Button 
                      variant={plan.variant} 
                      className={`w-full ${plan.popular ? 'gradient-primary text-primary-foreground shadow-medium' : ''}`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
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
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim, você pode cancelar seu plano a qualquer momento. Não há taxas de cancelamento."
              },
              {
                question: "Como funciona o período de teste?",
                answer: "Oferecemos 14 dias grátis para todos os planos pagos. Você pode cancelar antes do fim do período sem cobrança."
              },
              {
                question: "Meus arquivos ficam seguros?",
                answer: "Sim, todos os arquivos são criptografados e armazenados em servidores seguros com backup automático."
              },
              {
                question: "Posso fazer upgrade do meu plano?",
                answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento através das configurações."
              }
            ].map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nossa equipe está pronta para ajudar você a escolher o melhor plano.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">
              Falar com Vendas
            </Button>
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-primary-foreground">
                Começar Teste Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;