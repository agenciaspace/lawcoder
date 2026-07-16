/* Hero 3D — a manchete do hero como geometria extrudada.
   Regras da marca em 3D: bevelEnabled:false (sem radius), fosco (sem brilho),
   fundo transparente (o creme da pagina atravessa).
   A cor da face frontal vem do fill do SVG; a lateral e a cor oposta. */
import * as THREE from './vendor/three.bundle.js';
const { SVGLoader } = THREE;

const BLACK = 0x0d0d0d;
const RED = 0xe63012;
const DEPTH = 14;   // profundidade da extrusao, em unidades do SVG
const FOV = 35;     // baixo: achata a perspectiva, mantem leitura grafica
const ASSEMBLE_MS = 1200;   // duracao total da montagem
const STAGGER_MS = 26;      // cascata por letra
const TILT_MAX = 0.14;      // ~8 graus de resposta ao mouse

const svgCache = new Map();

async function loadSvg(lang) {
    if (svgCache.has(lang)) return svgCache.get(lang);
    const loader = new SVGLoader();
    const url = new URL(`../assets/headline-${lang}.svg`, import.meta.url).href;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`headline svg ${lang}: HTTP ${res.status}`);
    const data = loader.parse(await res.text());
    svgCache.set(lang, data);
    return data;
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* Offsets derivados do indice, nao aleatorios: brutalismo e ordem, nao caos.
   Le como algo sendo colocado, nao como poeira se juntando. */
function seedOffset(i) {
    return {
        z: -180 - (i % 5) * 45,
        ry: (((i % 3) - 1) * 0.42),
        rx: (((i % 4) - 1.5) * 0.2),
    };
}

