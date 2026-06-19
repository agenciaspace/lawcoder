# Logo · lawcoders

Identidade da comunidade **lawcoders** — automação para o mundo jurídico.
Coerente com o site LawCoder: paleta creme/preto/vermelho, Barlow Condensed Black no
wordmark, vibe terminal/CLI no símbolo (`>` + cursor).

## Cores
| Token   | Hex       | Uso                     |
|---------|-----------|-------------------------|
| creme   | `#f2ede4` | fundo claro             |
| preto   | `#0d0d0d` | texto / "LAW"           |
| vermelho| `#e63012` | destaque / "CODERS"     |

## Arquivos (SVG — vetorial, escala infinita, sem dependência de fonte)
| Arquivo | Uso |
|---------|-----|
| `lockup-light.svg` / `lockup-dark.svg` | logo principal (símbolo + LAWCODERS + tagline), fundo transparente |
| `lockup-light-on-cream.svg` / `lockup-dark-on-black.svg` | mesmos, com fundo sólido |
| `wordmark-light.svg` / `wordmark-dark.svg` | só o nome LAWCODERS |
| `symbol-light.svg` / `symbol-dark.svg` / `symbol-red.svg` | só o símbolo (tile) |
| `avatar-square-red.svg` / `avatar-round-red.svg` | avatar de redes (alto contraste) |
| `favicon.svg` | ícone do site |

## PNGs prontos (`png/`)
- `avatar-square-1024/512.png`, `avatar-round-1024/512.png` — WhatsApp / Discord / Telegram
- `apple-touch-icon.png` (180), `favicon-48/32/16.png`
- `lockup-light-1600.png`, `lockup-dark-1600.png`, `wordmark-light-1200.png`

## Regerar
```bash
python3 generate_logo.py          # gera todos os SVGs
# PNGs: ver comandos rsvg-convert no histórico / regenerar conforme necessário
```
Requer `BarlowCondensed-Black.ttf` e `JetBrainsMono-Medium.ttf` (presentes nesta pasta)
e, para PNG, `rsvg-convert` (`brew install librsvg`).

`contact-sheet.png` = visão geral de todas as variações.
