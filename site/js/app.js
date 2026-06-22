/* ========================================
   IA Prática para Advogados — Curso Completo
   ======================================== */

/* ===== Brand Logos (Simple Icons CDN) ===== */
const TOOL_LOGOS = {
    anthropic: 'https://cdn.simpleicons.org/anthropic/e63012',
    openai:    'https://cdn.simpleicons.org/openai/0d0d0d',
    google:    'https://cdn.simpleicons.org/google/0d0d0d',
    gemini:    'https://cdn.simpleicons.org/googlegemini/e63012',
    codeium:   'https://cdn.simpleicons.org/codeium/0d0d0d',
    github:    'https://cdn.simpleicons.org/github/0d0d0d',
    python:    'https://cdn.simpleicons.org/python/0d0d0d',
    n8n:       'https://cdn.simpleicons.org/n8n/e63012',
    make:      'https://cdn.simpleicons.org/make/0d0d0d',
    zapier:    'https://cdn.simpleicons.org/zapier/e63012',
    netlify:   'https://cdn.simpleicons.org/netlify/0d0d0d',
    vercel:    'https://cdn.simpleicons.org/vercel/0d0d0d',
    microsoft: 'https://cdn.simpleicons.org/microsoft/0d0d0d',
};

/* ===== Module Screenshots — real images from company CDNs =====
   Index 0 is the inaugural lesson poster; indexes 1..N map to modules 01..N. */
const MODULE_SCREENSHOTS = [
    'https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/misc/asset-6f4f4348d1d7da2ab88b.jpg',
    'https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/misc/asset-6f4f4348d1d7da2ab88b.jpg',
    'https://windsurf.com/static/images/windsurf/feature-cascade.png',
    'https://windsurf.com/static/images/windsurf/feature-command-terminal.png',
    'https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/misc/asset-3cb319c263fd5a76115b.png',
    'https://windsurf.com/static/images/windsurf/feature-codelenses.png',
    'https://windsurf.com/static/images/windsurf/linter-integration.png',
    'https://windsurf.com/static/images/windsurf/feature-supercomplete.png',
    'https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-screenshot.png',
    'https://windsurf.com/static/images/windsurf/feature-mcp.png',
    'https://windsurf.com/static/images/windsurf/feature-code-highlight.png',
];

/* ===== UI Strings (PT / EN) ===== */
const uiStrings = {
    pt: {
        navCourse: '// curso',
        navResources: '// recursos',
        progressLabel: 'Progresso',
        progressModules: (d, t) => `${d} de ${t} módulos concluídos`,
        prevBtn: '← Anterior',
        nextBtn: 'Próximo →',
        finishBtn: '_concluir ✓',
        celebration: '🎉 Parabéns! Você concluiu o curso IA Prática para Advogados!',
        moduleLabel: 'Módulo',
        inauguralLabel: 'Aula Inaugural',
        copyBtn: '_copiar',
        copiedBtn: '_copiado!',
        resources: [
            { action: 'cheatsheet', label: '_guia_rápido' },
            { action: 'glossary',   label: '_glossário' },
            { action: 'links',      label: '_links_úteis' },
        ],
    },
    en: {
        navCourse: '// course',
        navResources: '// resources',
        progressLabel: 'Progress',
        progressModules: (d, t) => `${d} of ${t} modules completed`,
        prevBtn: '← Previous',
        nextBtn: 'Next →',
        finishBtn: '_finish ✓',
        celebration: '🎉 Congratulations! You completed the AI in Practice for Lawyers course!',
        moduleLabel: 'Module',
        inauguralLabel: 'Opening Lesson',
        copyBtn: '_copy',
        copiedBtn: '_copied!',
        resources: [
            { action: 'cheatsheet', label: '_quick_guide' },
            { action: 'glossary',   label: '_glossary' },
            { action: 'links',      label: '_useful_links' },
        ],
    },
};

