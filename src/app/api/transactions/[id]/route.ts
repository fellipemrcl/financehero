import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { amount, description, date, type, accountId, categoryId } = body;

    // Validação dos campos obrigatórios
    if (!amount || !description || !date || !type || !accountId || !categoryId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a transação existe e pertence ao usuário
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        account: true,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
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

    // Reverter o efeito da transação anterior no saldo da conta antiga
    if (existingTransaction.type === TransactionType.EXPENSE) {
      await prisma.financialAccount.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: parseFloat(existingTransaction.amount.toString()),
          },
        },
      });
    } else if (existingTransaction.type === TransactionType.INCOME) {
      await prisma.financialAccount.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            decrement: parseFloat(existingTransaction.amount.toString()),
          },
        },
      });
    }

    // Atualizar a transação
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        type,
        accountId,
        categoryId,
      },
      include: {
        account: true,
        category: true,
      },
    });

    // Aplicar o efeito da nova transação no saldo da conta
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

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar se a transação existe e pertence ao usuário
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Reverter o efeito da transação no saldo da conta
    if (transaction.type === TransactionType.EXPENSE) {
      await prisma.financialAccount.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: parseFloat(transaction.amount.toString()),
          },
        },
      });
    } else if (transaction.type === TransactionType.INCOME) {
      await prisma.financialAccount.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            decrement: parseFloat(transaction.amount.toString()),
          },
        },
      });
    }

    // Deletar a transação
    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transação deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        account: true,
        category: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
