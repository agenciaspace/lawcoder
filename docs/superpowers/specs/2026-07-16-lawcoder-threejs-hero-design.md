# Revamp do hero da landing do LawCoder com Three.js

**Data:** 2026-07-16
**Status:** Design aprovado, aguardando plano de implementação

## Problema

A landing do LawCoder (`site/index.html`) tem hoje uma narrativa explain-first e uma camada
de movimento em CSS. O objetivo do revamp é usar 3D como **prova**, não como enfeite.

A tensão central: "prova técnica" pressupõe alguém capaz de avaliar a técnica, mas o público
é advogado, não desenvolvedor. Um advogado não distingue Three.js bem feito de template
comprado — e 3D genérico (partículas, blobs, esfera distorcida) hoje lê como *template de
agência*, o oposto de prova de competência.

## A promessa que a cena sustenta

O curso **não ensina Three.js, nem 3D, nem WebGL** — os 11 módulos cobrem ferramentas de IA,
terminal, editores com IA, dois projetos (app e assistente), automações, prompting e LGPD.
Portanto "isso você vai aprender a fazer", aplicado a uma cena 3D, seria falso, e falso de um
jeito que o aluno descobre no primeiro módulo.

A versão verdadeira, e mais forte: o módulo **"Como Pedir Para a IA Criar Coisas"** é
exatamente a habilidade que produz essa cena. A promessa é:

> **"Não sei escrever 3D. Pedi."**

A cena é o artefato do método — o exemplo mais extremo possível do argumento do curso. O
visitante não precisa avaliar a técnica; só entender que aquilo saiu de um pedido.

## Decisões travadas

| Decisão | Escolha |
|---|---|
| Papel do 3D | Diferenciação / prova técnica |
| O que o visitante conclui | "Isso eu vou aprender a fazer" → refinado para "não sei fazer, pedi" |
| Onde vive | Hero, primeira dobra, com a legenda junto |
| Mobile / peso | Fallback estático + upgrade progressivo |
| Forma | Manchete extrudada que se monta na entrada |

## Restrições

- Site estático vanilla. **Sem bundler** — build é PostCSS + csso + `cp`. Não introduzir toolchain.
- Identidade brutalista: creme `#f2ede4`, preto `#0d0d0d`, vermelho `#e63012`; sem
  border-radius; bordas duras 2px; sem brilho. Elimina a estética default de Three.js
  (glass, bloom, PBR realista).
- Bilíngue PT/EN via toggle.
- `prefers-reduced-motion` respeitado.
- Safari precisa funcionar (WebGL roda bem lá).

## 1. Arquitetura e carregamento

Sem bundler ⇒ sem tree-shaking: Three.js entra inteiro (~170KB gzip). Aceitável **porque o
3D nunca bloqueia a primeira pintura** — é download ocioso depois do LCP, não atraso na dobra.

- **Three.js vendorizado** em `site/js/vendor/three.module.js`, versão pinada. Mesma origem,
  zero dependência de terceiro em runtime. `build:copy` ganha mais um `cp`.
- **O poster de fallback é o hero atual em CSS.** Sem asset novo.
- A canvas é posicionada exatamente sobre a caixa do `h1`. Quando o 3D sobe, o `h1` vai a
  `opacity: 0` mas **continua no DOM ocupando o mesmo espaço** — leitor de tela e crawler
  seguem vendo a manchete. A canvas é `aria-hidden`. Sem layout shift, sem perda de SEO.
- **Texto vira geometria via SVG path extrudado** (um path por letra, um SVG por idioma),
  não via font JSON do Barlow Condensed: só precisamos de ~30 glifos (~10KB em SVG contra
  150KB+ da fonte inteira). Usa `SVGLoader` + `ExtrudeGeometry`.

### Portão de upgrade

Carrega o 3D **somente se** todas forem verdadeiras:

- `prefers-reduced-motion` não está em `reduce`
- WebGL disponível (contexto `webgl2` ou `webgl` obtido com sucesso)
- `navigator.connection.saveData` não é `true`
- `navigator.deviceMemory >= 4` **ou** a propriedade é indefinida
- `navigator.hardwareConcurrency >= 4` **ou** a propriedade é indefinida

Os limiares são deliberadamente permissivos: `deviceMemory` e `hardwareConcurrency` não
existem no Safari, e reprovar por ausência derrubaria o 3D em todo iPhone — que é justamente
onde ele tem chance de rodar bem. **Ausência de dado nunca reprova; só valor abaixo do limiar
reprova.**

Disparo: depois do evento `load`, em `requestIdleCallback`.
Qualquer falha ⇒ fica no hero CSS.

## 2. A cena

Regras da marca traduzidas pra 3D:

- `bevelEnabled: false` — arestas absolutamente duras (= "sem border-radius")
- `roughness: 1`, `metalness: 0` — material fosco (= "sem brilho")
- Fundo da canvas transparente (`alpha: true`) — o creme da página atravessa; a cena habita
  a página em vez de ser uma caixa colada por cima

**Cor:** dois grupos de material no `ExtrudeGeometry` — face frontal preta (`#0d0d0d`),
laterais vermelhas (`#e63012`). De frente é o hero preto de sempre; ao girar, sangra vermelho
na profundidade. **A cor da marca é literalmente a terceira dimensão** — o vermelho só existe
porque há profundidade, que é o que a peça está dizendo.

**Câmera:** `PerspectiveCamera`, FOV ~35° — achata a perspectiva, mantém leitura gráfica em
vez de cinematográfica.

**Luz:** uma `DirectionalLight` dura vinda da esquerda-alta + `AmbientLight` baixa. Sem shadow
map (caro e macio demais pro vocabulário daqui).

