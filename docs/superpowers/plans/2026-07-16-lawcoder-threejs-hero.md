# LawCoder — Hero 3D (manchete extrudada) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `h1` do hero da landing por uma versão 3D extrudada que se monta na entrada, com fallback CSS que é a página atual e upgrade progressivo.

**Architecture:** Three.js vendorizado (sem bundler) carregado via `import()` dinâmico **depois do `load`**, só se o portão de capacidade passar. As letras são SVG paths (gerados offline a partir do Barlow Condensed) extrudados com `ExtrudeGeometry`. A canvas fica sobre um wrapper que contém os dois `h1` gêmeos (PT/EN); o `h1` visível só vai a `opacity: 0` **depois do primeiro frame renderizado**, então toda falha é invisível por construção.

**Tech Stack:** Vanilla JS (script clássico + módulo ES), Three.js vendorizado, `SVGLoader`, `ExtrudeGeometry`, opentype.js (build-time, manual), PostCSS + csso (build existente, intocado).

**Spec:** `docs/superpowers/specs/2026-07-16-lawcoder-threejs-hero-design.md`

## Global Constraints

Todo task herda implicitamente estas regras:

- **Não introduzir bundler.** O build é `postcss` + `csso` + `cp`. O gerador de SVG roda **manualmente**, fora do `npm run build`; seu output é commitado.
- **Paleta exata:** creme `#f2ede4`, preto `#0d0d0d`, vermelho `#e63012`. Nenhuma outra cor.
- **Regras da marca em 3D:** `bevelEnabled: false` (arestas duras), `roughness: 1`, `metalness: 0` (fosco), fundo da canvas transparente (`alpha: true`). Sem shadow map, sem pós-processamento, sem bloom.
- **Cor das faces (corrige a spec):** a manchete real tem `.hero-h1 em { color: var(--red); display: block; }`. Linhas 1–2 são pretas, linha 3 (`em`) é vermelha. Em 3D: **face frontal = a cor que a letra já tem no CSS; laterais = a cor oposta.** Letra preta → lateral vermelha. Letra vermelha → lateral preta.
- **`prefers-reduced-motion: reduce` → o Three.js nunca é baixado.** Não é uma versão degradada; é não carregar.
- **O `h1` nunca sai do DOM** e mantém o texto real (SEO/a11y). A canvas é `aria-hidden="true"`.
- **Bilíngue PT/EN** em tudo que tem texto, seguindo o padrão `data-show="pt"` / `data-show="en"` já existente.
- **Three.js pinado** numa versão exata (definida no Task 1). Nunca `latest`.
- **Todo arquivo novo servido em produção precisa entrar no `build:copy`** do `package.json`. Este é o modo de falha mais provável do projeto inteiro (ver Task 1).

## Contexto que o implementador não tem

- O projeto é um site estático vanilla. **Não é React.**
- `site/js/landing.js` é um **script clássico** (IIFE), não um módulo. `import()` dinâmico funciona dentro dele — não precisa virar `type="module"`.
- O hero tem **dois `h1` gêmeos**, um por idioma, alternados por CSS via `html[data-lang]` + `data-show`. Ambos existem no DOM sempre.
- A manchete tem `<br>` e um `<em>`, resultando em **3 linhas** em ambos os idiomas:
  - PT: `Ferramentas` / `Jurídicas` / `Feitas Por Você` (em, vermelho)
  - EN: `Legal Tools` / `Built` / `By You` (em, vermelho)
  - `text-transform: uppercase` → renderizam em CAIXA ALTA.
- Já existe uma camada de movimento em CSS com `.is-visible` em ancestrais agnósticos de idioma, e `landing.js` aplica parallax via `transform` inline no `.hero-h1`.
- O dev server serve `site/` direto (`npx serve site`), **não** `site/dist/`. Por isso um arquivo esquecido no `build:copy` funciona local e quebra em produção sem erro nenhum.
- **O `--virtual-time-budget` do Chrome headless MATA o `requestAnimationFrame` (confirmado no Task 5, medido: 1 tick onde deveriam ser ~120).** Qualquer captura de coisa animada feita com ele é inútil — e falha do jeito pior, produzindo duas imagens byte-idênticas que parecem "a animação não roda". `setTimeout` e `setInterval` continuam andando sob tempo virtual; só o rAF morre. **Para qualquer verificação que dependa de animação, use o script de captura abaixo** (Playwright do Python, 1.60.0, já instalado na máquina — não é dependência do projeto):

  ```bash
  SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
  cat > $SP/shot.py <<'EOF'
  # uso: python3 shot.py <url> <saida.png> <espera_ms> [largura] [altura] [reduce]
  import sys
  from playwright.sync_api import sync_playwright
  url, out, wait = sys.argv[1], sys.argv[2], int(sys.argv[3])
  w = int(sys.argv[4]) if len(sys.argv) > 4 else 1280
  h = int(sys.argv[5]) if len(sys.argv) > 5 else 860
  reduce = len(sys.argv) > 6 and sys.argv[6] == 'reduce'
  with sync_playwright() as p:
      b = p.chromium.launch()
      ctx = b.new_context(viewport={'width': w, 'height': h},
                          reduced_motion='reduce' if reduce else 'no-preference')
      pg = ctx.new_page()
      logs = []
      pg.on('console', lambda m: logs.append(m.text))
      pg.goto(url, wait_until='load')
      pg.wait_for_timeout(wait)
      pg.screenshot(path=out, full_page=(h > 2000))
      b.close()
  for l in logs:
      print('CONSOLE:', l)
  EOF
  ```
  Testado: `python3 $SP/shot.py <url> <png> 2000` devolve 120 ticks de rAF onde o `--virtual-time-budget` devolve 1. Ele também captura o console (prefixo `CONSOLE:`) e aceita `reduce` como último argumento no lugar do `--force-prefers-reduced-motion`.
- **`tools/assert-dist.sh` só verifica que o arquivo EXISTE, não que ele carrega.** Foi assim que a falta do `three.core.js` atravessou o review do Task 1 inteiro: o `three.module.js` importa `./three.core.js` na linha 7, o arquivo não estava lá, o guarda deu `ok`, e nada quebrou até o Task 4 realmente importar o módulo. **Um `build:assert` verde não é evidência de que o JS funciona** — só de que o `cp` aconteceu. Quem prova é carregar a cena.
- **Armadilha de verificação (confirmada no Task 4b):** importar módulo ES entre portas diferentes no headless **falha por CORS**. Se a página de teste está numa porta e o `site/` noutra, o servidor do `site/` precisa mandar `Access-Control-Allow-Origin: *`. É artefato do teste, não do produto — em produção é mesma origem. `python3 -m http.server` puro não manda o header.
- **Armadilha de verificação (confirmada no Task 3):** este Chrome headless resolve `navigator.language` como `en-US` mesmo com `--lang=pt-BR`. Toda captura da landing sem forçar idioma mostra o hero em **inglês**, não em português. É pré-existente, não um bug do 3D. Ao verificar qualquer coisa dependente de idioma, force o estado com `localStorage.setItem('lawcoder-lang', 'pt')` e recarregue — nunca confie no default. Um teste que assume PT e recebe EN pode "passar" mostrando a coisa errada.

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `tools/gen-headline-svg.mjs` | **novo.** Gerador offline: TTF → SVG com um `<path>` por letra. Rodado à mão. |
| `tools/BarlowCondensed-Black.ttf` | **novo.** Fonte vendorizada (OFL). Só para o gerador. |
| `site/assets/headline-pt.svg` | **novo.** Output do gerador. Commitado. |
| `site/assets/headline-en.svg` | **novo.** Output do gerador. Commitado. |
| `site/js/vendor/three.module.js` | **novo.** Three.js pinado. |
| `site/js/vendor/SVGLoader.js` | **novo.** Addon. |
| `site/js/hero3d.js` | **novo.** A cena. Não conhece a landing. Só `initHero3d(mount, {lang})`. |
| `site/js/landing.js` | Portão de capacidade, `import()`, hook no `setLang`. |
| `site/css/landing.css` | `.hero-h1-stage`, `.hero-canvas`, `.hero-proof`, regra do `hero--3d`. |
| `site/index.html` | Wrapper dos `h1` + legenda bilíngue. |
| `package.json` | `build:copy` copia vendor, `hero3d.js` e assets. |

---

