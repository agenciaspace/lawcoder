(function() {
    const html = document.documentElement;
    html.classList.add('js'); // progressive enhancement: sem JS, reveals não escondem nada
    const btn  = document.getElementById('landingLangBtn');

    /* ── Idioma (PT/EN) ── */
    function detectLang() {
        const saved = localStorage.getItem('lawcoder-lang');
        if (saved) return saved;
        const bl = (navigator.language || (navigator.languages && navigator.languages[0]) || 'pt').toLowerCase();
        return bl.startsWith('en') ? 'en' : 'pt';
    }
    function setLang(l) {
        html.setAttribute('data-lang', l);
        html.lang = l === 'en' ? 'en' : 'pt-BR';
        document.title = l === 'en'
            ? 'LawCoder — Legal Tools Built By You, With AI'
            : 'LawCoder — Ferramentas Jurídicas Feitas Por Você, Com IA';
        btn.textContent = l === 'en' ? 'PT' : 'EN';
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
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    /* ═══════════════ MOTION LAYER (mínima) ═══════════════
       Alvos de reveal são sempre containers agnósticos de idioma
       (nunca elementos [data-show]), então trocar de idioma não
       re-esconde nada. */
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Índices para o stagger dos grids */
    document.querySelectorAll('.reveal-stagger').forEach(grid => {
        Array.prototype.forEach.call(grid.children, (child, i) => {
            child.style.setProperty('--i', i);
        });
    });

    /* Reveal no scroll */
    const targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!reduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        targets.forEach(t => io.observe(t));
    } else {
        targets.forEach(t => t.classList.add('is-visible'));
    }

    /* ── Scrollspy: destaca nav link da secao visivel ── */
    const navLinks = document.querySelectorAll('.nav-inline a');
    if (!reduce && 'IntersectionObserver' in window && navLinks.length) {
        const sections = Array.from(navLinks).map(a => {
            const id = a.getAttribute('href');
            return id ? document.querySelector(id) : null;
        }).filter(Boolean);
        const spyIo = new IntersectionObserver((entries) => {
            let active = '';
            entries.forEach(e => {
                if (e.isIntersecting) active = e.target.id;
            });
            navLinks.forEach(a => {
                a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
            });
        }, { threshold: 0.25, rootMargin: '0px 0px -20% 0px' });
        sections.forEach(s => spyIo.observe(s));
    }

    /* ═══════════════ HERO: campo ASCII vivo ═══════════════
       Ondas lentas de glifos mono + perturbacao do mouse + um
       feixe de scan laranja que "le" o campo periodicamente.
       Decorativo: canvas aria-hidden, pausa fora da viewport,
       honra prefers-reduced-motion (pinta um frame estatico). */
    (function heroAscii() {
        const cv = document.getElementById('heroAscii');
        if (!cv || !cv.getContext) return;
        const ctx  = cv.getContext('2d');
        const wrap = cv.parentElement;
        const CHARS  = ' ·.:;=+*x%#@'.split('');   // densidade crescente
        const CELL_W = 15, CELL_H = 19, SIZE = 11.5, FPS = 30;
        const SCAN_EVERY = 6800, SCAN_DUR = 2600;
        let w = 0, h = 0, cols = 0, rows = 0, raf = 0, running = false, last = 0;
        let mx = -9999, my = -9999, tx = -9999, ty = -9999;
        let scanStart = 0, lastScanEnd = 0, booted = 0;
        let atlasInk = [], atlasBrand = [];

        /* atlas de sprites: fillText por celula e caro; drawImage e barato */
        function buildAtlas() {
            function make(color) {
                return CHARS.map(ch => {
                    const c = document.createElement('canvas');
                    c.width = CELL_W * 2; c.height = CELL_H * 2;   // 2x p/ nitidez
                    const g = c.getContext('2d');
                    g.font = '500 ' + (SIZE * 2) + 'px "JetBrains Mono",monospace';
                    g.textAlign = 'center'; g.textBaseline = 'middle';
                    g.fillStyle = color;
                    g.fillText(ch, CELL_W, CELL_H + 1);
                    return c;
                });
            }
            atlasInk   = make('rgba(43,38,33,1)');
            atlasBrand = make('rgba(255,115,0,1)');
        }

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = wrap.clientWidth; h = wrap.clientHeight;
            cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / CELL_W); rows = Math.ceil(h / CELL_H);
        }

        function density(x, y, t) {
            const s = Math.sin(x * 0.011 + t * 0.35) * Math.cos(y * 0.016 - t * 0.22)
                    + Math.sin((x + y) * 0.007 + t * 0.16);
            let d = 0.36 + s * 0.20;                          // respiracao base
            const dx = x - mx, dy = y - my;
            d += 0.55 * Math.exp(-(dx * dx + dy * dy) / 26000); // halo do mouse
            return d < 0 ? 0 : d > 1 ? 1 : d;
        }

        function paint(now) {
            const t = now / 1000;
            ctx.clearRect(0, 0, w, h);
            mx += (tx - mx) * 0.085; my += (ty - my) * 0.085;

            /* agenda o scan (1º ~2,4s apos o loop comecar; depois a cada SCAN_EVERY) */
            let sx = -9999;
            if (scanStart) {
                const p = (now - scanStart) / SCAN_DUR;
                if (p >= 1) { scanStart = 0; lastScanEnd = now; }
                else {
                    const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
                    sx = -180 + e * (w + 360);
                }
            } else if (now - lastScanEnd > SCAN_EVERY && now - booted > 2400) {
                scanStart = now;
            }

            for (let i = 0; i < cols; i++) {
                const x = i * CELL_W + CELL_W / 2;
                for (let j = 0; j < rows; j++) {
                    const y = j * CELL_H + CELL_H / 2;
                    const d = density(x, y, t);
                    if (d < 0.07) continue;
                    const ci = Math.min(CHARS.length - 1, (d * CHARS.length) | 0);
                    const near = Math.abs(x - sx);
                    if (near < 90) {
                        const boost = 1 - near / 90;
                        ctx.globalAlpha = Math.min(1, 0.12 + boost * (0.38 + d * 0.45));
                        ctx.drawImage(atlasBrand[Math.min(CHARS.length - 1, ci + 2)], x - CELL_W, y - CELL_H, CELL_W * 2, CELL_H * 2);
                    } else {
                        ctx.globalAlpha = d * 0.13;
                        ctx.drawImage(atlasInk[ci], x - CELL_W, y - CELL_H, CELL_W * 2, CELL_H * 2);
                    }
                }
            }
            ctx.globalAlpha = 1;
        }

        function frame(now) {
            if (!running) return;
            if (!booted) booted = now;
            raf = requestAnimationFrame(frame);
            if (now - last < 1000 / FPS) return;
            last = now;
            paint(now);
        }
        function start() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(frame); } }
        function stop()  { running = false; cancelAnimationFrame(raf); }

        wrap.addEventListener('pointermove', e => {
            const r = cv.getBoundingClientRect();
            tx = e.clientX - r.left; ty = e.clientY - r.top;
        }, { passive: true });
        wrap.addEventListener('pointerleave', () => { tx = ty = -9999; }, { passive: true });
        document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

        buildAtlas();
        resize();
        window.addEventListener('resize', () => { resize(); if (reduce) paint(0); }, { passive: true });
        /* refaz o atlas quando a JetBrains Mono terminar de carregar */
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => { buildAtlas(); if (reduce) paint(0); });
        }

        if (reduce) {
            paint(0);            // um frame estatico, sem loop nem scan
        } else if ('IntersectionObserver' in window) {
            new IntersectionObserver(en => en[0].isIntersecting ? start() : stop(),
                { threshold: 0.02 }).observe(wrap);
        } else {
            start();
        }
    })();
})();
