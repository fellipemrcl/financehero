import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    console.log("Session de categorias:", session);
    
    if (!session?.user?.id) {
      console.log("Usuário não autenticado para categorias");
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: any = {
      userId: session.user.id,
      isActive: true,
    };

    if (type && Object.values(CategoryType).includes(type as CategoryType)) {
      where.type = type;
    }

    console.log("Buscando categorias para userId:", session.user.id, "type:", type);
    
    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    console.log("Categorias encontradas:", categories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