/* ===== PT Course Data ===== */
const courseDataPT = {
    modules: [
        {
            id: "mod00",
            title: "Panorama das Ferramentas de IA",
            subtitle: "O mapa completo: web, desktop, IDEs e terminal",
            duration: "35 min",
            type: "inaugural",
            content: `
                <h1>Panorama das Ferramentas<em>de Inteligência Artificial</em></h1>
                <p>Antes de colocar a mão na massa, vamos sobrevoar <strong>todo o cenário</strong> das ferramentas de IA que existem hoje — do navegador ao terminal. Esta é a <strong>aula inaugural</strong> do curso: o vídeo mais longo, pensado para te dar o mapa completo antes de descermos ao detalhe.</p>
                <div class="video-placeholder featured">
                    <button class="play-btn">▶</button>
                    <h3>Aula Inaugural — Vídeo Completo</h3>
                    <p>Tour guiado por todas as categorias de ferramentas de IA</p>
                </div>

                <div class="info-box">
                    <p><strong>Como assistir:</strong> não precisa instalar nada agora. O objetivo aqui é entender o <strong>mapa geral</strong>. Nos próximos módulos a gente desce ao detalhe e coloca cada ferramenta para funcionar.</p>
                </div>

                <h2>As 4 Famílias de Ferramentas</h2>
                <p>Tudo o que existe hoje cabe, na prática, em quatro grandes famílias. Você vai conhecer todas neste vídeo:</p>

                <div class="card"><h3>1. Ferramentas Web / GUI (no navegador)</h3><p>Você abre um site, conversa e copia o resultado. É o ponto de entrada de todo mundo: <strong>ChatGPT</strong> (OpenAI), <strong>Claude.ai</strong> (Anthropic), <strong data-logo-inject="gemini">Google Gemini</strong> e o <strong>Microsoft Copilot</strong>. Zero instalação, zero configuração.</p></div>
                <div class="card"><h3>2. Apps de Desktop com Superpoderes</h3><p>Os mesmos assistentes, mas instalados no seu computador e com permissão para <strong>ler arquivos, abrir programas e criar projetos</strong>: <strong data-logo-inject="anthropic">Claude Desktop</strong> e <strong data-logo-inject="openai">ChatGPT Desktop</strong>. A ponte entre o chat e a sua máquina.</p></div>
                <div class="card"><h3>3. Editores e IDEs com IA (exclusivos para desenvolvimento)</h3><p>Programas feitos para criar software, com a IA integrada ao código: <strong>Cursor</strong>, <strong data-logo-inject="codeium">Windsurf</strong>, <strong data-logo-inject="github">VS Code + GitHub Copilot</strong> e as ferramentas do <strong data-logo-inject="google">Google</strong> voltadas só para desenvolvimento — o <strong>Firebase Studio</strong> (antigo Project IDX), o <strong>Antigravity</strong> e o <strong>Gemini Code Assist</strong>.</p></div>
                <div class="card"><h3>4. Ferramentas de Linha de Comando (CLIs agênticas)</h3><p>Agentes que trabalham pelo terminal e executam tarefas de ponta a ponta: <strong data-logo-inject="anthropic">Claude Code</strong> (Anthropic), <strong data-logo-inject="openai">Codex</strong> (os modelos GPT Codex da OpenAI), <strong data-logo-inject="gemini">Gemini CLI</strong> (Google) e alternativas como Aider e Kimi CLI.</p></div>

                <h2>Web, Desktop, IDE ou Terminal — Quando Usar Cada Um</h2>
                <table>
                    <tr><th>Família</th><th>Melhor para</th><th>Exemplos</th></tr>
                    <tr><td>Web / GUI</td><td>Tirar dúvidas, redigir e revisar textos, primeiros testes</td><td>ChatGPT, Claude.ai, Gemini</td></tr>
                    <tr><td>Desktop</td><td>Conversar usando seus próprios arquivos e programas</td><td>Claude Desktop, ChatGPT Desktop</td></tr>
                    <tr><td>IDE com IA</td><td>Criar apps e sistemas com acompanhamento visual</td><td>Cursor, Windsurf, Firebase Studio, Antigravity</td></tr>
                    <tr><td>CLI agêntica</td><td>Automatizar tarefas inteiras e projetos completos</td><td>Claude Code, Codex, Gemini CLI</td></tr>
                </table>

                <h2>Os Modelos por Trás das Ferramentas</h2>
                <p>Toda ferramenta acima é só a "casca". O cérebro são os <strong>modelos de IA</strong>. Vale conhecer os principais:</p>
                <ul>
                    <li><strong data-logo-inject="anthropic">Claude</strong> (Anthropic) — referência em programação e raciocínio longo. É o que move o Claude Code.</li>
                    <li><strong data-logo-inject="openai">GPT e os modelos Codex</strong> (OpenAI) — especializados em escrever e executar código, por trás do Codex.</li>
                    <li><strong data-logo-inject="gemini">Gemini</strong> (Google) — multimodal e integrado ao ecossistema Google, move o Antigravity e o Gemini CLI.</li>
                </ul>
                <div class="info-box"><p><strong>Ideia-chave:</strong> a ferramenta é a interface; o modelo é a inteligência. Trocar de modelo é como trocar o motor de um carro — a direção continua a mesma.</p></div>

                <h2>O Que Vem Depois Desta Aula</h2>
                <p>Nos próximos 10 módulos, você sai do panorama e vai para a prática: instala sua primeira ferramenta, perde o medo do terminal, cria dois projetos reais e aprende a usar tudo isso com segurança e respeito à LGPD.</p>
                <div class="success-box"><p><strong>Guarde este mapa.</strong> Sempre que aparecer uma ferramenta nova — e aparece toda semana — ela vai cair em uma destas quatro famílias. Você nunca mais vai se sentir perdido no meio de tanta novidade.</p></div>
            `
        },
        {
            id: "mod01",
            title: "O Que São Assistentes Inteligentes",
            subtitle: "E por que você precisa deles agora",
            duration: "15 min",
            type: "intro",
            content: `
                <div class="hero">
                    <h1>IA Prática para<em>Advogados</em></h1>
                    <p>Como qualquer pessoa que trabalha com direito pode usar ferramentas de IA para criar apps, automatizar tarefas e resolver problemas — sem saber programar.</p>
                    <div class="hero-stats">
                        <div class="hero-stat"><span class="number">10</span><span class="label">Módulos</span></div>
                        <div class="hero-stat"><span class="number">2</span><span class="label">Projetos Práticos</span></div>
                        <div class="hero-stat"><span class="number">0</span><span class="label">Experiência em Código</span></div>
                    </div>
                </div>

                <h2>O Que Você Vai Aprender</h2>
                <p>Este curso é para <strong>qualquer pessoa que trabalha na área jurídica</strong>: advogados, estagiários, secretários, assistentes, gestores de escritório, departamentos jurídicos de empresas. Você não precisa saber nada de programação.</p>
                <p>Você vai aprender a usar ferramentas que <strong>criam coisas para você</strong>:</p>
                <ul>
                    <li><strong>Aplicativos</strong> para calcular prazos, gerar documentos, organizar processos</li>
                    <li><strong>Assistentes automáticos</strong> que trabalham sozinhos enquanto você faz outra coisa</li>
                    <li><strong>Automações</strong> para eliminar tarefas repetitivas do seu dia</li>
                </ul>

                <h2>O Que Mudou em 2025</h2>
                <p>Até pouco tempo atrás, criar um app ou automatizar uma tarefa exigia contratar um programador. Hoje, existem ferramentas onde você <strong>descreve o que quer em português</strong> e elas criam sozinhas.</p>
                <div class="info-box">
                    <p><strong>Pense assim:</strong> antes, você ditava para um estagiário e ele escrevia a petição. Agora, você descreve para uma ferramenta de IA e ela <strong>cria um app inteiro</strong> que faz o trabalho automaticamente.</p>
                </div>

                <h2>Três Tipos de Ferramentas Que Você Vai Conhecer</h2>
                <div class="card"><h3>1. Ferramentas de Chat com Superpoderes</h3><p>Como o Claude Desktop, o ChatGPT ou o Gemini. Você conversa, mas elas podem <strong>usar programas no seu computador</strong>, ler arquivos, navegar na internet e criar projetos completos.</p></div>
                <div class="card"><h3>2. Editores de Código com IA</h3><p>Programas como o <strong>Cursor</strong>, <strong>Windsurf</strong> ou o VS Code com GitHub Copilot. Eles são como um Word, mas para criar apps. A IA escreve o código enquanto você dita o que quer.</p></div>
                <div class="card"><h3>3. Ferramentas de Linha de Comando</h3><p>Programas que você usa digitando no terminal. Parece assustador, mas é só um <strong>chat de texto mais direto</strong>. Você digita um comando e a ferramenta cria ou faz algo.</p></div>

                <h2>Por Que a Área Jurídica Precisa Disso</h2>
                <ul>
                    <li><strong>Prazos processuais:</strong> calculados automaticamente por um app que você criou</li>
                    <li><strong>Documentos repetitivos:</strong> gerados em segundos com seus modelos personalizados</li>
                    <li><strong>Pesquisa jurisprudencial:</strong> organizada e resumida automaticamente</li>
                    <li><strong>Controle de processos:</strong> um sistema seu, do jeito que você quer</li>
                    <li><strong>Tarefas administrativas:</strong> eliminadas com automações simples</li>
                </ul>
                <div class="success-box">
                    <p><strong>Você não vai virar programador.</strong> Você vai virar alguém que sabe usar ferramentas inteligentes para criar soluções próprias. É como saber usar Excel avançado — só que para criar apps.</p>
                </div>
            `
        },
        {
            id: "mod02",
            title: "Setup Rápido: Sua Primeira Ferramenta",
            subtitle: "De zero a funcionando em 15 minutos",
            duration: "20 min",
            type: "setup",
            content: `
                <h1>Setup Rápido: Sua Primeira<em>Ferramenta</em></h1>
                <p>Vamos instalar e configurar sua primeira ferramenta de IA. Você vai escolher uma das opções abaixo e ter ela funcionando em poucos minutos.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Instalação passo a passo da ferramenta escolhida</p>
                </div>

                <h2>Escolha Sua Primeira Ferramenta</h2>
                <p>Não precisa instalar tudo agora. Escolha <strong>uma</strong> das opções abaixo.</p>
                <div class="tabs">
                    <button class="tab-btn active" data-tab="claude" data-logo="anthropic">Claude Desktop</button>
                    <button class="tab-btn" data-tab="cursor">Cursor</button>
                    <button class="tab-btn" data-tab="windsurf" data-logo="codeium">Windsurf</button>
                </div>

                <div class="tab-panel active" id="tab-claude">
                    <h3>Claude Desktop (Anthropic)</h3>
                    <p>O Claude Desktop é um aplicativo de chat que pode abrir programas, ler arquivos e criar projetos no seu computador.</p>
                    <div class="steps">
                        <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Crie sua conta</h4><p>Acesse <code>claude.ai</code> e clique em "Sign Up". Use seu e-mail ou conta do Google.</p></div></div>
                        <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Baixe o aplicativo</h4><p>No mesmo site, procure por "Download for Desktop" e instale como qualquer outro programa.</p></div></div>
                        <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Faça login e teste</h4><p>Digite: "Crie um arquivo chamado teste.txt na minha área de trabalho com a frase 'Olá, mundo jurídico'".</p></div></div>
                    </div>
                </div>

                <div class="tab-panel" id="tab-cursor">
                    <h3>Cursor</h3>
                    <p>Editor de código com IA muito poderoso. Gratuito para uso básico.</p>
                    <div class="steps">
                        <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Baixe o Cursor</h4><p>Acesse <code>cursor.com</code> e instale no seu computador.</p></div></div>
                        <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Crie conta ou use GitHub</h4><p>Faça login com sua conta Cursor ou GitHub.</p></div></div>
                        <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Primeiro projeto</h4><p>Clique em "New Project" e no chat digite: "Crie um app simples de cálculo de prazos processuais em HTML".</p></div></div>
                    </div>
                </div>

                <div class="tab-panel" id="tab-windsurf">
                    <h3>Windsurf (Codeium)</h3>
                    <p>Editor similar ao Cursor, com interface muito amigável para iniciantes.</p>
                    <div class="steps">
                        <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Baixe o Windsurf</h4><p>Acesse <code>codeium.com/windsurf</code> e baixe para seu sistema.</p></div></div>
                        <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Login</h4><p>Crie uma conta Codeium ou use login com Google/GitHub.</p></div></div>
                        <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Primeiro comando</h4><p>Use <code>Ctrl + I</code> para abrir o chat e peça: "Crie um app de contagem de dias úteis para prazos processuais".</p></div></div>
                    </div>
                </div>

                <h2>Checklist de Instalação</h2>
                <ul class="checklist">
                    <li>Conta criada na ferramenta escolhida</li>
                    <li>Aplicativo instalado e aberto</li>
                    <li>Primeiro teste funcionando</li>
                    <li>Explorada a interface por 5 minutos</li>
                </ul>
                <div class="warning-box"><p><strong>Dica importante:</strong> Não se preocupe em entender tudo agora. O objetivo é ter a ferramenta aberta e funcionando.</p></div>
            `
        },
        {
            id: "mod03",
            title: "O Terminal É Só Um Chat de Texto",
            subtitle: "Perdendo o medo da linha de comando",
            duration: "15 min",
            type: "concept",
            content: `
                <h1>O Terminal É Só Um<em>Chat de Texto</em></h1>
                <p>O terminal assusta muita gente. Mas pense nele como um <strong>WhatsApp com seu computador</strong>: você digita algo, ele responde.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Abrindo o terminal e usando os primeiros comandos</p>
                </div>

                <h2>Como Abrir o Terminal</h2>
                <table>
                    <tr><th>Sistema</th><th>Como abrir</th></tr>
                    <tr><td>Windows</td><td>Aperte <code>Windows + R</code>, digite <code>cmd</code> e Enter. Ou procure "Terminal" no menu Iniciar.</td></tr>
                    <tr><td>Mac</td><td>Aperte <code>Cmd + Espaço</code>, digite <code>Terminal</code> e Enter.</td></tr>
                </table>

                <h2>5 Comandos Que Você Precisa Saber</h2>
                <div class="code-block">
                    <div class="code-header"><span>Comandos Essenciais</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                    <pre><code># Ver onde você está
pwd

# Ver o que tem na pasta
ls        # Mac/Linux
dir       # Windows

# Entrar numa pasta
cd nome-da-pasta

# Voltar uma pasta
cd ..

# Criar uma pasta
mkdir nome-da-pasta</code></pre>
                </div>

                <div class="info-box"><p><strong>Analogia simples:</strong> usar o terminal é como mandar mensagens para um funcionário muito obediente. Você dá comandos curtos e ele executa imediatamente.</p></div>

                <h2>Pratique Agora</h2>
                <ol>
                    <li>Abra o terminal</li>
                    <li>Digite <code>pwd</code> para ver onde está</li>
                    <li>Digite <code>ls</code> ou <code>dir</code></li>
                    <li>Digite <code>mkdir meu-primeiro-projeto</code></li>
                    <li>Digite <code>cd meu-primeiro-projeto</code></li>
                    <li>Digite <code>cd ..</code> para voltar</li>
                </ol>
                <div class="success-box"><p><strong>Parabéns!</strong> Esses 5 comandos são 90% do que você vai precisar. O resto você pode pedir para a IA te ensinar no momento.</p></div>
            `
        },
        {
            id: "mod04",
            title: "Ferramentas de Linha de Comando",
            subtitle: "Assistentes que criam por texto",
            duration: "20 min",
            type: "setup",
            content: `
                <h1>Ferramentas de<em>Linha de Comando</em></h1>
                <p>CLIs são programas que você instala e usa pelo terminal. Você digita um pedido, eles criam ou fazem algo.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Instalando e usando uma ferramenta de IA pela primeira vez</p>
                </div>

                <h2>As Principais Opções</h2>
                <table>
                    <tr><th>Ferramenta</th><th>Para que serve</th><th>Grátis?</th></tr>
                    <tr><td><strong data-logo-inject="openai">Codex</strong> (OpenAI)</td><td>Criar apps e automações rapidamente</td><td>Tem créditos grátis</td></tr>
                    <tr><td><strong>Kimi CLI</strong></td><td>Assistente de código completo</td><td>Tem plano grátis</td></tr>
                    <tr><td><strong>Aider</strong></td><td>Editar projetos existentes com IA</td><td>Sim (open source)</td></tr>
                    <tr><td><strong data-logo-inject="anthropic">Claude Code</strong></td><td>Ferramenta oficial da Anthropic</td><td>Pago</td></tr>
                </table>

                <h2>Instalando Sua Primeira Ferramenta</h2>
                <div class="code-block">
                    <div class="code-header"><span>Terminal</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                    <pre><code>pip install kimi-cli

# Ou usando o gerenciador moderno uv
pip install uv
uv tool install kimi-cli</code></pre>
                </div>

                <div class="warning-box"><p><strong>Nunca compartilhe sua chave de API.</strong> Ela é como uma senha. Guarde em um lugar seguro.</p></div>

                <h2>Padrão Universal</h2>
                <div class="code-block">
                    <div class="code-header"><span>Padrão Universal</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                    <pre><code>nome-da-ferramenta "o que você quer que ela crie"

kimi "crie uma página de login em HTML e CSS"
codex "crie um script que organize arquivos PDF por data"</code></pre>
                </div>
            `
        },
        {
            id: "mod05",
            title: "Editores de Código com IA",
            subtitle: "Seu novo ambiente de criação",
            duration: "20 min",
            type: "setup",
            content: `
                <h1>Editores de Código<em>com IA</em></h1>
                <p>Editores como Cursor e Windsurf são onde a mágica acontece. Pense neles como um <strong>Word superpoderoso</strong> — você cria aplicativos, e a IA escreve o código para você.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Criando um app completo usando apenas descrições em português</p>
                </div>

                <h2>Cursor vs Windsurf vs VS Code</h2>
                <table>
                    <tr><th>Editor</th><th>Melhor para</th><th>Diferencial</th></tr>
                    <tr><td><strong>Cursor</strong></td><td>Criar apps do zero</td><td>Chat muito inteligente, edição em lote</td></tr>
                    <tr><td><strong data-logo-inject="codeium">Windsurf</strong></td><td>Iniciantes</td><td>Interface mais simples, modo "agente" automático</td></tr>
                    <tr><td><strong data-logo-inject="github">VS Code + Copilot</strong></td><td>Quem já tem VS Code</td><td>Integração perfeita, sugestões enquanto digita</td></tr>
                </table>

                <h2>Como Criar Algo no Cursor</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Abra o editor</h4><p>Clique em "New Project" e escolha uma pasta vazia.</p></div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Abra o chat de IA</h4><p>No Cursor: <code>Ctrl + L</code>. No Windsurf: <code>Ctrl + I</code>.</p></div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Descreva o que quer</h4><p><em>"Crie um app web que calcule prazos processuais em dias úteis com design profissional."</em></p></div></div>
                    <div class="step"><div class="step-number">4</div><div class="step-content"><h4>Deixe a IA trabalhar</h4><p>Ela vai criar os arquivos sozinha. Pode levar de 30s a 2 min.</p></div></div>
                    <div class="step"><div class="step-number">5</div><div class="step-content"><h4>Veja e ajuste</h4><p>Abra o <code>index.html</code> no navegador. Para ajustes, descreva no chat.</p></div></div>
                </div>
                <div class="success-box"><p><strong>Você acabou de aprender o workflow completo:</strong> abrir → descrever → criar → testar → ajustar. É assim que apps são feitos em 2025.</p></div>
            `
        },
        {
            id: "mod06",
            title: "Projeto 1: Seu Primeiro App",
            subtitle: "App de cálculo de prazos processuais",
            duration: "30 min",
            type: "project",
            content: `
                <h1>Projeto 1:<em>Seu Primeiro App</em></h1>
                <p>Vamos criar um aplicativo real que calcula prazos processuais considerando dias úteis.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Criando passo a passo um app funcional do zero</p>
                </div>

                <h2>Passo a Passo</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Crie a pasta e abra no editor</h4><p>Crie uma pasta chamada <code>calculadora-prazos</code> e abra no Cursor ou Windsurf.</p></div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Primeiro prompt</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Prompt</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                            <pre><code>Crie um app web completo em uma única página HTML
que calcule prazos processuais em dias úteis.

Requisitos:
- Campo para data de intimação (date picker)
- Campo para número de dias do prazo
- Checkbox para considerar ou não o dia do início
- Botão "Calcular"
- Resultado mostrando a data final em vermelho
- Feriados nacionais pré-carregados
- Design limpo, profissional, responsivo

Use HTML, CSS e JavaScript em um único arquivo index.html.</code></pre>
                        </div>
                    </div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Melhore o app</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Prompt</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                            <pre><code>Adicione ao app:
1. Histórico local dos últimos 10 cálculos (localStorage)
2. Botão "Exportar PDF" com o resultado
3. Campo para número do processo
4. Tabela com feriados do ano</code></pre>
                        </div>
                    </div></div>
                </div>

                <h2>Como Publicar (Opcional)</h2>
                <ul>
                    <li><strong data-logo-inject="netlify">Netlify Drop:</strong> Acesse <code>app.netlify.com/drop</code>, arraste a pasta.</li>
                    <li><strong data-logo-inject="github">GitHub Pages:</strong> Suba no GitHub e ative Pages.</li>
                    <li><strong data-logo-inject="vercel">Vercel:</strong> Conecte o GitHub e deploy automático.</li>
                </ul>
                <div class="success-box"><p><strong>Projeto concluído!</strong> Você criou um app funcional sem escrever uma linha de código.</p></div>
            `
        },
        {
            id: "mod07",
            title: "Projeto 2: Seu Primeiro Assistente Automático",
            subtitle: "Um assistente que trabalha sozinho",
            duration: "30 min",
            type: "project",
            content: `
                <h1>Projeto 2:<em>Assistente Automático</em></h1>
                <p>Vamos criar um <strong>assistente que trabalha sozinho</strong>: recebe uma pasta com arquivos de processo e gera um resumo organizado automaticamente.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Criando um assistente automatizado de organização de processos</p>
                </div>

                <h2>Passo a Passo</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Crie a estrutura</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Terminal</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                            <pre><code>mkdir assistente-processos
cd assistente-processos
mkdir entradas saidas relatorios</code></pre>
                        </div>
                    </div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Crie o assistente</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Prompt</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                            <pre><code>Crie um script Python chamado analisador.py que:
1. Leia todos os arquivos .txt da pasta "entradas"
2. Para cada arquivo, extraia: tipo de documento,
   partes, objeto, prazos, valores financeiros
3. Gere relatório em Markdown na pasta "relatorios"
4. Crie resumo geral em "saidas/resumo.json"

Menu no terminal: 1-Analisar, 2-Ver relatório, 0-Sair.
Comentários em português.</code></pre>
                        </div>
                    </div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Rode o assistente</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Terminal</span><button class="copy-btn" onclick="copyCode(this)">_copiar</button></div>
                            <pre><code>python analisador.py</code></pre>
                        </div>
                    </div></div>
                </div>
                <div class="success-box"><p><strong>Você criou um assistente automático!</strong> Com pequenos ajustes, ele pode rodar sozinho e te enviar resultados por e-mail toda semana.</p></div>
            `
        },
        {
            id: "mod08",
            title: "Automações no Seu Dia a Dia",
            subtitle: "Eliminando tarefas repetitivas",
            duration: "25 min",
            type: "concept",
            content: `
                <h1>Automações no<em>Seu Dia a Dia</em></h1>
                <p>Agora que você sabe criar apps e assistentes, vamos <strong>automatizar tarefas repetitivas</strong> que consomem seu tempo todo dia.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Identificando e automatizando tarefas do cotidiano jurídico</p>
                </div>

                <h2>O Que Automatizar</h2>
                <table>
                    <tr><th>Tarefa repetitiva</th><th>Como automatizar</th></tr>
                    <tr><td>Renomear arquivos de processo</td><td>Script que renomeia em lote</td></tr>
                    <tr><td>Organizar e-mails por cliente</td><td>Assistente que classifica</td></tr>
                    <tr><td>Gerar minutas de contrato</td><td>App com templates preenchíveis</td></tr>
                    <tr><td>Calcular custas e honorários</td><td>App de cálculos com fórmulas</td></tr>
                    <tr><td>Lembrar prazos</td><td>App com notificações automáticas</td></tr>
                </table>

                <h2>Ferramentas de Automação Sem Código</h2>
                <ul>
                    <li><strong data-logo-inject="n8n">n8n:</strong> Automação visual open source. Você conecta blocos como se fosse Lego.</li>
                    <li><strong data-logo-inject="make">Make (antigo Integromat):</strong> Conecta apps (Gmail, Drive, Excel) automaticamente.</li>
                    <li><strong data-logo-inject="zapier">Zapier:</strong> Similar ao Make, mais simples.</li>
                    <li><strong data-logo-inject="microsoft">Power Automate:</strong> Da Microsoft, integrado ao Office 365.</li>
                </ul>
                <div class="info-box"><p><strong>Dica de ouro:</strong> Comece pequeno. Automatize UMA tarefa por vez. Em 3 meses, você terá eliminado horas de trabalho manual.</p></div>
            `
        },
        {
            id: "mod09",
            title: "Como Pedir Para a IA Criar Coisas",
            subtitle: "A arte de descrever o que você quer",
            duration: "20 min",
            type: "concept",
            content: `
                <h1>Como Pedir Para a IA<em>Criar Coisas</em></h1>
                <p>O segredo para obter bons resultados não é técnico — é <strong>saber descrever</strong> o que você quer.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Técnicas práticas de comunicação com ferramentas de IA</p>
                </div>

                <div class="info-box"><p><strong>Regra de ouro:</strong> Se você não mencionar, a IA não vai fazer. Se você não especificar o formato, ela vai escolher sozinha.</p></div>

                <h2>A Estrutura PERFEITA</h2>
                <div class="card"><h3>P — Propósito</h3><p>"O que isso deve fazer? Para quem serve?"</p></div>
                <div class="card"><h3>E — Estrutura</h3><p>"Quais são as partes, seções ou telas?"</p></div>
                <div class="card"><h3>R — Regras</h3><p>"Quais são as regras? O que deve ou não fazer?"</p></div>
                <div class="card"><h3>F — Formato</h3><p>"Qual tecnologia, aparência, linguagem?"</p></div>
                <div class="card"><h3>E — Exemplos</h3><p>"Mostre um exemplo de entrada e saída."</p></div>
                <div class="card"><h3>I — Iteração</h3><p>"Peça melhorias passo a passo."</p></div>
                <div class="card"><h3>T — Teste</h3><p>"Peça para a IA incluir exemplos de teste."</p></div>
                <div class="card"><h3>A — Ajustes</h3><p>"Refine com feedback específico."</p></div>

                <h2>Antes e Depois</h2>
                <div class="danger-box"><p><strong>Pedido ruim:</strong> "Crie um app de prazos"</p></div>
                <div class="success-box"><p><strong>Pedido bom:</strong> "Crie um app web para cálculo de prazos processuais em dias úteis. Campos para data de intimação, número de dias, checkbox para incluir o primeiro dia. Pular sábados, domingos e feriados nacionais. HTML/CSS/JS num único arquivo. Design azul escuro, responsivo. Exemplo: 10/01/2025 + 15 dias = 31/01/2025."</p></div>
            `
        },
        {
            id: "mod10",
            title: "Segurança, Sigilo e LGPD",
            subtitle: "Protegendo dados enquanto inova",
            duration: "20 min",
            type: "concept",
            content: `
                <h1>Segurança, Sigilo<em>e LGPD</em></h1>
                <p>Na área jurídica temos uma responsabilidade extra: <strong>proteger dados de clientes</strong>. Este módulo é obrigatório.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Roteiro da Aula</h3>
                    <p>Segurança prática para quem usa IA no direito</p>
                </div>

                <h2>O Que Nunca Colocar em IAs Online</h2>
                <ul>
                    <li>Nomes completos de clientes</li>
                    <li>CPF, CNPJ ou documentos de identificação</li>
                    <li>Números de processos reais</li>
                    <li>Endereços, telefones e e-mails de partes</li>
                    <li>Fatos íntimos ou sensíveis do caso</li>
                    <li>Documentos com segredo de justiça</li>
                </ul>
                <div class="danger-box"><p><strong>Aviso grave:</strong> Vazar dados de um cliente pode configurar violação do sigilo profissional e infração à LGPD, com multas de até 2% do faturamento.</p></div>

                <h2>Como Usar IA de Forma Segura</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Anonimize antes de enviar</h4><p>Substitua nomes reais por fictícios. "João Silva" → "Parte A". CPF → "XXX.XXX.XXX-XX".</p></div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Use dados fictícios para criar</h4><p>Apps que rodam no seu navegador não enviam dados para lugar nenhum — são 100% locais.</p></div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Desative o "treinamento"</h4><p>No ChatGPT e Claude: Configurações → Data Controls → desative "Improve the model".</p></div></div>
                </div>

                <h2>Checklist de Segurança</h2>
                <ul class="checklist">
                    <li>Os dados usados nos testes são fictícios?</li>
                    <li>O app funciona localmente?</li>
                    <li>Desativei o treinamento de modelo?</li>
                    <li>Em caso de dúvida, consultei compliance ou a OAB?</li>
                </ul>

                <h2>Próximos Passos</h2>
                <ol>
                    <li><strong>Crie seu primeiro app real</strong> — algo que você vá usar</li>
                    <li><strong>Mostre para um colega</strong> — ensinar é a melhor forma de aprender</li>
                    <li><strong>Automatize uma tarefa semanal</strong> — comece pequeno</li>
                    <li><strong>Acompanhe novidades</strong> — esse campo muda rápido</li>
                </ol>
                <div class="success-box"><p><strong>Você está à frente de 99% da área jurídica.</strong> Saber criar soluções com IA não é mais diferencial — está se tornando o básico. Você começou no momento certo.</p></div>
            `
        }
    ]
};

