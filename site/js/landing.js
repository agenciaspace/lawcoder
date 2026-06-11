(function() {
    const html = document.documentElement;
    const btn  = document.getElementById('landingLangBtn');

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
        localStorage.setItem('lawcoder-lang', l);
    }

    setLang(detectLang());
    btn.addEventListener('click', () => {
        setLang(html.getAttribute('data-lang') === 'en' ? 'pt' : 'en');
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
        });
    });
})();
