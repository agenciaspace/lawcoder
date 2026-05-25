# Roteiro de Video-Aula — Módulo 07
## Projeto 2: Seu Primeiro Assistente Automático
**Duração estimada:** 30-35 minutos
**Público:** Qualquer pessoa da área jurídica
**Tom:** Prático, mostrando automação real

---

## ABERTURA (0:00 — 2:00)

### O que mostrar na tela
- Terminal com script rodando
- Título: "Projeto 2 — Assistente Automático de Processos"

### O que falar
"No projeto anterior, criamos um app que você abre e usa. Agora vamos criar algo diferente: um assistente automático. Ele trabalha sozinho. Você coloca arquivos numa pasta, roda o programa, e ele gera um relatório organizado.

É como contratar um estagiário virtual que nunca dorme e nunca erra na organização.""

---

## SEÇÃO 1: O Que Vamos Criar (2:00 — 4:00)

### O que mostrar na tela
- Diagrama simples: pasta entradas → script → pastas saidas e relatorios

### O que falar
"O assistente vai fazer o seguinte: ler arquivos de texto da pasta entradas, extrair informações importantes como partes, valor da causa, prazos, e gerar dois arquivos: um relatório bonito em formato Markdown e um resumo em JSON.

Além disso, ele vai ter um menu simples no terminal para você escolher o que fazer.""

---

## SEÇÃO 2: Criando a Estrutura (4:00 — 6:00)

### O que mostrar na tela
- Terminal aberto
- Comandos sendo digitados

### O que falar
"No terminal, crie a estrutura de pastas:

mkdir assistente-processos
cd assistente-processos
mkdir entradas saidas relatorios

Pronto. Três pastas: entradas para os documentos, saidas para os resumos, relatorios para os relatórios formatados.""

---

## SEÇÃO 3: Abrindo no Editor (6:00 — 7:00)

### O que mostrar na tela
- Cursor → Open Folder → assistente-processos

### O que falar
"Abra a pasta assistente-processos no Cursor ou Windsurf.""

---

## SEÇÃO 4: Criando o Script (7:00 — 15:00)

### O que mostrar na tela
- Chat aberto
- Prompt sendo colado
- IA criando o arquivo analisador.py

### O que falar
"No chat, cole este prompt:

'Crie um script em Python chamado analisador.py que: 1. Leia todos os arquivos .txt da pasta entradas. 2. Para cada arquivo, simule uma análise extraindo informações. 3. Gere um relatório em Markdown na pasta relatorios com nome do arquivo, tipo de documento, partes identificadas, objeto resumido, prazos mencionados, valores financeiros. 4. Crie um resumo geral em saidas/resumo.json com estatísticas. O script deve ter um menu simples no terminal: 1 Analisar novos arquivos, 2 Ver último relatório, 3 Estatísticas gerais, 0 Sair. Adicione comentários em português.'

[esperar]

A IA criou o script. Vamos ver o que ela fez.""

---

## SEÇÃO 5: Criando Arquivos de Teste (15:00 — 18:00)

### O que mostrar na tela
- Criação de arquivo de texto
- Conteúdo fictício de processo

### O que falar
"Agora precisamos de arquivos para testar. Na pasta entradas, crie um arquivo chamado processo-001.txt com este conteúdo fictício:

[mostrar texto na tela]

PROCESSO Nº 0001234-56.2025.8.26.0100
AUTOR: João Silva
RÉU: Empresa ABC Ltda.
OBJETO: Ação de indenização por danos materiais referente a contrato de prestação de serviços não cumprido. Valor da causa: R$ 50.000,00.
PRAZO PARA CONTESTAÇÃO: 15 dias.
Data da intimação: 10/01/2025.

Crie mais um ou dois arquivos com dados diferentes para testar.""

---

## SEÇÃO 6: Rodando o Assistente (18:00 — 24:00)

### O que mostrar na tela
- Terminal dentro da pasta
- Comando python analisador.py
- Menu aparecendo
- Opção 1 selecionada
- Relatório sendo gerado

### O que falar
"No terminal, dentro da pasta do projeto, digite:

python analisador.py

O menu aparece. Escolha a opção 1 para analisar os arquivos.

[mostrar funcionando]

Agora vamos ver os resultados. Na pasta relatorios, abra o arquivo Markdown gerado. Na pasta saidas, abra o resumo.json.

[mostrar conteúdo]

Funcionou. Seu assistente leu documentos e organizou as informações sozinho.""

---

## SEÇÃO 7: Conectando com IA Real (24:00 — 30:00)

### O que mostrar na tela
- Prompt no chat pedindo integração com API
- openai.com/platform

### O que falar
"O assistente atual usa análise simulada. Para usar uma IA real, você precisa de uma chave de API da OpenAI.

Acesse platform.openai.com. Crie uma conta. Vá em API Keys. Crie uma chave. Copie.

Agora peça para a IA no seu editor: 'Substitua a função simulada por uma chamada real à API do OpenAI usando minha chave de API. A função deve enviar o texto do documento e receber um JSON estruturado com as informações extraídas.'

[mostrar ajuste]

Instale a biblioteca: pip install openai

Rode de novo. Agora a análise é feita por uma inteligência artificial real.""

---

## FECHAMENTO (30:00 — 35:00)

### O que mostrar na tela
- Recapitulação
- Ideias de próximos passos

### O que falar
"Você criou um assistente automático. Ele lê documentos, extrai informações e gera relatórios. Com pequenos ajustes, pode rodar toda segunda-feira de manhã e te enviar o resultado por e-mail.

Próximos passos: agende para rodar automaticamente, adicione leitura de PDFs reais, integre com planilhas Google.

No próximo módulo, vamos falar de automações no dia a dia. Te vejo lá.""

---

## CHECKLIST DO ALUNO
- [ ] Estrutura de pastas criada
- [ ] Script analisador.py criado pelo editor com IA
- [ ] Arquivos de teste criados na pasta entradas
- [ ] Script rodou sem erros e gerou relatórios
- [ ] Entendeu como conectar com IA real via API (mesmo que não tenha feito)
