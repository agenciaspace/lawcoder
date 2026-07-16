#!/usr/bin/env bash
# Guarda contra o modo de falha mais provável do projeto: um arquivo novo
# que o build:copy esqueceu. Local funciona (dev server serve site/),
# produção fica sem — silenciosamente, porque o fallback é a página atual.
set -euo pipefail

# Cada task acrescenta os arquivos que ele introduz. Nao liste aqui nada
# que ainda nao existe: o guarda deve falhar por build:copy incompleto,
# nunca por arquivo que ainda nao foi escrito.
REQUIRED=(
  "site/dist/index.html"
  "site/dist/js/landing.js"
  "site/dist/css/landing.css"
  "site/dist/js/vendor/three.module.js"
  "site/dist/js/vendor/SVGLoader.js"
)

fail=0
for f in "${REQUIRED[@]}"; do
  if [ -s "$f" ]; then
    echo "ok    $f"
  else
    echo "FALTA $f"
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "ERRO: arquivo(s) ausente(s) em site/dist/ — build:copy no package.json esta incompleto."
  exit 1
fi
echo ""
echo "dist completo."
