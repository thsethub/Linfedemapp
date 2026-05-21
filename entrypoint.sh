#!/bin/bash
set -e

echo "=========================================================="
echo "  LINFEDEMAPP - Inicializando aplicação..."
echo "=========================================================="
echo ""

# Criar diretório de logs
mkdir -p /var/log/linfedemapp

# ============================================
# ETAPA 1: Aguardar URL ngrok da API
# ============================================
echo "[$(date)] Aguardando ngrok da API ficar disponível..."
MAX_RETRIES=60
RETRY=0
API_URL=""

while [ -z "$API_URL" ] && [ $RETRY -lt $MAX_RETRIES ]; do
  API_URL=$(grep 'API_NGROK_URL=https://' /var/log/defisio/urls.log 2>/dev/null | tail -1 | grep -o 'https://[^ ]*' || true)
  if [ -z "$API_URL" ]; then
    RETRY=$((RETRY + 1))
    echo "[$(date)] Tentativa $RETRY/$MAX_RETRIES - Aguardando ngrok da API..."
    sleep 5
  fi
done

if [ -z "$API_URL" ]; then
  echo "[$(date)] AVISO: Não foi possível obter URL ngrok da API."
  echo "[$(date)] Usando fallback: ${EXPO_PUBLIC_API_URL:-http://defisio-api:8083}"
  API_URL="${EXPO_PUBLIC_API_URL:-http://defisio-api:8083}"
fi

export EXPO_PUBLIC_API_URL="$API_URL"

echo ""
echo "=========================================================="
echo "  API NGROK URL CAPTURADA:"
echo "  $API_URL"
echo "=========================================================="
echo ""

# Persistir no log
echo "[$(date)] API_NGROK_URL=$API_URL" >> /var/log/linfedemapp/urls.log
echo "[$(date)] API_NGROK_URL=$API_URL" 

# ============================================
# ETAPA 2: Iniciar Expo com tunnel
# ============================================
echo "[$(date)] Iniciando Expo com --tunnel..."
echo ""

(
  RETRIES=0
  EXP_URL=""
  while [ -z "$EXP_URL" ] && [ $RETRIES -lt 60 ]; do
    sleep 3
    HTTPS_URL=$(curl -sf http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1 || true)
    if [ -n "$HTTPS_URL" ]; then
      EXP_URL="exp://${HTTPS_URL#https://}"
      echo ""
      echo "=========================================================="
      echo "  APP TUNNEL URL: $EXP_URL"
      echo "  (também acessível via $HTTPS_URL)"
      echo "=========================================================="
      echo "[$(date)] APP_TUNNEL_URL=$EXP_URL" >> /var/log/linfedemapp/urls.log
      echo "[$(date)] APP_TUNNEL_HTTPS=$HTTPS_URL" >> /var/log/linfedemapp/urls.log
    fi
    RETRIES=$((RETRIES + 1))
  done
) &

npx expo start --tunnel </dev/null 2>&1 | tee -a /var/log/linfedemapp/expo.log
