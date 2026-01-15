import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(25, 20, 30);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ----------------------------------------------------------
// GROUND (grass)
// ----------------------------------------------------------
const grassGeometry = new THREE.PlaneGeometry(80, 80);
const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x2e8b57 });
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);

// ----------------------------------------------------------
// ROADS (thick and shaped exactly like your sketch)
// ----------------------------------------------------------
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });

// Vertical main road (left side)
const roadVertical = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 60), roadMaterial);
roadVertical.position.set(-20, 0.05, 0);
roadVertical.receiveShadow = true;
scene.add(roadVertical);

// Horizontal top road (connecting across)
const roadHorizontal = new THREE.Mesh(new THREE.BoxGeometry(60, 0.1, 10), roadMaterial);
roadHorizontal.position.set(10, 0.05, 10);
roadHorizontal.receiveShadow = true;
scene.add(roadHorizontal);

// ----------------------------------------------------------
// BUILDINGS
// ----------------------------------------------------------
const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x1e90ff });
const grayMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });

// Left column buildings (two vertically aligned)
const buildingLeftTop = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 12), blueMaterial);
buildingLeftTop.position.set(-35, 1.5, 15); // top-left
buildingLeftTop.castShadow = true;
scene.add(buildingLeftTop);

const buildingLeftBottom = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 12), blueMaterial);
buildingLeftBottom.position.set(-35, 1.5, -15); // bottom-left
buildingLeftBottom.castShadow = true;
scene.add(buildingLeftBottom);

// Top row buildings (horizontal alignment)
const buildingTopLeft = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 8), blueMaterial);
buildingTopLeft.position.set(-2, 1.5, 25);
buildingTopLeft.castShadow = true;
scene.add(buildingTopLeft);

const buildingTopRight = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 8), blueMaterial);
buildingTopRight.position.set(18, 1.5, 25);
buildingTopRight.castShadow = true;
scene.add(buildingTopRight);

// Main gray building (center-bottom)
const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(20, 6, 14), grayMaterial);
mainBuilding.position.set(5, 3, -5);
mainBuilding.castShadow = true;
scene.add(mainBuilding);

// ----------------------------------------------------------
// LIGHTS (realistic sunlight and ambient)
// ----------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Directional Light (Sun)
const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(40, 40, 20);
sunLight.castShadow = true;

sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 200;
sunLight.shadow.camera.left = -80;
sunLight.shadow.camera.right = 80;
sunLight.shadow.camera.top = 80;
sunLight.shadow.camera.bottom = -80;

scene.add(sunLight);

// Optional helper to see sunlight direction (for debugging)
// const helper = new THREE.DirectionalLightHelper(sunLight, 5);
// scene.add(helper);

// ----------------------------------------------------------
// Animate
// ----------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
