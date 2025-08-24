import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Finance Hero
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Gerencie suas finanças pessoais de forma inteligente e segura.
            Controle gastos, planeje orçamentos e alcance seus objetivos financeiros.
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full md:w-auto">
                  Ir para Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button size="lg" className="w-full md:w-auto">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Controle de Gastos</h3>
              <p className="text-gray-600">
                Acompanhe suas despesas e receitas de forma detalhada
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Planejamento</h3>
              <p className="text-gray-600">
                Crie orçamentos e metas para alcançar seus objetivos
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Relatórios</h3>
              <p className="text-gray-600">
                Visualize relatórios detalhados sobre sua situação financeira
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
