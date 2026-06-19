"""Fontes de vagas (APIs públicas gratuitas). Cada fonte devolve uma lista de
dicts normalizados: {id, title, company, location, url, source, salary, tags}.

Todas as fontes exigem ATRIBUIÇÃO — por isso `source` e `url` sempre vão na
mensagem final (ver bot.py). Respeite os ToS de cada API.
"""
from __future__ import annotations
import requests

TIMEOUT = 25
UA = "lawcoders-vagas-bot/1.0 (+https://lawcoders.app)"


def _get(url, params=None, headers=None):
    h = {"User-Agent": UA, "Accept": "application/json"}
    if headers:
        h.update(headers)
    r = requests.get(url, params=params, headers=h, timeout=TIMEOUT)
    r.raise_for_status()
    return r.json()


def _norm(id, title, company, location, url, source, salary="", tags=None):
    return {
        "id": f"{source}:{id}",
        "title": (title or "").strip(),
        "company": (company or "").strip() or "Empresa não informada",
        "location": (location or "").strip() or "Remoto",
        "url": url or "",
        "source": source,
        "salary": (salary or "").strip(),
        "tags": tags or [],
    }


def remotive(query="legal"):
    """https://remotive.com/api/remote-jobs — atribuição obrigatória."""
    data = _get("https://remotive.com/api/remote-jobs", {"search": query})
    out = []
    for j in data.get("jobs", []):
        out.append(_norm(
            j.get("id"), j.get("title"), j.get("company_name"),
            j.get("candidate_required_location"), j.get("url"), "Remotive",
            j.get("salary", ""), j.get("tags", []),
        ))
    return out


def jobicy(tag="legal", count=50):
    """https://jobicy.com/api — creditar Jobicy e redirecionar p/ aplicar."""
    data = _get("https://jobicy.com/api/v2/remote-jobs",
                {"count": count, "tag": tag})
    out = []
    for j in data.get("jobs", []):
        out.append(_norm(
            j.get("id"), j.get("jobTitle"), j.get("companyName"),
            j.get("jobGeo"), j.get("url"), "Jobicy",
            "", j.get("jobIndustry", []),
        ))
    return out


def remoteok():
    """https://remoteok.com/api — exige backlink p/ Remote OK."""
    data = _get("https://remoteok.com/api")
    out = []
    for j in data:
        if not isinstance(j, dict) or not j.get("id"):
            continue  # primeiro item é aviso legal
        out.append(_norm(
            j.get("id"), j.get("position") or j.get("title"), j.get("company"),
            j.get("location"), j.get("url"), "RemoteOK",
            j.get("salary", ""), j.get("tags", []),
        ))
    return out


def himalayas(limit=100):
    """https://himalayas.app/jobs/api — vagas remotas globais."""
    data = _get("https://himalayas.app/jobs/api", {"limit": limit})
    out = []
    for j in data.get("jobs", []):
        locs = j.get("locationRestrictions") or []
        out.append(_norm(
            j.get("guid") or j.get("title"), j.get("title"),
            j.get("companyName"), ", ".join(locs) if locs else "Remoto",
            j.get("applicationLink") or j.get("url"), "Himalayas",
            "", j.get("categories", []),
        ))
    return out


# registro de fontes ativas no MVP.
# Jobicy (tag=legal) é a ÚNICA fonte gringa que entrega o nicho legal ops/tech de
# forma confiável. RemoteOK/Himalayas ficam como bônus de custo zero (filtrados por
# título downstream) — raramente trazem algo, mas quando trazem é relevante.
# Remotive foi removida: seu `search` casa na descrição e traz títulos irrelevantes.
SOURCES = {
    "jobicy": lambda: jobicy("legal", count=50),
    "remoteok": remoteok,
    "himalayas": lambda: himalayas(100),
}


def fetch_all(only=None):
    """Roda todas as fontes (ou um subconjunto). Tolera falha de fonte isolada."""
    jobs, errors = [], {}
    for name, fn in SOURCES.items():
        if only and name not in only:
            continue
        try:
            got = fn()
            jobs.extend(got)
        except Exception as e:  # uma fonte fora do ar não derruba o lote
            errors[name] = str(e)
    return jobs, errors
