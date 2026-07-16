(function() {
    const html = document.documentElement;
    html.classList.add('js'); // progressive enhancement: sem JS, reveals não escondem nada
    const btn  = document.getElementById('landingLangBtn');
    let hero3d = null;   // instancia da cena 3D, ou null. Declarado aqui em
                         // cima porque setLang() a referencia e roda na init.

    /* ── Idioma (PT/EN) ── */
    function detectLang() {
        const saved = localStorage.getItem('lawcoder-lang');
        if (saved) return saved;
        const bl = (navigator.language || navigator.languages[0] || 'pt').toLowerCase();
        return bl.startsWith('en') ? 'en' : 'pt';
    }
    function setLang(l) {
        html.setAttribute('data-lang', l);
        html.lang = l === 'en' ? 'en' : 'pt-BR';
        document.title = l === 'en'
            ? 'LawCoder — AI in Practice for Lawyers'
            : 'LawCoder — IA Prática para Advogados';
        btn.textContent = l === 'en' ? 'PT' : 'EN';
        if (hero3d) hero3d.setLang(l);
        localStorage.setItem('lawcoder-lang', l);
    }

    setLang(detectLang());
    btn.addEventListener('click', () => {
        setLang(html.getAttribute('data-lang') === 'en' ? 'pt' : 'en');
    });

    /* ── Scroll suave para âncoras ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
        });
    });

    /* ═══════════════ MOTION LAYER ═══════════════ */
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Barra de progresso de scroll */
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    let ticking = false;
    function updateProgress() {
        const max = html.scrollHeight - html.clientHeight;
        bar.style.width = (max > 0 ? (html.scrollTop / max) * 100 : 0) + '%';
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
    updateProgress();

    /* Índices para o stagger dos grids */
    document.querySelectorAll(
        '.modules-grid, .projects-grid, .forwho-grid, .pricing-grid, .tools-row, .hero-stats-grid, .problem-grid, .steps-grid, .faq-list'
    ).forEach(grid => {
        Array.prototype.forEach.call(grid.children, (child, i) => {
            child.style.setProperty('--i', i);
        });
    });

    /* Reveal no scroll (ancestrais agnósticos de idioma) */
    const revealTargets = document.querySelectorAll(
        'section.section, .mentoring-section, .cta-section'
    );
    if (!reduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealTargets.forEach(t => io.observe(t));
    } else {
        revealTargets.forEach(t => t.classList.add('is-visible'));
    }

    /* Entrada do hero no load */
    const hero = document.querySelector('.hero');
    if (hero) {
        requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-visible')));
    }

    /* Contadores animados nos números do hero (+ pop ao terminar) */
    function runCounters() {
        document.querySelectorAll('.stat-num').forEach(el => {
            const raw = el.textContent.trim();
            const target = parseInt(raw, 10);
            if (isNaN(target)) return;            // "∞" fica como está
            if (reduce || target === 0) { el.textContent = raw; return; }
            const dur = 1200;
            const start = performance.now();
            el.textContent = '0';
            (function tick(now) {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target).toString();
                if (p < 1) requestAnimationFrame(tick);
                else { el.textContent = raw; el.classList.add('pop'); }
            })(start);
        });
    }
    if (hero) setTimeout(runCounters, reduce ? 0 : 700);

    /* Parallax sutil do hero ao rolar (transform inline, não conflita
       com o reveal que usa translate/scale individuais) */
    if (!reduce) {
        const pH1  = document.querySelectorAll('.hero-h1');
        const pEye = document.querySelectorAll('.hero-eyebrow');
        let pTick = false;
        function parallax() {
            const y = Math.min(window.scrollY, window.innerHeight);
            pH1.forEach(el  => { el.style.transform = 'translateY(' + (-y * 0.12) + 'px)'; });
            pEye.forEach(el => { el.style.transform = 'translateY(' + (-y * 0.06) + 'px)'; });
            pTick = false;
        }
        window.addEventListener('scroll', () => {
            if (!pTick) { requestAnimationFrame(parallax); pTick = true; }
        }, { passive: true });
    }

    /* ═══════════════ HERO 3D ═══════════════ */

    /* Portao: so carrega o Three.js se tudo abaixo passar.
       Ausencia de dado NUNCA reprova — deviceMemory e hardwareConcurrency
       nao existem no Safari, e reprovar por ausencia derrubaria o 3D em
       todo iPhone, que e justamente onde ele roda bem. */
    function canRun3d() {
        if (reduce) return false;
        const c = navigator.connection;
        if (c && c.saveData === true) return false;
        if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory < 4) return false;
        if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4) return false;
        try {
            const cv = document.createElement('canvas');
            if (!(cv.getContext('webgl2') || cv.getContext('webgl'))) return false;
        } catch (_) { return false; }
        return true;
    }

    async function boot3d() {
        const stage = document.getElementById('heroH1Stage');
        if (!stage || !hero || !canRun3d()) return;
        try {
            const mod = await import('./hero3d.js');
            const api = await mod.initHero3d(stage, {
                lang: html.getAttribute('data-lang') || 'pt',
            });
            if (!api) return;
            hero3d = api;
            // O h1 so sai de vista agora — depois do primeiro frame existir.
            hero.classList.add('hero--3d');
            stage.querySelector('canvas').classList.add('is-live');

            // Contexto perdido: o h1 volta, a canvas sai. Sem buraco.
            stage.addEventListener('hero3d:lost', () => {
                hero.classList.remove('hero--3d');
                if (hero3d) { try { hero3d.destroy(); } catch (_) {} hero3d = null; }
            });

            // Um loop de RAF numa aba de fundo e bateria do visitante
            // queimada a toa.
            document.addEventListener('visibilitychange', () => {
                if (!hero3d) return;
                document.hidden ? hero3d.pause() : hero3d.resume();
            });

            if ('IntersectionObserver' in window) {
                new IntersectionObserver((es) => {
                    if (!hero3d) return;
                    es[0].isIntersecting ? hero3d.resume() : hero3d.pause();
                }, { threshold: 0 }).observe(hero);
            }
        } catch (err) {
            // Qualquer falha: fica no hero CSS, que nunca desapareceu.
            console.warn('[hero3d] desativado:', err && err.message);
            hero.classList.remove('hero--3d');   // sem isto, falha tardia = h1 invisivel e sem canvas
            if (hero3d) { try { hero3d.destroy(); } catch (_) {} hero3d = null; }
        }
    }

    /* Depois do load: o 3D nunca disputa a primeira pintura.
       requestIdleCallback aceita {timeout}; setTimeout aceita ms — nao da
       pra passar o mesmo argumento pros dois. */
    if (canRun3d()) {
        window.addEventListener('load', () => {
            if (window.requestIdleCallback) {
                window.requestIdleCallback(boot3d, { timeout: 1500 });
            } else {
                window.setTimeout(boot3d, 200);   // Safari < 17.4
            }
        });
    }
})();