/* ===== EN Course Data ===== */
const courseDataEN = {
    modules: [
        {
            id: "mod00",
            title: "The AI Tools Landscape",
            subtitle: "The full map: web, desktop, IDEs and terminal",
            duration: "35 min",
            type: "inaugural",
            content: `
                <h1>The Landscape of<em>AI Tools</em></h1>
                <p>Before we roll up our sleeves, let's fly over the <strong>entire landscape</strong> of AI tools available today — from the browser to the terminal. This is the course's <strong>opening lesson</strong>: the longest video, designed to give you the full map before we dive into the details.</p>
                <div class="video-placeholder featured">
                    <button class="play-btn">▶</button>
                    <h3>Opening Lesson — Full Video</h3>
                    <p>A guided tour through every category of AI tool</p>
                </div>

                <div class="info-box">
                    <p><strong>How to watch:</strong> don't install anything yet. The goal here is to understand the <strong>big-picture map</strong>. In the next modules we go deep and get each tool running.</p>
                </div>

                <h2>The 4 Families of Tools</h2>
                <p>In practice, everything out there fits into four big families. You'll meet all of them in this video:</p>

                <div class="card"><h3>1. Web / GUI Tools (in the browser)</h3><p>You open a website, chat, and copy the result. It's everyone's entry point: <strong>ChatGPT</strong> (OpenAI), <strong>Claude.ai</strong> (Anthropic), <strong data-logo-inject="gemini">Google Gemini</strong> and <strong>Microsoft Copilot</strong>. Zero install, zero setup.</p></div>
                <div class="card"><h3>2. Desktop Apps with Superpowers</h3><p>The same assistants, but installed on your computer and allowed to <strong>read files, open programs, and create projects</strong>: <strong data-logo-inject="anthropic">Claude Desktop</strong> and <strong data-logo-inject="openai">ChatGPT Desktop</strong>. The bridge between the chat and your machine.</p></div>
                <div class="card"><h3>3. AI-Powered Editors and IDEs (built for development)</h3><p>Programs made to build software, with AI woven into the code: <strong>Cursor</strong>, <strong data-logo-inject="codeium">Windsurf</strong>, <strong data-logo-inject="github">VS Code + GitHub Copilot</strong> and <strong data-logo-inject="google">Google</strong>'s development-only tools — <strong>Firebase Studio</strong> (formerly Project IDX), <strong>Antigravity</strong> and <strong>Gemini Code Assist</strong>.</p></div>
                <div class="card"><h3>4. Command-Line Tools (agentic CLIs)</h3><p>Agents that work through the terminal and carry tasks end to end: <strong data-logo-inject="anthropic">Claude Code</strong> (Anthropic), <strong data-logo-inject="openai">Codex</strong> (OpenAI's GPT Codex models), <strong data-logo-inject="gemini">Gemini CLI</strong> (Google) and alternatives like Aider and Kimi CLI.</p></div>

                <h2>Web, Desktop, IDE or Terminal — When to Use Each</h2>
                <table>
                    <tr><th>Family</th><th>Best for</th><th>Examples</th></tr>
                    <tr><td>Web / GUI</td><td>Quick questions, drafting and reviewing text, first tests</td><td>ChatGPT, Claude.ai, Gemini</td></tr>
                    <tr><td>Desktop</td><td>Chatting using your own files and programs</td><td>Claude Desktop, ChatGPT Desktop</td></tr>
                    <tr><td>AI IDE</td><td>Building apps and systems with visual feedback</td><td>Cursor, Windsurf, Firebase Studio, Antigravity</td></tr>
                    <tr><td>Agentic CLI</td><td>Automating whole tasks and complete projects</td><td>Claude Code, Codex, Gemini CLI</td></tr>
                </table>

                <h2>The Models Behind the Tools</h2>
                <p>Every tool above is just the "shell." The brain is the <strong>AI model</strong>. Worth knowing the main ones:</p>
                <ul>
                    <li><strong data-logo-inject="anthropic">Claude</strong> (Anthropic) — a benchmark for coding and long-form reasoning. It's what powers Claude Code.</li>
                    <li><strong data-logo-inject="openai">GPT and the Codex models</strong> (OpenAI) — specialized at writing and running code, behind Codex.</li>
                    <li><strong data-logo-inject="gemini">Gemini</strong> (Google) — multimodal and integrated into the Google ecosystem, powering Antigravity and the Gemini CLI.</li>
                </ul>
                <div class="info-box"><p><strong>Key idea:</strong> the tool is the interface; the model is the intelligence. Swapping models is like swapping a car's engine — the steering stays the same.</p></div>

                <h2>What Comes After This Lesson</h2>
                <p>Over the next 10 modules, you leave the overview and get hands-on: install your first tool, lose your fear of the terminal, build two real projects, and learn to use all of it safely and in line with data protection rules.</p>
                <div class="success-box"><p><strong>Keep this map.</strong> Whenever a new tool shows up — and one does every week — it will land in one of these four families. You'll never feel lost in the flood of new releases again.</p></div>
            `
        },
        {
            id: "mod01",
            title: "What Are AI Assistants",
            subtitle: "And why you need them right now",
            duration: "15 min",
            type: "intro",
            content: `
                <div class="hero">
                    <h1>AI in Practice for<em>Lawyers</em></h1>
                    <p>How legal professionals can use AI tools to build apps, automate tasks, and solve problems — no coding experience required.</p>
                    <div class="hero-stats">
                        <div class="hero-stat"><span class="number">10</span><span class="label">Modules</span></div>
                        <div class="hero-stat"><span class="number">2</span><span class="label">Real Projects</span></div>
                        <div class="hero-stat"><span class="number">0</span><span class="label">Coding Required</span></div>
                    </div>
                </div>

                <h2>What You Will Learn</h2>
                <p>This course is for <strong>anyone working in the legal field</strong>: attorneys, paralegals, law clerks, legal secretaries, office managers, and in-house legal teams. No programming knowledge needed.</p>
                <p>You'll learn to use tools that <strong>create things for you</strong>:</p>
                <ul>
                    <li><strong>Applications</strong> to calculate deadlines, generate documents, and organize cases</li>
                    <li><strong>Automated assistants</strong> that work while you focus on other things</li>
                    <li><strong>Automations</strong> to eliminate repetitive tasks from your day</li>
                </ul>

                <h2>What Changed in 2025</h2>
                <p>Until recently, building an app or automating a task required hiring a developer. Today, there are tools where you <strong>describe what you want in plain English</strong> and they build it for you.</p>
                <div class="info-box">
                    <p><strong>Think of it this way:</strong> you used to dictate to a paralegal and they would draft the brief. Now, you describe what you need to an AI tool and it <strong>builds a complete app</strong> that does the work automatically.</p>
                </div>

                <h2>Three Types of Tools You'll Discover</h2>
                <div class="card"><h3>1. Chat Tools with Superpowers</h3><p>Like Claude Desktop, ChatGPT, or Gemini. You chat, but they can <strong>use programs on your computer</strong>, read files, browse the web, and create complete projects.</p></div>
                <div class="card"><h3>2. AI-Powered Code Editors</h3><p>Programs like <strong>Cursor</strong>, <strong>Windsurf</strong>, or VS Code with GitHub Copilot. Like a word processor, but for building apps. The AI writes the code while you describe what you want.</p></div>
                <div class="card"><h3>3. Command-Line Tools</h3><p>Programs you use by typing in a terminal. Sounds intimidating, but it's just <strong>a more direct text chat with your computer</strong>. You type a command and the tool creates or does something.</p></div>

                <h2>Why the Legal Field Needs This</h2>
                <ul>
                    <li><strong>Case deadlines:</strong> automatically calculated by an app you built</li>
                    <li><strong>Repetitive documents:</strong> generated in seconds with your custom templates</li>
                    <li><strong>Case law research:</strong> organized and summarized automatically</li>
                    <li><strong>Case management:</strong> your own system, exactly as you want it</li>
                    <li><strong>Administrative tasks:</strong> eliminated through simple automations</li>
                </ul>
                <div class="success-box">
                    <p><strong>You won't become a developer.</strong> You'll become someone who knows how to use intelligent tools to create their own solutions. It's like mastering advanced Excel — except for building apps.</p>
                </div>
            `
        },
        {
            id: "mod02",
            title: "Quick Setup: Your First Tool",
            subtitle: "From zero to running in 15 minutes",
            duration: "20 min",
            type: "setup",
            content: `
                <h1>Quick Setup: Your First<em>Tool</em></h1>
                <p>Let's install and configure your first AI tool. Choose one of the options below and get it running in minutes.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Step-by-step installation of your chosen tool</p>
                </div>

                <h2>Choose Your First Tool</h2>
                <p>You don't need to install everything now. Pick <strong>one</strong> option below.</p>
                <div class="tabs">
                    <button class="tab-btn active" data-tab="claude" data-logo="anthropic">Claude Desktop</button>
                    <button class="tab-btn" data-tab="cursor">Cursor</button>
                    <button class="tab-btn" data-tab="windsurf" data-logo="codeium">Windsurf</button>
                </div>

                <div class="tab-panel active" id="tab-claude">
                    <h3>Claude Desktop (Anthropic)</h3>
                    <p>Claude Desktop is a chat app that can open programs, read files, and create projects on your computer.</p>
                    <div class="steps">
                        <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Create your account</h4><p>Go to <code>claude.ai</code> and click "Sign Up". Use your email or Google account.</p></div></div>
                        <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Download the app</h4><p>On the same site, look for "Download for Desktop" and install it like any other program.</p></div></div>
                        <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Log in and test</h4><p>Type: "Create a file called test.txt on my Desktop with the text 'Hello, legal world'".</p></div></div>
                    </div>
                </div>

                <div class="tab-panel" id="tab-cursor">
                    <h3>Cursor</h3>
                    <p>A very powerful AI-powered code editor. Free for basic use.</p>
                    <div class="steps">
                        <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Download Cursor</h4><p>Go to <code>cursor.com</code> and install on your computer.</p></div></div>
                        <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Create account or use GitHub</h4><p>Log in with your Cursor or GitHub account.</p></div></div>
                        <div class="step"><div class="step-number">3</div><div class="step-content"><h4>First project</h4><p>Click "New Project" and in the chat type: "Create a simple HTML app to calculate case deadlines".</p></div></div>
                    </div>
                </div>

                <div class="tab-panel" id="tab-windsurf">
                    <h3>Windsurf (Codeium)</h3>
                    <p>Similar to Cursor, with a very beginner-friendly interface.</p>
                    <div class="steps">
                        <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Download Windsurf</h4><p>Go to <code>codeium.com/windsurf</code> and download for your OS.</p></div></div>
                        <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Login</h4><p>Create a Codeium account or use Google/GitHub login.</p></div></div>
                        <div class="step"><div class="step-number">3</div><div class="step-content"><h4>First command</h4><p>Use <code>Ctrl + I</code> to open chat and type: "Create a working-day deadline calculator app".</p></div></div>
                    </div>
                </div>

                <h2>Installation Checklist</h2>
                <ul class="checklist">
                    <li>Account created for your chosen tool</li>
                    <li>Application installed and open</li>
                    <li>First test working</li>
                    <li>Interface explored for 5 minutes</li>
                </ul>
                <div class="warning-box"><p><strong>Important tip:</strong> Don't worry about understanding everything now. The goal is to have the tool open and working.</p></div>
            `
        },
        {
            id: "mod03",
            title: "The Terminal Is Just a Text Chat",
            subtitle: "Losing your fear of the command line",
            duration: "15 min",
            type: "concept",
            content: `
                <h1>The Terminal Is Just<em>a Text Chat</em></h1>
                <p>The terminal intimidates many people. But think of it as a <strong>text message conversation with your computer</strong>: you type something, it responds.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Opening the terminal and using your first commands</p>
                </div>

                <h2>How to Open the Terminal</h2>
                <table>
                    <tr><th>System</th><th>How to open</th></tr>
                    <tr><td>Windows</td><td>Press <code>Windows + R</code>, type <code>cmd</code> and hit Enter. Or search "Terminal" in the Start menu.</td></tr>
                    <tr><td>Mac</td><td>Press <code>Cmd + Space</code>, type <code>Terminal</code> and hit Enter.</td></tr>
                </table>

                <h2>5 Commands You Need to Know</h2>
                <div class="code-block">
                    <div class="code-header"><span>Essential Commands</span><button class="copy-btn" onclick="copyCode(this)">_copy</button></div>
                    <pre><code># Show where you are
pwd

# List what's in the folder
ls        # Mac/Linux
dir       # Windows

# Enter a folder
cd folder-name

# Go back one folder
cd ..

# Create a folder
mkdir folder-name</code></pre>
                </div>

                <div class="info-box"><p><strong>Simple analogy:</strong> using the terminal is like texting instructions to a very obedient assistant. You give short commands and they execute immediately.</p></div>

                <h2>Practice Now</h2>
                <ol>
                    <li>Open the terminal</li>
                    <li>Type <code>pwd</code> to see where you are</li>
                    <li>Type <code>ls</code> or <code>dir</code></li>
                    <li>Type <code>mkdir my-first-project</code></li>
                    <li>Type <code>cd my-first-project</code></li>
                    <li>Type <code>cd ..</code> to go back</li>
                </ol>
                <div class="success-box"><p><strong>Well done!</strong> These 5 commands are 90% of what you'll ever need. The rest you can ask the AI to teach you on the spot.</p></div>
            `
        },
        {
            id: "mod04",
            title: "Command-Line AI Tools",
            subtitle: "Assistants that create from text",
            duration: "20 min",
            type: "setup",
            content: `
                <h1>Command-Line<em>AI Tools</em></h1>
                <p>CLIs are programs you install and use through the terminal. You type a request, they create or do something.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Installing and using an AI tool for the first time</p>
                </div>

                <h2>Main Options</h2>
                <table>
                    <tr><th>Tool</th><th>Best for</th><th>Free?</th></tr>
                    <tr><td><strong data-logo-inject="openai">Codex</strong> (OpenAI)</td><td>Building apps and automations quickly</td><td>Free credits available</td></tr>
                    <tr><td><strong>Kimi CLI</strong></td><td>Full code assistant</td><td>Free plan available</td></tr>
                    <tr><td><strong>Aider</strong></td><td>Editing existing projects with AI</td><td>Yes (open source)</td></tr>
                    <tr><td><strong data-logo-inject="anthropic">Claude Code</strong></td><td>Anthropic's official coding tool</td><td>Paid</td></tr>
                </table>

                <h2>Universal Pattern</h2>
                <div class="code-block">
                    <div class="code-header"><span>Universal Pattern</span><button class="copy-btn" onclick="copyCode(this)">_copy</button></div>
                    <pre><code>tool-name "what you want it to create or do"

kimi "create a login page in HTML and CSS"
codex "create a script that organizes PDF files by date"</code></pre>
                </div>

                <div class="warning-box"><p><strong>Never share your API key.</strong> It's like a password. Keep it in a safe place.</p></div>
            `
        },
        {
            id: "mod05",
            title: "AI-Powered Code Editors",
            subtitle: "Your new creation environment",
            duration: "20 min",
            type: "setup",
            content: `
                <h1>AI-Powered<em>Code Editors</em></h1>
                <p>Editors like Cursor and Windsurf are where the magic happens. Think of them as a <strong>supercharged word processor</strong> — you build apps, and the AI writes the code for you.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Building a complete app using plain-English descriptions</p>
                </div>

                <h2>Cursor vs Windsurf vs VS Code</h2>
                <table>
                    <tr><th>Editor</th><th>Best for</th><th>Standout feature</th></tr>
                    <tr><td><strong>Cursor</strong></td><td>Building apps from scratch</td><td>Very smart chat, bulk editing</td></tr>
                    <tr><td><strong data-logo-inject="codeium">Windsurf</strong></td><td>Beginners</td><td>Simpler interface, automatic "agent" mode</td></tr>
                    <tr><td><strong data-logo-inject="github">VS Code + Copilot</strong></td><td>Those already using VS Code</td><td>Perfect integration, inline suggestions</td></tr>
                </table>

                <h2>How to Build Something in Cursor</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Open the editor</h4><p>Click "New Project" and choose an empty folder.</p></div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Open the AI chat</h4><p>In Cursor: <code>Ctrl + L</code>. In Windsurf: <code>Ctrl + I</code>.</p></div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Describe what you want</h4><p><em>"Create a web app that calculates case deadlines in working days with a professional design."</em></p></div></div>
                    <div class="step"><div class="step-number">4</div><div class="step-content"><h4>Let the AI work</h4><p>It will create the files on its own. Takes 30 seconds to 2 minutes.</p></div></div>
                    <div class="step"><div class="step-number">5</div><div class="step-content"><h4>View and refine</h4><p>Open <code>index.html</code> in your browser. Describe any changes in the chat.</p></div></div>
                </div>
                <div class="success-box"><p><strong>You just learned the complete workflow:</strong> open → describe → build → test → refine. This is how apps are made in 2025.</p></div>
            `
        },
        {
            id: "mod06",
            title: "Project 1: Your First App",
            subtitle: "Case deadline calculator app",
            duration: "30 min",
            type: "project",
            content: `
                <h1>Project 1:<em>Your First App</em></h1>
                <p>Let's build a real app that calculates case deadlines accounting for working days.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Building a functional app from scratch, step by step</p>
                </div>

                <h2>Step by Step</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Create the folder and open it</h4><p>Create a folder called <code>deadline-calculator</code> and open it in Cursor or Windsurf.</p></div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>First prompt</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Prompt</span><button class="copy-btn" onclick="copyCode(this)">_copy</button></div>
                            <pre><code>Create a complete web app in a single HTML file
that calculates legal deadlines in working days.

Requirements:
- Field for the notice/summons date (date picker)
- Field for the number of deadline days
- Checkbox to include or exclude the first day
- "Calculate" button
- Result showing the final date highlighted in red
- Pre-loaded national holidays
- Clean, professional, responsive design

Use HTML, CSS and JavaScript in a single index.html file.</code></pre>
                        </div>
                    </div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Enhance the app</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Prompt</span><button class="copy-btn" onclick="copyCode(this)">_copy</button></div>
                            <pre><code>Add to the app:
1. Local history of the last 10 calculations (localStorage)
2. "Export PDF" button with the result
3. Field for the case number
4. Table showing all holidays for the year</code></pre>
                        </div>
                    </div></div>
                </div>

                <h2>How to Publish (Optional)</h2>
                <ul>
                    <li><strong data-logo-inject="netlify">Netlify Drop:</strong> Go to <code>app.netlify.com/drop</code>, drag your project folder.</li>
                    <li><strong data-logo-inject="github">GitHub Pages:</strong> Upload to GitHub and enable Pages.</li>
                    <li><strong data-logo-inject="vercel">Vercel:</strong> Connect GitHub for automatic deployment.</li>
                </ul>
                <div class="success-box"><p><strong>Project complete!</strong> You just built a functional app useful in daily legal practice — without writing a single line of code.</p></div>
            `
        },
        {
            id: "mod07",
            title: "Project 2: Your First Automated Assistant",
            subtitle: "An assistant that works on its own",
            duration: "30 min",
            type: "project",
            content: `
                <h1>Project 2:<em>Automated Assistant</em></h1>
                <p>Now let's build something more advanced: an <strong>assistant that works on its own</strong>. It reads a folder of case files and generates an organized summary automatically.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Building an automated case organization assistant</p>
                </div>

                <h2>Step by Step</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Create the structure</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Terminal</span><button class="copy-btn" onclick="copyCode(this)">_copy</button></div>
                            <pre><code>mkdir case-assistant
cd case-assistant
mkdir inputs outputs reports</code></pre>
                        </div>
                    </div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Build the assistant</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Prompt</span><button class="copy-btn" onclick="copyCode(this)">_copy</button></div>
                            <pre><code>Create a Python script called analyzer.py that:
1. Reads all .txt files from the "inputs" folder
2. For each file, extracts: document type, parties,
   subject, deadlines, financial amounts
3. Generates a Markdown report in the "reports" folder
4. Creates a summary in "outputs/summary.json"

Terminal menu: 1-Analyze, 2-View report, 0-Exit.
Add comments explaining each function.</code></pre>
                        </div>
                    </div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Run the assistant</h4>
                        <div class="code-block">
                            <div class="code-header"><span>Terminal</span><button class="copy-btn" onclick="copyCode(this)">_copy</button></div>
                            <pre><code>python analyzer.py</code></pre>
                        </div>
                    </div></div>
                </div>
                <div class="success-box"><p><strong>You built an automated assistant!</strong> With minor tweaks, it can run on its own and email you results every week.</p></div>
            `
        },
        {
            id: "mod08",
            title: "Automations in Your Daily Practice",
            subtitle: "Eliminating repetitive tasks",
            duration: "25 min",
            type: "concept",
            content: `
                <h1>Automations in Your<em>Daily Practice</em></h1>
                <p>Now that you can build apps and assistants, let's <strong>automate the repetitive tasks</strong> that consume your time every day.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Identifying and automating common legal tasks</p>
                </div>

                <h2>What to Automate</h2>
                <table>
                    <tr><th>Repetitive task</th><th>How to automate</th></tr>
                    <tr><td>Renaming case files in bulk</td><td>Script that renames by pattern</td></tr>
                    <tr><td>Organizing emails by client</td><td>Assistant that reads and classifies</td></tr>
                    <tr><td>Generating draft contracts</td><td>App with fillable templates</td></tr>
                    <tr><td>Calculating fees and costs</td><td>App with custom formulas</td></tr>
                    <tr><td>Tracking deadlines</td><td>App with automatic reminders</td></tr>
                </table>

                <h2>No-Code Automation Tools</h2>
                <ul>
                    <li><strong data-logo-inject="n8n">n8n:</strong> Open-source visual automation. Connect blocks like Lego.</li>
                    <li><strong data-logo-inject="make">Make (formerly Integromat):</strong> Connects apps (Gmail, Drive, Excel) automatically.</li>
                    <li><strong data-logo-inject="zapier">Zapier:</strong> Similar to Make, simpler to start with.</li>
                    <li><strong data-logo-inject="microsoft">Power Automate:</strong> Microsoft's tool, integrated with Office 365.</li>
                </ul>
                <div class="info-box"><p><strong>Golden rule:</strong> Start small. Automate ONE task at a time. In 3 months, you'll have eliminated hours of manual work.</p></div>
            `
        },
        {
            id: "mod09",
            title: "How to Ask AI to Build Things",
            subtitle: "The art of describing what you want",
            duration: "20 min",
            type: "concept",
            content: `
                <h1>How to Ask AI<em>to Build Things</em></h1>
                <p>The secret to great results isn't technical — it's <strong>knowing how to describe what you want</strong>.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Practical communication techniques with AI tools</p>
                </div>

                <div class="info-box"><p><strong>Golden rule:</strong> If you don't mention it, the AI won't do it. If you don't specify the format, it will choose on its own.</p></div>

                <h2>The PERFECT Framework</h2>
                <div class="card"><h3>P — Purpose</h3><p>"What should it do? Who uses it?"</p></div>
                <div class="card"><h3>E — Elements</h3><p>"What parts, sections, or screens does it have?"</p></div>
                <div class="card"><h3>R — Rules</h3><p>"What must it do? What must it NOT do?"</p></div>
                <div class="card"><h3>F — Format</h3><p>"What technology, appearance, language?"</p></div>
                <div class="card"><h3>E — Examples</h3><p>"Show an example of input and expected output."</p></div>
                <div class="card"><h3>C — Chunks</h3><p>"Build it piece by piece, not all at once."</p></div>
                <div class="card"><h3>T — Tests</h3><p>"Include test examples so I can verify."</p></div>

                <h2>Before and After</h2>
                <div class="danger-box"><p><strong>Bad request:</strong> "Create a deadline app"</p></div>
                <div class="success-box"><p><strong>Good request:</strong> "Create a web app to calculate legal deadlines in working days. Fields for notice date, number of days, and a checkbox for including the first day. Skip weekends and national holidays. Single HTML/CSS/JS file. Professional dark-blue design, mobile-friendly. Example: Jan 10 + 15 days = Jan 31."</p></div>
            `
        },
        {
            id: "mod10",
            title: "Security, Confidentiality & Data Protection",
            subtitle: "Protecting client data while innovating",
            duration: "20 min",
            type: "concept",
            content: `
                <h1>Security, Confidentiality<em>& Data Protection</em></h1>
                <p>In the legal field we have an extra responsibility: <strong>protecting client data</strong>. This module is mandatory.</p>
                <div class="video-placeholder">
                    <button class="play-btn">▶</button>
                    <h3>Lesson Overview</h3>
                    <p>Practical security for legal professionals using AI</p>
                </div>

                <h2>What to NEVER Send to Online AI Tools</h2>
                <ul>
                    <li>Clients' full names</li>
                    <li>Social security numbers, tax IDs, or government IDs</li>
                    <li>Real case numbers</li>
                    <li>Addresses, phone numbers, and emails of parties</li>
                    <li>Sensitive or intimate case details</li>
                    <li>Documents under court seal or protective order</li>
                </ul>
                <div class="danger-box"><p><strong>Serious warning:</strong> Leaking client data can constitute a violation of professional secrecy and data protection laws, with fines up to 4% of annual turnover (GDPR) or 2% in other jurisdictions.</p></div>

                <h2>How to Use AI Safely</h2>
                <div class="steps">
                    <div class="step"><div class="step-number">1</div><div class="step-content"><h4>Anonymize before sending</h4><p>Replace real names with fictional ones. "John Smith" → "Party A". Tax IDs → "XXX-XXX-XXXX".</p></div></div>
                    <div class="step"><div class="step-number">2</div><div class="step-content"><h4>Use fictional data to build</h4><p>Apps that run in your browser <strong>never send data anywhere</strong> — they work 100% locally.</p></div></div>
                    <div class="step"><div class="step-number">3</div><div class="step-content"><h4>Disable "training" in settings</h4><p>In ChatGPT and Claude: Settings → Data Controls → disable "Improve the model".</p></div></div>
                </div>

                <h2>Security Checklist</h2>
                <ul class="checklist">
                    <li>Data used in tests is fictional?</li>
                    <li>The app runs locally on my computer?</li>
                    <li>Training disabled in AI settings?</li>
                    <li>Consulted compliance or bar association when in doubt?</li>
                </ul>

                <h2>Next Steps</h2>
                <ol>
                    <li><strong>Build your first real app</strong> — something you'll actually use</li>
                    <li><strong>Show a colleague</strong> — teaching is the best way to learn</li>
                    <li><strong>Automate one weekly task</strong> — start small</li>
                    <li><strong>Stay current</strong> — this field moves fast</li>
                </ol>
                <div class="success-box"><p><strong>You're ahead of 99% of the legal field.</strong> Knowing how to build AI solutions is no longer a differentiator — it's becoming the baseline. You started at the right time.</p></div>
            `
        }
    ]
};

