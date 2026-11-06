FROM node:22

WORKDIR /usr/src/app

# Instalar curl para healthcheck e captura de URLs
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Variáveis de ambiente
ENV EXPO_PUBLIC_API_URL=http://defisio-api:8083
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Instalar @expo/ngrok globalmente para tunnel
RUN npm install -g @expo/ngrok@^4.1.0

# Copiar código fonte
COPY . .

# Copiar e dar permissão ao entrypoint
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Criar diretório de logs
RUN mkdir -p /var/log/linfedemapp

EXPOSE 8081

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]