# ---------- Etapa 1: build estático da versão web ----------
FROM node:22 AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

# URL pública da API, embutida no bundle em tempo de build. O .env não existe no CI
# (está no .gitignore), então o padrão fica aqui. Sobrescreva com --build-arg se mudar.
ARG EXPO_PUBLIC_API_URL=https://linfedemapp-api.thsethub.com.br
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}
ENV CI=1
RUN npx expo export --platform web --output-dir /dist

# ---------- Etapa 2: nginx servindo os arquivos estáticos ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
