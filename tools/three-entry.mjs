// Superficie exata do three.js que a cena do hero usa. O esbuild faz
// tree-shaking a partir daqui: tudo que nao estiver listado nao entra
// no bundle. Adicionar simbolo aqui = aumentar o peso da landing.
export {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh,
  MeshStandardMaterial, DirectionalLight, AmbientLight,
  ExtrudeGeometry, Box3, Vector3, Color,
} from 'three';
export { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
