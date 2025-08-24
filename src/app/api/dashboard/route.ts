import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // formato: YYYY-MM
    const year = searchParams.get("year"); // formato: YYYY

    // Determinar o período para as estatísticas
    let startDate: Date;
    let endDate: Date;
    
    if (month && year) {
      // Mês específico
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    } else {
      // Mês atual
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    // Mês anterior para comparação
    const previousMonthStart = new Date(startDate);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    const previousMonthEnd = new Date(startDate);
    previousMonthEnd.setDate(previousMonthEnd.getDate() - 1);

    // Buscar dados em paralelo para melhor performance
    const [
      totalBalance,
      currentMonthTransactions,
      previousMonthTransactions,
      recentTransactions,
      categoryStats,
      accountStats
    ] = await Promise.all([
      // Saldo total de todas as contas ativas
      prisma.financialAccount.aggregate({
        where: {
          userId: session.user.id,
          isActive: true,
        },
        _sum: {
          balance: true,
        },
      }),

      // Transações do mês atual
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          account: true,
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      }),

      // Transações do mês anterior para comparação
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
        include: {
          account: true,
          category: true,
        },
      }),

      // Transações recentes (últimas 5)
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          account: true,
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
      }),

      // Estatísticas por categoria
      prisma.transaction.groupBy({
        by: ["categoryId", "type"],
        where: {
          userId: session.user.id,
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
      }),

      // Estatísticas por conta
      prisma.financialAccount.findMany({
        where: {
          userId: session.user.id,
          isActive: true,
        },
        include: {
          _count: {
            select: {
              transactions: {
                where: {
                  date: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    // Calcular estatísticas do mês atual
    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentMonthSavings = currentMonthIncome - currentMonthExpenses;

    // Calcular estatísticas do mês anterior
    const previousMonthExpenses = previousMonthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const previousMonthIncome = previousMonthTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calcular variações percentuais
    const expenseChange = previousMonthExpenses > 0 
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
      : 0;

    const incomeChange = previousMonthIncome > 0
      ? ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100
      : 0;

    // Processar estatísticas por categoria
    const categoryStatsMap = new Map();
    
    for (const stat of categoryStats) {
      const categoryId = stat.categoryId;
      if (!categoryStatsMap.has(categoryId)) {
        categoryStatsMap.set(categoryId, { expenses: 0, income: 0, count: 0 });
      }
      
      const categoryData = categoryStatsMap.get(categoryId);
      if (stat.type === TransactionType.EXPENSE) {
        categoryData.expenses += Number(stat._sum.amount || 0);
      } else {
        categoryData.income += Number(stat._sum.amount || 0);
      }
      categoryData.count += stat._count.id;
    }

    // Buscar nomes das categorias
    const categoryIds = Array.from(categoryStatsMap.keys());
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        color: true,
        icon: true,
      },
    });

    // Combinar dados das categorias
    const categoryDetails = categories.map(category => {
      const stats = categoryStatsMap.get(category.id);
      return {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        expenses: stats?.expenses || 0,
        income: stats?.income || 0,
        count: stats?.count || 0,
      };
    });

    // Ordenar categorias por gastos (maior para menor)
    categoryDetails.sort((a, b) => b.expenses - a.expenses);

    return NextResponse.json({
      totalBalance: totalBalance._sum.balance || 0,
      currentMonth: {
        expenses: currentMonthExpenses,
        income: currentMonthIncome,
        savings: currentMonthSavings,
        savingsPercentage: currentMonthIncome > 0 ? (currentMonthSavings / currentMonthIncome) * 100 : 0,
      },
      previousMonth: {
        expenses: previousMonthExpenses,
        income: previousMonthIncome,
      },
      changes: {
        expenses: expenseChange,
        income: incomeChange,
      },
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        date: t.date,
        type: t.type,
        account: {
          id: t.account.id,
          name: t.account.name,
        },
        category: {
          id: t.category.id,
          name: t.category.name,
          color: t.category.color,
          icon: t.category.icon,
        },
      })),
      categoryStats: categoryDetails,
      accountStats: accountStats.map(account => ({
        id: account.id,
        name: account.name,
        balance: account.balance,
        transactionCount: account._count.transactions,
      })),
      period: {
        start: startDate,
        end: endDate,
      },
    });

  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
