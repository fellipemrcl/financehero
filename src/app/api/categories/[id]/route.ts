import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@/generated/prisma";

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
    const { name, type, description, color, icon, isActive } = body;

    // Validação dos campos obrigatórios
    if (!name || !type) {
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a categoria existe e pertence ao usuário
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se já existe outra categoria com o mesmo nome para o usuário
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: session.user.id,
        NOT: {
          id,
        },
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      );
    }

    // Atualizar a categoria
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        type,
        description,
        color,
        icon,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
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

    // Verificar se a categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se a categoria está sendo usada em transações
    const transactionsCount = await prisma.transaction.count({
      where: {
        categoryId: id,
        userId: session.user.id,
      },
    });

    if (transactionsCount > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir esta categoria pois ela está sendo usada em ${transactionsCount} transação(ões)` },
        { status: 400 }
      );
    }

    // Verificar se a categoria está sendo usada em orçamentos
    const budgetsCount = await prisma.budget.count({
      where: {
        categoryId: id,
        userId: session.user.id,
      },
    });

    if (budgetsCount > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir esta categoria pois ela está sendo usada em ${budgetsCount} orçamento(s)` },
        { status: 400 }
      );
    }

    // Deletar a categoria
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
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

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
