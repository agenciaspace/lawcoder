#!/usr/bin/env python3
"""Gera os SVGs do logo lawcoders (wordmark vetorizado + simbolo vetorial)."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Offset
import os

HERE = os.path.dirname(os.path.abspath(__file__))

def load(name):
    f = TTFont(os.path.join(HERE, name))
    return f, f["head"].unitsPerEm, f.getBestCmap(), f.getGlyphSet(), f["hmtx"]

FONT, UPM, CMAP, GS, HMTX = load("BarlowCondensed-Black.ttf")
MONO, MUPM, MCMAP, MGS, MHMTX = load("JetBrainsMono-Medium.ttf")

# cores
BLACK = "#0d0d0d"
CREAM = "#f2ede4"
RED = "#e63012"

def word_path(text, tracking_em=0.0, gs=None, cmap=None, hmtx=None, upm=None):
    """Retorna (path_d em unidades de fonte y-up, largura_total)."""
    gs = gs or GS; cmap = cmap or CMAP; hmtx = hmtx or HMTX; upm = upm or UPM
    pen = SVGPathPen(gs)
    x = 0
    track = tracking_em * upm
    for ch in text:
        gname = cmap[ord(ch)]
        tpen = TransformPen(pen, Offset(x, 0))
        gs[gname].draw(tpen)
        x += hmtx[gname][0] + track
    if text:
        x -= track  # sem tracking depois do ultimo glifo
    return pen.getCommands(), x

def tagline_path(text, size, tracking_em=0.16):
    """Tagline em JetBrains Mono Medium, vetorizada. Retorna (group_str, width, cap)."""
    scale = size / MUPM
    d, w = word_path(text, tracking_em, MGS, MCMAP, MHMTX, MUPM)
    cap = MONO["OS/2"].sCapHeight
    grp = (f'<path d="{d}" fill="{{COLOR}}" '
           f'transform="translate(0,{cap*scale:.3f}) scale({scale:.5f},{-scale:.5f})"/>')
    return grp, w * scale, cap * scale

def wordmark_svg_parts(size, tracking=0.06):
    """Constroi paths de LAW (cor1) e CODERS (cor2) lado a lado, ja escalados.
    Retorna (svg_group_str, width_px, cap_height_px)."""
    scale = size / UPM
    law_d, law_w = word_path("LAW", tracking)
    cod_d, cod_w = word_path("CODERS", tracking)
    gap = tracking * UPM  # mesmo tracking entre as palavras (sem espaco)
    # cap height da Barlow Black ~ 0.72 em; usamos OS/2 capHeight se houver
    try:
        cap = FONT["OS/2"].sCapHeight
    except Exception:
        cap = 720
    cap_px = cap * scale
    total_w = (law_w + gap + cod_w) * scale
    # transform: escala e flip Y; baseline em y=cap_px
    def grp(d, dx, color):
        return (f'<path d="{d}" fill="{color}" '
                f'transform="translate({dx:.3f},{cap_px:.3f}) scale({scale:.5f},{-scale:.5f})"/>')
    parts = grp(law_d, 0, "{LAW}") + grp(cod_d, (law_w + gap) * scale, RED)
    return parts, total_w, cap_px

# ---------- SIMBOLO (vetorial puro) ----------
def symbol(tile_fill, border, glyph, cursor, bleed=False, radius=0):
    """SVG inner do simbolo num viewBox 0 0 120 120."""
    s = []
    if bleed:
        s.append(f'<rect x="0" y="0" width="120" height="120" rx="{radius}" fill="{tile_fill}"/>')
    else:
        s.append(f'<rect x="5" y="5" width="110" height="110" fill="{tile_fill}" '
                 f'stroke="{border}" stroke-width="8"/>')
    # chevron ">" como stroke grosso
    s.append(f'<path d="M40 38 L64 60 L40 82" fill="none" stroke="{glyph}" '
             f'stroke-width="12" stroke-linecap="butt" stroke-linejoin="miter"/>')
    # cursor (bloco)
    s.append(f'<rect x="71" y="40" width="13" height="40" fill="{cursor}"/>')
    return "\n  ".join(s)

def svg(viewbox, body, w=None, h=None):
    wh = f' width="{w}" height="{h}"' if w else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{wh}>\n  '
            + body + "\n</svg>\n")

def write(name, content):
    p = os.path.join(HERE, name)
    with open(p, "w") as f:
        f.write(content)
    print("wrote", name)

# ===== SIMBOLOS =====
write("symbol-light.svg", svg("0 0 120 120",
      symbol(CREAM, BLACK, BLACK, RED)))
write("symbol-dark.svg", svg("0 0 120 120",
      symbol(BLACK, CREAM, CREAM, RED)))
write("symbol-red.svg", svg("0 0 120 120",
      symbol(RED, RED, CREAM, CREAM, bleed=True)))
# avatar redondo (circulo) vermelho
write("avatar-round-red.svg", svg("0 0 120 120",
      symbol(RED, RED, CREAM, CREAM, bleed=True, radius=60)))
write("avatar-square-red.svg", svg("0 0 120 120",
      symbol(RED, RED, CREAM, CREAM, bleed=True, radius=14)))
write("favicon.svg", svg("0 0 120 120",
      symbol(RED, RED, CREAM, CREAM, bleed=True, radius=18)))

# ===== WORDMARK (sem tile) =====
def wordmark_file(name, law_color, bg=None):
    size = 100
    parts, w, cap = wordmark_svg_parts(size)
    parts = parts.replace("{LAW}", law_color)
    pad = 12
    W = w + pad * 2
    H = cap + pad * 2
    body = ""
    if bg:
        body += f'<rect x="0" y="0" width="{W:.2f}" height="{H:.2f}" fill="{bg}"/>\n  '
    body += f'<g transform="translate({pad},{pad})">{parts}</g>'
    write(name, svg(f"0 0 {W:.2f} {H:.2f}", body))
    return W, H

wordmark_file("wordmark-light.svg", BLACK)
wordmark_file("wordmark-dark.svg", CREAM)

# ===== LOCKUP HORIZONTAL (simbolo + wordmark + tagline) =====
def lockup(name, tile_fn, law_color, sub_color, bg=None, tagline=True):
    size = 78
    parts, w, cap = wordmark_svg_parts(size)
    parts = parts.replace("{LAW}", law_color)
    sym = 120          # viewBox do simbolo
    sym_draw = 92      # tamanho desenhado
    gap = 26
    pad = 16
    text_x = pad + sym_draw + gap
    block_h = sym_draw
    H = block_h + pad * 2
    sym_y = pad
    if tagline:
        wm_y = pad + (block_h - cap) / 2 - 9   # leve subida p/ caber tagline
        sub_y = wm_y + cap + 20
    else:
        wm_y = pad + (block_h - cap) / 2       # centralizado
    W = text_x + w + pad
    body = ""
    if bg:
        body += f'<rect width="{W:.2f}" height="{H:.2f}" fill="{bg}"/>\n  '
    body += (f'<g transform="translate({pad},{sym_y}) '
             f'scale({sym_draw/sym:.4f})">{tile_fn}</g>\n  ')
    body += f'<g transform="translate({text_x},{wm_y})">{parts}</g>'
    if tagline:
        tag, _, _ = tagline_path("COMUNIDADE · AUTOMAÇÃO JURÍDICA", 13)
        tag = tag.replace("{COLOR}", sub_color)
        body += f'\n  <g transform="translate({text_x+2},{sub_y})">{tag}</g>'
    write(name, svg(f"0 0 {W:.2f} {H:.2f}", body))

lockup("lockup-light.svg", symbol(CREAM, BLACK, BLACK, RED), BLACK, "#777777")
lockup("lockup-dark.svg", symbol(BLACK, CREAM, CREAM, RED), CREAM, "#9a958c")
lockup("lockup-light-on-cream.svg", symbol(CREAM, BLACK, BLACK, RED), BLACK, "#777777", bg=CREAM)
lockup("lockup-dark-on-black.svg", symbol(BLACK, CREAM, CREAM, RED), CREAM, "#9a958c", bg=BLACK)
# compactos p/ header (sem tagline)
lockup("lockup-header-light.svg", symbol(CREAM, BLACK, BLACK, RED), BLACK, "#777777", tagline=False)
lockup("lockup-header-dark.svg", symbol(BLACK, CREAM, CREAM, RED), CREAM, "#9a958c", tagline=False)

# ===== VARIACAO: simbolo com chaves { } =====
def symbol_braces(tile_fill, border, glyph, bleed=False, radius=0):
    s = []
    if bleed:
        s.append(f'<rect x="0" y="0" width="120" height="120" rx="{radius}" fill="{tile_fill}"/>')
    else:
        s.append(f'<rect x="5" y="5" width="110" height="110" fill="{tile_fill}" '
                 f'stroke="{border}" stroke-width="8"/>')
    # chaves desenhadas como path (stroke)
    s.append(f'<path d="M52 36 C42 36 44 54 34 60 C44 66 42 84 52 84" fill="none" '
             f'stroke="{glyph}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>')
    s.append(f'<path d="M68 36 C78 36 76 54 86 60 C76 66 78 84 68 84" fill="none" '
             f'stroke="{glyph}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>')
    s.append(f'<circle cx="60" cy="60" r="6" fill="{glyph}"/>')
    return "\n  ".join(s)

write("alt-symbol-braces-light.svg", svg("0 0 120 120", symbol_braces(CREAM, BLACK, BLACK)))
write("alt-symbol-braces-red.svg", svg("0 0 120 120", symbol_braces(RED, RED, CREAM, bleed=True, radius=14)))

print("done")
