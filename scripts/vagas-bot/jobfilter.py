"""Filtro de NICHO: só vagas de Legal Operations / Legal Tech / Legal Engineering
— o sub-nicho técnico do mundo jurídico (público lawcoders). NÃO é "qualquer vaga
de advogado": é a interseção Direito + tecnologia/operações/dados/produto.

Estratégia: casar TERMOS COMPOSTOS no TÍTULO (alta precisão). Tags de agregadores
são spam de SEO e NÃO são confiáveis — por isso o match é no título.
"""
from __future__ import annotations

# termos compostos de alta precisão (todos já trazem o contexto "legal" embutido)
NICHE_TERMS = [
    # EN — legal ops / legal tech / legal engineering
    "legal operations", "legal ops", "legalops",
    "legal engineer", "legal engineering", "legal technologist",
    "legal technology", "legal tech", "legaltech",
    "legal solutions engineer", "legal solution engineer",
    "legal data", "legal analytics", "legal automation",
    "legal project manager", "legal program manager",
    "legal product", "legal systems", "legal platform",
    "legal knowledge", "legal innovation", "legal design",
    "legal designer", "legal transformation", "legal business partner",
    "contract lifecycle", "contract management system",
    "clm implementation", "legal spend", "legal intake",
    # PT — equivalentes brasileiros
    "operações jurídicas", "operações do jurídico", "operação jurídica",
    "inovação jurídica", "tecnologia jurídica", "engenheiro jurídico",
    "engenharia jurídica", "automação jurídica", "produto jurídico",
    "dados jurídicos", "transformação jurídica", "jurimetria",
]

# termos avulsos que SÓ valem se aparecer "legal"/"jurídic" no mesmo título
WEAK_WITH_LEGAL = ["operations", "ops", "engineer", "technologist", "technology",
                   "analyst", "project manager", "product manager", "data",
                   "automation", "knowledge", "innovation", "design",
                   "operações", "tecnologia", "dados", "produto", "inovação"]
LEGAL_ANCHORS = ["legal", "advogad", "juríd", "jurid", "direito"]


def _title(job):
    return (job.get("title", "") or "").lower()


def is_niche(job):
    t = _title(job)
    if any(term in t for term in NICHE_TERMS):
        return True
    # fallback: título tem âncora jurídica E um termo técnico/ops
    if any(a in t for a in LEGAL_ANCHORS) and any(w in t for w in WEAK_WITH_LEGAL):
        return True
    return False


def filter_legal(jobs):  # nome mantido p/ compatibilidade
    return [j for j in jobs if is_niche(j)]