/* ===== State ===== */
let currentModule = 0;
let completedModules = new Set();
let lang = 'pt';

function getCourseData() { return lang === 'en' ? courseDataEN : courseDataPT; }
function t() { return uiStrings[lang]; }

/* Display number for a module: the inaugural lesson shows "00";
   every other module is numbered 01..N, ignoring inaugural lessons. */
function isInaugural(mod) { return mod && mod.type === 'inaugural'; }
function moduleNumber(modules, idx) {
    if (isInaugural(modules[idx])) return '00';
    let n = 0;
    for (let i = 0; i <= idx; i++) {
        if (!isInaugural(modules[i])) n++;
    }
    return String(n).padStart(2, '0');
}

/* ===== DOM Elements ===== */
const moduleList    = document.getElementById('moduleList');
const contentBody   = document.getElementById('contentBody');
const breadcrumb    = document.getElementById('breadcrumb');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const progressFill  = document.getElementById('progressFill');
const progressText  = document.getElementById('progressText');
const progressPct   = document.getElementById('progressPct');
const sidebar       = document.getElementById('sidebar');
const overlay       = document.getElementById('overlay');
const menuBtn       = document.getElementById('menuBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const langSwitcher  = document.getElementById('langSwitcher');
const navCourseLabel    = document.getElementById('navCourseLabel');
const navResourcesLabel = document.getElementById('navResourcesLabel');
const navResourcesList  = document.getElementById('navResourcesList');
const progressMetaLabel = document.getElementById('progressMetaLabel');

/* ===== Initialize ===== */
function init() {
    // Auto-detect language
    const saved = localStorage.getItem('ia-pratica-lang');
    if (saved) {
        lang = saved;
    } else {
        const browserLang = (navigator.language || navigator.languages[0] || 'pt').toLowerCase();
        lang = browserLang.startsWith('en') ? 'en' : 'pt';
    }

    applyLanguageUI();
    renderModuleList();
    loadModule(0);
    updateProgress();
    setupEventListeners();
}

/* ===== Apply Language to Static UI ===== */
function applyLanguageUI() {
    if (langSwitcher) langSwitcher.textContent = lang === 'en' ? 'PT' : 'EN';
    if (navCourseLabel) navCourseLabel.textContent = t().navCourse;
    if (navResourcesLabel) navResourcesLabel.textContent = t().navResources;
    if (progressMetaLabel) progressMetaLabel.textContent = t().progressLabel;

    // Update course name in sidebar
    const logoName = document.querySelector('.logo-name');
    const logoSub  = document.querySelector('.logo-sub');
    if (logoName) logoName.textContent = lang === 'en' ? 'AI in Practice' : 'IA Prática';
    if (logoSub)  logoSub.textContent  = lang === 'en' ? 'for_lawyers'    : 'para_advogados';

    // Update page title
    document.title = lang === 'en'
        ? 'AI in Practice for Lawyers — Complete Course'
        : 'IA Prática para Advogados — Curso Completo';

    // Update resource links
    if (navResourcesList) {
        navResourcesList.innerHTML = t().resources.map(r =>
            `<li><a href="#" data-action="${r.action}" class="sidebar-nav-link">${r.label}</a></li>`
        ).join('');
        // Re-attach resource listeners
        navResourcesList.querySelectorAll('[data-action]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showResource(link.dataset.action);
            });
        });
    }

    // Update nav buttons text
    if (prevBtn) prevBtn.textContent = t().prevBtn;
    const modules = getCourseData().modules;
    if (nextBtn) {
        nextBtn.textContent = currentModule === modules.length - 1 ? t().finishBtn : t().nextBtn;
    }

    document.documentElement.lang = lang;
}

