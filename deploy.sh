#!/bin/bash

echo "🚀 Fazendo deploy do Clarity Cash na Vercel..."

# Instalar Vercel CLI se não estiver instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Deploy na Vercel
echo "☁️ Fazendo deploy na Vercel..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🌐 Seu app estará disponível na URL fornecida pela Vercel"