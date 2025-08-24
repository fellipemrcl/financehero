import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  
  // Criar usuário de teste
  const user = await prisma.user.upsert({
    where: { email: 'demo@financehero.com' },
    update: {},
    create: {
      email: 'demo@financehero.com',
      name: 'Usuário Demo',
    },
  })

  console.log('👤 Usuário criado:', user.email, 'ID:', user.id)

  // Criar categorias padrão
  const incomeCategories = [
    { name: 'Salário', color: '#22c55e', icon: '💰' },
    { name: 'Freelance', color: '#3b82f6', icon: '💻' },
    { name: 'Investimentos', color: '#8b5cf6', icon: '📈' },
    { name: 'Outros', color: '#6b7280', icon: '🔄' },
  ]

  const expenseCategories = [
    { name: 'Alimentação', color: '#ef4444', icon: '🍕' },
    { name: 'Transporte', color: '#f59e0b', icon: '🚗' },
    { name: 'Moradia', color: '#06b6d4', icon: '🏠' },
    { name: 'Saúde', color: '#10b981', icon: '🏥' },
    { name: 'Lazer', color: '#f97316', icon: '🎮' },
    { name: 'Educação', color: '#8b5cf6', icon: '📚' },
    { name: 'Roupas', color: '#ec4899', icon: '👕' },
    { name: 'Outros', color: '#6b7280', icon: '❓' },
  ]

  for (const category of incomeCategories) {
    await prisma.category.upsert({
      where: { 
        name_userId: {
          name: category.name,
          userId: user.id
        }
      },
      update: {},
      create: {
        ...category,
        type: 'INCOME',
        userId: user.id,
      },
    })
  }

  for (const category of expenseCategories) {
    await prisma.category.upsert({
      where: { 
        name_userId: {
          name: category.name,
          userId: user.id
        }
      },
      update: {},
      create: {
        ...category,
        type: 'EXPENSE',
        userId: user.id,
      },
    })
  }

  console.log('📂 Categorias criadas')

  // Criar contas padrão
  const accounts = [
    { name: 'Conta Corrente', type: 'CHECKING', balance: 2500.00 },
    { name: 'Poupança', type: 'SAVINGS', balance: 10000.00 },
    { name: 'Cartão de Crédito', type: 'CREDIT_CARD', balance: -1200.00 },
    { name: 'Dinheiro', type: 'CASH', balance: 300.00 },
  ]

  for (const account of accounts) {
    await prisma.financialAccount.upsert({
      where: { 
        id: `${user.id}-${account.name.toLowerCase().replace(/\s+/g, '-')}` 
      },
      update: {},
      create: {
        id: `${user.id}-${account.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: account.name,
        type: account.type as any,
        balance: account.balance,
        userId: user.id,
      },
    })
  }

  console.log('🏦 Contas criadas')

  // Criar uma meta de exemplo
  await prisma.goal.upsert({
    where: { id: `${user.id}-emergency-fund` },
    update: {},
    create: {
      id: `${user.id}-emergency-fund`,
      name: 'Reserva de Emergência',
      description: 'Meta de 6 meses de gastos para emergências',
      targetAmount: 20000.00,
      currentAmount: 5000.00,
      targetDate: new Date('2024-12-31'),
      userId: user.id,
    },
  })

  console.log('🎯 Meta criada')

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
