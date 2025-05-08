# Use uma imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho no container
WORKDIR /usr/src/app

# Copie o arquivo package.json e yarn.lock para o diretório de trabalho
COPY package.json yarn.lock ./

# Instale as dependências
RUN yarn install

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Exponha as portas padrão do Expo SDK 53
EXPOSE 8081 19000 19001

# Comando para iniciar o servidor do Expo
CMD ["yarn", "start"]