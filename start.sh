#!/bin/bash

set -e

echo "🔧 Iniciando o setup da aplicação..."

# Atualiza os pacotes do sistema
echo "📦 Atualizando pacotes do sistema..."
sudo apt update && sudo apt upgrade -y

# Instala Docker caso não esteja instalado
if ! command -v docker &> /dev/null; then
  echo "🐳 Instalando o Docker..."
  sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt update
  sudo apt install -y docker-ce docker-ce-cli containerd.io
else
  echo "✅ Docker já está instalado."
fi

# Inicia o serviço do Docker
echo "🚀 Iniciando o serviço do Docker..."
sudo systemctl enable docker
sudo systemctl start docker

# Build da imagem
echo "🔨 Construindo a imagem Docker..."
docker build -t linfedemapp .

# Remove container anterior se existir
if docker ps -a | grep -q linfedemapp-container; then
  echo "🧹 Removendo container anterior..."
  docker rm -f linfedemapp-container
fi

# Inicia o container com as portas certas
echo "🏁 Iniciando o container..."
docker run -d \
  -p 8081:8081 \
  --name linfedemapp-container \
  linfedemapp

echo "✅ Setup concluído! A aplicação Expo está rodando na porta 8081 (SDK 53)."
