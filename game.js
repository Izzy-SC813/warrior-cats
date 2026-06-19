// --- 1. Engine Core & Environment ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xfffaed, 1.1);
sunLight.position.set(15, 35, 15);
sunLight.castShadow = true;
scene.add(sunLight);

// Floor
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a3313, roughness: 0.9 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// --- 2. Palette Settings & Material Cache ---
const furPalette = {
  orange: 0xd4a373, gray: 0x6b7782, brown: 0x544336,
  black: 0x1c1c1c, white: 0xedebe6, silver: 0xa1aab3,
  cream: 0xe6caa3
};
const eyePalette = { amber: 0xd97e18, green: 0x448c46, blue: 0x5ca9e6 };

const clanEnvironments = {
  ThunderClan: { groundColor: 0x224017, skyColor: 0x0c1710, sunColor: 0xfffaed, density: 1.1 },
  RiverClan:   { groundColor: 0x1d353b, skyColor: 0x09141c, sunColor: 0xdef0ff, density: 1.3 },
  WindClan:    { groundColor: 0x3d4f26, skyColor: 0x192429, sunColor: 0xffffff, density: 1.4 },
  ShadowClan:  { groundColor: 0x171a14, skyColor: 0x040805, sunColor: 0xd6c7a7, density: 0.8 }
};

const mainFurMat = new THREE.MeshStandardMaterial({ color: furPalette.orange, roughness: 0.7 });
const markingMat = new THREE.MeshStandardMaterial({ color: furPalette.orange, roughness: 0.7 });
const leftEyeMat = new THREE.MeshStandardMaterial({ color: eyePalette.amber, roughness: 0.1 });
const rightEyeMat = new THREE.MeshStandardMaterial({ color: eyePalette.amber, roughness: 0.1 });

// Tortoiseshell Colors
const tortieBlack = new THREE.MeshStandardMaterial({ color: furPalette.black, roughness: 0.7 });
const tortieGinger = new THREE.MeshStandardMaterial({ color: furPalette.orange, roughness: 0.7 });
const tortieCream = new THREE.MeshStandardMaterial({ color: furPalette.cream, roughness: 0.7 });
const patchPool = [tortieBlack, tortieGinger, tortieCream];

// --- 3. Construct 3D Segmented Cat ---
const playerGroup = new THREE.Group();
const customizableSegments = [];

function registerPart(mesh) {
  mesh.castShadow = true;
  playerGroup.add(mesh);
  customizableSegments.push(mesh);
  return mesh;
}

registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), mainFurMat)).position.set(0, 0.6, 0.4);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.4), mainFurMat)).position.set(0, 0.6, 0.0);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), mainFurMat)).position.set(0, 0.6, -0.4);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.48, 0.52), mainFurMat)).position.set(0.14, 1.1, 0.5);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.48, 0.52), mainFurMat)).position.set(-0.14, 1.1, 0.5);

const muzzle = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), markingMat));
muzzle.position.set(0, 1.0, 0.75);

registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.1), mainFurMat)).position.set(0.18, 1.38, 0.5);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.1), mainFurMat)).position.set(-0.18, 1.38, 0.5);

const eyeGeo = new THREE.BoxGeometry(0.09, 0.09, 0.04);
const leftEye = new THREE.Mesh(eyeGeo, leftEyeMat); leftEye.position.set(0.16, 1.15, 0.75);
const rightEye = new THREE.Mesh(eyeGeo, rightEyeMat); rightEye.position.set(-0.16, 1.15, 0.75);
playerGroup.add(leftEye, rightEye);

const legGeo = new THREE.BoxGeometry(0.16, 0.4, 0.16);
const pawGeo = new THREE.BoxGeometry(0.18, 0.12, 0.2);

function createLeg(x, z, name) {
  const legContainer = new THREE.Group();
  legContainer.position.set(x, 0.3, z);
  const legMesh = new THREE.Mesh(legGeo, mainFurMat); legMesh.position.y = 0.1; legMesh.castShadow = true;
  legContainer.add(legMesh); customizableSegments.push(legMesh);
  const pawMesh = new THREE.Mesh(pawGeo, mainFurMat); pawMesh.position.set(0, -0.12, 0.04); pawMesh.name = name + "Paw";
  legContainer.add(pawMesh); playerGroup.add(legContainer);
}
createLeg(0.28, 0.4, "frontLeft"); createLeg(-0.28, 0.4, "frontRight");
createLeg(0.28, -0.4, "backLeft"); createLeg(-0.28, -0.4, "backRight");

let tail = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.75), mainFurMat));
tail.position.set(0, 0.8, -0.8); tail.rotation.x = 0.4;

// Fluff
const fluffGroup = new THREE.Group();
const cheekL = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.3), mainFurMat)); cheekL.position.set(0.3, 1.05, 0.45);
const cheekR = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.3), mainFurMat)); cheekR.position.set(-0.3, 1.05, 0.45);
const chestF = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 0.4), mainFurMat)); chestF.position.set(0, 0.65, 0.75);
const bushyT = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.85), mainFurMat)); bushyT.position.set(0, 0.8, -0.85); bushyT.rotation.x = 0.4;
fluffGroup.add(cheekL, cheekR, chestF, bushyT);
playerGroup.add(fluffGroup); fluffGroup.visible = false;