### Task 1: Vendorizar Three.js e blindar o `build:copy`

Este task vem primeiro porque é o **maior risco real do projeto**: `build:copy` é uma lista literal de `cp`. Um arquivo esquecido nela funciona local e some em produção — silenciosamente, porque o fallback é a página funcionando. O teste aqui é o guarda que impede isso.

**Files:**
- Create: `site/js/vendor/three.module.js`, `site/js/vendor/SVGLoader.js`
- Create: `tools/assert-dist.sh`
- Modify: `package.json`

**Interfaces:**
- Consumes: nada.
- Produces: `site/js/vendor/three.module.js` (export nomeado `* as THREE`), `site/js/vendor/SVGLoader.js` (export nomeado `SVGLoader`). `npm run build:assert` roda o build e falha se algum arquivo faltar em `site/dist/`.

- [ ] **Step 1: Descobrir e fixar a versão do Three.js**

Não chute a versão. Rode e anote:

```bash
cd ~/agenciaspace/lawcoder
npm view three version
```

Anote o valor exato (ex.: `0.181.0`). Use-o em todos os passos abaixo como `<VERSAO>`. **Registre a versão escolhida num comentário no topo de `site/js/vendor/three.module.js`.**

- [ ] **Step 2: Baixar Three.js e o SVGLoader na versão fixada**

```bash
cd ~/agenciaspace/lawcoder
mkdir -p site/js/vendor
VER=$(npm view three version)
echo "pinando three@$VER"
curl -sfL "https://unpkg.com/three@$VER/build/three.module.js" -o site/js/vendor/three.module.js
curl -sfL "https://unpkg.com/three@$VER/examples/jsm/loaders/SVGLoader.js" -o site/js/vendor/SVGLoader.js
printf '/* three@%s — vendorizado, nao editar */\n' "$VER" | cat - site/js/vendor/three.module.js > /tmp/t && mv /tmp/t site/js/vendor/three.module.js
ls -la site/js/vendor/
```

Esperado: dois arquivos, `three.module.js` na casa de centenas de KB, `SVGLoader.js` na casa de dezenas de KB.

- [ ] **Step 3: Corrigir o import do SVGLoader**

O `SVGLoader.js` do unpkg importa de `'three'` (bare specifier), que **não resolve sem bundler nem import map**. Aponte para o arquivo vizinho:

```bash
cd ~/agenciaspace/lawcoder
sed -i "s|from 'three'|from './three.module.js'|g" site/js/vendor/SVGLoader.js
grep -n "^import" site/js/vendor/SVGLoader.js
```

Esperado: a linha de import agora referencia `'./three.module.js'`. **Se aparecer qualquer outro bare specifier, corrija do mesmo jeito.**

- [ ] **Step 4: Escrever o teste — o assert de dist**

Crie `tools/assert-dist.sh`:

```bash
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
```

```bash
chmod +x tools/assert-dist.sh
```

- [ ] **Step 5: Rodar o teste e ver ele falhar**

```bash
cd ~/agenciaspace/lawcoder && npm run build >/dev/null 2>&1; ./tools/assert-dist.sh
```

Esperado: **FALHA**, com `FALTA site/dist/js/vendor/three.module.js` e `FALTA site/dist/js/vendor/SVGLoader.js`, e exit code 1. Os arquivos existem em `site/js/vendor/` mas o `build:copy` ainda não os copia — que é exatamente a classe de bug que este guarda existe pra pegar.

- [ ] **Step 6: Atualizar o `build:copy` e adicionar `build:assert`**

Em `package.json`, substitua o script `build:copy` e adicione `build:assert`. O `build:copy` passa a criar `site/dist/js/vendor` e copiar o vendor:

```json
"build:copy": "mkdir -p site/dist/css site/dist/js/vendor && cp site/index.html site/dist/index.html && cp site/curso.html site/dist/curso.html && cp site/404.html site/dist/404.html && cp site/js/landing.js site/dist/js/landing.js && cp site/js/app.js site/dist/js/app.js && cp site/js/vendor/three.module.js site/dist/js/vendor/three.module.js && cp site/js/vendor/SVGLoader.js site/dist/js/vendor/SVGLoader.js && cp site/css/variables.css site/dist/css/variables.css",
"build:assert": "npm run build && ./tools/assert-dist.sh",
```

**Não** adicione `hero3d.js` nem os SVGs aqui — eles não existem ainda. Os Tasks 2 e 4 acrescentam cada um os seus, junto com a linha correspondente no `assert-dist.sh`.

- [ ] **Step 7: Rodar o teste e ver ele passar**

```bash
cd ~/agenciaspace/lawcoder && npm run build:assert
```

Esperado: **PASSA** — todas as linhas `ok`, terminando em `dist completo.` e exit 0.

- [ ] **Step 8: Confirmar que o `.gitignore` não engole o vendor**

O `.gitignore` tem `dist/`. Confirme que os arquivos novos **serão** versionados:

```bash
cd ~/agenciaspace/lawcoder
git check-ignore -v site/js/vendor/three.module.js tools/assert-dist.sh || echo "nenhum ignorado — ok"
```

Esperado: `nenhum ignorado — ok`. Se algum aparecer como ignorado, ajuste o `.gitignore` com uma exceção (`!site/js/vendor/`).

- [ ] **Step 9: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add site/js/vendor/ tools/assert-dist.sh package.json
git commit -m "chore: vendoriza three.js pinado + guarda de build:copy

O build:copy e uma lista literal de cp: arquivo esquecido nela funciona
local (dev server serve site/) e some em producao sem erro. assert-dist.sh
falha o build nesse caso.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Gerador offline dos SVGs da manchete

**Files:**
- Create: `tools/gen-headline-svg.mjs`, `tools/BarlowCondensed-Black.ttf`
- Create: `site/assets/headline-pt.svg`, `site/assets/headline-en.svg`
- Modify: `package.json` (devDependency `opentype.js`, script `gen:headline`, `build:copy`), `tools/assert-dist.sh`

**Interfaces:**
- Consumes: nada.
- Produces: dois SVGs com **um `<path>` por letra**, cada um com `fill="#0d0d0d"` (linhas 1–2) ou `fill="#e63012"` (linha 3, o `em`). O `hero3d.js` (Task 4) lê **esse fill** para decidir a cor da face frontal — a cor mora no SVG, não hardcoded no JS. Espaços não geram path. Ordem dos paths = ordem de leitura (usada para o stagger determinístico da montagem).

- [ ] **Step 1: Instalar o opentype.js como devDependency**

É build-time e roda à mão. **Não entra no `npm run build`** — o output é commitado, então o build de produção segue intocado.

```bash
cd ~/agenciaspace/lawcoder && npm install --save-dev opentype.js
```

- [ ] **Step 2: Baixar o Barlow Condensed Black (peso 900)**

O site carrega as fontes do Google Fonts, não há TTF local. Barlow Condensed é OFL — vendorizar é permitido.

```bash
cd ~/agenciaspace/lawcoder && mkdir -p tools
curl -sfL "https://github.com/google/fonts/raw/main/ofl/barlowcondensed/BarlowCondensed-Black.ttf" -o tools/BarlowCondensed-Black.ttf
ls -la tools/BarlowCondensed-Black.ttf
```

Esperado: arquivo de ~100KB+. Se der 404, procure o caminho correto em https://github.com/google/fonts/tree/main/ofl/barlowcondensed e ajuste.

- [ ] **Step 3: Escrever o gerador**

Crie `tools/gen-headline-svg.mjs`. Os valores tipográficos são copiados do CSS real (`site/css/landing.css:103-117`): `font-size` máximo do `clamp` = 96px, `letter-spacing: -2px`, `line-height: .86`, `text-transform: uppercase`.

