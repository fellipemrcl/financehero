import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    const { name, type, balance, description, isActive } = body;

    // Validação dos campos obrigatórios
    if (!name || !type) {
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a conta existe e pertence ao usuário
    const existingAccount = await prisma.financialAccount.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Conta não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se já existe outra conta com o mesmo nome para o usuário
    const duplicateAccount = await prisma.financialAccount.findFirst({
      where: {
        name,
        userId: session.user.id,
        NOT: {
          id,
        },
      },
    });

    if (duplicateAccount) {
      return NextResponse.json(
        { error: "Já existe uma conta com este nome" },
        { status: 400 }
      );
    }

    // Atualizar a conta
    const account = await prisma.financialAccount.update({
      where: { id },
      data: {
        name,
        type,
        balance: balance ? parseFloat(balance) : existingAccount.balance,
        description,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
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

    // Verificar se a conta existe e pertence ao usuário
    const account = await prisma.financialAccount.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Conta não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se a conta está sendo usada em transações
    const transactionsCount = await prisma.transaction.count({
      where: {
        accountId: id,
        userId: session.user.id,
      },
    });

    if (transactionsCount > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir esta conta pois ela está sendo usada em ${transactionsCount} transação(ões)` },
        { status: 400 }
      );
    }

    // Deletar a conta
    await prisma.financialAccount.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Conta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
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

    const account = await prisma.financialAccount.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Conta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Erro ao buscar conta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
