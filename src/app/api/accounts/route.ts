import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    const includeInactive = searchParams.get("includeInactive") === "true";

    const where: any = {
      userId: session.user.id,
    };

    if (!includeInactive) {
      where.isActive = true;
    }

    const accounts = await prisma.financialAccount.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

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
    const { name, type, balance, description, isActive } = body;

    // Validação dos campos obrigatórios
    if (!name || !type) {
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se já existe uma conta com o mesmo nome para o usuário
    const existingAccount = await prisma.financialAccount.findFirst({
      where: {
        name,
        userId: session.user.id,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: "Já existe uma conta com este nome" },
        { status: 400 }
      );
    }

    // Criar a conta
    const account = await prisma.financialAccount.create({
      data: {
        name,
        type,
        balance: balance ? parseFloat(balance) : 0,
        description,
        isActive: isActive ?? true,
        userId: session.user.id,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
