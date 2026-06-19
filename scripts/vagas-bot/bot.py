#!/usr/bin/env python3
"""Bot de Vagas da comunidade lawcoders.

Fluxo: coleta (fontes) -> filtra (jurídico) -> deduplica -> formata -> publica.

Por padrão roda em DRY-RUN (só imprime, não posta). Para postar de verdade,
defina SEND=1 e as variáveis UAZAPI_HOST / UAZAPI_TOKEN / VAGAS_GROUP_JID.

Uso:
  python bot.py                 # dry-run, mostra o que postaria
  python bot.py --max 8         # limita a 8 vagas no lote
  SEND=1 python bot.py          # posta de verdade (exige envs uazapi)
"""
from __future__ import annotations
import argparse
import json
import os
import sys
from pathlib import Path

import sources
import jobfilter
import uazapi

HERE = Path(__file__).parent
SEEN_FILE = HERE / "data" / "seen.json"
MAX_PER_RUN = 8


def load_seen():
    if SEEN_FILE.exists():
        return set(json.loads(SEEN_FILE.read_text()))
    return set()


def save_seen(seen):
    SEEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    # mantém só os últimos 5000 ids p/ não crescer infinito
    SEEN_FILE.write_text(json.dumps(sorted(seen)[-5000:], ensure_ascii=False, indent=0))


def format_job(j):
    lines = [f"💼 *{j['title']}* — {j['company']}"]
    geo = j["location"]
    sal = f"  ·  💰 {j['salary']}" if j.get("salary") else ""
    lines.append(f"🌎 {geo}  ·  🔎 {j['source']}{sal}")
    lines.append(f"🔗 {j['url']}")
    return "\n".join(lines)


def build_message(batch):
    header = "💼 *Vagas — Legal Ops & Legal Tech* (remoto/internacional)\n"
    body = "\n\n".join(format_job(j) for j in batch)
    # rodapé com atribuição dinâmica (só as fontes presentes no lote)
    srcs = []
    for j in batch:
        if j["source"] not in srcs:
            srcs.append(j["source"])
    footer = (f"\n\n———\n_Fontes: {' · '.join(srcs)}._ "
              "_Candidate-se sempre no link oficial._ #vagas #legalops #legaltech")
    return header + "\n" + body + footer


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=MAX_PER_RUN)
    ap.add_argument("--only", nargs="*", help="rodar só estas fontes")
    ap.add_argument("--no-seen", action="store_true", help="ignora dedup (teste)")
    args = ap.parse_args()

    jobs, errors = sources.fetch_all(only=args.only)
    for name, err in errors.items():
        print(f"[aviso] fonte '{name}' falhou: {err}", file=sys.stderr)

    legal = jobfilter.filter_legal(jobs)
    print(f"coletadas: {len(jobs)} | jurídicas: {len(legal)}", file=sys.stderr)

    seen = set() if args.no_seen else load_seen()
    fresh, fresh_ids = [], []
    for j in legal:
        if j["id"] in seen or j["id"] in fresh_ids:
            continue
        fresh.append(j)
        fresh_ids.append(j["id"])

    batch = fresh[: args.max]
    if not batch:
        print("nada novo pra postar.", file=sys.stderr)
        return

    msg = build_message(batch)
    send = os.environ.get("SEND") == "1"

    if not send:
        print("\n===== DRY-RUN (não postado) =====\n")
        print(msg)
        print(f"\n[dry-run] {len(batch)} vagas novas (de {len(fresh)} disponíveis). "
              f"Defina SEND=1 + envs uazapi p/ postar.", file=sys.stderr)
        return

    host = os.environ["UAZAPI_HOST"]
    token = os.environ["UAZAPI_TOKEN"]
    group = os.environ["VAGAS_GROUP_JID"]
    resp = uazapi.send_text(host, token, group, msg)
    print(f"[ok] postado no grupo {group}: {resp.get('id', resp)}", file=sys.stderr)

    # só marca como visto após postar com sucesso
    seen.update(fresh_ids[: args.max])
    save_seen(seen)


if __name__ == "__main__":
    main()
