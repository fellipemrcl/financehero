# FinanceHero 💰

Uma aplicação moderna de controle financeiro pessoal desenvolvida com Next.js e Prisma ORM.

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Linguagem de programação
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 🛠️ Configuração do Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd financehero
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o banco de dados:**
```bash
# Copie o arquivo de exemplo das variáveis de ambiente
cp .env.example .env

# Configure a DATABASE_URL no arquivo .env
DATABASE_URL="postgresql://username:password@localhost:5432/financehero?schema=public"
```

4. **Configure o banco de dados com Prisma:**
```bash
# Gerar o Prisma Client
npm run db:generate

# Aplicar o schema ao banco de dados
npm run db:push

# Popular o banco com dados de exemplo (opcional)
npm run db:seed
```

5. **Execute o servidor de desenvolvimento:**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📊 Banco de Dados

Este projeto usa **Prisma ORM** com PostgreSQL. O schema inclui:

- **Users** - Usuários da aplicação
- **Accounts** - Contas bancárias (corrente, poupança, cartão, etc.)
- **Categories** - Categorias de receitas e despesas
- **Transactions** - Transações financeiras
- **Budgets** - Orçamentos por categoria
- **Goals** - Metas financeiras

### Comandos úteis do Prisma:

```bash
# Visualizar o banco de dados
npm run db:studio

# Criar migração
npm run db:migrate

# Gerar cliente
npm run db:generate

# Popular banco
npm run db:seed
```

📚 **Documentação detalhada:** [docs/PRISMA.md](./docs/PRISMA.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
