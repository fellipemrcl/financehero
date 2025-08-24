"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatTransactionAmount, formatDate, formatDateTime } from "@/lib/format";
import { 
  Calendar,
  CreditCard, 
  Tag, 
  FileText, 
  DollarSign,
  Clock
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  account: {
    id: string;
    name: string;
    type: string;
  };
  category: {
    id: string;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TransactionDetailsProps {
  transaction: Transaction;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "INCOME":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "EXPENSE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "TRANSFER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "INCOME":
        return "Receita";
      case "EXPENSE":
        return "Despesa";
      case "TRANSFER":
        return "Transferência";
      default:
        return type;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "CHECKING":
        return "Conta Corrente";
      case "SAVINGS":
        return "Poupança";
      case "CREDIT_CARD":
        return "Cartão de Crédito";
      case "INVESTMENT":
        return "Investimento";
      case "CASH":
        return "Dinheiro";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Transaction Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Resumo da Transação</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className={`text-lg font-semibold ${
                  transaction.type === "EXPENSE" 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-green-600 dark:text-green-400"
                }`}>
                  {formatTransactionAmount(transaction.amount, transaction.type)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <Badge className={getTypeColor(transaction.type)}>
                  {getTypeLabel(transaction.type)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground mb-1">Descrição</p>
            <p className="text-base">{transaction.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Account and Category Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Conta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome da Conta</p>
              <p className="font-medium">{transaction.account.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Conta</p>
              <p className="text-sm">{getAccountTypeLabel(transaction.account.type)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Categoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome da Categoria</p>
              <p className="font-medium">{transaction.category.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Categoria</p>
              <Badge variant="outline">
                {transaction.category.type === "INCOME" ? "Receita" : "Despesa"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Informações de Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data da Transação</p>
                <p className="font-medium">
                  {formatDate(transaction.date, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Criada em</p>
              <p className="text-sm">
                {formatDateTime(transaction.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Última atualização</p>
              <p className="text-sm">
                {formatDateTime(transaction.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction ID */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ID da Transação</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">{transaction.id}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
