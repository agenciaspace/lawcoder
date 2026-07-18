"""Cliente mínimo do uazapi para postar no grupo de Vagas.

⚠️ Postar em grupo usa biblioteca não-oficial por baixo — use SEMPRE um número
DEDICADO nesta instância, nunca o número pessoal/principal.
"""
from __future__ import annotations
import requests

TIMEOUT = 30


def send_text(host, token, number, text, link_preview=True):
    """POST {host}/send/text — envia texto p/ um número ou JID de grupo (@g.us)."""
    host = host.rstrip("/")
    r = requests.post(
        f"{host}/send/text",
        headers={"token": token, "Content-Type": "application/json"},
        json={"number": number, "text": text, "linkPreview": link_preview},
        timeout=TIMEOUT,
    )
    r.raise_for_status()
    return r.json()
