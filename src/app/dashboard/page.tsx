import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/auth/signout-button"

export default async function Dashboard() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

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