```js
// Gera site/assets/headline-{pt,en}.svg — um <path> por letra.
// Rodar a mao: npm run gen:headline   (o output e commitado)
// NAO faz parte do npm run build.
import opentype from 'opentype.js';
import { writeFileSync } from 'node:fs';

const FONT = 'tools/BarlowCondensed-Black.ttf';
const SIZE = 96;          // clamp(52px, 7vw, 96px) -> maximo
const TRACK = -2;         // letter-spacing: -2px
const LINE = SIZE * 0.86; // line-height: .86
const BLACK = '#0d0d0d';
const RED = '#e63012';

// text-transform: uppercase. Linha 3 e o <em> (vermelho, display:block).
const HEADLINES = {
  pt: [
    { text: 'FERRAMENTAS', fill: BLACK },
    { text: 'JURÍDICAS', fill: BLACK },
    { text: 'FEITAS POR VOCÊ', fill: RED },
  ],
  en: [
    { text: 'LEGAL TOOLS', fill: BLACK },
    { text: 'BUILT', fill: BLACK },
    { text: 'BY YOU', fill: RED },
  ],
};

const font = opentype.loadSync(FONT);

function buildSvg(lines) {
  const paths = [];
  let maxX = 0;

  lines.forEach((line, li) => {
    let x = 0;
    const y = SIZE + li * LINE; // baseline aproximada por linha
    for (const ch of line.text) {
      const adv = font.getAdvanceWidth(ch, SIZE) + TRACK;
      if (ch !== ' ') {
        const d = font.getPath(ch, x, y, SIZE).toPathData(2);
        if (d && d !== 'Z' && d.length > 2) {
          paths.push(`  <path fill="${line.fill}" d="${d}"/>`);
        }
      }
      x += adv;
    }
    maxX = Math.max(maxX, x);
  });

  const w = Math.ceil(maxX);
  const h = Math.ceil(SIZE + (lines.length - 1) * LINE + SIZE * 0.28);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${paths.join('\n')}\n</svg>\n`;
}

for (const [lang, lines] of Object.entries(HEADLINES)) {
  const svg = buildSvg(lines);
  const out = `site/assets/headline-${lang}.svg`;
  writeFileSync(out, svg);
  const n = (svg.match(/<path/g) || []).length;
  console.log(`${out}: ${n} paths, ${svg.length} bytes`);
}
```

- [ ] **Step 4: Adicionar o script ao package.json**

Em `package.json`, dentro de `scripts`:

```json
"gen:headline": "node tools/gen-headline-svg.mjs",
```

- [ ] **Step 5: Rodar o gerador**

```bash
cd ~/agenciaspace/lawcoder && npm run gen:headline
```

Esperado (contagem de letras sem espaços):
- `site/assets/headline-pt.svg: 31 paths, ...` — FERRAMENTAS(11) + JURÍDICAS(9) + FEITASPORVOCÊ(13) = 33. **Se o número vier diferente de 33, algum glifo acentuado (Í, Ê) falhou** — investigue antes de seguir.
- `site/assets/headline-en.svg: 19 paths, ...` — LEGALTOOLS(10) + BUILT(5) + BYYOU(5) = 20.

- [ ] **Step 6: Verificar que os acentos existem**

Este é o ponto de falha real: `JURÍDICAS` e `VOCÊ` dependem de `Í` e `Ê`. Se a fonte não tiver o glifo, o opentype devolve `.notdef` silenciosamente e a manchete sai errada em produção.

```bash
cd ~/agenciaspace/lawcoder
node -e "
import('opentype.js').then(async (m) => {
  const font = await m.default.load('tools/BarlowCondensed-Black.ttf');
  for (const ch of ['Í','Ê','A','Ç']) {
    const g = font.charToGlyph(ch);
    console.log(ch, '->', g.name || '(sem nome)', 'unicode:', g.unicode);
  }
});
"
```

Esperado: `Í -> Iacute`, `Ê -> Ecircumflex`, `A -> A`. **Se algum vier `.notdef` ou `unicode: undefined`**, a fonte não cobre o glifo — pare e reporte; a solução seria outro arquivo de fonte, não seguir.

- [ ] **Step 7: Inspecionar o SVG visualmente**

```bash
cd ~/agenciaspace/lawcoder && head -c 400 site/assets/headline-pt.svg && echo && \
google-chrome --headless=new --hide-scrollbars --window-size=1200,500 \
  --screenshot=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad/headline-pt.png \
  "file://$PWD/site/assets/headline-pt.svg" 2>/dev/null && echo "captura ok"
```

Leia `/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad/headline-pt.png` com a ferramenta Read. Esperado: três linhas, "FERRAMENTAS" e "JURÍDICAS" pretas, "FEITAS POR VOCÊ" vermelha, sem letra faltando e sem sobreposição.

- [ ] **Step 8: Registrar os SVGs no `build:copy` e no guarda**

Os SVGs são novos: sem isto eles funcionam local e somem em produção. Em `package.json`, no `build:copy`, acrescente `site/dist/assets` ao `mkdir -p` e as duas cópias:

```json
"build:copy": "mkdir -p site/dist/css site/dist/js/vendor site/dist/assets && cp site/index.html site/dist/index.html && cp site/curso.html site/dist/curso.html && cp site/404.html site/dist/404.html && cp site/js/landing.js site/dist/js/landing.js && cp site/js/app.js site/dist/js/app.js && cp site/js/vendor/three.module.js site/dist/js/vendor/three.module.js && cp site/js/vendor/SVGLoader.js site/dist/js/vendor/SVGLoader.js && cp site/assets/headline-pt.svg site/dist/assets/headline-pt.svg && cp site/assets/headline-en.svg site/dist/assets/headline-en.svg && cp site/css/variables.css site/dist/css/variables.css",
```

E em `tools/assert-dist.sh`, acrescente ao array `REQUIRED`:

```bash
  "site/dist/assets/headline-pt.svg"
  "site/dist/assets/headline-en.svg"
```

- [ ] **Step 9: Rodar o assert de build**

```bash
cd ~/agenciaspace/lawcoder && npm run build:assert
```

Esperado: PASSA, com as duas linhas novas `ok site/dist/assets/headline-*.svg`.

- [ ] **Step 10: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add tools/gen-headline-svg.mjs tools/BarlowCondensed-Black.ttf site/assets/ tools/assert-dist.sh package.json package-lock.json
git commit -m "feat: gerador offline dos SVGs da manchete do hero

Um <path> por letra, fill vermelho na linha do <em> (espelha o CSS).
Roda a mao (npm run gen:headline); output commitado, build intocado.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Mount point, legenda e o fallback intacto

Nenhum 3D ainda. Ao fim deste task a página está **idêntica ao que é hoje**, mais a legenda — e com a estrutura pronta para receber a canvas.

**Files:**
- Modify: `site/index.html:42-43` (envolver os `h1`), `site/css/landing.css`

**Interfaces:**
- Consumes: nada.
- Produces: `.hero-h1-stage` (elemento `position: relative` contendo os dois `h1` gêmeos) — é o **mount point** que o Task 6 passa para `initHero3d`. A classe `hero--3d` em `.hero`, quando presente, esconde os `h1` visualmente mantendo-os no layout e no DOM.

- [ ] **Step 1: Envolver os `h1` no stage**

Em `site/index.html`, substitua as linhas 42-43:

```html
        <h1 class="hero-h1" data-show="pt">Ferramentas<br>Jurídicas<em>Feitas Por Você</em></h1>
        <h1 class="hero-h1" data-show="en">Legal Tools<br>Built<em>By You</em></h1>
```

por:

```html
        <div class="hero-h1-stage" id="heroH1Stage">
            <h1 class="hero-h1" data-show="pt">Ferramentas<br>Jurídicas<em>Feitas Por Você</em></h1>
            <h1 class="hero-h1" data-show="en">Legal Tools<br>Built<em>By You</em></h1>
        </div>
        <p class="hero-proof" data-show="pt">// não sei escrever 3D. pedi. — módulo 09</p>
        <p class="hero-proof" data-show="en">// i don't know 3D. i asked. — module 09</p>
```

A legenda fica **fora** do stage de propósito: ela aparece com ou sem 3D. O argumento não pode depender do WebGL ter carregado.

- [ ] **Step 2: Adicionar o CSS do stage, da canvas e da legenda**

Adicione ao final de `site/css/landing.css`:

```css
/* ═══════════ HERO 3D ═══════════ */
.hero-h1-stage { position: relative; }

/* A canvas ocupa exatamente a caixa do stage — sem layout shift. */
.hero-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    opacity: 0;
    transition: opacity .35s ease;
}
.hero-canvas.is-live { opacity: 1; }

/* Os h1 saem de vista SO depois do primeiro frame (JS poe .hero--3d).
   opacity, nao display: o texto continua no DOM, no layout, e legivel
   por leitor de tela e crawler. !important porque a camada de movimento
   ja define opacity:1 em .hero.is-visible .hero-h1. */
