import { prisma } from './prisma'
import { Prisma } from '@/generated/prisma'

// Tipos úteis
export type UserWithAccounts = Prisma.UserGetPayload<{
  include: { userAccounts: true }
}>

export type TransactionWithDetails = Prisma.TransactionGetPayload<{
  include: {
    account: true
    category: true
  }
}>

export type FinancialAccountWithTransactions = Prisma.FinancialAccountGetPayload<{
  include: { transactions: true }
}>

// Funções utilitárias para operações comuns
export class DatabaseUtils {
  // Usuários
  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        userAccounts: true,
        categories: true,
        budgets: true,
        goals: true,
      },
    })
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    })
  }

  // Transações
  static async getTransactionsByUser(userId: string, limit: number = 50) {
    return await prisma.transaction.findMany({
      where: { userId },
      include: {
        account: true,
        category: true,
      },
      orderBy: { date: 'desc' },
      take: limit,
    })
  }

  static async getTransactionsByAccount(accountId: string, limit: number = 50) {
    return await prisma.transaction.findMany({
      where: { accountId },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
      take: limit,
    })
  }

  static async getTransactionsByCategory(categoryId: string, limit: number = 50) {
    return await prisma.transaction.findMany({
      where: { categoryId },
      include: {
        account: true,
      },
      orderBy: { date: 'desc' },
      take: limit,
    })
  }

  // Estatísticas
  static async getMonthlyExpenses(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    return await prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    })
  }

  static async getMonthlyIncome(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    return await prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INCOME',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    })
  }

  static async getCategoryExpenses(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    return await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    })
  }

  // Orçamentos
  static async getBudgetsByUser(userId: string) {
    return await prisma.budget.findMany({
      where: { userId, isActive: true },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async updateBudgetSpent(budgetId: string) {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
    })

    if (!budget) return null

    const spent = await prisma.transaction.aggregate({
      where: {
        categoryId: budget.categoryId,
        type: 'EXPENSE',
        date: {
          gte: budget.startDate,
          lte: budget.endDate,
        },
      },
      _sum: {
        amount: true,
      },
    })

    return await prisma.budget.update({
      where: { id: budgetId },
      data: {
        spent: spent._sum.amount || 0,
      },
    })
  }

  // Metas
  static async getGoalsByUser(userId: string) {
    return await prisma.goal.findMany({
      where: { userId },
      orderBy: { targetDate: 'asc' },
    })
  }

  // Contas
  static async getAccountsByUser(userId: string) {
    return await prisma.financialAccount.findMany({
      where: { userId, isActive: true },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  static async updateAccountBalance(accountId: string) {
    const transactions = await prisma.transaction.aggregate({
      where: { accountId },
      _sum: {
        amount: true,
      },
    })

    return await prisma.financialAccount.update({
      where: { id: accountId },
      data: {
        balance: transactions._sum.amount || 0,
      },
    })
  }

  // Categorias
  static async getCategoriesByUser(userId: string, type?: 'INCOME' | 'EXPENSE') {
    return await prisma.category.findMany({
      where: {
        userId,
        isActive: true,
        ...(type && { type }),
      },
      orderBy: { name: 'asc' },
    })
  }
}

export default DatabaseUtils
