# Vagas Bot · lawcoders

Feed automático de vagas de **Legal Operations / Legal Tech** (o sub-nicho técnico
do mundo jurídico) para o grupo 💼 **Vagas** da comunidade.

```
coleta (APIs públicas) → filtra (nicho legal ops/tech) → deduplica → formata → posta (uazapi)
```

## Fontes
| Fonte | Como | Observação |
|-------|------|-----------|
| **Jobicy** (`tag=legal`) | API pública grátis | **principal** — única gringa que entrega o nicho. Creditar Jobicy + link de candidatura. |
| RemoteOK | API pública grátis | bônus; filtrado por título. Exige backlink. |
| Himalayas | API pública grátis | bônus; filtrado por título. |

> ⚠️ **Remotive/LinkedIn/Gupy não entram**: Remotive busca na descrição (traz lixo),
> LinkedIn proíbe scraping, Gupy virou API autenticada. Ver §11 do playbook.
>
> 💡 **Maior potencial de volume/relevância (BR):** ler os grupos de WhatsApp de
> legal ops que o Leon já participa (*Legal Ops Jobs*, *CLOC Brasil*) via uazapi.
> Não implementado ainda — ver "Próximos passos".

## Filtro (alta precisão)
Casa **termos compostos no título** (ex.: "legal operations", "legal engineer",
"legal tech", "operações jurídicas", "automação jurídica"). Tags de agregadores são
spam de SEO e são ignoradas. Ver `jobfilter.py`.

## Rodar local (dry-run)
```bash
cd scripts/vagas-bot
pip install -r requirements.txt
python bot.py            # mostra o que postaria, sem postar
python bot.py --max 5    # limita o lote
python bot.py --no-seen  # ignora dedup (teste)
```

## Postar de verdade
Exige uma **instância uazapi com número DEDICADO** (nunca o número pessoal).
Defina as variáveis e `SEND=1`:
```bash
SEND=1 UAZAPI_HOST="https://SEU.uazapi.com" \
       UAZAPI_TOKEN="xxxx" \
       VAGAS_GROUP_JID="120363425645860977@g.us" \
       python bot.py
```

## Automação (GitHub Actions)
`.github/workflows/vagas-bot.yml` roda 9h e 18h (dias úteis).
- Sem secrets → **dry-run** (seguro).
- Para ativar: crie os secrets do repo `UAZAPI_HOST`, `UAZAPI_TOKEN`,
  `VAGAS_GROUP_JID` e dispare com `send=1` (workflow_dispatch) ou ajuste o cron.

## Dedup
`data/seen.json` guarda os IDs já postados (últimos 5000). O workflow commita as
atualizações automaticamente.

## Próximos passos
- [ ] Instância uazapi dedicada (número descartável) — pré-requisito p/ postar
- [ ] Confirmar endpoint de envio do uazapi (`/send/text`) na instância real
- [ ] (opcional) Fonte via grupos de WhatsApp legal ops (uazapi read + extração)
- [ ] (opcional) Resumo de 1 linha por vaga via LLM
