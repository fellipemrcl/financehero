"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/signout-button";
import { AddExpenseDialog } from "@/components/transactions/add-expense-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  PiggyBank, 
  BarChart3, 
  Shield, 
  Zap, 
  Target,
  ChevronRight,
  Star,
  Users,
  Award,
  TrendingDown
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Stats and testimonials data
const stats = [
  { number: "50K+", label: "Usuários Ativos", icon: Users },
  { number: "R$ 100M+", label: "Economizados", icon: TrendingUp },
  { number: "4.9/5", label: "Avaliação", icon: Star },
  { number: "99.9%", label: "Disponibilidade", icon: Award }
];

const features = [
  {
    icon: PiggyBank,
    title: "Controle de Gastos",
    description: "Acompanhe suas despesas e receitas de forma detalhada com categorização inteligente"
  },
  {
    icon: BarChart3,
    title: "Relatórios Avançados",
    description: "Visualize relatórios detalhados e gráficos sobre sua situação financeira"
  },
  {
    icon: Target,
    title: "Metas e Objetivos",
    description: "Defina metas financeiras e acompanhe seu progresso em tempo real"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Seus dados protegidos com criptografia de nível bancário"
  },
  {
    icon: Zap,
    title: "IA Personalizada",
    description: "Insights inteligentes para otimizar seus hábitos financeiros"
  },
  {
    icon: TrendingUp,
    title: "Investimentos",
    description: "Acompanhe seus investimentos e portfólio em um só lugar"
  }
];

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (session) {
    // Authenticated user - show enhanced dashboard
    return (
      <div className="min-h-screen bg-background">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur-xl shadow-sm border-b border-border sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-foreground"
              >
                Finance Hero
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <span className="text-muted-foreground">
                  Olá, {session.user?.name || session.user?.email}
                </span>
                <ThemeToggle />
                <SignOutButton />
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-6 sm:px-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Welcome Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 rounded-xl border border-border backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Bem-vindo de volta! 👋
                    </h2>
                    <p className="text-muted-foreground">
                      Vamos continuar cuidando das suas finanças
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <PiggyBank className="h-16 w-16 text-primary" />
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <AddExpenseDialog />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4"
                  >
                    <Button variant="outline" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Relatórios
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Target className="h-4 w-4 mr-2" />
                      Suas Metas
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Saldo Total</span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">R$ 12.450,80</div>
                  <div className="text-sm text-success">+12.5% este mês</div>
                </div>
                
                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Gastos do Mês</span>
                    <TrendingDown className="h-4 w-4 text-warning" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">R$ 3.248,90</div>
                  <div className="text-sm text-warning">Meta: R$ 4.000,00</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Unauthenticated user - show enhanced landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Floating Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-card/80 backdrop-blur-xl border border-border rounded-full px-6 py-3 shadow-lg"
      >
        <div className="flex items-center space-x-6">
          <motion.span 
            className="font-bold text-primary"
            whileHover={{ scale: 1.05 }}
          >
            Finance Hero
          </motion.span>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/signin">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm">
                  Começar
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear"
            }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear"
            }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 1 
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
              </motion.div>
              Revolucione suas finanças
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Finance{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Hero
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              A plataforma mais inteligente para gerenciar suas finanças pessoais.
              Controle gastos, planeje investimentos e alcance a liberdade financeira
              com nossa tecnologia de ponta.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/auth/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="w-full sm:w-auto group">
                    Começar Gratuitamente
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/auth/signin">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Fazer Login
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Recursos que fazem a diferença
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para transformar sua relação com o dinheiro
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-primary-foreground"
          >
            <h2 className="text-4xl font-bold mb-4">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de usuários que já conquistaram o controle financeiro
            </p>
            <Link href="/auth/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" className="group">
                  Começar Agora - É Grátis
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
