# Roteiro de Video-Aula — Módulo 04
## Ferramentas de Linha de Comando
**Duração estimada:** 20-25 minutos
**Público:** Qualquer pessoa da área jurídica
**Tom:** Prático, mostrando instalação e uso real

---

## ABERTURA (0:00 — 1:30)

### O que mostrar na tela
- Terminal aberto
- Título: "Ferramentas de Linha de Comando — Criando por Texto"

### O que falar
"Neste módulo, você vai conhecer ferramentas de linha de comando com IA. A diferença das ferramentas de chat que a gente viu é simples: em vez de conversar, você dá um comando e ela executa direto.

É como a diferença entre mandar mensagens para um estagiário pedindo para ele fazer algo, e simplesmente apontar e dizer 'faça'. Mais direto, mais rápido.""

---

## SEÇÃO 1: As Opções (1:30 — 3:30)

### O que mostrar na tela
- Tabela com as principais CLIs de IA

### O que falar
"As principais opções são: Codex da OpenAI, Kimi CLI, Aider, e Claude Code. Todas fazem mais ou menos a mesma coisa: você digita um comando descrevendo o que quer, e elas criam.

Vou mostrar a instalação do Kimi CLI como exemplo, porque é fácil e tem plano gratuito. Se você preferir outra, o processo é similar.""

---

## SEÇÃO 2: Instalando o Python (3:30 — 6:00)

### O que mostrar na tela
- python.org no navegador
- Download e instalação passo a passo

### O que falar
"A maioria das ferramentas de linha de comando precisa do Python. É uma linguagem de programação, mas você não precisa aprender ela. É só instalar.

Acesse python.org. Clique em Downloads. Baixe a versão mais recente. Clique em instalar. No Windows, marque a opção 'Add Python to PATH' antes de clicar em Install Now. No Mac, é próximo, próximo, concluir.

Para verificar se deu certo, abra o terminal e digite python --version. Deve aparecer o número da versão.""

---

## SEÇÃO 3: Instalando a CLI (6:00 — 10:00)

### O que mostrar na tela
- Terminal aberto
- Comando de instalação sendo digitado

### O que falar
"Agora vamos instalar o Kimi CLI. No terminal, digite:

pip install kimi-cli

Isso vai baixar e instalar a ferramenta. Pode demorar um minutinho.

Agora precisamos configurar a chave de API. A API é como uma senha que conecta a ferramenta à inteligência artificial.

Acesse platform.moonshot.cn. Crie uma conta. Vá em API Keys. Crie uma nova chave. Copie.

Volte no terminal e digite: kimi config set api_key e cole sua chave.

Pronto. A ferramenta está configurada.""

---

## SEÇÃO 4: Primeiro Uso (10:00 — 15:00)

### O que mostrar na tela
- Terminal limpo
- Criação de pasta e execução do comando
- Resultado aparecendo

### O que falar
"Vamos criar algo. No terminal, digite:

mkdir meu-primeiro-app
cd meu-primeiro-app
kimi 'crie um app HTML simples que calcule juros compostos para honorários advocatícios'

[esperar a ferramenta trabalhar]

Ela criou arquivos sozinha. Vamos ver o resultado. Se criou um index.html, abra no navegador.

[mostrar o app funcionando]

Você acabou de criar um app digitando uma frase em português.""

---

## SEÇÃO 5: Padrão Universal (15:00 — 18:00)

### O que mostrar na tela
- Exemplos de comandos diferentes

### O que falar
"Toda CLI de IA funciona assim:

nome-da-ferramenta 'descrição do que você quer'

Exemplos:

kimi 'crie uma página de login em HTML e CSS'
codex 'crie um script que organize arquivos PDF por data'
aider 'adicione uma função de busca neste projeto'

O formato é sempre o mesmo: nome do programa, descrição entre aspas.""

---

## SEÇÃO 6: Alternativa Sem Instalar (18:00 — 20:00)

### O que mostrar na tela
- Cursor ou editor com IA aberto

### O que falar
"Se você não quer instalar nada agora, tudo bem. O Cursor e o Windsurf que você instalou no módulo dois fazem o mesmo trabalho, só que com interface gráfica.

Use o que preferir. O importante é criar.""

---

## FECHAMENTO (20:00 — 25:00)

### O que mostrar na tela
- Recapitulação
- Próximo módulo: Editores de Código com IA

### O que falar
"Hoje você aprendeu que CLIs são ferramentas diretas que criam coisas só com comandos de texto. Instalou o Python, instalou uma CLI, configurou sua chave e criou seu primeiro app por linha de comando.

No próximo módulo, a gente aprofunda nos editores de código com IA. É lá que a magia dos projetos práticos acontece. Te vejo lá.""

---

## CHECKLIST DO ALUNO
- [ ] Python instalado (verificado com python --version)
- [ ] Uma CLI de IA instalada (Kimi, Codex, ou outra)
- [ ] Chave de API configurada
- [ ] Conseguiu criar algo usando apenas um comando de texto
- [ ] Entende o padrão universal: ferramenta + descrição entre aspas