.hero--3d .hero-h1 { opacity: 0 !important; }

.hero-proof {
    font-family: var(--f-mono);
    font-size: 12px;
    color: var(--text-subtle);
    margin: -14px 0 24px;
    letter-spacing: .02em;
}
```

- [ ] **Step 3: Verificar que a legenda respeita o toggle PT/EN**

A regra `data-show` já existe e é genérica. Confirme que ela cobre `<p>`:

```bash
cd ~/agenciaspace/lawcoder && grep -n 'data-show' site/css/landing.css | head -6
```

Esperado: seletores de atributo (ex.: `html[data-lang="pt"] [data-show="en"] { display: none !important; }`) que **não** são presos a uma tag específica. Se forem presos a tags (`h1[data-show]`), adicione `.hero-proof` à lista.

- [ ] **Step 4: Verificar que nada quebrou visualmente**

```bash
cd ~/agenciaspace/lawcoder
(python3 -m http.server 4321 --directory site >/dev/null 2>&1 &) ; sleep 1
google-chrome --headless=new --force-prefers-reduced-motion --hide-scrollbars \
  --window-size=1280,860 --virtual-time-budget=3000 \
  --screenshot=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad/hero-t3.png \
  "http://localhost:4321/index.html" 2>/dev/null && echo "captura ok"
```

Leia o PNG. Esperado: o hero de sempre — "FERRAMENTAS / JURÍDICAS" preto, "FEITAS POR VOCÊ" vermelho — **sem deslocamento de layout**, com a legenda em mono cinza logo abaixo da manchete.

- [ ] **Step 5: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add site/index.html site/css/landing.css
git commit -m "feat: stage do hero 3D + legenda da prova

Stage envolve os h1 gemeos e sera o mount point da canvas. A legenda
fica fora do stage: aparece com ou sem 3D, porque o argumento nao pode
depender do WebGL ter carregado.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: `hero3d.js` — cena estática correta

Ao fim deste task a cena renderiza a manchete parada, nas cores certas, encaixada na caixa. Sem montagem, sem mouse, sem portão — ainda não está ligada na página (o Task 6 liga).

**Files:**
- Create: `site/js/hero3d.js`
- Modify: `package.json` (`build:copy`), `tools/assert-dist.sh`

**Interfaces:**
- Consumes: `site/js/vendor/three.module.js`, `site/js/vendor/SVGLoader.js`, `site/assets/headline-{pt,en}.svg`.
- Produces: `export async function initHero3d(mount, { lang })` → `Promise<{ setLang(lang), destroy(), _debug }>`. Resolve **somente depois do primeiro frame ter renderizado** — é isso que garante que o `h1` nunca some antes de existir pixel. Rejeita em qualquer erro (o chamador fica no fallback). `_debug` expõe `{ renderer, group }` para o teste de vazamento do Task 7.

- [ ] **Step 1: Escrever a cena**

Crie `site/js/hero3d.js`:

```js
/* Hero 3D — a manchete do hero como geometria extrudada.
   Regras da marca em 3D: bevelEnabled:false (sem radius), fosco (sem brilho),
   fundo transparente (o creme da pagina atravessa).
   A cor da face frontal vem do fill do SVG; a lateral e a cor oposta. */
import * as THREE from './vendor/three.module.js';
import { SVGLoader } from './vendor/SVGLoader.js';

const BLACK = 0x0d0d0d;
const RED = 0xe63012;
const DEPTH = 14;   // profundidade da extrusao, em unidades do SVG
const FOV = 35;     // baixo: achata a perspectiva, mantem leitura grafica

const svgCache = new Map();

async function loadSvg(lang) {
    if (svgCache.has(lang)) return svgCache.get(lang);
    const loader = new SVGLoader();
    const url = new URL(`../assets/headline-${lang}.svg`, import.meta.url).href;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`headline svg ${lang}: HTTP ${res.status}`);
    const data = loader.parse(await res.text());
    svgCache.set(lang, data);
    return data;
}

