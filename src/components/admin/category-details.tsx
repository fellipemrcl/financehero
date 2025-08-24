"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/format";
import { 
  Tag, 
  FileText, 
  Palette,
  Clock,
  Activity
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  type: "INCOME" | "EXPENSE";
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryDetailsProps {
  category: Category;
}

export function CategoryDetails({ category }: CategoryDetailsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "INCOME":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "EXPENSE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
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
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Resumo da Categoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {category.icon && (
              <div className="text-4xl">{category.icon}</div>
            )}
            <div>
              <h3 className="text-2xl font-bold">{category.name}</h3>
              <Badge className={getTypeColor(category.type)}>
                {getTypeLabel(category.type)}
              </Badge>
            </div>
          </div>

          {category.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                <p className="text-base">{category.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Visual Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Propriedades Visuais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.color && (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-border"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <p className="text-sm text-muted-foreground">Cor</p>
                  <p className="font-mono text-sm">{category.color}</p>
                </div>
              </div>
            )}

            {category.icon && (
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{category.icon}</div>
                <div>
                  <p className="text-sm text-muted-foreground">Ícone</p>
                  <p className="text-sm">Emoji selecionado</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status and Timestamps */}
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
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "Ativo" : "Inativo"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {category.isActive 
                  ? "Esta categoria pode ser usada em transações" 
                  : "Esta categoria está desabilitada"
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Datas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Criada em</p>
              <p className="text-sm">
                {formatDateTime(category.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Última atualização</p>
              <p className="text-sm">
                {formatDateTime(category.updatedAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category ID */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ID da Categoria</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">{category.id}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
