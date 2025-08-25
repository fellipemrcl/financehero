import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SubscriptionsClient } from '@/components/subscriptions/subscriptions-client'

async function getSubscriptions(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
          icon: true
        }
      }
    },
    orderBy: {
      nextBillingDate: 'asc'
    }
  })

  return subscriptions
}

async function getCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      isActive: true
    },
    select: {
      id: true,
      name: true,
      color: true,
      icon: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  return categories
}

export default async function SubscriptionsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const [subscriptions, categories] = await Promise.all([
    getSubscriptions(session.user.id),
    getCategories(session.user.id)
  ])

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assinaturas</h1>
          <p className="text-muted-foreground">
            Gerencie seus gastos recorrentes e assinaturas
          </p>
        </div>

        <SubscriptionsClient 
          initialSubscriptions={subscriptions}
          categories={categories}
        />
      </div>
    </div>
  )
}