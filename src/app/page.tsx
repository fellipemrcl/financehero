import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/signout-button"

export default async function Home() {
  const session = await auth()

  if (session) {
    // Authenticated user - show dashboard content
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-foreground">
                Finance Hero
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  Olá, {session.user?.name || session.user?.email}
                </span>
                <SignOutButton />
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-2 border-dashed border-border rounded-lg h-96 flex items-center justify-center bg-card/50">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                  Bem-vindo ao Finance Hero!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Sua autenticação foi configurada com sucesso.
                </p>
                <div className="max-w-md mx-auto p-6 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-success-foreground bg-success/80 px-3 py-2 rounded">
                    ✅ Auth.js configurado com sucesso<br/>
                    ✅ Prisma Adapter funcionando<br/>
                    ✅ Sessão ativa
                  </p>
                </div>
                
                {/* Quick stats preview */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-card border border-border p-4 rounded-lg">
                    <div className="text-2xl font-bold text-chart-1">+R$ 2.500</div>
                    <div className="text-sm text-muted-foreground">Receitas</div>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-lg">
                    <div className="text-2xl font-bold text-chart-4">-R$ 1.800</div>
                    <div className="text-sm text-muted-foreground">Despesas</div>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">R$ 700</div>
                    <div className="text-sm text-muted-foreground">Saldo</div>
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Finance Hero
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
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
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-chart-1 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Controle de Gastos</h3>
              <p className="text-muted-foreground">
                Acompanhe suas despesas e receitas de forma detalhada
              </p>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-chart-2 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Planejamento</h3>
              <p className="text-muted-foreground">
                Crie orçamentos e metas para alcançar seus objetivos
              </p>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-chart-3 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Relatórios</h3>
              <p className="text-muted-foreground">
                Visualize relatórios detalhados sobre sua situação financeira
              </p>
            </div>
          </div>

          {/* Color Palette Preview for Demo */}
          <div className="mt-16 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Paleta de Cores Finance Hero</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-muted-foreground">Primary</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-muted-foreground">Success</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-muted-foreground">Warning</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-muted-foreground">Loss</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-muted-foreground">Accent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
