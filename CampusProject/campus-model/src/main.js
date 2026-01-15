import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// =====================================================
// Assignment II - FINAL (Textures, Animation, Interaction, GLTF)
// =====================================================

// -------------------- Scene --------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// -------------------- Camera --------------------
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(25, 20, 30);

// -------------------- Renderer --------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Make canvas focusable so keydown always works
renderer.domElement.tabIndex = 0;
renderer.domElement.style.outline = "none";
renderer.domElement.focus();
renderer.domElement.addEventListener("pointerdown", () => {
  renderer.domElement.focus();
});

// HUD to confirm L works
const hud = document.createElement("div");
hud.style.position = "fixed";
hud.style.top = "10px";
hud.style.left = "10px";
hud.style.padding = "6px 10px";
hud.style.background = "rgba(0,0,0,0.55)";
hud.style.color = "white";
hud.style.fontFamily = "Arial, sans-serif";
hud.style.fontSize = "14px";
hud.style.zIndex = "9999";
hud.textContent = "Light: ON (press L)";
document.body.appendChild(hud);

// -------------------- OrbitControls (Task #8) --------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// =====================================================
// TEXTURES (Tasks #1, #2)
// =====================================================
const texLoader = new THREE.TextureLoader();

function loadRepeatTexture(path, rx, ry) {
  const tex = texLoader.load(path);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(rx, ry);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Paths MUST match files inside public/textures/
const grassTex = loadRepeatTexture("/textures/sparse_grass_diff_1k.jpg", 10, 10);
const roadTex = loadRepeatTexture("/textures/aerial_asphalt_01_diff_1k.jpg", 6, 2);
const brickTex = loadRepeatTexture("/textures/brick_wall_13_diff_1k.jpg", 2, 2);
const concreteTex = loadRepeatTexture("/textures/concrete_tiles_02_diff_1k.jpg", 2, 2);

// =====================================================
// GROUND (Task #2)
// =====================================================
const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({
    map: grassTex,
    roughness: 1.0,
    metalness: 0.0,
  })
);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);

// =====================================================
// ROADS (Task #2)
// =====================================================
const roadMaterial = new THREE.MeshStandardMaterial({
  map: roadTex,
  roughness: 1.0,
  metalness: 0.0,
});

const roadVertical = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.1, 60),
  roadMaterial
);
roadVertical.position.set(-20, 0.05, 0);
roadVertical.receiveShadow = true;
scene.add(roadVertical);

const roadHorizontal = new THREE.Mesh(
  new THREE.BoxGeometry(60, 0.1, 10),
  roadMaterial
);
roadHorizontal.position.set(10, 0.05, 10);
roadHorizontal.receiveShadow = true;
scene.add(roadHorizontal);

// =====================================================
// BUILDINGS (Task #1) - at least TWO textured buildings
// =====================================================
const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x1e90ff }); // keep blue

const brickMaterial = new THREE.MeshStandardMaterial({
  map: brickTex,
  roughness: 0.95,
  metalness: 0.0,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  map: concreteTex,
  roughness: 0.9,
  metalness: 0.0,
});

// Brick buildings (textured)
const buildingLeftTop = new THREE.Mesh(
  new THREE.BoxGeometry(8, 3, 12),
  brickMaterial
);
buildingLeftTop.position.set(-35, 1.5, 15);
buildingLeftTop.castShadow = true;
buildingLeftTop.receiveShadow = true;
buildingLeftTop.userData.isBuilding = true;
scene.add(buildingLeftTop);

const buildingLeftBottom = new THREE.Mesh(
  new THREE.BoxGeometry(8, 3, 12),
  brickMaterial
);
buildingLeftBottom.position.set(-35, 1.5, -15);
buildingLeftBottom.castShadow = true;
buildingLeftBottom.receiveShadow = true;
buildingLeftBottom.userData.isBuilding = true;
scene.add(buildingLeftBottom);

// Blue buildings (unchanged)
const buildingTopLeft = new THREE.Mesh(
  new THREE.BoxGeometry(12, 3, 8),
  blueMaterial
);
buildingTopLeft.position.set(-2, 1.5, 25);
buildingTopLeft.castShadow = true;
buildingTopLeft.receiveShadow = true;
buildingTopLeft.userData.isBuilding = true;
scene.add(buildingTopLeft);

const buildingTopRight = new THREE.Mesh(
  new THREE.BoxGeometry(12, 3, 8),
  blueMaterial
);
buildingTopRight.position.set(18, 1.5, 25);
buildingTopRight.castShadow = true;
buildingTopRight.receiveShadow = true;
buildingTopRight.userData.isBuilding = true;
scene.add(buildingTopRight);

// Main building (concrete textured)
const mainBuilding = new THREE.Mesh(
  new THREE.BoxGeometry(20, 6, 14),
  concreteMaterial
);
mainBuilding.position.set(5, 3, -5);
mainBuilding.castShadow = true;
mainBuilding.receiveShadow = true;
mainBuilding.userData.isBuilding = true;
scene.add(mainBuilding);

