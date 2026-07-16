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

export async function initHero3d(mount, { lang }) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearAlpha(0);

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

    function render() { renderer.render(scene, camera); }

    await build(lang);
    mount.appendChild(canvas);

    // Primeiro frame ANTES de resolver: o chamador so esconde o h1 depois
    // que existe pixel na tela.
    render();
    await new Promise((r) => requestAnimationFrame(() => r()));

    return {
        async setLang(l) { if (!destroyed) { await build(l); render(); } },
        destroy() {
            destroyed = true;
            cancelAnimationFrame(raf);
            disposeGroup();
            renderer.dispose();
            canvas.remove();
        },
        _debug: { renderer, get group() { return group; }, fit, render },
    };
}