export async function initHero3d(mount, { lang }) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearAlpha(0);
    let onLost = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 4000);

    // Luz direcional dura da esquerda-alta + ambiente baixa. Sem shadow map.
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-1, 1.4, 1.6);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    let group = null;
    let raf = 0;
    let destroyed = false;

    function disposeGroup() {
        if (!group) return;
        group.traverse((o) => {
            if (!o.isMesh) return;
            o.geometry.dispose();
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        });
        scene.remove(group);
        group = null;
    }

    async function build(l) {
        disposeGroup();
        const data = await loadSvg(l);
        const g = new THREE.Group();

        data.paths.forEach((path, i) => {
            const hex = path.color.getHexString();
            const isRed = hex === 'e63012';
            // Face = a cor que a letra ja tem no CSS. Lateral = a oposta.
            const front = new THREE.MeshStandardMaterial({
                color: isRed ? RED : BLACK, roughness: 1, metalness: 0,
            });
            const side = new THREE.MeshStandardMaterial({
                color: isRed ? BLACK : RED, roughness: 1, metalness: 0,
            });
            const shapes = SVGLoader.createShapes(path);
            const geo = new THREE.ExtrudeGeometry(shapes, {
                depth: DEPTH, bevelEnabled: false, curveSegments: 6,
            });
            const mesh = new THREE.Mesh(geo, [front, side]);
            mesh.userData.i = i;
            g.add(mesh);
        });

        // Centraliza ANTES de inverter o Y. A ordem importa: com scale.y=-1
        // aplicado, getCenter() devolve o centro em espaco de MUNDO (y ja
        // negado), e subtrair isso de m.position — que e LOCAL — deslocaria
        // a manchete para longe do centro em vez de para ele. Sem scale, os
        // dois espacos coincidem e a subtracao e correta.
        const box = new THREE.Box3().setFromObject(g);
        const center = box.getCenter(new THREE.Vector3());
        g.children.forEach((m) => m.position.sub(center));

        // Alvo final de cada letra + estado inicial da montagem.
        g.children.forEach((m, i) => {
            m.userData.home = m.position.clone();
            const o = seedOffset(i);
            m.userData.seed = o;
            m.position.z = m.userData.home.z + o.z;
            m.rotation.y = o.ry;
            m.rotation.x = o.rx;
        });
        g.userData.size = box.getSize(new THREE.Vector3());

        // Agora sim: SVG tem Y para baixo, three tem Y para cima.
        // Inverter um grupo ja centrado na origem mantem ele centrado.
        g.scale.y = -1;

        scene.add(g);
        group = g;
        fit();
    }

    // Encaixa a manchete na largura da caixa do h1 visivel.
    function fit() {
        const r = mount.getBoundingClientRect();
        const w = Math.max(1, r.width);
        const h = Math.max(1, r.height);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,
            window.innerWidth < 768 ? 1.5 : 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;

        if (group) {
            const size = group.userData.size;
            // Distancia tal que a largura do grupo caiba na largura visivel.
            const vFov = (FOV * Math.PI) / 180;
            const distH = (size.y / 2) / Math.tan(vFov / 2);
            const distW = (size.x / 2) / (Math.tan(vFov / 2) * camera.aspect);
            camera.position.z = Math.max(distH, distW) * 1.06 + DEPTH;
        }
        camera.updateProjectionMatrix();
    }

    let t0 = 0;
    let assembling = true;
    let paused = false;
    let pausedAt = 0;
    const pointer = { x: 0, y: 0 };   // alvo, -1..1
    const tilt = { x: 0, y: 0 };      // atual (lerp)

    function render() { renderer.render(scene, camera); }

    function frame(now) {
        if (destroyed) return;
        raf = requestAnimationFrame(frame);
        if (!t0) t0 = now;

        if (group) {
            if (assembling) {
                const el = now - t0;
                let done = true;
                group.children.forEach((m, i) => {
                    const p = Math.min(Math.max((el - i * STAGGER_MS) / ASSEMBLE_MS, 0), 1);
                    if (p < 1) done = false;
                    const e = easeOutCubic(p);
                    const o = m.userData.seed;
                    m.position.z = m.userData.home.z + o.z * (1 - e);
                    m.rotation.y = o.ry * (1 - e);
                    m.rotation.x = o.rx * (1 - e);
                });
                if (done) assembling = false;
            }

            // Repouso: acompanha o mouse com lerp, limitado.
            tilt.x += (pointer.y * TILT_MAX - tilt.x) * 0.06;
            tilt.y += (pointer.x * TILT_MAX - tilt.y) * 0.06;
            group.rotation.x = tilt.x;
            group.rotation.y = tilt.y;

            group.position.y = scrollY;   // sobe de leve conforme rola
        }
        render();
    }

    function onPointer(e) {
        const r = mount.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    }
    window.addEventListener('pointermove', onPointer, { passive: true });

    let scrollY = 0;
    function onScroll() {
        // Espelha o fator do parallax do .hero-h1 em landing.js (-y * 0.12),
        // convertido para unidades da cena via a altura da caixa do mount.
        const y = Math.min(window.scrollY, window.innerHeight);
        const r = mount.getBoundingClientRect();
        const unitsPerPx = group ? group.userData.size.y / Math.max(1, r.height) : 0;
        scrollY = y * 0.12 * unitsPerPx;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    await build(lang);
    mount.appendChild(canvas);

    // Primeiro frame ANTES de resolver: o chamador so esconde o h1 depois
    // que existe pixel na tela.
    render();
    await new Promise((r) => requestAnimationFrame(() => r()));
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => { fit(); render(); });
    ro.observe(mount);

    // Contexto perdido (comum no mobile sob pressao de memoria):
    // avisa o chamador para reverter ao hero CSS.
    onLost = (e) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        canvas.dispatchEvent(new CustomEvent('hero3d:lost', { bubbles: true }));
    };
    canvas.addEventListener('webglcontextlost', onLost);

    return {
        async setLang(l) {
            if (destroyed) return;
            await build(l);
            t0 = 0;
            assembling = true;   // remonta no novo idioma
        },
        pause() {
            if (paused || destroyed) return;
            paused = true;
            pausedAt = performance.now();
            cancelAnimationFrame(raf);
        },
        resume() {
            if (!paused || destroyed) return;
            paused = false;
            // Empurra o inicio da montagem pelo tempo parado, senao ela
            // salta pronta em vez de retomar a cascata de onde parou.
            if (t0 && pausedAt) t0 += performance.now() - pausedAt;
            pausedAt = 0;
            raf = requestAnimationFrame(frame);
        },
        destroy() {
            destroyed = true;
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onPointer);
            window.removeEventListener('scroll', onScroll);
            canvas.removeEventListener('webglcontextlost', onLost);
            ro.disconnect();
            disposeGroup();
            renderer.dispose();
            canvas.remove();
        },
        _debug: { renderer, get group() { return group; }, fit, render },
    };
}