/* ===== Set Language ===== */
function setLanguage(newLang) {
    lang = newLang;
    localStorage.setItem('ia-pratica-lang', lang);
    completedModules = new Set();
    applyLanguageUI();
    renderModuleList();
    loadModule(currentModule < getCourseData().modules.length ? currentModule : 0);
    updateProgress();
}

/* ===== Render Module List ===== */
function renderModuleList() {
    const modules = getCourseData().modules;
    moduleList.innerHTML = modules.map((mod, idx) => {
        const isActive = idx === currentModule;
        const isDone   = completedModules.has(idx);
        const classes  = [isActive ? 'active' : '', isDone ? 'completed' : '', isInaugural(mod) ? 'inaugural' : ''].filter(Boolean).join(' ');
        const badge    = isDone ? '✓' : moduleNumber(modules, idx);
        return `
        <li>
            <a href="#" data-index="${idx}" class="${classes}">
                <span class="nav-num">${badge}</span>
                <span class="nav-title">${mod.title}</span>
            </a>
        </li>`;
    }).join('');
}

/* ===== Load Module ===== */
function loadModule(index) {
    const modules = getCourseData().modules;
    if (index < 0 || index >= modules.length) return;

    currentModule = index;
    const mod = modules[index];

    contentBody.innerHTML = mod.content;

    const crumbLabel = isInaugural(mod)
        ? t().inauguralLabel
        : `${t().moduleLabel} ${moduleNumber(modules, index)}`;
    breadcrumb.innerHTML = `<span>${crumbLabel}</span><span class="breadcrumb-sep">/</span>${mod.title}`;

    prevBtn.disabled = index === 0;
    prevBtn.textContent = t().prevBtn;
    nextBtn.disabled = false;
    nextBtn.textContent = index === modules.length - 1 ? t().finishBtn : t().nextBtn;

    renderModuleList();

    document.getElementById('mainContent').scrollTop = 0;
    window.scrollTo(0, 0);

    if (index === modules.length - 1) {
        completedModules.add(index);
    }

    setupTabs();
    postProcessContent(index);
    closeMobileMenu();
}

