'use client'

import { useState } from 'react'
import { SubscriptionsList } from './subscriptions-list'

interface SubscriptionsClientProps {
  initialSubscriptions: unknown[]
  categories: unknown[]
}

export function SubscriptionsClient({ 
  initialSubscriptions, 
  categories 
}: SubscriptionsClientProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)

  const handleRefresh = async () => {
    try {
      const response = await fetch('/api/subscriptions')
      if (response.ok) {
        const updatedSubscriptions = await response.json()
        setSubscriptions(updatedSubscriptions)
      }
    } catch (error) {
      console.error('Erro ao atualizar assinaturas:', error)
    }
  }

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      categories={categories}
      onRefresh={handleRefresh}
    />
  )
}