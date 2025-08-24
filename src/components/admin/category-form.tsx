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

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  type: "INCOME" | "EXPENSE";
  description?: string;
  isActive: boolean;
}

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
}

const commonIcons = [
  "🏠", "🚗", "🍔", "⚡", "🛒", "💰", "📱", "✈️", "🎬", "🏥",
  "📚", "🎮", "👕", "💊", "⛽", "🍕", "🎵", "💻", "🎯", "🏃‍♂️"
];

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      type: category?.type || "EXPENSE",
      description: category?.description || "",
      color: category?.color || "#3B82F6",
      icon: category?.icon || "",
      isActive: category?.isActive ?? true,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setLoading(true);
      
      const url = category 
        ? `/api/categories/${category.id}` 
        : "/api/categories";
      
      const method = category ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        console.error("Erro:", error);
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    } finally {
      setLoading(false);
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
            placeholder="Nome da categoria"
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
              <SelectItem value="INCOME">Receita</SelectItem>
              <SelectItem value="EXPENSE">Despesa</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição da categoria (opcional)"
          {...form.register("description")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cor */}
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="color"
              type="color"
              className="w-16 h-10 p-0 border-0"
              {...form.register("color")}
            />
            <Input
              placeholder="#3B82F6"
              {...form.register("color")}
            />
          </div>
        </div>

        {/* Ícone */}
        <div className="space-y-2">
          <Label htmlFor="icon">Ícone</Label>
          <div className="space-y-2">
            <Input
              id="icon"
              placeholder="Emoji ou ícone"
              {...form.register("icon")}
            />
            <div className="flex flex-wrap gap-2">
              {commonIcons.map((icon, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => form.setValue("icon", icon)}
                >
                  {icon}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Ativo */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={form.watch("isActive")}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
        <Label htmlFor="isActive">Categoria ativa</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {category ? "Atualizar" : "Criar"} Categoria
        </Button>
      </div>
    </form>
  );
}
