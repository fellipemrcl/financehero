# Docker Setup para FinanceHero

Este guia explica como configurar e usar o Docker Compose para rodar o banco de dados PostgreSQL localmente para o projeto FinanceHero.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## 🚀 Configuração Inicial

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database Configuration
POSTGRES_USER=financehero
POSTGRES_PASSWORD=sua_senha_segura_aqui
POSTGRES_DB=financehero_db

# Database URL for Prisma
DATABASE_URL="postgresql://financehero:sua_senha_segura_aqui@localhost:5432/financehero_db?schema=public"

# pgAdmin Configuration
PGADMIN_EMAIL=admin@financehero.com
PGADMIN_PASSWORD=senha_admin_segura
```

### 2. Iniciar os Serviços

Para iniciar o PostgreSQL e pgAdmin:

```bash
docker compose up -d
```

### 3. Verificar se os Serviços Estão Rodando

```bash
docker compose ps
```

Você deve ver algo como:
```
NAME                    COMMAND                  SERVICE             STATUS              PORTS
financehero_postgres    "docker-entrypoint.s…"   postgres            running (healthy)   0.0.0.0:5432->5432/tcp
financehero_pgadmin     "/entrypoint.sh"         pgadmin             running             0.0.0.0:5050->80/tcp
```

## 🔧 Serviços Disponíveis

### PostgreSQL Database
- **Host:** `localhost`
- **Porta:** `5432`
- **Database:** `financehero_db`
- **Usuário:** `financehero` (ou conforme configurado no .env)
- **Senha:** Conforme configurado no .env

### pgAdmin (Interface Web)
- **URL:** http://localhost:5050
- **Email:** `admin@financehero.com` (ou conforme configurado no .env)
- **Senha:** Conforme configurado no .env

## 🗃️ Trabalhando com Prisma

### Gerar o Cliente Prisma
```bash
npm run db:generate
```

### Aplicar Migrações
```bash
npm run db:migrate
```

### Push do Schema (para desenvolvimento)
```bash
npm run db:push
```

### Executar Seeds
```bash
npm run db:seed
```

### Abrir Prisma Studio
```bash
npm run db:studio
```

## 📊 Comandos Úteis

### Parar os Serviços
```bash
docker compose down
```

### Parar e Remover Volumes (⚠️ Remove todos os dados!)
```bash
docker compose down -v
```

### Ver Logs dos Serviços
```bash
# Todos os serviços
docker compose logs -f

# Apenas PostgreSQL
docker compose logs -f postgres

# Apenas pgAdmin
docker compose logs -f pgadmin
```

### Executar Comandos no PostgreSQL
```bash
# Conectar ao container PostgreSQL
docker compose exec postgres psql -U financehero -d financehero_db

# Backup do banco
docker compose exec postgres pg_dump -U financehero financehero_db > backup.sql

# Restaurar backup
docker compose exec -T postgres psql -U financehero financehero_db < backup.sql
```

## 🔄 Conectando com pgAdmin

1. Acesse http://localhost:5050
2. Faça login com as credenciais configuradas no .env
3. O servidor PostgreSQL já deve estar pré-configurado (FinanceHero PostgreSQL)
4. Se não estiver, adicione um novo servidor:
   - **Host:** `postgres`
   - **Porta:** `5432`
   - **Database:** `financehero_db`
   - **Usuário:** `financehero`
   - **Senha:** Sua senha do .env

## 🐛 Troubleshooting

### Porta 5432 já está em uso
Se você já tem PostgreSQL instalado localmente:
```bash
# Parar PostgreSQL local
sudo systemctl stop postgresql

# Ou mudar a porta no docker-compose.yml
# ports:
#   - "5433:5432"  # Use porta 5433 no host
```

### Erro de permissão nos volumes
```bash
# Linux/macOS - Ajustar permissões
sudo chown -R $USER:$USER ./docker/
```

### Reset completo do ambiente
```bash
# Parar tudo e remover volumes
docker compose down -v

# Remover imagens (opcional)
docker compose down --rmi all

# Limpar volumes órfãos
docker volume prune

# Recriar tudo
docker compose up -d
```

### Verificar saúde dos containers
```bash
docker compose ps
docker compose logs postgres
```

## 📂 Estrutura de Arquivos Docker

```
docker/
├── postgres/
│   └── init/
│       └── 01-init.sql    # Script de inicialização do PostgreSQL
└── pgadmin/
    └── servers.json       # Configuração de servidores do pgAdmin
```

## 🔒 Segurança

- ⚠️ **Nunca commite o arquivo `.env`** com senhas reais
- Use senhas fortes em produção
- O arquivo `.env.example` serve como template
- Em produção, use secrets ou variáveis de ambiente do sistema

## 📚 Recursos Úteis

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [pgAdmin Docker Image](https://hub.docker.com/r/dpage/pgadmin4)
- [Prisma Documentation](https://www.prisma.io/docs)