export async function initHero3d(mount, { lang }) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 4000);

    // Luz direcional dura da esquerda-alta + ambiente baixa. Sem shadow map.
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-1, 1.4, 1.6);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    let group = null;
    let raf = 0;
    let destroyed = false;

    function disposeGroup() {
        if (!group) return;
        group.traverse((o) => {
            if (!o.isMesh) return;
            o.geometry.dispose();
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        });
        scene.remove(group);
        group = null;
    }

    async function build(l) {
        disposeGroup();
        const data = await loadSvg(l);
        const g = new THREE.Group();

        data.paths.forEach((path, i) => {
            const hex = path.color.getHexString();
            const isRed = hex === 'e63012';
            // Face = a cor que a letra ja tem no CSS. Lateral = a oposta.
            const front = new THREE.MeshStandardMaterial({
                color: isRed ? RED : BLACK, roughness: 1, metalness: 0,
            });
            const side = new THREE.MeshStandardMaterial({
                color: isRed ? BLACK : RED, roughness: 1, metalness: 0,
            });
            const shapes = SVGLoader.createShapes(path);
            const geo = new THREE.ExtrudeGeometry(shapes, {
                depth: DEPTH, bevelEnabled: false, curveSegments: 6,
            });
            const mesh = new THREE.Mesh(geo, [front, side]);
            mesh.userData.i = i;
            g.add(mesh);
        });

        // Centraliza ANTES de inverter o Y. A ordem importa: com scale.y=-1
        // aplicado, getCenter() devolve o centro em espaco de MUNDO (y ja
        // negado), e subtrair isso de m.position — que e LOCAL — deslocaria
        // a manchete para longe do centro em vez de para ele. Sem scale, os
        // dois espacos coincidem e a subtracao e correta.
        const box = new THREE.Box3().setFromObject(g);
        const center = box.getCenter(new THREE.Vector3());
        g.children.forEach((m) => m.position.sub(center));
        g.userData.size = box.getSize(new THREE.Vector3());

        // Agora sim: SVG tem Y para baixo, three tem Y para cima.
        // Inverter um grupo ja centrado na origem mantem ele centrado.
        g.scale.y = -1;

        scene.add(g);
        group = g;
        fit();
    }

    // Encaixa a manchete na largura da caixa do h1 visivel.
    function fit() {
        const r = mount.getBoundingClientRect();
        const w = Math.max(1, r.width);
        const h = Math.max(1, r.height);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,
            window.innerWidth < 768 ? 1.5 : 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;

        if (group) {
            const size = group.userData.size;
            // Distancia tal que a largura do grupo caiba na largura visivel.
            const vFov = (FOV * Math.PI) / 180;
            const distH = (size.y / 2) / Math.tan(vFov / 2);
            const distW = (size.x / 2) / (Math.tan(vFov / 2) * camera.aspect);
            camera.position.z = Math.max(distH, distW) * 1.06 + DEPTH;
        }
        camera.updateProjectionMatrix();
    }

    function render() { renderer.render(scene, camera); }

    await build(lang);
    mount.appendChild(canvas);

    // Primeiro frame ANTES de resolver: o chamador so esconde o h1 depois
    // que existe pixel na tela.
    render();
    await new Promise((r) => requestAnimationFrame(() => r()));

    return {
        async setLang(l) { if (!destroyed) { await build(l); render(); } },
        destroy() {
            destroyed = true;
            cancelAnimationFrame(raf);
            disposeGroup();
            renderer.dispose();
            canvas.remove();
        },
        _debug: { renderer, get group() { return group; }, fit, render },
    };
}
```

- [ ] **Step 2: Verificar a sintaxe**

`node --check` não entende `import.meta` em `.js` clássico. Use o parser de módulo:

```bash
cd ~/agenciaspace/lawcoder && node --input-type=module --check < site/js/hero3d.js && echo "sintaxe ok"
```

Esperado: `sintaxe ok`.

- [ ] **Step 3: Escrever uma página de teste isolada**

Crie `/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad/t4.html` — testa a cena sozinha, fora da landing:

```html
<style>
  body { background:#f2ede4; margin:0; }
  #stage { position:relative; width:900px; height:300px; margin:40px; }
</style>
<div id="stage"></div>
<script type="module">
  import { initHero3d } from 'http://localhost:4321/js/hero3d.js';
  const api = await initHero3d(document.getElementById('stage'), { lang: 'pt' });
  document.querySelector('canvas').classList.add('is-live');
  document.querySelector('canvas').style.opacity = 1;
  window.__api = api;
  console.log('MESHES:', api._debug.group.children.length);
</script>
```

- [ ] **Step 4: Rodar e ver a cena**

```bash
cd ~/agenciaspace/lawcoder
(python3 -m http.server 4321 --directory site >/dev/null 2>&1 &) ; sleep 1
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
(python3 -m http.server 4322 --directory $SP >/dev/null 2>&1 &) ; sleep 1
google-chrome --headless=new --hide-scrollbars --window-size=1000,400 \
  --virtual-time-budget=6000 --screenshot=$SP/t4.png \
  "http://localhost:4322/t4.html" 2>/dev/null && echo "captura ok"
```

Leia `$SP/t4.png`. Esperado: a manchete em 3D sobre fundo creme — "FERRAMENTAS / JURÍDICAS" com faces pretas, "FEITAS POR VOCÊ" com faces vermelhas, arestas duras, sem brilho, encaixada na caixa. **Se vier preta inteira, o fill do SVG não está chegando** (`path.color`) — verifique o Step 6 abaixo antes de seguir.

- [ ] **Step 5: Confirmar a contagem de meshes**

Uma mesh por letra é o que o stagger do Task 5 depende.

```bash
cd ~/agenciaspace/lawcoder
google-chrome --headless=new --virtual-time-budget=6000 --enable-logging=stderr --v=0 \
  --dump-dom "http://localhost:4322/t4.html" 2>&1 | grep -o 'MESHES: [0-9]*' | head -1
```

Esperado: `MESHES: 33` (PT). Se vier `0`, o SVG não carregou; se vier `1`, os paths foram fundidos e o stagger não vai funcionar.

- [ ] **Step 6: Registrar o `hero3d.js` no `build:copy` e no guarda**

Em `package.json`, no `build:copy`, acrescente a cópia logo após a do `app.js`:

```
&& cp site/js/hero3d.js site/dist/js/hero3d.js
```

E em `tools/assert-dist.sh`, acrescente ao array `REQUIRED`:

```bash
  "site/dist/js/hero3d.js"
```

Rode o guarda:

```bash
cd ~/agenciaspace/lawcoder && npm run build:assert
```

Esperado: PASSA, com a linha nova `ok site/dist/js/hero3d.js`.

- [ ] **Step 7: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add site/js/hero3d.js tools/assert-dist.sh package.json
git commit -m "feat: cena 3D da manchete do hero (estatica)

Faces herdam a cor do fill do SVG; laterais recebem a cor oposta —
letra preta sangra vermelho, letra vermelha sangra preto. Arestas duras
(bevelEnabled:false), material fosco, fundo transparente.

initHero3d so resolve apos o primeiro frame renderizado.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Montagem na entrada e repouso

**Files:**
- Modify: `site/js/hero3d.js`

**Interfaces:**
- Consumes: `initHero3d` do Task 4.
- Produces: mesma assinatura. A montagem roda automaticamente no primeiro `build()`. Adiciona `pause()` / `resume()` ao objeto retornado (o Task 8 usa).

- [ ] **Step 1: Adicionar a montagem determinística e o loop**

Em `site/js/hero3d.js`, adicione as constantes abaixo de `const FOV = 35;`:

```js
const ASSEMBLE_MS = 1200;   // duracao total da montagem
const STAGGER_MS = 26;      // cascata por letra
const TILT_MAX = 0.14;      // ~8 graus de resposta ao mouse
```

E as funções auxiliares antes de `export async function initHero3d`:

```js
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* Offsets derivados do indice, nao aleatorios: brutalismo e ordem, nao caos.
   Le como algo sendo colocado, nao como poeira se juntando. */
function seedOffset(i) {
    return {
        z: -180 - (i % 5) * 45,
        ry: (((i % 3) - 1) * 0.42),
        rx: (((i % 4) - 1.5) * 0.2),
    };
}
```

- [ ] **Step 2: Guardar o alvo de cada letra no `build()`**

Dentro de `build(l)`, logo após `g.children.forEach((m) => m.position.sub(center));`, adicione:

```js
        // Alvo final de cada letra + estado inicial da montagem.
        g.children.forEach((m, i) => {
            m.userData.home = m.position.clone();
            const o = seedOffset(i);
            m.userData.seed = o;
            m.position.z = m.userData.home.z + o.z;
            m.rotation.y = o.ry;
            m.rotation.x = o.rx;
        });
```

- [ ] **Step 3: Adicionar o loop de animação**

Substitua a linha `function render() { renderer.render(scene, camera); }` por:

```js
    let t0 = 0;
    let assembling = true;
    let paused = false;
    const pointer = { x: 0, y: 0 };   // alvo, -1..1
    const tilt = { x: 0, y: 0 };      // atual (lerp)

    function render() { renderer.render(scene, camera); }

    function frame(now) {
        if (destroyed) return;
        raf = requestAnimationFrame(frame);
        if (!t0) t0 = now;

        if (group) {
            if (assembling) {
                const el = now - t0;
                let done = true;
                group.children.forEach((m, i) => {
                    const p = Math.min(Math.max((el - i * STAGGER_MS) / ASSEMBLE_MS, 0), 1);
                    if (p < 1) done = false;
                    const e = easeOutCubic(p);
                    const o = m.userData.seed;
                    m.position.z = m.userData.home.z + o.z * (1 - e);
                    m.rotation.y = o.ry * (1 - e);
                    m.rotation.x = o.rx * (1 - e);
                });
                if (done) assembling = false;
            }

            // Repouso: acompanha o mouse com lerp, limitado.
            tilt.x += (pointer.y * TILT_MAX - tilt.x) * 0.06;
            tilt.y += (pointer.x * TILT_MAX - tilt.y) * 0.06;
            group.rotation.x = tilt.x;
            group.rotation.y = tilt.y;
        }
        render();
    }

    function onPointer(e) {
        const r = mount.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    }
    window.addEventListener('pointermove', onPointer, { passive: true });
```

- [ ] **Step 4: Adicionar o parallax de scroll da canvas**

O `landing.js` aplica parallax via `transform` inline no `.hero-h1`. Quando o 3D liga, o `h1` vai a `opacity: 0` — **e o parallax dele vira invisível junto**. Sem este passo, ligar o 3D deixaria o hero *menos* vivo no scroll do que é hoje. A canvas precisa do seu próprio.

Em `site/js/hero3d.js`, adicione logo após o bloco do `onPointer` (Step 3):

```js
    let scrollY = 0;
    function onScroll() {
        // Espelha o fator do parallax do .hero-h1 em landing.js (-y * 0.12),
        // convertido para unidades da cena via a altura da caixa do mount.
        const y = Math.min(window.scrollY, window.innerHeight);
        const r = mount.getBoundingClientRect();
        const unitsPerPx = group ? group.userData.size.y / Math.max(1, r.height) : 0;
        scrollY = y * 0.12 * unitsPerPx;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
```

E dentro de `frame()`, logo antes de `render();` no fim do bloco `if (group) {...}`, adicione:

```js
            group.position.y = scrollY;   // sobe de leve conforme rola
```

Em `destroy()`, junto da remoção do `pointermove`:

```js
            window.removeEventListener('scroll', onScroll);
```

- [ ] **Step 5: Ligar o loop e expor pause/resume**

Substitua o bloco final (de `render();` até o `return {...}`) por:

```js
    render();
    await new Promise((r) => requestAnimationFrame(() => r()));
    raf = requestAnimationFrame(frame);

    return {
        async setLang(l) {
            if (destroyed) return;
            await build(l);
            t0 = 0;
            assembling = true;   // remonta no novo idioma
        },
        pause() {
            if (paused || destroyed) return;
            paused = true;
            cancelAnimationFrame(raf);
        },
        resume() {
            if (!paused || destroyed) return;
            paused = false;
            raf = requestAnimationFrame(frame);
        },
        destroy() {
            destroyed = true;
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onPointer);
            disposeGroup();
            renderer.dispose();
            canvas.remove();
        },
        _debug: { renderer, get group() { return group; }, fit, render },
    };
```

- [ ] **Step 6: Verificar a sintaxe**

```bash
cd ~/agenciaspace/lawcoder && node --input-type=module --check < site/js/hero3d.js && echo "sintaxe ok"
```

Esperado: `sintaxe ok`.

- [ ] **Step 7: Capturar a montagem em dois tempos**

O ponto é **provar que a montagem existe** — uma captura só não distingue animado de estático.

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
for T in 300 2500; do
  google-chrome --headless=new --hide-scrollbars --window-size=1000,400 \
    --virtual-time-budget=$T --screenshot=$SP/t5-$T.png \
    "http://localhost:4322/t4.html" 2>/dev/null
done
ls -la $SP/t5-*.png
```

Leia os dois PNGs. Esperado: em `t5-300.png` as letras estão **espalhadas na profundidade e giradas** (montagem em curso); em `t5-2500.png` a manchete está **montada e legível**. Se os dois forem idênticos, o loop não está rodando.

- [ ] **Step 8: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add site/js/hero3d.js
git commit -m "feat: montagem deterministica da manchete + repouso e parallax

Offsets derivados do indice, nao aleatorios: le como algo sendo colocado.
Cascata de 26ms/letra, easeOutCubic, 1.2s. Repouso com lerp limitado a ~8deg.
A canvas tem parallax proprio: o do .hero-h1 fica invisivel com opacity:0.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Portão de capacidade e integração na landing

Aqui o 3D finalmente aparece na página real.

**Files:**
- Modify: `site/js/landing.js`

**Interfaces:**
- Consumes: `initHero3d(mount, {lang})` do Task 5, `#heroH1Stage` e `.hero--3d` do Task 3.
- Produces: `hero3d` (a instância ou `null`) no escopo do IIFE, consumido pelo `setLang` no Task 7.

- [ ] **Step 1: Declarar `hero3d` no TOPO do IIFE**

**Isto não é estilo — é obrigatório.** O `setLang` (Task 7) vai referenciar `hero3d`, e `setLang(detectLang())` roda na linha 23, durante a inicialização. Se `let hero3d` estiver declarado no fim do arquivo, essa chamada bate na *temporal dead zone* e lança `ReferenceError: Cannot access 'hero3d' before initialization` — quebrando a landing inteira no load, para **todo** visitante, inclusive os que nunca veriam 3D.

Em `site/js/landing.js`, logo após a linha `const btn = document.getElementById('landingLangBtn');`, adicione:

```js
    let hero3d = null;   // instancia da cena 3D, ou null. Declarado aqui em
                         // cima porque setLang() a referencia e roda na init.
```

- [ ] **Step 2: Adicionar o portão de capacidade**

Em `site/js/landing.js`, antes do fechamento `})();`, adicione:

```js
    /* ═══════════════ HERO 3D ═══════════════ */

    /* Portao: so carrega o Three.js se tudo abaixo passar.
       Ausencia de dado NUNCA reprova — deviceMemory e hardwareConcurrency
       nao existem no Safari, e reprovar por ausencia derrubaria o 3D em
       todo iPhone, que e justamente onde ele roda bem. */
    function canRun3d() {
        if (reduce) return false;
        const c = navigator.connection;
        if (c && c.saveData === true) return false;
        if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory < 4) return false;
        if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4) return false;
        try {
            const cv = document.createElement('canvas');
            if (!(cv.getContext('webgl2') || cv.getContext('webgl'))) return false;
        } catch (_) { return false; }
        return true;
    }

    async function boot3d() {
        const stage = document.getElementById('heroH1Stage');
        if (!stage || !hero || !canRun3d()) return;
        try {
            const mod = await import('./hero3d.js');
            const api = await mod.initHero3d(stage, {
                lang: html.getAttribute('data-lang') || 'pt',
            });
            if (!api) return;
            hero3d = api;
            // O h1 so sai de vista agora — depois do primeiro frame existir.
            hero.classList.add('hero--3d');
            stage.querySelector('canvas').classList.add('is-live');
        } catch (err) {
            // Qualquer falha: fica no hero CSS, que nunca desapareceu.
            console.warn('[hero3d] desativado:', err && err.message);
            if (hero3d) { try { hero3d.destroy(); } catch (_) {} hero3d = null; }
        }
    }

    /* Depois do load: o 3D nunca disputa a primeira pintura.
       requestIdleCallback aceita {timeout}; setTimeout aceita ms — nao da
       pra passar o mesmo argumento pros dois. */
    if (canRun3d()) {
        window.addEventListener('load', () => {
            if (window.requestIdleCallback) {
                window.requestIdleCallback(boot3d, { timeout: 1500 });
            } else {
                window.setTimeout(boot3d, 200);   // Safari < 17.4
            }
        });
    }
```

- [ ] **Step 3: Verificar a sintaxe**

```bash
cd ~/agenciaspace/lawcoder && node --check site/js/landing.js && echo "sintaxe ok"
```

Esperado: `sintaxe ok`.

- [ ] **Step 4: Ver o 3D na landing real**

Use o `shot.py` (relógio real). O `--virtual-time-budget` **não serve aqui**: ele congela o rAF e a manchete apareceria eternamente desmontada.

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
(python3 -m http.server 4321 --directory site >/dev/null 2>&1 &) ; sleep 1
python3 $SP/shot.py "http://localhost:4321/index.html" $SP/t6-3d.png 4000
```

Leia `$SP/t6-3d.png`. Esperado: o hero com a manchete em 3D **montada**, cores certas, **no mesmo lugar** onde estava o texto, com a legenda em mono abaixo. (O headless resolve o idioma como `en-US`, então espere a manchete em inglês — isso é normal.)

- [ ] **Step 5: Testar o fallback por reduced-motion**

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
python3 $SP/shot.py "http://localhost:4321/index.html" $SP/t6-reduce.png 4000 1280 860 reduce
```

Leia `$SP/t6-reduce.png`. Esperado: o hero **em CSS**, idêntico ao de hoje. Nenhuma canvas.

Confirme também que o Three.js **nem foi baixado** — este é o requisito real, não só "a canvas não apareceu":

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
cat > $SP/net-check.py <<'PYEOF'
import sys
from playwright.sync_api import sync_playwright
reduce = len(sys.argv) > 1 and sys.argv[1] == 'reduce'
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(reduced_motion='reduce' if reduce else 'no-preference')
    pg = ctx.new_page()
    urls = []
    pg.on('request', lambda r: urls.append(r.url))
    pg.goto('http://localhost:4321/index.html', wait_until='load')
    pg.wait_for_timeout(4000)
    b.close()
hits = [u for u in urls if 'three.bundle' in u or 'hero3d' in u]
print('BAIXOU_3D:', bool(hits), hits)
PYEOF
echo "--- com reduced-motion (deve ser False) ---"; python3 $SP/net-check.py reduce
echo "--- sem reduced-motion (deve ser True) ---"; python3 $SP/net-check.py
```

Esperado: `BAIXOU_3D: False []` com reduced-motion, e `BAIXOU_3D: True [...]` sem. Se vier `True` com reduced-motion, o portão está barrando a renderização mas **não** o download — 148KB gastos à toa em quem pediu explicitamente menos movimento.

- [ ] **Step 6: Provar que o Three.js não bloqueia a primeira pintura**

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
python3 $SP/shot.py "http://localhost:4321/index.html" $SP/t6-early.png 0
```

Leia `$SP/t6-early.png`. Esperado: a manchete **já visível em CSS** — nunca um buraco. É a regra central do design; se aqui aparecer vazio, o `h1` está sendo escondido cedo demais e o task falhou.

- [ ] **Step 7: Confirmar que o `h1` continua no DOM (SEO)**

```bash
cd ~/agenciaspace/lawcoder
google-chrome --headless=new --virtual-time-budget=8000 --dump-dom \
  "http://localhost:4321/index.html" 2>/dev/null | grep -c 'class="hero-h1"'
```

Esperado: `2` (os dois gêmeos). Se vier `0`, o texto sumiu do DOM e o SEO foi junto.

- [ ] **Step 8: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add site/js/landing.js
git commit -m "feat: portao de capacidade e boot do hero 3D

Carrega depois do load, so se passar no portao. Ausencia de deviceMemory/
hardwareConcurrency nao reprova (Safari nao expoe: reprovar derrubaria
todo iPhone). h1 so vai a opacity:0 apos o primeiro frame.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Toggle PT/EN sem vazar GPU

**Files:**
- Modify: `site/js/landing.js`

**Interfaces:**
- Consumes: `hero3d` e `setLang` do Task 6.
- Produces: nada novo.

- [ ] **Step 1: Escrever o teste do vazamento — e vê-lo falhar**

Antes de ligar o toggle, prove que o `dispose()` do Task 4 funciona. Crie `/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad/t7.html`:

```html
<style>body{background:#f2ede4;margin:0}#stage{position:relative;width:900px;height:300px}</style>
<div id="stage"></div>
<script type="module">
  import { initHero3d } from 'http://localhost:4321/js/hero3d.js';
  const api = await initHero3d(document.getElementById('stage'), { lang: 'pt' });
  const info = api._debug.renderer.info.memory;
  const base = info.geometries;
  for (let i = 0; i < 10; i++) await api.setLang(i % 2 ? 'pt' : 'en');
  // Sem dispose, geometrias se acumulam a cada toggle.
  console.log('LEAK_BASE:' + base + ' LEAK_AFTER:' + info.geometries);
</script>
```

Sirva o `site/` com CORS — `python3 -m http.server` puro não manda o header, e o import de módulo entre portas falha (confirmado no Task 4b):

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
cat > $SP/cors-server.py <<'EOF'
# uso: python3 cors-server.py <porta> <diretorio>
import functools, http.server, sys
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
handler = functools.partial(H, directory=sys.argv[2])
http.server.HTTPServer(('127.0.0.1', int(sys.argv[1])), handler).serve_forever()
EOF
(python3 $SP/cors-server.py 4321 site >/dev/null 2>&1 &) ; sleep 1
(python3 -m http.server 4322 --directory $SP >/dev/null 2>&1 &) ; sleep 1
google-chrome --headless=new --virtual-time-budget=15000 --enable-logging=stderr --v=0 \
  --dump-dom "http://localhost:4322/t7.html" 2>&1 | grep -o 'LEAK_BASE:[0-9]* LEAK_AFTER:[0-9]*'
```

Se não sair nada, cheque o console por erro de CORS antes de suspeitar do `dispose()`.

Esperado: `LEAK_AFTER` ≈ `LEAK_BASE` (± o número de letras — PT tem 33, EN tem 20, então após 10 toggles o valor final deve ser 33 ou 20, **não** ~250). Se `LEAK_AFTER` estiver na casa das centenas, o `disposeGroup()` está errado — **conserte antes de seguir**; cada toggle estaria vazando memória de GPU, e o botão de idioma convida a brincar.

- [ ] **Step 2: Ligar o `setLang` da landing na cena**

Em `site/js/landing.js`, na função `setLang` existente, logo antes de `localStorage.setItem('lawcoder-lang', l);`, adicione:

```js
        if (hero3d) hero3d.setLang(l);
```

Isto **depende** de `let hero3d = null;` estar declarado no topo do IIFE (Task 6, Step 1). `setLang(detectLang())` roda na inicialização, antes do bloco do 3D no fim do arquivo — se a declaração estiver lá embaixo, esta linha bate na temporal dead zone e lança `ReferenceError`, quebrando a landing no load. Confirme antes de seguir:

```bash
cd ~/agenciaspace/lawcoder && grep -n 'let hero3d' site/js/landing.js
```

Esperado: **uma** ocorrência, com número de linha **menor** que o do `setLang(detectLang())` (verifique com `grep -n 'setLang(detectLang())' site/js/landing.js`).

- [ ] **Step 3: Verificar a sintaxe**

```bash
cd ~/agenciaspace/lawcoder && node --check site/js/landing.js && echo "sintaxe ok"
```

Esperado: `sintaxe ok`.

- [ ] **Step 4: Testar o toggle na página real**

**Armadilha confirmada no Task 3:** este Chrome headless resolve `navigator.language` como `en-US` mesmo com `--lang=pt-BR`. Sem forçar, a página já **abre em inglês**, e clicar no toggle levaria a português — o teste "passaria" mostrando o oposto do que diz verificar. Force o estado inicial via `localStorage` em vez de confiar no default.

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
cat > $SP/t7-toggle.html <<'EOF'
<iframe id="f" style="width:1280px;height:800px;border:0"></iframe>
<script>
  // Forca PT como estado inicial: o headless resolveria en-US sozinho.
  const f = document.getElementById('f');
  f.src = 'http://localhost:4321/index.html';
  f.onload = () => {
    const w = f.contentWindow;
    if (w.localStorage.getItem('lawcoder-lang') !== 'pt') {
      w.localStorage.setItem('lawcoder-lang', 'pt');
      f.contentWindow.location.reload();
      return;   // o proximo onload cai no else
    }
    setTimeout(() => {
      const d = f.contentDocument;
      console.log('LANG_ANTES:' + d.documentElement.getAttribute('data-lang'));
      d.getElementById('landingLangBtn').click();
      setTimeout(() => {
        console.log('LANG_DEPOIS:' + d.documentElement.getAttribute('data-lang'));
      }, 2500);
    }, 5000);
  };
</script>
EOF
google-chrome --headless=new --hide-scrollbars --window-size=1280,860 \
  --virtual-time-budget=16000 --enable-logging=stderr --v=0 \
  --screenshot=$SP/t7-en.png --dump-dom "http://localhost:4322/t7-toggle.html" 2>&1 \
  | grep -oE 'LANG_(ANTES|DEPOIS):[a-z]*'
```

Esperado: `LANG_ANTES:pt` seguido de `LANG_DEPOIS:en` — **nessa ordem**. Se vier `LANG_ANTES:en`, o `localStorage` não pegou e a captura não prova nada.

Leia `$SP/t7-en.png`. Esperado: a manchete em 3D em **inglês** ("LEGAL TOOLS / BUILT / BY YOU"), com "BY YOU" de face vermelha, remontando.

- [ ] **Step 5: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add site/js/landing.js
git commit -m "feat: toggle PT/EN reconstroi a cena com dispose explicito

Sem dispose cada toggle vazaria memoria de GPU — e o botao convida a
brincar, entao o vazamento seria questao de tempo, nao de azar.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: Ciclo de vida — pausa, resize e contexto perdido

**Files:**
- Modify: `site/js/hero3d.js`, `site/js/landing.js`

**Interfaces:**
- Consumes: `pause()`, `resume()`, `destroy()` do Task 5; as funções internas `fit()` e `render()` do Task 4 (via closure, não via `_debug`); a classe `hero--3d` do Task 3.
- Produces: o evento **`hero3d:lost`**, disparado na canvas e propagado (`bubbles: true`) — o `landing.js` escuta no `#heroH1Stage` para reverter ao hero CSS. Ao fim, a cena para quando não é vista, reencaixa no resize, e some com elegância se o contexto WebGL cair.

- [ ] **Step 1: Tratar `webglcontextlost` no `hero3d.js`**

Este é o modo de falha mais esquecido: no celular o navegador **derruba o contexto WebGL** quando a memória aperta. Sem tratar, o visitante fica olhando um retângulo vazio onde estava a manchete — exatamente o que o fallback existe pra evitar.

Em `site/js/hero3d.js`, dentro de `initHero3d`, logo após a criação do `renderer`, adicione:

```js
    let onLost = null;
```

E logo antes do `return {` final:

```js
    // Contexto perdido (comum no mobile sob pressao de memoria):
    // avisa o chamador para reverter ao hero CSS.
    onLost = (e) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        canvas.dispatchEvent(new CustomEvent('hero3d:lost', { bubbles: true }));
    };
    canvas.addEventListener('webglcontextlost', onLost);
```

E dentro de `destroy()`, antes de `canvas.remove();`:

```js
            canvas.removeEventListener('webglcontextlost', onLost);
```

- [ ] **Step 2: Adicionar `ResizeObserver` no `hero3d.js`**

Logo antes do `return {` final:

```js
    const ro = new ResizeObserver(() => { fit(); render(); });
    ro.observe(mount);
```

E dentro de `destroy()`, antes de `renderer.dispose();`:

```js
            ro.disconnect();
```

- [ ] **Step 3: Reagir na landing — reverter no contexto perdido, pausar fora de vista**

Em `site/js/landing.js`, dentro de `boot3d()`, logo após `stage.querySelector('canvas').classList.add('is-live');`, adicione:

```js
            // Contexto perdido: o h1 volta, a canvas sai. Sem buraco.
            stage.addEventListener('hero3d:lost', () => {
                hero.classList.remove('hero--3d');
                if (hero3d) { try { hero3d.destroy(); } catch (_) {} hero3d = null; }
            });

            // Um loop de RAF numa aba de fundo e bateria do visitante
            // queimada a toa.
            document.addEventListener('visibilitychange', () => {
                if (!hero3d) return;
                document.hidden ? hero3d.pause() : hero3d.resume();
            });

            if ('IntersectionObserver' in window) {
                new IntersectionObserver((es) => {
                    if (!hero3d) return;
                    es[0].isIntersecting ? hero3d.resume() : hero3d.pause();
                }, { threshold: 0 }).observe(hero);
            }
```

- [ ] **Step 4: Verificar a sintaxe dos dois arquivos**

```bash
cd ~/agenciaspace/lawcoder
node --check site/js/landing.js && node --input-type=module --check < site/js/hero3d.js && echo "sintaxe ok"
```

Esperado: `sintaxe ok`.

- [ ] **Step 5: Testar a reversão no contexto perdido**

Force a perda de contexto com a extensão `WEBGL_lose_context` e confirme que o `h1` volta. Crie `/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad/t8.html`:

```html
<iframe id="f" src="http://localhost:4321/index.html" style="width:1280px;height:800px;border:0"></iframe>
<script>
  const f = document.getElementById('f');
  f.onload = () => setTimeout(() => {
    const d = f.contentDocument;
    const cv = d.querySelector('.hero-canvas');
    if (!cv) { console.log('CTX_TEST: sem canvas'); return; }
    const gl = cv.getContext('webgl2') || cv.getContext('webgl');
    gl.getExtension('WEBGL_lose_context').loseContext();
    setTimeout(() => {
      const hero = d.querySelector('.hero');
      console.log('CTX_TEST: hero--3d=' + hero.classList.contains('hero--3d') +
                  ' canvas=' + !!d.querySelector('.hero-canvas'));
    }, 600);
  }, 6000);
</script>
```

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
google-chrome --headless=new --hide-scrollbars --window-size=1280,860 \
  --virtual-time-budget=12000 --enable-logging=stderr --v=0 \
  --screenshot=$SP/t8-lost.png --dump-dom "http://localhost:4322/t8.html" 2>&1 \
  | grep -o 'CTX_TEST:[^"<]*' | head -1
```

Esperado: `CTX_TEST: hero--3d=false canvas=false`. Leia `$SP/t8-lost.png`: a manchete deve estar **de volta em CSS**, legível — nunca um retângulo vazio.

- [ ] **Step 6: Commit**

```bash
cd ~/agenciaspace/lawcoder
git add site/js/hero3d.js site/js/landing.js
git commit -m "feat: ciclo de vida do hero 3D (pausa, resize, contexto perdido)

webglcontextlost reverte ao hero CSS: no mobile o navegador derruba o
contexto sob pressao de memoria, e sem isso sobraria um retangulo vazio
onde estava a manchete.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: Verificação final e deploy

**Files:**
- Nenhum novo. Verificação de ponta a ponta.

**Interfaces:**
- Consumes: tudo.
- Produces: confiança de que produção != local.

- [ ] **Step 1: Rodar o assert de build (o risco #1)**

```bash
cd ~/agenciaspace/lawcoder && npm run build:assert
```

Esperado: todas as linhas `ok`, `dist completo.`, exit 0.

- [ ] **Step 2: Servir o `dist` e verificar que o 3D funciona lá também**

O dev server serve `site/`. **Produção serve `site/dist/`.** Este passo é o único que testa o que o visitante realmente recebe.

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
(python3 -m http.server 4323 --directory site/dist >/dev/null 2>&1 &) ; sleep 1
google-chrome --headless=new --hide-scrollbars --window-size=1280,860 \
  --virtual-time-budget=8000 --screenshot=$SP/t9-dist.png \
  "http://localhost:4323/index.html" 2>/dev/null && echo ok
```

Leia `$SP/t9-dist.png`. Esperado: **manchete em 3D montada**, igual à do dev server. Se aqui aparecer o hero em CSS mas no `site/` aparecer o 3D, um arquivo faltou no `build:copy` — exatamente o bug que o assert existe pra pegar.

- [ ] **Step 3: Verificar que nenhum 404 aparece no dist**

```bash
cd ~/agenciaspace/lawcoder
for f in js/hero3d.js js/vendor/three.module.js js/vendor/SVGLoader.js assets/headline-pt.svg assets/headline-en.svg; do
  printf "%s -> %s\n" "$f" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:4323/$f)"
done
```

Esperado: todos `200`.

- [ ] **Step 4: Conferir o peso real**

```bash
cd ~/agenciaspace/lawcoder
for f in site/dist/js/vendor/three.module.js site/dist/assets/headline-pt.svg site/dist/assets/headline-en.svg site/dist/js/hero3d.js; do
  printf "%-45s %6s bruto  %6s gzip\n" "$(basename $f)" "$(du -h $f | cut -f1)" "$(gzip -c $f | wc -c | numfmt --to=iec)"
done
```

Esperado: `three.module.js` na casa de ~170KB gzip — **o número que a spec assumiu**. Se vier muito acima, reporte: o cálculo de custo/benefício do design muda.

- [ ] **Step 5: Fallback com WebGL indisponível**

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
google-chrome --headless=new --disable-webgl --hide-scrollbars --window-size=1280,860 \
  --virtual-time-budget=8000 --screenshot=$SP/t9-nowebgl.png \
  "http://localhost:4323/index.html" 2>/dev/null && echo ok
```

Leia `$SP/t9-nowebgl.png`. Esperado: hero em CSS, íntegro, com a legenda. Sem canvas, sem buraco.

- [ ] **Step 6: Revisar a página inteira**

```bash
cd ~/agenciaspace/lawcoder
SP=/tmp/claude-1000/-home-leon/b6b95e26-c7ae-4ea8-8350-47b25c080878/scratchpad
google-chrome --headless=new --force-prefers-reduced-motion --hide-scrollbars \
  --window-size=1280,6600 --virtual-time-budget=6000 \
  --screenshot=$SP/t9-full.png "http://localhost:4323/index.html" 2>/dev/null && echo ok
```

Leia `$SP/t9-full.png`. Confirme que a narrativa explain-first inteira segue intacta e que o hero não empurrou nada.

- [ ] **Step 7: Parar os servidores de teste**

```bash
pkill -f "http.server 432" 2>/dev/null; echo "servidores parados"
```

- [ ] **Step 8: Entregar para teste humano — não pule**

**O Safari não é testável neste ambiente.** Chrome headless é tudo que existe aqui. WebGL é sólido no Safari, mas o iPhone é onde o `webglcontextlost` e o portão de capacidade realmente importam, e nenhum dos dois foi exercitado em hardware real.

Peça ao Leon:
1. Abrir a branch de preview da Vercel no **iPhone/Safari** e confirmar que a manchete monta (ou cai no CSS com elegância — os dois são resultados aceitáveis).
2. Confirmar o texto da legenda na voz dele (é troca de string).

- [ ] **Step 9: Commit final e push (SÓ com OK explícito do Leon)**

O repositório tem mudanças anteriores não commitadas (a landing explain-first). **Não as inclua sem perguntar.** O push dispara deploy na Vercel.

```bash
cd ~/agenciaspace/lawcoder
git status --short
git log --oneline -9
```

Confirme com o Leon antes de qualquer `git push`.

---

## Notas de risco

- **Tracking em viewports pequenas.** O SVG é gerado a 96px com `letter-spacing: -2px` absoluto. O CSS usa `clamp(52px, 7vw, 96px)`, então a 52px o tracking real seria −2px, mas o SVG escalado dá ≈−1,08px proporcional. A manchete 3D pode ficar levemente mais larga que a de CSS no mobile. O `fit()` encaixa pela caixa, então o total bate; a distribuição interna difere de forma sutil. **Aceitável** — a troca é um crossfade. Se incomodar, gere um segundo SVG a 52px e escolha por breakpoint.
- **`--disable-webgl` pode não existir** na sua versão do Chrome. Alternativa: `--disable-gpu --use-gl=disabled`, ou testar via DevTools desabilitando WebGL.
- **O peso só se justifica pela legenda.** Se a legenda sair, o 3D vira decoração de ~170KB gzip e deve sair junto.