scene.add(playerGroup);

// --- 4. Customizer Logic Functions ---
let currentFurSelection = 'orange';
function changeFur(type) {
  currentFurSelection = type;
  if (type === 'tortie') { applyTortieColors(); } 
  else {
    const hex = furPalette[type];
    mainFurMat.color.setHex(hex); markingMat.color.setHex(hex);
    customizableSegments.forEach(mesh => mesh.material = mainFurMat);
    muzzle.material = markingMat; updatePawColors(hex);
  }
}
function applyTortieColors() {
  customizableSegments.forEach(mesh => mesh.material = patchPool[Math.floor(Math.random() * 3)]);
  muzzle.material = tortieGinger; updatePawColors(furPalette.black);
}
function changeEyes(type) { leftEyeMat.color.setHex(eyePalette[type]); rightEyeMat.color.setHex(eyePalette[type]); }
function changeMarkings(style) {
  if (currentFurSelection === 'tortie') return; 
  if (style === 'solid') { markingMat.color.setHex(furPalette[currentFurSelection]); updatePawColors(furPalette[currentFurSelection]); } 
  else if (style === 'socks') { markingMat.color.setHex(furPalette[currentFurSelection]); updatePawColors(0xedebe6); } 
  else if (style === 'tabby') { markingMat.color.setHex(0x2d2015); updatePawColors(furPalette[currentFurSelection]); } 
  else if (style === 'point') { markingMat.color.setHex(0x2b1e14); updatePawColors(0x2b1e14); }
}
function updatePawColors(hexColor) {
  playerGroup.traverse((child) => { if (child.name && child.name.includes("Paw")) child.material = new THREE.MeshStandardMaterial({ color: hexColor, roughness: 0.7 }); });
}
function changeLength(lengthType) {
  if (lengthType === 'long') { fluffGroup.visible = true; tail.visible = false; } else { fluffGroup.visible = false; tail.visible = true; }
}
function selectClan(clanName) {
  selectedClan = clanName; const env = clanEnvironments[clanName];
  floorMaterial.color.setHex(env.groundColor); scene.background.setHex(env.skyColor);
  sunLight.color.setHex(env.sunColor); sunLight.intensity = env.density;
}
selectClan("ThunderClan");

// --- 5. NEW: Hunting & Fighting Entity Management Arrays ---
let catData = { prefix: "Fire", suffix: "kit", rank: "Kit", moons: 0, inventory: [], hp: 100, freshKill: 0 };
let selectedClan = "ThunderClan";

const herbsArray = [];
const preyArray = [];
const rogueArray = [];

// Spawners
function spawnHerb(x, z) {
  let m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 0.35, 5), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
  m.position.set(x, 0.15, z); scene.add(m); herbsArray.push(m);
}

function spawnPrey(x, z) {
  // Prey look like little small scurrying gray blocks
  let m = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.3), new THREE.MeshStandardMaterial({ color: 0x828282 }));
  m.position.set(x, 0.08, z);
  m.direction = Math.random() * Math.PI * 2; // Move angle tracking
  scene.add(m);
  preyArray.push(m);
}

function spawnRogue(x, z) {
  // Rogues are dark-furred cats with glowing crimson eye slots
  let rogue = new THREE.Group();
  let rBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.2), new THREE.MeshStandardMaterial({ color: 0x242424 }));
  rBody.position.y = 0.5; rogue.add(rBody);
  let rHead = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x141414 }));
  rHead.position.set(0, 0.9, 0.4); rogue.add(rHead);
  let rEye = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.05), new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 }));
  rEye.position.set(0, 0.95, 0.61); rogue.add(rEye);
  
  rogue.position.set(x, 0, z);
  rogue.hp = 60; // Rogue health pool
  scene.add(rogue);
  rogueArray.push(rogue);
}

// Global World Entity Spawns
spawnHerb(12, 10); spawnHerb(-10, -8);
spawnPrey(5, 5); spawnPrey(-12, 15); spawnPrey(18, -10);
spawnRogue(-15, -15); spawnRogue(20, 20);

// --- 6. Simulator Lifecycle Engine ---
function startGame() {
  catData.prefix = document.getElementById('nameInput').value.trim() || "Fire";
  document.getElementById('customizationMenu').style.display = 'none';
  document.getElementById('gameStats').style.display = 'block';
  playerGroup.scale.set(0.4, 0.4, 0.4);
  updateUI();
  setInterval(ageOneMoon, 25000);
}

function updateUI() {
  document.getElementById('catName').innerText = `Name: ${catData.prefix}${catData.suffix}`;
  document.getElementById('catClan').innerText = `Clan: ${selectedClan}`;
  document.getElementById('catRank').innerText = `Rank: ${catData.rank}`;
  document.getElementById('catAge').innerText = `Age: ${catData.moons} Moons`;
  document.getElementById('catHP').innerText = `Health: ${catData.hp}%`;
