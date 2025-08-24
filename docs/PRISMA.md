# Prisma Setup - FinanceHero

Este projeto usa Prisma como ORM para gerenciar o banco de dados PostgreSQL.

## 📦 Estrutura

```
prisma/
├── schema.prisma     # Schema do banco de dados
└── seed.ts          # Script para popular o banco com dados iniciais

src/
├── generated/       # Prisma Client gerado automaticamente
│   └── prisma/
├── lib/
│   ├── prisma.ts    # Configuração do cliente Prisma
│   └── db-utils.ts  # Utilitários para operações no banco
```

## 🚀 Comandos Disponíveis

### Desenvolvimento
```bash
# Gerar o Prisma Client
npm run db:generate

# Aplicar mudanças no schema para o banco (development)
npm run db:push

# Criar e aplicar migrações
npm run db:migrate

# Abrir Prisma Studio (interface visual do banco)
npm run db:studio

# Popular o banco com dados iniciais
npm run db:seed
```

### Configuração Inicial

1. **Configure o DATABASE_URL no arquivo .env:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/financehero?schema=public"
```

2. **Gere o Prisma Client:**
```bash
npm run db:generate
```

3. **Aplique o schema ao banco:**
```bash
npm run db:push
```

4. **Popular com dados iniciais (opcional):**
```bash
npm run db:seed
```

## 📊 Modelos do Banco de Dados

### User (Usuário)
- Gerencia informações dos usuários
- Relacionado com todas as outras entidades

### Account (Conta)
- Diferentes tipos de conta (corrente, poupança, cartão, etc.)
- Controla saldo de cada conta

### Category (Categoria)
- Categorização de receitas e despesas
- Personalizável por usuário

### Transaction (Transação)
- Registros de entrada/saída de dinheiro
- Conecta conta, categoria e usuário

### Budget (Orçamento)
- Controle de gastos por categoria
- Períodos configuráveis (semanal, mensal, etc.)

### Goal (Meta)
- Objetivos financeiros dos usuários
- Controle de progresso

## 🔧 Uso do Prisma Client

### Importação
```typescript
import { prisma } from '@/lib/prisma'
import DatabaseUtils from '@/lib/db-utils'
```

### Exemplos de Uso

#### Buscar usuário com contas:
```typescript
const user = await DatabaseUtils.getUserById(userId)
```

#### Criar nova transação:
```typescript
const transaction = await prisma.transaction.create({
  data: {
    amount: 100.50,
    description: 'Almoço',
    date: new Date(),
    type: 'EXPENSE',
    userId,
    accountId,
    categoryId,
  },
})
```

#### Buscar transações do mês:
```typescript
const expenses = await DatabaseUtils.getMonthlyExpenses(userId, 2024, 1)
```

## 🛠️ Desenvolvimento

### Mudanças no Schema
1. Edite `prisma/schema.prisma`
2. Execute `npm run db:push` para aplicar as mudanças
3. Execute `npm run db:generate` para atualizar o client

### Migrações para Produção
```bash
# Criar migração
npx prisma migrate dev --name nome_da_migração

# Aplicar migrações em produção
npx prisma migrate deploy
```

### Debugging
- Use `npm run db:studio` para visualizar dados
- Ative logs no Prisma Client para debug de queries

## 📋 Enums Disponíveis

- **AccountType**: CHECKING, SAVINGS, CREDIT_CARD, INVESTMENT, CASH
- **CategoryType**: INCOME, EXPENSE
- **TransactionType**: INCOME, EXPENSE, TRANSFER
- **Period**: WEEKLY, MONTHLY, QUARTERLY, YEARLY
- **GoalStatus**: ACTIVE, COMPLETED, PAUSED, CANCELLED

## 🔒 Segurança

- Todas as operações devem validar o `userId` para isolamento de dados
- Use transactions do Prisma para operações críticas
- Validação de entrada sempre obrigatória

## 📚 Referências

- [Documentação do Prisma](https://www.prisma.io/docs/)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
