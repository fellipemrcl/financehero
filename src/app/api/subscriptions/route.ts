import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  amount: z.number().positive('Valor deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  nextBillingDate: z.string().datetime()
})

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id
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
        createdAt: 'desc'
      }
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = subscriptionSchema.parse(body)

    // Verificar se a categoria pertence ao usuário
    const category = await prisma.category.findFirst({
      where: {
        id: validatedData.categoryId,
        userId: session.user.id
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    const subscription = await prisma.subscription.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        amount: validatedData.amount,
        frequency: validatedData.frequency,
        nextBillingDate: new Date(validatedData.nextBillingDate),
        userId: session.user.id,
        categoryId: validatedData.categoryId
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
      }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Erro ao criar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}