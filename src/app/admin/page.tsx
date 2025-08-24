"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  CreditCard, 
  FileText, 
  Settings, 
  TrendingUp,
  Users,
  Wallet,
  PiggyBank,
  Target,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignOutButton } from "@/components/auth/signout-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TransactionsManager } from "@/components/admin/transactions-manager";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { AccountsManager } from "@/components/admin/accounts-manager";
import { BudgetsManager } from "@/components/admin/budgets-manager";
import { GoalsManager } from "@/components/admin/goals-manager";

const adminTabs = [
  {
    value: "transactions",
    label: "Transações",
    icon: FileText,
    component: TransactionsManager
  },
  {
    value: "categories",
    label: "Categorias",
    icon: BarChart3,
    component: CategoriesManager
  },
  {
    value: "accounts",
    label: "Contas",
    icon: Wallet,
    component: AccountsManager
  },
  {
    value: "budgets",
    label: "Orçamentos",
    icon: PiggyBank,
    component: BudgetsManager
  },
  {
    value: "goals",
    label: "Metas",
    icon: Target,
    component: GoalsManager
  }
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("transactions");

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

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você precisa estar logado para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/auth/signin'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-xl shadow-sm border-b border-border sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-foreground flex items-center"
              >
                <Settings className="h-6 w-6 mr-2 text-primary" />
                Administração
              </motion.h1>
              <div className="hidden sm:flex items-center text-sm text-muted-foreground">
                <span>Gerenciar todas as suas finanças</span>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                Voltar ao Dashboard
              </Button>
              <span className="text-sm text-muted-foreground">
                {session.user?.name || session.user?.email}
              </span>
              <ThemeToggle />
              <SignOutButton />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-6 sm:px-0"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
              {adminTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            {adminTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <tab.component />
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