**Montagem (entrada):** determinística, não aleatória — brutalismo é ordem, não caos. Cada
letra entra da profundidade pro seu lugar; deslocamento e rotação derivados do índice,
escalonados em cascata, ~1,2s no total. Lê como algo sendo *colocado*, não como poeira se
juntando. Reaproveita o idioma de stagger (`--i`) que a página já usa.

**Repouso:** acompanha o mouse com lerp suave, limitado a ±8°; sobe de leve no scroll (a
canvas tem seu próprio parallax — o do `h1` em CSS fica irrelevante quando ele vai a
`opacity: 0`).

**Legenda:** linha em mono, pequena, abaixo da canvas. É ela que converte a cena em argumento.
Bilíngue, e visível também no fallback CSS (o argumento não depende do 3D ter carregado).

Texto a implementar (confirmado: "Como Pedir Para a IA Criar Coisas" **é** o módulo 09):

- PT: `// não sei escrever 3D. pedi. — módulo 09`
- EN: `// i don't know 3D. i asked. — module 09`

Este é o texto **default**, não um placeholder: a implementação segue com ele. O Leon pode
reescrever na voz dele depois — é troca de string, não muda o design.

## 3. Integração e ciclo de vida

Módulo isolado com contrato mínimo:

```js
initHero3d(mount, { lang }) -> { setLang(l), destroy() }
```

Não conhece a landing — só recebe onde montar e em que idioma. `landing.js` continua
orquestrador e segue **script clássico** (`import()` dinâmico funciona lá dentro; não precisa
virar módulo).

**Regra que garante que ninguém veja buraco:** o `h1` só vai a `opacity: 0` **depois do
primeiro frame ter renderizado com sucesso** — não quando o import resolve. Toda falha fica
invisível por construção, porque o estado de partida é a página funcionando.

**PT/EN:** o `setLang` existente avisa a cena. Trocar idioma reconstrói a geometria a partir
do outro SVG e **descarta a antiga explicitamente** (`geometry.dispose()`, `material.dispose()`).
Sem isso cada toggle vaza memória de GPU — e o botão convida a brincar, então o vazamento é
questão de tempo, não de azar.

**Pausa:** para de renderizar quando não está visível — `IntersectionObserver` no hero +
`visibilitychange` na aba.

**Resize:** `ResizeObserver` na caixa do hero. `pixelRatio` capado em 2 (1.5 no mobile).

### Modos de falha

| Falha | Resposta |
|---|---|
| Import ou SVG não carrega | Fica no hero CSS (o `h1` nunca desapareceu) |
| Sem WebGL / `saveData` / aparelho fraco | Nem tenta carregar |
| `prefers-reduced-motion` | Nem tenta carregar |
| Erro no init | `try/catch` → hero CSS |
| `webglcontextlost` | `h1` volta a `opacity: 1`, canvas removida |

O último é o mais esquecido: no celular o navegador derruba contexto WebGL quando a memória
aperta. Sem escutar `webglcontextlost`, o visitante fica olhando um retângulo vazio onde
estava a manchete — exatamente o cenário que o fallback existe pra evitar.

## 4. Verificação

O repo **não tem infra de teste** (nenhum runner, nenhum Playwright). Não vamos criar uma
suíte pra um efeito de hero. Verificação headless + manual, específica:

**O risco mais provável não é o 3D — é o deploy.** `build:copy` é uma lista literal de `cp`.
Se `hero3d.js`, os SVGs ou `three.module.js` não entrarem nela, funciona local (o dev server
serve `site/` direto) e **produção silenciosamente fica sem 3D** — sem erro, porque o fallback
é a página funcionando. O caminho de falha elegante esconderia o bug.

Checklist:

1. **Obrigatório:** rodar `npm run build` e afirmar que cada arquivo novo existe em `site/dist/`.
2. Três capturas headless: padrão (manchete montada), `--force-prefers-reduced-motion` (hero
   CSS, igual ao de hoje) e WebGL desligado (hero CSS).
3. Vazamento de GPU: alternar PT/EN ~10x e ler `renderer.info.memory.geometries` — estável.
   Se subir, o `dispose()` está errado.
4. SEO/a11y: `h1` no DOM com o texto real; canvas `aria-hidden`.
5. Sem layout shift: canvas ocupa exatamente a caixa do `h1`.
6. Não bloqueia: `three.module.js` só aparece na rede depois do evento `load`.

**Safari não é testável neste ambiente** (só Chrome headless). WebGL é sólido no Safari, mas o
teste real depende de o Leon abrir no iPhone.

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `site/js/hero3d.js` | **novo** — módulo da cena |
| `site/js/vendor/three.module.js` | **novo** — Three.js vendorizado, versão pinada |
| `site/js/vendor/SVGLoader.js` | **novo** — addon |
| `site/assets/headline-pt.svg`, `headline-en.svg` | **novos** — paths por letra |
| `site/js/landing.js` | portão de upgrade + `import()` + hook no `setLang` |
| `site/css/landing.css` | caixa de montagem da canvas + legenda |
| `site/index.html` | mount point + legenda bilíngue |
| `package.json` | `build:copy` copia os arquivos novos |

## Fora de escopo

- Introduzir bundler/tree-shaking. Revisitar só se o peso for medido como problema real.
- 3D em qualquer outra seção da página.
- Shadow maps, pós-processamento, bloom.

## Pendências do Leon

- Revisar o texto da legenda (não bloqueia: há default implementável).
- Teste no Safari/iPhone — não é testável neste ambiente.
- Bio real do instrutor (pendência anterior, não deste design).
