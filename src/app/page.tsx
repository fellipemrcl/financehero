"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  TrendingDown,
  Wallet,
  Calendar,
  FileText,
  Settings,
  Plus,
  PieChart,
  LineChart,
  CreditCard,
  HomeIcon,
  ShoppingCart,
  Utensils,
  Car,
  Heart,
  BookOpen,
  Gamepad2,
  Gift,
  Loader2
} from "lucide-react";
import { formatCurrency, formatPercentage, formatDate, formatRelativeTime } from "@/lib/format";

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

// Stats and testimonials data (for landing page only)
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

// Quick actions for the dashboard
const quickActions = [
  {
    title: "Adicionar Gasto",
    description: "Registre uma nova despesa",
    icon: Plus,
    action: "add-expense",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950"
  },
  {
    title: "Ver Relatórios",
    description: "Analise seus dados financeiros",
    icon: BarChart3,
    action: "reports",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950"
  },
  {
    title: "Gerenciar Contas",
    description: "Configure suas contas bancárias",
    icon: Wallet,
    action: "accounts",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950"
  },
  {
    title: "Definir Metas",
    description: "Crie e acompanhe objetivos",
    icon: Target,
    action: "goals",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950"
  },
  {
    title: "Assinaturas",
    description: "Gerencie gastos recorrentes",
    icon: CreditCard,
    action: "subscriptions",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950"
  }
];

