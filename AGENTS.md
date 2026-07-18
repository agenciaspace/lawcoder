# Lawcoder — registro de handoff para o agente do opencode

> Este arquivo é o ponto de continuação. Foi escrito pelo Claude Code para que o
> agente do opencode (rodando com a assinatura desta máquina) retome a configuração
> e o revamp da landing sem perder contexto. Leia tudo antes de agir.

---

## 0. Autenticação e modelo — RESOLVIDO ✅

Login feito com a assinatura **OpenCode Go**, que **inclui o Kimi K3**. O modelo é:

```
opencode-go/kimi-k3
```

(atenção ao prefixo: é `opencode-go/`, NÃO `opencode/` nem `moonshotai/`.)
Já está definido como `model` padrão no `~/.config/opencode/opencode.json`, então
`opencode` puro já sobe no K3. Testado: `opencode run "responda apenas: ok"` → `ok`.
Nenhuma key paga da Moonshot é necessária — vem tudo pela assinatura.

O gateway `opencode-go` também serve `kimi-k2.6` e `kimi-k2.7-code`, se quiser variar.

### O que já foi configurado (feito pelo Claude Code)
- opencode atualizado `1.17.18 → 1.18.3`.
- Removida a chave inválida `yolo: true` do `opencode.json` (quebrava TODA a config
  na 1.18.x). Permissões YOLO seguem vindo do agente `yolo`.
- `model` padrão setado para `opencode-go/kimi-k3`.

---

## 1. A tarefa: revamp da landing da Lawcoder

Diretório: `~/agenciaspace/lawcoder`. Site estático **vanilla** (HTML/CSS/JS, sem
React, sem bundler). Build = PostCSS + csso + uma lista literal de `cp`.
`npm run build` gera `site/dist/`. A Vercel serve `dist/`; o dev server serve `site/`.

### Produto e marca
- **Produto:** um **curso** (era um SaaS, o Leon fez o pivô). Ensina advogados a
  criar as próprias ferramentas jurídicas com IA (Claude Code etc.).
- **Marca:** **Lawcoder** — lockup = `Law` (DM Sans 700, sans) + `coder`
  (Playfair Display **itálico** 500, serif). O "coder" em itálico serifado é a
  identidade. Cor de marca: **laranja `#FF7300`** (NÃO `#FF6B00`).
- **Logo real:** `~/agenciaspace/lawcode/public/lawcode-logo.png` (500×500, #FF7300,
  "Law" sans + "code" serif itálico branco). O `.svg` irmão é uma reconstrução ruim
  em Arial com cor errada — **não use**.

### Direção de design (aprovada)
Inspiração no espírito do ivo.ai, mas com identidade própria: fundo branco,
respiro generoso, sombras sutis, raio 8–16px, laranja como **acento** (não
dominante), uma faixa escura de âncora. Palavras de ênfase em serif itálico
laranja. Saiu de um visual "brutalista" anterior; a régua é "calmo, com um tom de
personalidade" — nem minimalista demais, nem exagerado.

### Restrições invioláveis (intenção explícita do Leon)
- **NUNCA inventar** depoimentos, número de alunos, ou bio do instrutor.
  (A bio do instrutor está **pendente** — o Leon vai fornecer. Deixe placeholders
  `[Nome do instrutor]` etc.)
- O **hero NÃO mostra nenhuma ferramenta/mockup inventado.**
- **Não usar** os logos da "Dra. Clarissa Van Acker Sakayanagui" que estão em
  ~/Downloads — é outra pessoa (médica), nada a ver com o projeto.
- **Nenhum git commit/push para produção sem aprovação explícita do Leon.**

---

## 2. Estado dos arquivos

- **`site/css/landing.css`** — ✅ **JÁ REESCRITO** no novo design system (está como
  modificado não-commitado no git). É self-contained (não importa mais
  `variables.css`, pra isolar a landing da página do curso). Tokens principais:
  `--brand:#FF7300`, `--bg:#fff`, fontes `--f:'DM Sans'` + `--s:'Playfair Display'`
  (serif itálico) + `--m:'JetBrains Mono'`. Estiliza TODOS os nomes de classe já
  existentes (section-label, section-h2, problem-grid, terminal, steps-grid,
  build-row, modules-grid, forwho-grid, faq-item, instructor-card, tools-row,
  pricing-grid, mentoring-*, cta-section, footer) + camada de motion
  `.reveal`/`.reveal-stagger` + breakpoints em 980px e 680px.

