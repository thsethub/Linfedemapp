# Linfedemapp — App Mobile

Aplicativo para fisioterapeutas registrarem e acompanharem pacientes com linfedema. Permite cadastro de mensurações (perimetria e volumetria) dos membros superiores, histórico de procedimentos e geração de relatórios em PDF.

## Stack

- React Native + Expo (SDK 52)
- TypeScript
- Expo Router (navegação por arquivo)
- i18n — Português (PT-BR), Inglês (EN-US), Espanhol (ES-ES)
- Docker (produção via túnel Ngrok)

## Funcionalidades

- Autenticação (login, cadastro, recuperação de senha)
- Cadastro e gerenciamento de pacientes
- Registro de mensurações: perimetria e volumetria
- Histórico detalhado de exames e procedimentos
- Calculadora de linfedema
- Geração de relatório em PDF por paciente
- Suporte a múltiplos idiomas

## Desenvolvimento local

### Pré-requisitos

- Node.js 22+
- Expo CLI (`npm install -g expo-cli`)
- App **Expo Go** no celular, ou emulador Android/iOS

### Configuração

```bash
npm install --legacy-peer-deps
cp .env.example .env
```

Edite o `.env` com o endereço da API:

```
EXPO_PUBLIC_API_URL=http://<IP-da-máquina>:8083
```

### Executar

```bash
npx expo start
```

Escaneie o QR code com o Expo Go ou pressione `a` para emulador Android / `i` para iOS.

## Conexão com a API

| Ambiente | URL |
|---|---|
| Local | `EXPO_PUBLIC_API_URL` do `.env` |
| Docker | Resolvida automaticamente via Ngrok no `entrypoint.sh` |

Em produção (Docker), o `entrypoint.sh` consulta `http://defisio-api:4040/api/tunnels` para obter a URL pública do Ngrok antes de iniciar o bundler.

## Build e publicação da imagem

O push para `main` ou `master` aciona o workflow do GitHub Actions que publica a imagem em `ghcr.io/thsethub/linfedemapp:latest`.

```bash
git push origin main
```