/* ===== Post-Process Content (screenshots + logos) ===== */
function postProcessContent(moduleIndex) {
    // 1. Inject real screenshot into .video-placeholder
    const imgUrl = MODULE_SCREENSHOTS[moduleIndex] || '';
    contentBody.querySelectorAll('.video-placeholder').forEach(vp => {
        if (imgUrl) {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = '';
            img.className = 'vp-screenshot';
            img.loading = 'lazy';
            vp.insertBefore(img, vp.firstChild);
        }

        // Restructure bottom info strip
        const playBtn = vp.querySelector('.play-btn');
        const h3      = vp.querySelector('h3');
        const p       = vp.querySelector('p');

        const info = document.createElement('div');
        info.className = 'vp-info';

        if (playBtn) info.appendChild(playBtn);

        const textDiv = document.createElement('div');
        textDiv.className = 'vp-text';
        if (h3) { h3.style.display = ''; textDiv.appendChild(h3); }
        if (p)  { p.style.display  = ''; textDiv.appendChild(p);  }
        info.appendChild(textDiv);

        vp.appendChild(info);
    });

    // 2. Inject logos into tab buttons via data-logo attribute
    contentBody.querySelectorAll('.tab-btn[data-logo]').forEach(btn => {
        const logoKey = btn.dataset.logo;
        const logoUrl = TOOL_LOGOS[logoKey];
        if (logoUrl && !btn.querySelector('img')) {
            const img = document.createElement('img');
            img.src = logoUrl;
            img.alt = '';
            img.className = 'tab-logo';
            img.width = 16;
            img.height = 16;
            btn.insertBefore(img, btn.firstChild);
        }
    });

    // 3. Inject logos into inline elements
    contentBody.querySelectorAll('[data-logo-inject]').forEach(el => {
        const logoKey = el.dataset.logoInject;
        const logoUrl = TOOL_LOGOS[logoKey];
        if (logoUrl && !el.querySelector('img')) {
            const img = document.createElement('img');
            img.src = logoUrl;
            img.alt = '';
            img.className = 'inline-logo';
            img.width = 14;
            img.height = 14;
            el.insertBefore(img, el.firstChild);
        }
    });
}