// =====================================================
// TRANSPARENT MATERIAL (Task #3)
// =====================================================
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x99ccff,
  transparent: true,
  opacity: 0.35,
  roughness: 0.05,
  transmission: 1.0,
  thickness: 0.2,
});

const glassFacade = new THREE.Mesh(
  new THREE.BoxGeometry(18, 3, 0.2),
  glassMaterial
);
glassFacade.position.set(5, 3, 2.4);
glassFacade.castShadow = true;
glassFacade.receiveShadow = true;
scene.add(glassFacade);

// =====================================================
// LIGHTING (Task #7)
// (slightly reduced so toggling is visible)
// =====================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.9);
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

// Point light on grass (Task #5 + toggled by L)
const movingLight = new THREE.PointLight(0xfff2cc, 1.6, 60);
movingLight.position.set(-18, 2.5, 0); // on grass near road
movingLight.castShadow = true;
scene.add(movingLight);

// =====================================================
// EXTERNAL GLTF MODEL (Task #4)
// =====================================================
let lanternModel = null;
const lanternLights = [];      // lights inside GLB (if any)
const lanternEmissive = [];    // emissive materials inside GLB (if any)

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/models/Lantern.glb",
  (gltf) => {
    lanternModel = gltf.scene;
    lanternModel.scale.set(0.45, 0.45, 0.45);
    lanternModel.position.set(-18, 0, 0); // put model near movingLight

    lanternModel.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        // store emissive materials so we can dim them when OFF
        const mat = obj.material;
        if (mat && mat.emissive) {
          // remember original emissiveIntensity (or default 1)
          if (mat.userData.__origEmissiveIntensity === undefined) {
            mat.userData.__origEmissiveIntensity =
              mat.emissiveIntensity !== undefined ? mat.emissiveIntensity : 1;
          }
          lanternEmissive.push(mat);
        }
      }

      // store any lights inside GLB so we can toggle them too
      if (obj.isLight) {
        lanternLights.push(obj);
      }
    });

    scene.add(lanternModel);
  },
  undefined,
  (err) => console.error("GLTF load error:", err)
);

// =====================================================
// INTERACTION (Task #6)
// - Hover highlight buildings (mouse)
// - Toggle light with "L" (keyboard) [toggles: movingLight + GLB lights + emissive]
// =====================================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;

function setHover(obj, on) {
  if (!obj) return;
  obj.scale.set(on ? 1.05 : 1.0, on ? 1.05 : 1.0, on ? 1.05 : 1.0);
}

window.addEventListener("mousemove", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
});

let lightOn = true;

function applyLanternOnOff(on) {
  // toggle our scene light
  movingLight.intensity = on ? 1.6 : 0;

  // toggle lights inside GLB
  for (const L of lanternLights) {
    // keep visible, just change intensity for reliability
    L.visible = true;
    L.intensity = on ? (L.userData.__origIntensity ?? L.intensity ?? 1) : 0;
  }

  // toggle emissive materials inside GLB (if any)
  for (const m of lanternEmissive) {
    const orig =
      m.userData.__origEmissiveIntensity !== undefined
        ? m.userData.__origEmissiveIntensity
        : 1;
    // if OFF, set emissiveIntensity to 0
    m.emissiveIntensity = on ? orig : 0;
  }
}

function toggleLight() {
  lightOn = !lightOn;
  applyLanternOnOff(lightOn);

  hud.textContent = `Light: ${lightOn ? "ON" : "OFF"} (press L)`;
  console.log("Pressed L. lightOn =", lightOn, "GLB lights:", lanternLights.length);
}

// capture keydown strongly
function onKey(e) {
  if (e.code === "KeyL" || e.key === "l" || e.key === "L") toggleLight();
}
window.addEventListener("keydown", onKey, true);
document.addEventListener("keydown", onKey, true);
renderer.domElement.addEventListener("keydown", onKey, true);

// =====================================================
// ANIMATION (Task #5)
// - flicker (only when ON) + rotate lantern
// =====================================================
let t = 0;

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  t += 0.02;

  // flicker ONLY when light is ON
  if (lightOn) {
    movingLight.intensity = 1.55 + 0.15 * Math.sin(t * 6);
  }

  // rotate lantern continuously
  if (lanternModel) lanternModel.rotation.y += 0.01;

  // Hover detection (buildings only)
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(scene.children, true);

  let hitObj = null;
  if (hits.length > 0) {
    hitObj = hits[0].object;
    while (hitObj && !hitObj.userData.isBuilding && hitObj.parent) {
      hitObj = hitObj.parent;
    }
    if (hitObj && !hitObj.userData.isBuilding) hitObj = null;
  }

  if (hovered !== hitObj) {
    setHover(hovered, false);
    hovered = hitObj;
    setHover(hovered, true);
  }

  renderer.render(scene, camera);
}
animate();

// =====================================================
// Resize
// =====================================================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
