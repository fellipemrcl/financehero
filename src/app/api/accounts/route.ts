import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    console.log("Session de contas:", session);
    
    if (!session?.user?.id) {
      console.log("Usuário não autenticado");
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    console.log("Buscando contas para userId:", session.user.id);

    const accounts = await prisma.financialAccount.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log("Contas encontradas:", accounts);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
