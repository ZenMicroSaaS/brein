#!/usr/bin/env bash
# brein-zoek — eenmalige installatie op Cloudflare.
# Gebruik: ./setup.sh   (in deze map, op je Mac)
set -euo pipefail
cd "$(dirname "$0")"

echo "== 1/7 Afhankelijkheden installeren"
command -v node >/dev/null || { echo "Node.js ontbreekt. Installeer via https://nodejs.org (LTS) en start opnieuw."; exit 1; }
npm install --silent

echo "== 2/7 Inloggen bij Cloudflare (er opent een browservenster)"
npx wrangler whoami >/dev/null 2>&1 || npx wrangler login

echo "== 3/7 Vectorindex aanmaken (bge-m3, 1024 dimensies)"
npx wrangler vectorize create brein-zoek --dimensions=1024 --metric=cosine || echo "   (bestaat al, ga door)"
npx wrangler vectorize create-metadata-index brein-zoek --property-name=map --type=string || echo "   (bestaat al, ga door)"

echo "== 4/7 Database aanmaken"
if grep -q "VUL-IN-NA-AANMAKEN" wrangler.jsonc; then
  OUT=$(npx wrangler d1 create brein-zoek 2>&1 || true)
  ID=$(echo "$OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  if [ -z "$ID" ]; then
    ID=$(npx wrangler d1 info brein-zoek --json 2>/dev/null | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  fi
  [ -n "$ID" ] || { echo "Kon database-id niet vinden. Uitvoer:"; echo "$OUT"; exit 1; }
  sed -i.bak "s/VUL-IN-NA-AANMAKEN/$ID/" wrangler.jsonc && rm -f wrangler.jsonc.bak
  echo "   database-id: $ID"
fi

echo "== 5/7 Tabellen aanmaken"
npx wrangler d1 migrations apply brein-zoek --remote

echo "== 6/7 Geheime sleutel instellen"
if [ ! -f .mcp-secret ]; then
  openssl rand -hex 24 > .mcp-secret
  chmod 600 .mcp-secret
fi
SECRET=$(cat .mcp-secret)
printf "%s" "$SECRET" | npx wrangler secret put MCP_SECRET

echo "== 7/7 Live zetten"
DEPLOY=$(npx wrangler deploy 2>&1 | tee /dev/stderr)
URL=$(echo "$DEPLOY" | grep -oE 'https://[a-z0-9.-]+\.workers\.dev' | head -1)

echo
echo "Klaar."
echo "Voeg in Claude een eigen connector toe (Instellingen → Connectors → Aangepaste connector toevoegen) met deze URL:"
echo
echo "   ${URL}/mcp/${SECRET}"
echo
echo "Bewaar deze URL als een wachtwoord: wie hem heeft, kan in je zoekindex lezen en schrijven."
echo "De sleutel staat ook in het bestand .mcp-secret in deze map."
