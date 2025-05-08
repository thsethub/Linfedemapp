# Use uma imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho no container
WORKDIR /usr/src/app

# Copie o arquivo package.json e yarn.lock para o diretório de trabalho
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install --legacy-peer-deps

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Exponha as portas padrão do Expo SDK 53
EXPOSE 8081

# Comando para iniciar o servidor do Expo
CMD ["sudo", "npx", "expo", "start"]