/* ===== Update Progress ===== */
function updateProgress() {
    const modules   = getCourseData().modules;
    // The inaugural lesson is a bonus opener — it doesn't count toward the 10 modules.
    const total     = modules.filter(m => !isInaugural(m)).length;
    let completed   = 0;
    completedModules.forEach(i => { if (modules[i] && !isInaugural(modules[i])) completed++; });
    const pct       = total ? Math.round((completed / total) * 100) : 0;
    progressFill.style.width = `${pct}%`;
    progressText.textContent = t().progressModules(completed, total);
    if (progressPct) progressPct.textContent = `${pct}%`;
}

/* ===== Setup Event Listeners ===== */
function setupEventListeners() {
    // Module links
    moduleList.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('a');
        if (!link) return;
        const index = parseInt(link.dataset.index);
        if (!isNaN(index)) {
            completedModules.add(currentModule);
            loadModule(index);
            updateProgress();
        }
    });

    // Nav buttons
    prevBtn.addEventListener('click', () => {
        completedModules.add(currentModule);
        loadModule(currentModule - 1);
        updateProgress();
    });

    nextBtn.addEventListener('click', () => {
        completedModules.add(currentModule);
        const modules = getCourseData().modules;
        if (currentModule < modules.length - 1) {
            loadModule(currentModule + 1);
        } else {
            alert(t().celebration);
        }
        updateProgress();
    });

    // Mobile menu
    menuBtn.addEventListener('click', openMobileMenu);
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', closeMobileMenu);

    // Language switcher
    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            setLanguage(lang === 'en' ? 'pt' : 'en');
        });
    }

    // Resource links (initial render)
    document.querySelectorAll('[data-action]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showResource(link.dataset.action);
        });
    });
}

