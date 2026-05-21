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

# Rodar expo e capturar output para extrair URL do tunnel
CI=1 npx expo start --tunnel 2>&1 | while IFS= read -r line; do
  echo "$line"
  echo "[$(date)] $line" >> /var/log/linfedemapp/expo.log
  
  # Capturar URL do tunnel quando aparecer
  if echo "$line" | grep -q "tunnel ready"; then
    TUNNEL_URL=$(echo "$line" | grep -o 'https://[^ ]*')
    if [ -n "$TUNNEL_URL" ]; then
      echo ""
      echo "=========================================================="
      echo "  APP TUNNEL URL:"
      echo "  $TUNNEL_URL"
      echo "=========================================================="
      echo ""
      echo "[$(date)] APP_TUNNEL_URL=$TUNNEL_URL" >> /var/log/linfedemapp/urls.log
    fi
  fi
  
  # Capturar URL exp:// quando aparecer
  if echo "$line" | grep -qE "exp://|https://exp"; then
    echo ""
    echo "=========================================================="
    echo "  EXPO URL DETECTADA:"
    echo "  $line"
    echo "=========================================================="
    echo ""
    echo "[$(date)] EXPO_URL=$line" >> /var/log/linfedemapp/urls.log
  fi
done
