# Playbook da Comunidade lawcoders

Guia de gestão da Comunidade do WhatsApp **lawcoders** — automação para o mundo
jurídico. Comunidade gratuita. Site/app: **lawcoders.app**.

---

## 1. Princípio de organização

Os grupos são separados por **temporalidade + nível de ruído**, não só por tema:

| Eixo | Pergunta que responde | Exemplos |
|------|----------------------|----------|
| **Permanente** (admin-only, quase não muda) | "O que preciso saber SEMPRE?" | Comece aqui |
| **Efêmero / broadcast** (admin-only, rola e some) | "O que é novo HOJE?" | Avisos |
| **Conversa** (todos postam) | "Onde eu troco ideia / pergunto?" | Geral, IA & Prompts, etc. |

Isso elimina a confusão entre "Avisos" e "Comece aqui": um é **feed de notícias**,
o outro é o **README fixo** da comunidade.

---

## 2. Arquitetura dos grupos

| Grupo | Tipo | Quem posta | Ruído | Existe desde |
|-------|------|-----------|-------|--------------|
| 🚀 **Comece aqui** | permanente | só admin | zero | Fase 1 |
| 📢 **Avisos** (nativo da Comunidade) | broadcast | só admin | baixo | Fase 1 (automático) |
| 💬 **Geral / Comunidade** | conversa | todos | alto | Fase 1 |
| 🤖 **IA & Prompts** | conversa | todos | médio | Fase 2 |
| ⚙️ **Automação & Ferramentas** | conversa | todos | médio | Fase 2 |
| 📄 **Petições & Contratos** | conversa | todos | médio | Fase 2 |
| 🆘 **Dúvidas técnicas** | conversa | todos | médio | Fase 2 |
| 💼 **Vagas** | **feed (admin-only / bot)** | bot + admin | baixo | Fase 2/3 |

> **Comece aqui = admin-only com lawcoders.app fixado.** É a vitrine/bio da
> comunidade. Pessoa entra, lê, sabe o que fazer, e vai pros grupos de conversa.
> Não precisa permitir conversa nele — quanto mais limpo, melhor.

> **Vagas = feed automático (admin-only).** Não é grupo de conversa: um bot posta
> vagas jurídicas coletadas automaticamente (ver §11). Mantém limpo, sem
> "alguém viu essa vaga?" no meio. O **networking** (conversa) fica no 💬 Geral —
> não vale criar grupo separado de networking no início (vira grupo morto).

### Avisos vs. Comece aqui (a regra de ouro)
- **Comece aqui** → conteúdo **evergreen**: o app, regras, como começar, links fixos. Muda 1x por mês no máximo.
- **Avisos** → conteúdo **datado**: "live hoje 19h", "post novo no app", "novo material". Some no feed depois.

---

## 3. Mensagens fixadas (pinned) — prontas pra usar

### 🚀 Comece aqui (fixe esta como mensagem única)
```
👋 Bem-vindo(a) à lawcoders — automação para o mundo jurídico.

🔗 Comece pelo nosso hub: https://lawcoders.app

O que fazer agora:
1️⃣ Acesse lawcoders.app e veja os materiais gratuitos
2️⃣ Entre no grupo 💬 Geral e se apresente
3️⃣ Escolha os grupos de assunto que te interessam

📌 Regras: respeito sempre · sem spam ou venda não autorizada ·
compartilhe o que aprender · dúvida técnica vai no grupo 🆘

Você NÃO precisa saber programar. Bora. 🚀
```

### 💬 Geral (pinned)
```
Aqui é bate-papo livre da lawcoders. 🤝
Apresente-se: nome, área de atuação e o que quer automatizar.
Dúvida técnica? Use o grupo 🆘 Dúvidas técnicas.
Regras completas: veja o grupo 🚀 Comece aqui.
```

### 🆘 Dúvidas técnicas (pinned)
```
Antes de perguntar, descreva:
• O que você quer fazer
• Qual ferramenta está usando
• O que aconteceu (print/erro ajuda muito)
Assim a gente responde rápido. 🧩
```