// Common expense categories with icons (fallback)
const fallbackCategories = [
  { name: "Moradia", icon: HomeIcon, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900" },
  { name: "Alimentação", icon: Utensils, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900" },
  { name: "Transporte", icon: Car, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900" },
  { name: "Saúde", icon: Heart, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900" },
  { name: "Educação", icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900" },
  { name: "Entretenimento", icon: Gamepad2, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900" },
  { name: "Compras", icon: ShoppingCart, color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-900" },
  { name: "Presentes", icon: Gift, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900" }
];

// Types for dashboard data
interface DashboardData {
  totalBalance: number;
  currentMonth: {
    expenses: number;
    income: number;
    savings: number;
    savingsPercentage: number;
  };
  previousMonth: {
    expenses: number;
    income: number;
  };
  changes: {
    expenses: number;
    income: number;
  };
  recentTransactions: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
    type: string;
    account: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
      color: string;
      icon: string;
    };
  }>;
  categoryStats: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
    expenses: number;
    income: number;
    count: number;
  }>;
  accountStats: Array<{
    id: string;
    name: string;
    balance: number;
    transactionCount: number;
  }>;
  period: {
    start: string;
    end: string;
  };
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  description?: string;
}

// Utility function to get relative time (keeping for backward compatibility)
const getRelativeTime = (dateString: string): string => {
  return formatRelativeTime(dateString);
};

// Utility function to get category icon
const getCategoryIcon = (iconName: string | null) => {
  if (!iconName) return ShoppingCart;
  
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'home': HomeIcon,
    'utensils': Utensils,
    'car': Car,
    'heart': Heart,
    'book-open': BookOpen,
    'gamepad-2': Gamepad2,
    'shopping-cart': ShoppingCart,
    'gift': Gift,
    'wallet': Wallet,
    'credit-card': CreditCard,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'bar-chart-3': BarChart3,
    'pie-chart': PieChart,
    'line-chart': LineChart,
  };
  
  return iconMap[iconName] || ShoppingCart;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (err) {
      console.error('Erro ao buscar metas:', err);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (session) {
      fetchDashboardData();
      fetchGoals();
    }
  }, [session]);

  // Refresh data after adding expense
  const handleExpenseAdded = () => {
    fetchDashboardData();
    fetchGoals();
  };

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
    // Authenticated user - show organized dashboard
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
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
          <div className="px-4 sm:px-0 space-y-8">
            
            {/* Welcome Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 rounded-xl border border-border backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Bem-vindo de volta! 👋
                  </h2>
                  <p className="text-muted-foreground text-lg">
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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <AddExpenseDialog onSuccess={handleExpenseAdded} />
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => window.location.href = '/subscriptions'}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Assinaturas
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => window.location.href = '/admin'}>
                  <Settings className="h-4 w-4 mr-2" />
                  Administração Completa
                </Button>
              </div>
            </motion.section>

            {/* Loading State */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-12"
              >
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">Carregando dados financeiros...</span>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-center"
              >
                <p className="text-destructive mb-2">Erro ao carregar dados</p>
                <p className="text-sm text-muted-foreground mb-3">{error}</p>
                <Button onClick={fetchDashboardData} variant="outline" size="sm">
                  Tentar Novamente
                </Button>
              </motion.div>
            )}

            {/* Dashboard Content */}
            {dashboardData && !isLoading && !error && (
              <>
                {/* Quick Stats Overview */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Saldo Total</span>
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(dashboardData.totalBalance)}
                    </div>
                    <div className="text-sm text-success">
                      {formatPercentage(dashboardData.changes.income)}
                    </div>
                  </div>
                  
                  <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Gastos do Mês</span>
                      <TrendingDown className="h-4 w-4 text-warning" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(dashboardData.currentMonth.expenses)}
                    </div>
                    <div className="text-sm text-warning">
                      {formatPercentage(dashboardData.changes.expenses)}
                    </div>
                  </div>

                  <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Receitas do Mês</span>
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(dashboardData.currentMonth.income)}
                    </div>
                    <div className="text-sm text-success">
                      {formatPercentage(dashboardData.changes.income)}
                    </div>
                  </div>

                  <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Economia</span>
                      <PiggyBank className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(dashboardData.currentMonth.savings)}
                    </div>
                    <div className="text-sm text-primary">
                      {formatPercentage(dashboardData.currentMonth.savingsPercentage, false, 1)} da receita
                    </div>
                  </div>
                </motion.section>

                {/* Quick Actions */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Ações Rápidas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          if (action.action === 'add-expense') {
                            // Trigger add expense dialog
                            const addExpenseButton = document.querySelector('[data-add-expense]') as HTMLElement;
                            if (addExpenseButton) addExpenseButton.click();
                          } else if (action.action === 'reports') {
                            window.location.href = '/admin?tab=transactions';
                          } else if (action.action === 'accounts') {
                            window.location.href = '/admin?tab=accounts';
                          } else if (action.action === 'goals') {
                            window.location.href = '/admin?tab=goals';
                          } else if (action.action === 'subscriptions') {
                            window.location.href = '/subscriptions';
                          }
                        }}
                      >
                        <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                          <action.icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Recent Activity & Categories */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Recent Transactions */}
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Transações Recentes
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin?tab=transactions'}>
                        Ver Todas
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.recentTransactions.length > 0 ? (
                        dashboardData.recentTransactions.map((transaction) => {
                          const CategoryIcon = getCategoryIcon(transaction.category.icon);
                          const isExpense = transaction.type === 'EXPENSE';
                          
                          return (
                            <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 ${isExpense ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'} rounded-full flex items-center justify-center`}>
                                  <CategoryIcon className={`h-4 w-4 ${isExpense ? 'text-red-600' : 'text-green-600'}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{transaction.description}</p>
                                  <p className="text-sm text-muted-foreground">{transaction.category.name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-semibold ${isExpense ? 'text-red-600' : 'text-green-600'}`}>
                                  {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getRelativeTime(transaction.date)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Nenhuma transação encontrada</p>
                          <p className="text-sm">Adicione sua primeira transação para começar</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expense Categories Overview */}
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground flex items-center">
                        <PieChart className="h-5 w-5 mr-2 text-primary" />
                        Categorias de Gastos
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin?tab=categories'}>
                        Gerenciar
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {dashboardData.categoryStats.length > 0 ? (
                        dashboardData.categoryStats.slice(0, 8).map((category, index) => {
                          const CategoryIcon = getCategoryIcon(category.icon);
                          const bgColor = category.color ? `bg-${category.color.split('-')[1]}-100 dark:bg-${category.color.split('-')[1]}-900` : 'bg-gray-100 dark:bg-gray-900';
                          const textColor = category.color || 'text-gray-600';
                          
                          return (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.05 * index }}
                              className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                              onClick={() => window.location.href = '/admin?tab=transactions'}
                            >
                              <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
                                <CategoryIcon className={`h-4 w-4 ${textColor}`} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{category.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatCurrency(category.expenses)}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        fallbackCategories.map((category, index) => (
                          <motion.div
                            key={category.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * index }}
                            className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                            onClick={() => window.location.href = '/admin?tab=categories'}
                          >
                            <div className={`w-8 h-8 ${category.bgColor} rounded-full flex items-center justify-center`}>
                              <category.icon className={`h-4 w-4 ${category.color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{category.name}</p>
                              <p className="text-xs text-muted-foreground">R$ 0,00</p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.section>

                {/* Financial Goals & Insights */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Financial Goals */}
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground flex items-center">
                        <Target className="h-5 w-5 mr-2 text-primary" />
                        Suas Metas Financeiras
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin?tab=goals'}>
                        Gerenciar Metas
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {goals.length > 0 ? (
                        goals.slice(0, 2).map((goal) => {
                          const progress = (goal.currentAmount / goal.targetAmount) * 100;
                          const progressColor = progress >= 75 ? 'from-primary/10 to-primary/5' : 
                                               progress >= 50 ? 'from-accent/10 to-accent/5' : 
                                               'from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900';
                          const borderColor = progress >= 75 ? 'border-primary/20' : 
                                            progress >= 50 ? 'border-accent/20' : 
                                            'border-yellow-200 dark:border-yellow-800';
                          const textColor = progress >= 75 ? 'text-primary' : 
                                          progress >= 50 ? 'text-accent' : 
                                          'text-yellow-800 dark:text-yellow-200';
                          
                          return (
                            <div key={goal.id} className={`p-4 bg-gradient-to-r ${progressColor} rounded-lg border ${borderColor}`}>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground">{goal.name}</h4>
                                <span className={`text-sm font-medium ${textColor}`}>{formatPercentage(progress, false, 0)}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 mb-2">
                                <div className={`h-2 rounded-full ${progress >= 75 ? 'bg-primary' : progress >= 50 ? 'bg-accent' : 'bg-yellow-500'}`} 
                                     style={{ width: `${Math.min(progress, 100)}%` }}></div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)} economizados
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Nenhuma meta definida</p>
                          <p className="text-sm">Crie suas primeiras metas financeiras</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Insights */}
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground flex items-center">
                        <LineChart className="h-5 w-5 mr-2 text-primary" />
                        Insights Financeiros
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin'}>
                        Ver Relatórios
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData.currentMonth.savings > 0 && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">Boa Notícia!</span>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Suas economias representam {formatPercentage(dashboardData.currentMonth.savingsPercentage, false, 1)} da receita este mês. Continue assim!
                          </p>
                        </div>
                      )}

                      {dashboardData.changes.expenses > 20 && (
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Atenção</span>
                          </div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Seus gastos aumentaram {formatPercentage(Math.abs(dashboardData.changes.expenses), false, 1)} em relação ao mês anterior. Considere revisar.
                          </p>
                        </div>
                      )}

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Resumo do Mês</span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {dashboardData.currentMonth.income > 0 ? 
                            `Receitas: ${formatCurrency(dashboardData.currentMonth.income)} | Gastos: ${formatCurrency(dashboardData.currentMonth.expenses)}` :
                            'Nenhuma transação registrada este mês'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Quick Navigation to Admin */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-primary/5 to-accent/5 p-8 rounded-xl border border-border text-center"
                >
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Precisa de mais controle?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Acesse o painel completo de administração para gerenciar todas as suas finanças, 
                    criar relatórios detalhados e configurar suas preferências.
                  </p>
                  <Button size="lg" onClick={() => window.location.href = '/admin'}>
                    <Settings className="h-5 w-5 mr-2" />
                    Acessar Administração
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.section>
              </>
            )}
          </div>
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
