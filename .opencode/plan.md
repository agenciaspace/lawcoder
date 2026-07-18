# Plano — finalizar o revamp da landing Lawcoder

Retomada do handoff deixado pelo Claude Code (ver AGENTS.md do projeto).

## Estado inicial
- `site/css/landing.css` — ✅ já reescrito no novo design system (não commitado).
- `site/index.html` — ⏳ reescrever no novo design (conteúdo bilíngue real a preservar verbatim).
- `site/js/landing.js` — ⏳ reescrever versão minimalista.

## Tarefas
1. **index.html** — reescrever no novo design:
   - Google Fonts: trocar Barlow Condensed por **Playfair Display** (ital 500).
   - Topbar/footer: lockup `<div class="logo"><span class="law">Law</span><span class="code">coder</span></div>`.
   - Topbar com `.topbar-in` + `.nav-inline` (âncoras) + lang btn + CTA.
   - Hero: pill + h1 com `<em>` serif-itálico laranja + desc + CTAs (`.btn .btn-brand/.btn-ghost`) + hero-note.
   - Hero "vitrine": `.hero-shot > .window > .mods` com os 11 módulos reais (sem mockup inventado).
   - Faixa escura `.strip` com os números (11 módulos, 2 projetos, 0 código, ∞).
   - Preservar as 15 seções, todo texto `[data-show]` pt/en, links `curso.html`, `wa.me/5511947519397`.
   - Remover `<img src="cdn.simpleicons.org/...">` dos `.tool-chip` (CSS já põe o ponto ::before).
   - Aplicar `.reveal` nas seções/blocos e `.reveal-stagger` nos grids (JS põe `--i`).
   - Mapear classes antigas → novas do CSS: `.cta-top`→`.btn .btn-brand`, `.btn-hero-*`→`.btn .btn-lg`, stats→`.strip`, etc.
2. **landing.js** — minimalista:
   - MANTER: `html.classList.add('js')`, toggle idioma (title EN/PT, localStorage `lawcoder-lang`), smooth scroll, stagger `--i`, IntersectionObserver → `.is-visible`, respeitar `prefers-reduced-motion`.
   - REMOVER: barra de progresso, contadores, parallax.
   - Reveal agora observa `.reveal, .reveal-stagger` (o HTML marca os alvos).
   - Title: alinhar com a marca "Lawcoder" (sem capslock "CODER").
3. **Build**: `npm run build` e conferir `site/dist/` + `./tools/assert-dist.sh`.
4. **Preview** com `npx serve site` e revisão visual (headless screenshot se possível).
5. **NÃO commitar/pushar** — aguardar aprovação explícita do Leon.

## Restrições invioláveis
- Nunca inventar depoimentos, nº de alunos, bio do instrutor (placeholders `[Nome do instrutor]`).
- Hero não mostra ferramenta/mockup inventado — vitrine usa os 11 módulos reais do curso.
- Não usar logos de ~/Downloads (Dra. Clarissa — outra pessoa).
- Laranja `#FF7300` (não `#FF6B00`).
- Sem commit/push sem aprovação do Leon.

## Verificação
- `npm run build` sem erros; `site/dist/` completo (assert-dist.sh).
- grep no dist: sem `simpleicons`, sem `LAW<span>CODER`, com Playfair, com `.logo`.
- Todos os textos pt/en preservados (diff de contagem de `data-show`).