---

## 4. Regras da comunidade (única, vale pra todos)

1. **Respeito** — sem ofensa, preconceito ou ataque pessoal.
2. **Sem spam** — nada de corrente, propaganda ou venda sem autorização do admin.
3. **No assunto** — cada grupo tem um tema; off-topic vai pro 💬 Geral.
4. **Sem captação irregular** — respeite o Código de Ética da OAB (Provimento 205/2021 sobre publicidade).
5. **Compartilhe** — quem aprende, ensina. Conteúdo > autopromoção.
6. **Privacidade** — não compartilhe dados de clientes/processos sigilosos.

> Fixe um resumo dessas regras no "Comece aqui" e deixe a versão completa no app.

---

## 5. Moderação & admins

- **Comece com 2–3 admins** (você + 1 ou 2 de confiança). Comunidade sem moderação vira spam.
- Defina um **admin "de plantão" por semana** pra responder dúvidas e dar boas-vindas.
- **Ferramentas do WhatsApp:** ative "aprovar novos participantes" e, se precisar, "só admins enviam mensagens" em grupos que estiverem fora de controle.
- **3 strikes:** aviso privado → aviso no grupo → remoção. Documente quem foi removido e por quê.
- **Boas-vindas:** mensagem automática? O WhatsApp não tem nativo robusto — combine os admins pra dar um 👋 manual aos novos (ou use a fixada do "Comece aqui").

---

## 6. Cadência de conteúdo (pra comunidade não morrer)

Comunidade nova morre por **silêncio**, não por excesso. Mantenha um ritmo mínimo:

| Frequência | Onde | O quê |
|-----------|------|-------|
| Diário | 💬 Geral | uma pergunta/provocação ("o que você automatizou hoje?") |
| 2–3x/semana | grupos de assunto | 1 prompt pronto, 1 ferramenta, 1 dica |
| Semanal | 📢 Avisos | resumo da semana + novidade do lawcoders.app |
| Quinzenal | 📢 Avisos | live / call aberta / convidado |

> **Banco de conteúdo:** mantenha uma lista de 20–30 posts prontos (prompts, dicas)
> pra nunca ficar sem o que postar nos primeiros meses.

---

## 7. Crescimento

- **1 link de convite da Comunidade** (não dos grupos individuais) → coloque em: lawcoders.app, bio do Instagram/LinkedIn, rodapé do site lawcoder.com.br, assinatura de e-mail.
- **CTA no site:** botão "Entrar na comunidade gratuita" no lawcoder.com.br e no lawcoders.app.
- **Conteúdo isca:** ofereça algo no app (ex.: "10 prompts jurídicos") em troca da entrada.
- **Indicação:** peça pros membros ativos convidarem 1 colega. Comunidade cresce por boca-a-boca.

---

## 8. Quando criar um grupo novo (sinais)

Não crie por antecipação. Divida quando:
- ✅ Um assunto **toma conta** do 💬 Geral por vários dias
- ✅ O 💬 Geral passa de ~150–200 msgs/dia e fica difícil acompanhar
- ✅ Várias pessoas pedem um espaço específico

Não crie se:
- ❌ Você "acha que vai precisar" (grupo vazio afasta gente)
- ❌ É variação fina de um grupo que já existe

---

## 9. Roadmap por fases

**Fase 1 — Lançamento (0 → ~200 membros)**
`🚀 Comece aqui` · `📢 Avisos` · `💬 Geral`
Foco: dar as boas-vindas, manter conversa viva, fixar o lawcoders.app.

**Fase 2 — Organização (~200 → ~1.000)**
Adicione `🤖 IA & Prompts`, `⚙️ Automação`, `📄 Petições`, `🆘 Dúvidas`.
Lance `💼 Vagas` já como feed semi-automático (§11, opção B).
Foco: mover conteúdo do Geral pros grupos certos; recrutar moderadores.

