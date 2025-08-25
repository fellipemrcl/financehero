'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { SubscriptionCard } from './subscription-card'
import { SubscriptionForm } from './subscription-form'
import { Plus, Search, Filter } from 'lucide-react'

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

interface Category {
  id: string
  name: string
  color?: string
  icon?: string
}

interface SubscriptionsListProps {
  subscriptions: Subscription[]
  categories: Category[]
  onRefresh: () => void
}

export function SubscriptionsList({ 
  subscriptions, 
  categories, 
  onRefresh 
}: SubscriptionsListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all')
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])

  useEffect(() => {
    let filtered = subscriptions

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => 
        statusFilter === 'active' ? sub.isActive : !sub.isActive
      )
    }

    // Filtro por frequência
    if (frequencyFilter !== 'all') {
      filtered = filtered.filter(sub => sub.frequency === frequencyFilter)
    }

    setFilteredSubscriptions(filtered)
  }, [subscriptions, searchTerm, statusFilter, frequencyFilter])

  const handleCreateSubscription = async (data: any) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          nextBillingDate: data.nextBillingDate.toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar assinatura')
      }

      onRefresh()
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
      throw error
    }
  }

  const handleUpdateSubscription = async (data: any) => {
    if (!editingSubscription) return

    try {
      const response = await fetch(`/api/subscriptions/${editingSubscription.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          nextBillingDate: data.nextBillingDate.toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar assinatura')
      }

      onRefresh()
      setEditingSubscription(null)
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error)
      throw error
    }
  }

  const handleDeleteSubscription = async (id: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir assinatura')
      }

      onRefresh()
    } catch (error) {
      console.error('Erro ao excluir assinatura:', error)
    }
  }

  const handleToggleSubscriptionStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status da assinatura')
      }

      onRefresh()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingSubscription(null)
  }

  const totalMonthlyAmount = subscriptions
    .filter(sub => sub.isActive)
    .reduce((total, sub) => {
      const monthlyAmount = (() => {
        switch (sub.frequency) {
          case 'WEEKLY': return sub.amount * 4.33
          case 'MONTHLY': return sub.amount
          case 'QUARTERLY': return sub.amount / 3
          case 'YEARLY': return sub.amount / 12
          default: return sub.amount
        }
      })()
      return total + monthlyAmount
    }, 0)

  const activeCount = subscriptions.filter(sub => sub.isActive).length
  const overdueCount = subscriptions.filter(sub => 
    sub.isActive && new Date(sub.nextBillingDate) < new Date()
  ).length

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Mensal</h3>
          <p className="text-2xl font-bold text-green-600">
            R$ {totalMonthlyAmount.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-600">Assinaturas Ativas</h3>
          <p className="text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-600">Vencidas</h3>
          <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar assinaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="inactive">Pausadas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Frequência</SelectItem>
              <SelectItem value="WEEKLY">Semanal</SelectItem>
              <SelectItem value="MONTHLY">Mensal</SelectItem>
              <SelectItem value="QUARTERLY">Trimestral</SelectItem>
              <SelectItem value="YEARLY">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Assinatura
        </Button>
      </div>

      {/* Lista de assinaturas */}
      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {subscriptions.length === 0 
              ? 'Nenhuma assinatura cadastrada ainda.'
              : 'Nenhuma assinatura encontrada com os filtros aplicados.'
            }
          </p>
          {subscriptions.length === 0 && (
            <Button 
              onClick={() => setIsFormOpen(true)} 
              className="mt-4"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira assinatura
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={handleEdit}
              onDelete={handleDeleteSubscription}
              onToggleStatus={handleToggleSubscriptionStatus}
            />
          ))}
        </div>
      )}

      {/* Formulário */}
      <SubscriptionForm
        categories={categories.filter(cat => cat.id)}
        onSubmit={editingSubscription ? handleUpdateSubscription : handleCreateSubscription}
        initialData={editingSubscription ? {
          ...editingSubscription,
          nextBillingDate: new Date(editingSubscription.nextBillingDate)
        } : undefined}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  )
}