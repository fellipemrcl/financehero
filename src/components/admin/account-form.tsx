"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const accountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT_CARD", "INVESTMENT", "CASH"]),
  balance: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  description?: string;
  isActive: boolean;
}

interface AccountFormProps {
  account?: Account;
  onSuccess: () => void;
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name || "",
      type: (account?.type as any) || "CHECKING",
      balance: account?.balance?.toString() || "0",
      description: account?.description || "",
      isActive: account?.isActive ?? true,
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    try {
      setLoading(true);
      
      const payload = {
        ...data,
        balance: parseFloat(data.balance),
      };

      const url = account 
        ? `/api/accounts/${account.id}` 
        : "/api/accounts";
      
      const method = account ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        console.error("Erro:", error);
      }
    } catch (error) {
      console.error("Erro ao salvar conta:", error);
    } finally {
      setLoading(false);
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Nome da conta"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select 
            value={form.watch("type")} 
            onValueChange={(value) => form.setValue("type", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CHECKING">{getAccountTypeLabel("CHECKING")}</SelectItem>
              <SelectItem value="SAVINGS">{getAccountTypeLabel("SAVINGS")}</SelectItem>
              <SelectItem value="CREDIT_CARD">{getAccountTypeLabel("CREDIT_CARD")}</SelectItem>
              <SelectItem value="INVESTMENT">{getAccountTypeLabel("INVESTMENT")}</SelectItem>
              <SelectItem value="CASH">{getAccountTypeLabel("CASH")}</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Saldo */}
      <div className="space-y-2">
        <Label htmlFor="balance">Saldo Inicial (R$)</Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          placeholder="0,00"
          {...form.register("balance")}
        />
        {form.formState.errors.balance && (
          <p className="text-sm text-red-500">{form.formState.errors.balance.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição da conta (opcional)"
          {...form.register("description")}
        />
      </div>

      {/* Status Ativo */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={form.watch("isActive")}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
        <Label htmlFor="isActive">Conta ativa</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {account ? "Atualizar" : "Criar"} Conta
        </Button>
      </div>
    </form>
  );
}