**Fase 3 — Maturidade (1.000+)**
Evolua o `💼 Vagas` p/ bot 100% automático (§11, opção A) e, se houver demanda,
grupos por **perfil** (autônomo / escritório / in-house). Eventos recorrentes.

---

## 10. Métricas simples (acompanhe semanal)

- Nº de membros (e crescimento/semana)
- Nº de mensagens/dia no Geral (saúde do engajamento)
- Nº de novos que se apresentam (onboarding funcionando?)
- Cliques no link do lawcoders.app (conversão pro app)

---

## 11. Automação do feed de Vagas (jobs bot)

O grupo 💼 **Vagas** é um feed automático: um bot coleta vagas jurídicas e posta no
grupo (admin-only). É também a vitrine viva da comunidade ("a gente automatiza isso").

### ⚠️ A restrição mais importante (ler antes de tudo)
**Postar em GRUPO do WhatsApp não é suportado pela API oficial.** A WhatsApp Cloud API
(oficial) só envia mensagens 1:1 / template — **não posta em grupos**. As opções reais:

| Opção | Como funciona | Risco |
|-------|--------------|-------|
| **A. Biblioteca não-oficial** (whatsapp-web.js / Baileys) | um número "robô" linkado como dispositivo, admin do grupo, posta via automação | viola ToS do WhatsApp → risco de **ban do número**. Use número dedicado, volume baixo, cara de humano. |
| **B. Semi-manual (recomendado p/ começar)** | bot monta a mensagem pronta e envia pra você (DM/Telegram/e-mail); você cola no grupo 1x/dia | zero risco, 30s de trabalho/dia |
| **C. Telegram espelho** | feed 100% automático num canal Telegram + link fixado no WhatsApp | zero risco, mas tira do WhatsApp |

> **Recomendação:** comece na **opção B** (curadoria assistida). Quando o volume justificar,
> migre pra **A** com um número descartável e dedicado. Nunca automatize no SEU número pessoal.

### Arquitetura do pipeline
```
[fontes] → fetch → filtrar (jurídico + relevante) → deduplicar → formatar → publicar
                                                        (store de IDs já vistos)
```

1. **Fontes** (priorize as que permitem coleta legal):
   - APIs/RSS oficiais quando existirem (melhor)
   - Agregadores: Gupy, Solides, Vagas.com, Trampos, Indeed (checar ToS de cada)
   - ⚠️ LinkedIn: ToS proíbe scraping + tem antibot forte → **evitar** ou usar via parceria/API
   - Sites de carreira de grandes escritórios (páginas públicas)
2. **Filtro**: termos jurídicos (advogado, jurídico, paralegal, compliance, contratos…)
   + opcional: priorizar vagas com viés de tecnologia/automação (legal ops, legal tech).
   Um LLM pode classificar relevância e gerar um resumo de 1 linha.
3. **Dedup**: guarde um hash/ID de cada vaga já postada (arquivo/DB) pra não repetir.
4. **Formato da mensagem** (padrão):
   ```
   💼 [Cargo] — [Empresa]
   📍 [Local / Remoto]  ·  [Senioridade]
   📝 [resumo de 1 linha]
   🔗 [link]
   #vagas #juridico
   ```
5. **Agendamento**: cron 1–2x/dia (ex.: 9h e 17h). Lote pequeno (5–10 vagas) pra não floodar.

### MVP sugerido (Fase 2)
- 1 ou 2 fontes confiáveis + filtro por palavra-chave + dedup em arquivo JSON
- Saída na **opção B** (te manda o lote formatado por DM/Telegram)
- Roda via cron (GitHub Actions / Vercel Cron / máquina local)
- Stack natural aqui: Node ou Python; postar via Baileys/whatsapp-web.js só na evolução

> Esse bot é conteúdo de marketing por si só: documente "como construímos o bot de
> vagas" e use no grupo ⚙️ Automação e no lawcoders.app.

---

## Ativos visuais

Ícones de cada grupo: `site/assets/logo/png/group-<nome>-1024.png`
(ver `site/assets/logo/README.md`). Foto da Comunidade: `avatar-square-1024.png`.
