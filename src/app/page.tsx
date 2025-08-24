import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/signout-button"

export default async function Home() {
  const session = await auth()

  if (session) {
    // Authenticated user - show dashboard content
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Finance Hero
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Olá, {session.user?.name || session.user?.email}
                </span>
                <SignOutButton />
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Bem-vindo ao Finance Hero!
                </h2>
                <p className="text-gray-600">
                  Sua autenticação foi configurada com sucesso.
                </p>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">
                    ✅ Auth.js configurado com sucesso<br/>
                    ✅ Prisma Adapter funcionando<br/>
                    ✅ Sessão ativa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Unauthenticated user - show landing page
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
