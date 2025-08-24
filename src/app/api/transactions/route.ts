import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, description, date, type, accountId, categoryId } = body;

    // Validação dos campos obrigatórios
    if (!amount || !description || !date || !type || !accountId || !categoryId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Validação do tipo de transação
    if (!Object.values(TransactionType).includes(type)) {
      return NextResponse.json(
        { error: "Tipo de transação inválido" },
        { status: 400 }
      );
    }

    // Verificar se a conta pertence ao usuário
    const account = await prisma.financialAccount.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Conta não encontrada ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Verificar se a categoria pertence ao usuário
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Para gastos, verificar se a categoria é do tipo EXPENSE
    if (type === TransactionType.EXPENSE && category.type !== "EXPENSE") {
      return NextResponse.json(
        { error: "Para gastos, use uma categoria do tipo EXPENSE" },
        { status: 400 }
      );
    }

    // Criar a transação
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        type,
        userId: session.user.id,
        accountId,
        categoryId,
      },
      include: {
        account: true,
        category: true,
      },
    });

    // Atualizar o saldo da conta
    if (type === TransactionType.EXPENSE) {
      await prisma.financialAccount.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: parseFloat(amount),
          },
        },
      });
    } else if (type === TransactionType.INCOME) {
      await prisma.financialAccount.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: parseFloat(amount),
          },
        },
      });
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const type = searchParams.get("type");
    const accountId = searchParams.get("accountId");
    const categoryId = searchParams.get("categoryId");

    const skip = (page - 1) * limit;

    const where: any = {
      userId: session.user.id,
    };

    if (type && Object.values(TransactionType).includes(type as TransactionType)) {
      where.type = type;
    }

    if (accountId) {
      where.accountId = accountId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: true,
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