/* ===== Tabs ===== */
function setupTabs() {
    const tabs   = contentBody.querySelectorAll('.tab-btn');
    const panels = contentBody.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = contentBody.querySelector(`#tab-${target}`);
            if (panel) panel.classList.add('active');
        });
    });
}

/* ===== Copy Code ===== */
function copyCode(btn) {
    const block = btn.closest('.code-block') || btn.closest('.code-header').parentElement;
    const code  = block.querySelector('pre, code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const original = btn.textContent;
        btn.textContent = t().copiedBtn;
        setTimeout(() => btn.textContent = original, 1500);
    });
}

/* ===== Mobile Menu ===== */
function openMobileMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
}
function closeMobileMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

/* ===== Resources ===== */
function showResource(action) {
    const resources = {
        pt: {
            cheatsheet: `
                <h1>_guia_rápido</h1>
                <h2>Comandos de Terminal</h2>
                <table>
                    <tr><th>Comando</th><th>O que faz</th></tr>
                    <tr><td><code>pwd</code></td><td>Mostra pasta atual</td></tr>
                    <tr><td><code>ls</code> / <code>dir</code></td><td>Lista arquivos</td></tr>
                    <tr><td><code>cd nome</code></td><td>Entra na pasta</td></tr>
                    <tr><td><code>cd ..</code></td><td>Volta uma pasta</td></tr>
                    <tr><td><code>mkdir nome</code></td><td>Cria pasta</td></tr>
                </table>
                <h2>Estrutura PERFEITA de Prompt</h2>
                <ul>
                    <li><strong>P</strong>ropósito — para que serve?</li>
                    <li><strong>E</strong>strutura — quais partes/telas?</li>
                    <li><strong>R</strong>egras — o que deve/não deve fazer?</li>
                    <li><strong>F</strong>ormato — tecnologia e design?</li>
                    <li><strong>E</strong>xemplos — mostre entrada e saída</li>
                    <li><strong>I</strong>teração — faça por partes</li>
                    <li><strong>T</strong>este — inclua testes</li>
                    <li><strong>A</strong>justes — refine com feedback</li>
                </ul>
                <h2>Ferramentas por Objetivo</h2>
                <table>
                    <tr><th>Quer criar...</th><th>Use...</th></tr>
                    <tr><td>App web simples</td><td>Cursor, Windsurf, Claude Desktop</td></tr>
                    <tr><td>Script de automação</td><td>Kimi CLI, Codex, Cursor</td></tr>
                    <tr><td>Automação visual</td><td>n8n, Make, Zapier</td></tr>
                </table>
            `,
            glossary: `
                <h1>_glossário</h1>
                <div class="card"><h3>Terminal / CLI</h3><p>Interface de texto para dar comandos ao computador.</p></div>
                <div class="card"><h3>IDE</h3><p>Ambiente de Desenvolvimento Integrado. Cursor e Windsurf são IDEs com IA.</p></div>
                <div class="card"><h3>API</h3><p>Forma de dois programas conversarem. Quando seu app "fala" com a IA, usa uma API.</p></div>
                <div class="card"><h3>Deploy</h3><p>Publicar algo na internet. Colocar seu app online.</p></div>
                <div class="card"><h3>Script</h3><p>Pequeno programa que automatiza uma tarefa específica.</p></div>
                <div class="card"><h3>HTML / CSS / JS</h3><p>As três tecnologias básicas de qualquer site.</p></div>
                <div class="card"><h3>Python</h3><p>Linguagem de programação simples e poderosa, ideal para automações.</p></div>
            `,
            links: `
                <h1>_links_úteis</h1>
                <h2>Ferramentas do Curso</h2>
                <ul>
                    <li><a href="https://claude.ai" target="_blank">Claude Desktop</a> — Chat com superpoderes</li>
                    <li><a href="https://cursor.com" target="_blank">Cursor</a> — Editor com IA</li>
                    <li><a href="https://codeium.com/windsurf" target="_blank">Windsurf</a> — Editor com IA</li>
                    <li><a href="https://platform.openai.com" target="_blank">OpenAI Platform</a> — API Codex</li>
                </ul>
                <h2>Publicação</h2>
                <ul>
                    <li><a href="https://app.netlify.com/drop" target="_blank">Netlify Drop</a></li>
                    <li><a href="https://vercel.com" target="_blank">Vercel</a></li>
                    <li><a href="https://pages.github.com" target="_blank">GitHub Pages</a></li>
                </ul>
                <h2>Automação</h2>
                <ul>
                    <li><a href="https://n8n.io" target="_blank">n8n</a></li>
                    <li><a href="https://make.com" target="_blank">Make</a></li>
                    <li><a href="https://zapier.com" target="_blank">Zapier</a></li>
                </ul>
            `
        },
        en: {
            cheatsheet: `
                <h1>_quick_guide</h1>
                <h2>Terminal Commands</h2>
                <table>
                    <tr><th>Command</th><th>What it does</th></tr>
                    <tr><td><code>pwd</code></td><td>Show current folder</td></tr>
                    <tr><td><code>ls</code> / <code>dir</code></td><td>List files</td></tr>
                    <tr><td><code>cd name</code></td><td>Enter folder</td></tr>
                    <tr><td><code>cd ..</code></td><td>Go back one folder</td></tr>
                    <tr><td><code>mkdir name</code></td><td>Create folder</td></tr>
                </table>
                <h2>The PERFECT Prompt Framework</h2>
                <ul>
                    <li><strong>P</strong>urpose — what should it do?</li>
                    <li><strong>E</strong>lements — what parts or screens?</li>
                    <li><strong>R</strong>ules — what must/must not it do?</li>
                    <li><strong>F</strong>ormat — technology and design?</li>
                    <li><strong>E</strong>xamples — show input and output</li>
                    <li><strong>C</strong>hunks — build piece by piece</li>
                    <li><strong>T</strong>ests — include test examples</li>
                </ul>
                <h2>Tools by Goal</h2>
                <table>
                    <tr><th>Want to build...</th><th>Use...</th></tr>
                    <tr><td>Simple web app</td><td>Cursor, Windsurf, Claude Desktop</td></tr>
                    <tr><td>Automation script</td><td>Kimi CLI, Codex, Cursor</td></tr>
                    <tr><td>Visual automation</td><td>n8n, Make, Zapier</td></tr>
                </table>
            `,
            glossary: `
                <h1>_glossary</h1>
                <div class="card"><h3>Terminal / CLI</h3><p>Text interface for giving commands to your computer.</p></div>
                <div class="card"><h3>IDE</h3><p>Integrated Development Environment. Cursor and Windsurf are AI-powered IDEs.</p></div>
                <div class="card"><h3>API</h3><p>How two programs talk to each other. When your app "talks" to AI, it uses an API.</p></div>
                <div class="card"><h3>Deploy</h3><p>Publishing something online. Putting your app on the internet for others to access.</p></div>
                <div class="card"><h3>Script</h3><p>Small program that automates a specific task.</p></div>
                <div class="card"><h3>HTML / CSS / JS</h3><p>The three core technologies of any website.</p></div>
                <div class="card"><h3>Python</h3><p>Simple, powerful programming language, ideal for automations.</p></div>
            `,
            links: `
                <h1>_useful_links</h1>
                <h2>Course Tools</h2>
                <ul>
                    <li><a href="https://claude.ai" target="_blank">Claude Desktop</a> — Chat with superpowers</li>
                    <li><a href="https://cursor.com" target="_blank">Cursor</a> — AI code editor</li>
                    <li><a href="https://codeium.com/windsurf" target="_blank">Windsurf</a> — AI code editor</li>
                    <li><a href="https://platform.openai.com" target="_blank">OpenAI Platform</a> — Codex API</li>
                </ul>
                <h2>Publishing</h2>
                <ul>
                    <li><a href="https://app.netlify.com/drop" target="_blank">Netlify Drop</a></li>
                    <li><a href="https://vercel.com" target="_blank">Vercel</a></li>
                    <li><a href="https://pages.github.com" target="_blank">GitHub Pages</a></li>
                </ul>
                <h2>Automation</h2>
                <ul>
                    <li><a href="https://n8n.io" target="_blank">n8n</a></li>
                    <li><a href="https://make.com" target="_blank">Make</a></li>
                    <li><a href="https://zapier.com" target="_blank">Zapier</a></li>
                </ul>
            `
        }
    };

    const langResources = resources[lang] || resources.pt;
    contentBody.innerHTML = langResources[action] || '<p>Resource not found.</p>';

    const labels = t().resources.reduce((acc, r) => { acc[r.action] = r.label; return acc; }, {});
    breadcrumb.innerHTML = `<span>${lang === 'en' ? 'Resources' : 'Recursos'}</span><span class="breadcrumb-sep">/</span>${labels[action] || action}`;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
}

/* ===== Start ===== */
document.addEventListener('DOMContentLoaded', init);
