#!/usr/bin/env bash
# Guarda contra o modo de falha mais provável do projeto: um arquivo novo
# que o build:copy esqueceu. Local funciona (dev server serve site/),
# produção fica sem — silenciosamente, porque o fallback é a página atual.
set -euo pipefail

# Ao adicionar um arquivo novo servido em producao, acrescente-o aqui E no
# build:copy. Nao liste nada que ainda nao exista: o guarda deve falhar por
# build:copy incompleto, nunca por arquivo que ainda nao foi escrito.
#
# Limite conhecido: isto verifica que o arquivo EXISTE, nao que ele carrega.
# Um JS quebrado passa por aqui. Para prova de funcionamento, carregue a pagina.
REQUIRED=(
  "site/dist/index.html"
  "site/dist/curso.html"
  "site/dist/404.html"
  "site/dist/js/landing.js"
  "site/dist/js/app.js"
  "site/dist/css/landing.css"
  "site/dist/css/styles.css"
  "site/dist/css/variables.css"
  "site/dist/assets/leon-hatori.jpg"
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
