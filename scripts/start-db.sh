#!/bin/bash

# FinanceHero Database Quick Start Script
# This script helps you quickly start the PostgreSQL database with Docker Compose

set -e

echo "🚀 Starting FinanceHero Database Setup..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker compose is available
if ! docker compose version >/dev/null 2>&1; then
    echo "❌ docker compose is not available. Please install Docker Compose v2 first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created! Please edit it with your settings."
        echo "⚠️  Remember to change the default passwords!"
    else
        echo "❌ .env.example not found!"
        exit 1
    fi
fi

# Start the services
echo "🐳 Starting Docker Compose services..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker compose exec postgres pg_isready -U financehero -d financehero_db >/dev/null 2>&1; do
    printf "."
    sleep 1
done
echo ""

echo "✅ PostgreSQL is ready!"

# Check if Node.js packages are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run database migrations
echo "🗄️  Applying database migrations..."
npm run db:push

# Check if we should run seeds
if [ -f "prisma/seed.ts" ]; then
    read -p "🌱 Do you want to run database seeds? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Running database seeds..."
        npm run db:seed
    fi
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📊 Services are now running:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Prisma Studio: npm run db:studio (run this to open database UI)"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: docker compose logs -f"
echo "   - Stop services: docker compose down"
echo "   - Open Prisma Studio: npm run db:studio"
echo ""
echo "📚 For more information, see DOCKER.md"
