import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@/generated/prisma";

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
    const type = searchParams.get("type");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const where: any = {
      userId: session.user.id,
    };

    if (!includeInactive) {
      where.isActive = true;
    }

    if (type && Object.values(CategoryType).includes(type as CategoryType)) {
      where.type = type;
    }
    
    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
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
    const { name, type, description, color, icon, isActive } = body;

    // Validação dos campos obrigatórios
    if (!name || !type) {
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Validação do tipo de categoria
    if (!Object.values(CategoryType).includes(type)) {
      return NextResponse.json(
        { error: "Tipo de categoria inválido" },
        { status: 400 }
      );
    }

    // Verificar se já existe uma categoria com o mesmo nome para o usuário
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: session.user.id,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      );
    }

    // Criar a categoria
    const category = await prisma.category.create({
      data: {
        name,
        type,
        description,
        color,
        icon,
        isActive: isActive ?? true,
        userId: session.user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
