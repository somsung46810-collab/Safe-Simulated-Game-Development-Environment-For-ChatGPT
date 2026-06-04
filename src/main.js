import * as THREE from 'three';

const root = document.querySelector('#scene-root');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(root.clientWidth, root.clientHeight);
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x06111f, 12, 42);

const camera = new THREE.PerspectiveCamera(60, root.clientWidth / root.clientHeight, 0.1, 100);
camera.position.set(8, 7, 10);
camera.lookAt(0, 0, 0);

const group = new THREE.Group();
scene.add(group);

const grid = new THREE.GridHelper(22, 22, 0x40a8ff, 0x143a66);
grid.position.y = -1.6;
group.add(grid);

const blueWire = new THREE.MeshBasicMaterial({ color: 0x2fa7ff, wireframe: true, transparent: true, opacity: 0.78 });
const redSafe = new THREE.MeshBasicMaterial({ color: 0xff3344, transparent: true, opacity: 0.42 });
const greenCheck = new THREE.MeshBasicMaterial({ color: 0x41ff8a, wireframe: true, transparent: true, opacity: 0.8 });
const goldLine = new THREE.LineBasicMaterial({ color: 0xf6d365, transparent: true, opacity: 0.9 });

function cube(size, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), material);
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
}

const mapShell = new THREE.Mesh(new THREE.BoxGeometry(9, 3.5, 6), blueWire);
mapShell.position.y = 0.4;
group.add(mapShell);

const assets = [
  cube(0.8, blueWire, -2.5, 0.6, -1.5),
  cube(0.7, blueWire, 0.5, 1.2, 0.4),
  cube(0.9, blueWire, 2.6, 0.5, 1.4)
];

const safetyBounds = [
  cube(1.15, redSafe, -2.5, 0.6, -1.5),
  cube(1.05, redSafe, 0.5, 1.2, 0.4),
  cube(1.25, redSafe, 2.6, 0.5, 1.4)
];

const checkpoints = [
  cube(1.35, greenCheck, -1.2, 0.75, 1.8),
  cube(1.35, greenCheck, 1.5, 1.35, -1.8),
  cube(1.35, greenCheck, 3.6, 0.7, 0.1)
];
checkpoints.forEach((box, index) => {
  box.rotation.set(0.5 + index * 0.2, 0.7, 0.25);
});

function makeRail(from, to) {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, goldLine);
  group.add(line);
  return line;
}

makeRail([-2.5, 0.6, -1.5], [-1.2, 0.75, 1.8]);
makeRail([0.5, 1.2, 0.4], [1.5, 1.35, -1.8]);
makeRail([2.6, 0.5, 1.4], [3.6, 0.7, 0.1]);
makeRail([0, 2.4, 0], [0, -1.6, 0]);

let safeRedraw = true;
let debugOverlay = true;

document.querySelector('#toggle-redraw').addEventListener('click', event => {
  safeRedraw = !safeRedraw;
  event.currentTarget.textContent = `Safe Redraw Mode: ${safeRedraw ? 'ON' : 'OFF'}`;
});

document.querySelector('#toggle-debug').addEventListener('click', event => {
  debugOverlay = !debugOverlay;
  [...safetyBounds, ...checkpoints].forEach(mesh => { mesh.visible = debugOverlay; });
  event.currentTarget.textContent = `Debug Overlay: ${debugOverlay ? 'ON' : 'OFF'}`;
});

function animate(time) {
  requestAnimationFrame(animate);
  const t = time * 0.001;
  group.rotation.y = Math.sin(t * 0.18) * 0.25;
  assets.forEach((asset, index) => {
    asset.rotation.x += 0.01 + index * 0.002;
    asset.rotation.y += 0.012;
    if (safeRedraw) asset.position.y += Math.sin(t + index) * 0.002;
  });
  checkpoints.forEach((checkpoint, index) => {
    checkpoint.rotation.y += 0.008 + index * 0.002;
  });
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = root.clientWidth / root.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(root.clientWidth, root.clientHeight);
});

animate(0);
