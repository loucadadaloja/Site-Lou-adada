#!/usr/bin/env bash
# Troca o domínio do site inteiro em um comando.
#
# O endereço aparece em canonical, og:url, JSON-LD, sitemap.xml, robots.txt e
# .htaccess. Trocar na mão significa esquecer um. Este script troca em todos.
#
#   ./trocar-dominio.sh loucadada.com
#   ./trocar-dominio.sh www.loucadadapresentes.com.br
#
# Rode ANTES de publicar e antes de pedir indexação no Search Console.
# Depois que o Google indexa, trocar de domínio joga autoridade fora.

set -euo pipefail

ATUAL="loucadada.com"
NOVO="${1:-}"

if [ -z "$NOVO" ]; then
  echo "Falta o domínio novo."
  echo "Uso: ./trocar-dominio.sh meudominio.com.br   (sem https://, sem barra no fim)"
  exit 1
fi

# tira https:// e barra final, se a pessoa colar o endereço inteiro
NOVO="${NOVO#http://}"; NOVO="${NOVO#https://}"; NOVO="${NOVO%/}"

if [ "$NOVO" = "$ATUAL" ]; then
  echo "O domínio já é $ATUAL. Nada a fazer."
  exit 0
fi

cd "$(dirname "$0")"

echo "Trocando  $ATUAL  ->  $NOVO"
echo

ALVOS=$(grep -rl "$ATUAL" \
  --include="*.html" --include="*.xml" --include="*.txt" \
  --include="*.md" --include=".htaccess" . 2>/dev/null || true)

if [ -z "$ALVOS" ]; then
  echo "Nenhum arquivo cita $ATUAL. Talvez a troca já tenha sido feita."
  exit 0
fi

for arq in $ALVOS; do
  n=$(grep -c "$ATUAL" "$arq" || true)
  # o ponto do domínio é literal, por isso o escape
  sed -i.bak "s|${ATUAL//./\\.}|$NOVO|g" "$arq" && rm -f "$arq.bak"
  printf "  %-34s %s ocorrências\n" "$arq" "$n"
done

echo
echo "Feito. Agora, antes de publicar:"
echo "  1. Confira o resultado:  grep -rn '$NOVO' . --include='*.html' | head"
echo "  2. Suba a versão dos assets (?v=) em todas as páginas, se o CSS mudou."
echo "  3. Ajuste este script: troque ATUAL por '$NOVO' na linha 15."
echo "  4. No .htaccess, descomente o bloco de redirecionamento para HTTPS."