- **`site/index.html`** (753 linhas) — ⏳ **AINDA NÃO reescrito** no novo design.
  Tem todo o conteúdo bilíngue real (15 seções). Padrão bilíngue: pares
  `[data-show="pt"]`/`[data-show="en"]` alternados por `html[data-lang]` via CSS
  `display:revert`, botão `#landingLangBtn`. **Preserve verbatim** todo texto
  bilíngue, links `curso.html`, e o link do WhatsApp `wa.me/5511947519397`.
  Pendências ao reescrever:
  - Topbar/footer: trocar `LAW<span>CODER</span>` pelo lockup
    `<div class="logo"><span class="law">Law</span><span class="code">coder</span></div>`.
  - Adicionar **Playfair Display** ao `<link>` do Google Fonts.
  - Remover os `<img src="https://cdn.simpleicons.org/...">` dos `.tool-chip`
    (elimina 2 erros 404 pré-existentes; o CSS já põe um ponto via `::before`).
  - Adicionar classes `.reveal`/`.reveal-stagger` (com `--i`) para o motion.

- **`site/js/landing.js`** (124 linhas) — ⏳ reescrever para versão minimalista:
  MANTER: toggle de idioma, smooth scroll em âncoras, `html.classList.add('js')`,
  stagger `--i`, IntersectionObserver adicionando `.is-visible`.
  REMOVER: barra de progresso de scroll, contadores (`runCounters`), parallax do
  hero (conflita com o reveal). Respeitar `prefers-reduced-motion`.

- **`tools/assert-dist.sh`** — guard que só checa existência de arquivos no dist.
- **`package.json`** — build = `build:css && build:copy` (deps: csso-cli, postcss,
  postcss-cli, postcss-import). O trabalho de 3D anterior foi revertido.

### As 15 seções de `index.html` (conteúdo real a preservar)
topbar · hero · `#problema` (4 itens ⏳📄🔌💸) · `#o-que-e` (terminal "claude-code")
· `#como-funciona` (4 passos) · `#projetos` (Calculadora de Prazos + Assistente de
Processos) · `#modulos` (11 módulos; módulo 00 em destaque "Panorama das
Ferramentas de IA") · `#pra-quem` (5 perfis) · `#duvidas` (5 FAQ) · `#instrutor`
(placeholders TODO) · why-free (blockquote "— Lawcoder") · tools (11 tool-chips) ·
`#planos` (Gratuito R$0 + Pago R$497/$97) · `#mentoria` (card + WhatsApp) ·
cta-section (dupla) · footer.

---

## 3. Próximos passos (ordem sugerida)
1. Logar no opencode com a assinatura (seção 0) e escolher o modelo (K3 se
   disponível via Zen).
2. ~~Reescrever `site/index.html` no novo design~~ — ✅ FEITO (opencode/K3).
3. ~~Reescrever `site/js/landing.js` (versão minimalista)~~ — ✅ FEITO.
4. ~~`npm run build` e conferir o `site/dist/`.~~ — ✅ FEITO.
5. Abrir preview e revisar com o Leon. **Não commitar/pushar sem aprovação dele.**

## 3b. O que mais foi feito depois (opencode/K3, jul/2026)
- Fix do mecanismo bilíngue no CSS: `[data-show]{display:none}` + `revert`
  vazava os dois idiomas em `.btn`/`.section-label` e destruía o inline-flex.
  Agora: hide só no idioma inativo (`:not()` + `!important`).
- Camada de identidade "documento vivo": grão de papel, seções numeradas
  `· art. N` (counter CSS), carimbo de cartório no plano grátis, sublinhado
  manuscrito animado nos `<em>`, caret `_` piscando no h1, aspas gigantes no
  quote, `::selection` laranja, focus-visible da marca.
- Emojis dos cards viraram SVGs de traço próprios (9 ícones).
- Hero: § removido a pedido do Leon → **campo ASCII vivo em canvas**
  (ondas de glifos mono + halo do mouse + feixe de scan laranja periódico,
  sprite atlas, pausa fora da viewport, honra reduced-motion) + crosshairs
  `+` de blueprint na vitrine.
- **Bio do instrutor preenchida** com dados reais do LinkedIn (/in/leonhatori):
  Leon Hatori, Global Legal Operations Leader na Monks; ~20 anos IBM/lawtechs/
  Lawing(CEO)/Monks. Quote do why-free assinado "— Leon Hatori" (serif itálico).
  Nome veio do slug público (LinkedIn oculta o sobrenome) — confirmar com ele.
- **Foto do instrutor aplicada**: ilustração sketch sobre laranja (enviada pelo
  Leon), otimizada p/ 480px JPEG em `site/assets/leon-hatori.jpg`. O build:copy
  e o assert-dist.sh passaram a incluir `site/dist/assets/leon-hatori.jpg`.

## 4. Pendências que dependem do Leon
- ~~Bio real do instrutor (hoje é placeholder).~~ — ✅ preenchida via LinkedIn.
- ~~Foto do instrutor~~ — ✅ ilustração aplicada (avatar circular 112px).
- Confirmar a afirmação "roda no seu computador" do projeto Assistente.
- Decidir se `curso.html` (ainda brutalista) também será migrado depois.
- **Aprovar e autorizar commit/push** (landing.css, index.html, landing.js,
  package.json, tools/assert-dist.sh, site/assets/ + .opencode/plan.md +
  este AGENTS.md).
