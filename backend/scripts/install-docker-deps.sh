#!/bin/bash

# Script para instalar dependências no container Docker
# Uso: ./scripts/install-docker-deps.sh

set -e

echo "📦 Instalando dependências no container Docker..."
docker compose exec backend npm install

echo "✅ Dependências instaladas com sucesso!"
echo "🔄 Reiniciando container..."
docker compose restart backend

echo "✅ Pronto! Container reiniciado."

