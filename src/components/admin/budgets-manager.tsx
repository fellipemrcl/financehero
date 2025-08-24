"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";

export function BudgetsManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orçamentos</h2>
        <p className="text-muted-foreground">
          Gerencie seus orçamentos mensais e categorias
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PiggyBank className="h-5 w-5" />
            <span>Orçamentos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <PiggyBank className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Funcionalidade em Desenvolvimento</h3>
            <p className="text-muted-foreground">
              O gerenciamento de orçamentos será implementado em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
