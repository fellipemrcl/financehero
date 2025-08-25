'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { MoreHorizontal, Calendar, DollarSign, Tag, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Subscription {
  id: string
  name: string
  description?: string
  amount: number
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  nextBillingDate: string | Date
  isActive: boolean
  category: {
    id: string
    name: string
    color?: string
    icon?: string
  }
}

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, isActive: boolean) => void
}

const frequencyLabels = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  QUARTERLY: 'Trimestral',
  YEARLY: 'Anual'
}

const frequencyColors = {
  WEEKLY: 'bg-blue-100 text-blue-800',
  MONTHLY: 'bg-green-100 text-green-800',
  QUARTERLY: 'bg-yellow-100 text-yellow-800',
  YEARLY: 'bg-purple-100 text-purple-800'
}

export function SubscriptionCard({ 
  subscription, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete(subscription.id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setIsLoading(true)
    try {
      await onToggleStatus(subscription.id, !subscription.isActive)
    } finally {
      setIsLoading(false)
    }
  }

  const nextBillingDate = new Date(subscription.nextBillingDate)
  const isOverdue = nextBillingDate < new Date()

  return (
    <Card className={`relative ${!subscription.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {subscription.category.icon && (
                <span className="text-xl">{subscription.category.icon}</span>
              )}
              {subscription.name}
              {!subscription.isActive && (
                <Badge variant="secondary" className="text-xs">
                  Pausada
                </Badge>
              )}
            </CardTitle>
            {subscription.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {subscription.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(subscription)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus}>
                {subscription.isActive ? 'Pausar' : 'Reativar'}
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a assinatura &quot;{subscription.name}&quot;? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-lg">
              R$ {subscription.amount.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <Badge 
            variant="secondary"
            className={frequencyColors[subscription.frequency]}
          >
            {frequencyLabels[subscription.frequency]}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {subscription.category.name}
          </span>
          {subscription.category.color && (
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: subscription.category.color }}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {isOverdue ? 'Vencida em ' : 'Próxima cobrança: '}
            {format(nextBillingDate, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>

        {isOverdue && subscription.isActive && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
            <p className="text-red-800 text-sm font-medium">
              ⚠️ Assinatura vencida
            </p>
            <p className="text-red-600 text-xs mt-1">
              Esta assinatura pode ter sido cobrada. Verifique sua conta.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}