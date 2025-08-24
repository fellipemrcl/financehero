"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatAccountBalance, formatDateTime } from "@/lib/format";
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Clock,
  Activity
} from "lucide-react";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccountDetailsProps {
  account: Account;
}

export function AccountDetails({ account }: AccountDetailsProps) {
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

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "CHECKING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "SAVINGS":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "CREDIT_CARD":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "INVESTMENT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "CASH":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Resumo da Conta</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{account.name}</h3>
              <Badge className={getAccountTypeColor(account.type)}>
                {getAccountTypeLabel(account.type)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Saldo Atual</p>
              <p className={`text-2xl font-bold ${
                Number(account.balance) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}>
                {formatAccountBalance(Number(account.balance), account.type)}
              </p>
            </div>
          </div>

          {account.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                <p className="text-base">{account.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={account.isActive ? "default" : "secondary"}>
                {account.isActive ? "Ativo" : "Inativo"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {account.isActive 
                  ? "Esta conta pode ser usada em transações" 
                  : "Esta conta está desabilitada"
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Informações Financeiras</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Conta</p>
              <p className="font-medium">{getAccountTypeLabel(account.type)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className={`font-bold ${
                Number(account.balance) >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {formatAccountBalance(Number(account.balance), account.type)}
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Criada em</p>
              <p className="text-sm">
                {formatDateTime(account.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Última atualização</p>
              <p className="text-sm">
                {formatDateTime(account.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account ID */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ID da Conta</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">{account.id}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
