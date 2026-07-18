// --- 1. ENGINE CORE & ENVIRONMENT ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xfffaed, 1.1);
sunLight.position.set(15, 35, 15);
sunLight.castShadow = true;
scene.add(sunLight);

// Floor Mesh
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a3313, roughness: 0.9 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// --- 2. PALETTE SETTINGS & MATERIAL CACHE ---
const furPalette = {
  orange: 0xd4a373,
  gray: 0x6b7782,
  brown: 0x544336,
  black: 0x1c1c1c,
  white: 0xedebe6,
  silver: 0xa1aab3,
  cream: 0xe6caa3,
  red: 0xa84432,
  cinnamon: 0x8b5a3c,
  chocolate: 0x3e2723,
  fawn: 0xc2a082
};

const eyePalette = {
  amber: 0xd97e18,
  green: 0x448c46,
  blue: 0x5ca9e6,
  gold: 0xffd700,
  copper: 0xb87333,
  yellow: 0xffff00,
  orange: 0xffa500,
  emerald: 0x50c878,
  sapphire: 0x0f52ba,
  violet: 0xee82ee,
  silver: 0xc0c0c0,
  gray: 0xa9a9a9
};

// Clan Environments Data
const clanEnvironments = {
  ThunderClan: { groundColor: 0x224017, skyColor: 0x0c1710, sunColor: 0xfffaed, density: 1.1, icon: '⚡' },
  RiverClan:   { groundColor: 0x1d353b, skyColor: 0x09141c, sunColor: 0xdef0ff, density: 1.3, icon: '💧' },
  WindClan:    { groundColor: 0x3d4f26, skyColor: 0x192429, sunColor: 0xffffff, density: 1.4, icon: '🌬️' },
  ShadowClan:  { groundColor: 0x171a14, skyColor: 0x040805, sunColor: 0xd6c7a7, density: 0.8, icon: '🌙' },
  SkyClan:     { groundColor: 0x2a3a4a, skyColor: 0x1a2a3a, sunColor: 0xd4c5ff, density: 1.0, icon: '☁️' }
};

const mainFurMat = new THREE.MeshStandardMaterial({ color: furPalette.orange, roughness: 0.7 });
const markingMat = new THREE.MeshStandardMaterial({ color: furPalette.white, roughness: 0.7 });
const tertiaryMat = new THREE.MeshStandardMaterial({ color: furPalette.white, roughness: 0.7 });
const quaternaryMat = new THREE.MeshStandardMaterial({ color: furPalette.white, roughness: 0.7 });
const leftEyeMat = new THREE.MeshStandardMaterial({ color: eyePalette.amber, roughness: 0.1 });
const rightEyeMat = new THREE.MeshStandardMaterial({ color: eyePalette.amber, roughness: 0.1 });

// Tortoiseshell Colors
const tortieBlack = new THREE.MeshStandardMaterial({ color: furPalette.black, roughness: 0.7 });
const tortieGinger = new THREE.MeshStandardMaterial({ color: furPalette.orange, roughness: 0.7 });
const tortieCream = new THREE.MeshStandardMaterial({ color: furPalette.cream, roughness: 0.7 });
const patchPool = [tortieBlack, tortieGinger, tortieCream];

// --- 3. CONSTRUCT 3D SEGMENTED CAT ---
const playerGroup = new THREE.Group();
const customizableSegments = [];
const secondarySegments = [];
const tertiarySegments = [];
const quaternarySegments = [];

function registerPart(mesh) {
  mesh.castShadow = true;
  playerGroup.add(mesh);
  customizableSegments.push(mesh);
  return mesh;
}

function registerSecondaryPart(mesh) {
  mesh.castShadow = true;
  playerGroup.add(mesh);
  secondarySegments.push(mesh);
  return mesh;
}

function registerTertiaryPart(mesh) {
  mesh.castShadow = true;
  playerGroup.add(mesh);
  tertiarySegments.push(mesh);
  return mesh;
}

function registerQuaternaryPart(mesh) {
  mesh.castShadow = true;
  playerGroup.add(mesh);
  quaternarySegments.push(mesh);
  return mesh;
}

// Segmented Torso
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), mainFurMat)).position.set(0, 0.6, 0.4);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.4), mainFurMat)).position.set(0, 0.6, 0.0);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), mainFurMat)).position.set(0, 0.6, -0.4);

// Split Head Halves
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.48, 0.52), mainFurMat)).position.set(0.14, 1.1, 0.5);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.48, 0.52), mainFurMat)).position.set(-0.14, 1.1, 0.5);

// Muzzle
const muzzle = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), markingMat));
muzzle.position.set(0, 1.0, 0.75);

// Ears
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.1), mainFurMat)).position.set(0.18, 1.38, 0.5);
registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.1), mainFurMat)).position.set(-0.18, 1.38, 0.5);

// 3D Eyeballs
const eyeGeo = new THREE.BoxGeometry(0.09, 0.09, 0.04);
const leftEye = new THREE.Mesh(eyeGeo, leftEyeMat); leftEye.position.set(0.16, 1.15, 0.75);
const rightEye = new THREE.Mesh(eyeGeo, rightEyeMat); rightEye.position.set(-0.16, 1.15, 0.75);
playerGroup.add(leftEye, rightEye);

// Legs & Paws
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

// Long Hair / Fluff Extenders
const fluffGroup = new THREE.Group();
const cheekL = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.3), mainFurMat)); cheekL.position.set(0.3, 1.05, 0.45);
const cheekR = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.3), mainFurMat)); cheekR.position.set(-0.3, 1.05, 0.45);
const chestF = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 0.4), mainFurMat)); chestF.position.set(0, 0.65, 0.75);
const bushyT = registerPart(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.85), mainFurMat)); bushyT.position.set(0, 0.8, -0.85); bushyT.rotation.x = 0.4;

fluffGroup.add(cheekL, cheekR, chestF, bushyT);
playerGroup.add(fluffGroup); fluffGroup.visible = false;

// Secondary patches
const chestPatch = registerSecondaryPart(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.3), markingMat));
chestPatch.position.set(0, 0.7, 0.5);
chestPatch.visible = false;

const facePatch = registerSecondaryPart(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 0.2), markingMat));
facePatch.position.set(0, 1.05, 0.65);
facePatch.visible = false;

// Tertiary patches
const tertiaryChest = registerTertiaryPart(new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.2), tertiaryMat));
tertiaryChest.position.set(0, 0.75, 0.55);
tertiaryChest.visible = false;

const tertiaryFace = registerTertiaryPart(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.15), tertiaryMat));
tertiaryFace.position.set(0, 1.1, 0.7);
tertiaryFace.visible = false;

// Quaternary patches (smallest accents)
const quaternaryTip = registerQuaternaryPart(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.15), quaternaryMat));
quaternaryTip.position.set(0, 0.7, -0.7);
quaternaryTip.visible = false;

const quaternaryNose = registerQuaternaryPart(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), quaternaryMat));
quaternaryNose.position.set(0, 0.95, 0.8);
quaternaryNose.visible = false;

scene.add(playerGroup);

// --- 4. CUSTOMIZER LOGIC FUNCTIONS ---
let currentPrimaryFur = 'orange';
let currentSecondaryFur = 'white';
let currentTertiaryFur = 'none';
let currentQuaternaryFur = 'none';
let currentPrimaryPattern = 'solid';
let currentSecondaryPattern = 'none';
let currentTertiaryPattern = 'none';
let currentQuaternaryPattern = 'none';
let currentFurLength = 'short';
let currentFurTexture = 'normal';
let currentBuild = 'average';
let currentDistinctiveFeature = 'none';

// Update preview canvas with cat info
function updatePreviewInfo() {
  const nameInput = document.getElementById('nameInput').value.trim() || 'Fire';
  const catNameDisplay = document.getElementById('catNamePreview');
  const catDescription = document.getElementById('catDescription');
  
  catNameDisplay.textContent = nameInput + '-kit';
  
  let description = `${currentBuild.charAt(0).toUpperCase() + currentBuild.slice(1)} ${currentPrimaryFur}`;
  if (currentFurLength === 'long' || currentFurLength === 'extra-long') {
    description += ' fluffy';
  }
  catDescription.textContent = description;
}

function changePrimaryFur(type) {
  currentPrimaryFur = type;
  if (type === 'tortie') { 
    applyTortieColors(); 
  } else {
    const hex = furPalette[type];
    mainFurMat.color.setHex(hex);
    customizableSegments.forEach(mesh => {
      if (mesh !== muzzle && !mesh.name?.includes('Paw')) {
        mesh.material = mainFurMat;
      }
    });
    applyTexture();
  }
  updatePreviewInfo();
}

function changeSecondaryFur(type) {
  currentSecondaryFur = type;
  const hex = furPalette[type];
  markingMat.color.setHex(hex);
  secondarySegments.forEach(mesh => mesh.material = markingMat);
  applySecondaryPattern();
  updatePreviewInfo();
}

function changeTertiaryFur(type) {
  currentTertiaryFur = type;
  if (type === 'none') {
    tertiarySegments.forEach(mesh => mesh.visible = false);
  } else {
    const hex = furPalette[type];
    tertiaryMat.color.setHex(hex);
    tertiarySegments.forEach(mesh => mesh.material = tertiaryMat);
  }
  applyTertiaryPattern();
  updatePreviewInfo();
}

function changeQuaternaryFur(type) {
  currentQuaternaryFur = type;
  if (type === 'none') {
    quaternarySegments.forEach(mesh => mesh.visible = false);
  } else {
    const hex = furPalette[type];
    quaternaryMat.color.setHex(hex);
    quaternarySegments.forEach(mesh => mesh.material = quaternaryMat);
  }
  applyQuaternaryPattern();
  updatePreviewInfo();
}

function changePrimaryPattern(type) {
  currentPrimaryPattern = type;
  applyPatternEffect();
  updatePreviewInfo();
}

function changeSecondaryPattern(type) {
  currentSecondaryPattern = type;
  applySecondaryPattern();
  updatePreviewInfo();
}

function changeTertiaryPattern(type) {
  currentTertiaryPattern = type;
  applyTertiaryPattern();
  updatePreviewInfo();
}

function changeQuaternaryPattern(type) {
  currentQuaternaryPattern = type;
  applyQuaternaryPattern();
  updatePreviewInfo();
}

function applySecondaryPattern() {
  chestPatch.visible = false;
  facePatch.visible = false;
  
  switch(currentSecondaryPattern) {
    case 'socks':
      updatePawColors(furPalette[currentSecondaryFur]);
      break;
    case 'blaze':
      facePatch.visible = true;
      break;
    case 'chest':
      chestPatch.visible = true;
      break;
    case 'calico':
      chestPatch.visible = true;
      facePatch.visible = true;
      break;
    case 'points':
      updatePawColors(furPalette[currentSecondaryFur]);
      muzzle.material = markingMat;
      break;
    case 'mittens':
      updatePawColors(furPalette[currentSecondaryFur]);
      break;
    case 'belly':
      chestPatch.visible = true;
      break;
    case 'saddle':
      chestPatch.visible = true;
      break;
  }
}

function applyTertiaryPattern() {
  tertiaryChest.visible = false;
  tertiaryFace.visible = false;
  
  if (currentTertiaryFur === 'none') return;
  
  switch(currentTertiaryPattern) {
    case 'chest':
      tertiaryChest.visible = true;
      break;
    case 'blaze':
      tertiaryFace.visible = true;
      break;
    case 'stripe':
      tertiaryChest.visible = true;
      break;
    case 'spots':
      tertiaryFace.visible = true;
      tertiaryChest.visible = true;
      break;
    case 'paws':
      updatePawColors(furPalette[currentTertiaryFur]);
      break;
  }
}

function applyQuaternaryPattern() {
  quaternaryTip.visible = false;
  quaternaryNose.visible = false;
  
  if (currentQuaternaryFur === 'none') return;
  
  switch(currentQuaternaryPattern) {
    case 'tail-tip':
      quaternaryTip.visible = true;
      break;
    case 'nose':
      quaternaryNose.visible = true;
      break;
    case 'spots':
      quaternaryNose.visible = true;
      quaternaryTip.visible = true;
      break;
  }
}

function applyPatternEffect() {
  let roughness = 0.7;
  switch(currentPrimaryPattern) {
    case 'sleek': roughness = 0.4; break;
    case 'matte': roughness = 0.9; break;
    case 'tabby': roughness = 0.6; break;
    case 'spotted': roughness = 0.65; break;
  }
  mainFurMat.roughness = roughness;
}

function applyTortieColors() {
  customizableSegments.forEach(mesh => mesh.material = patchPool[Math.floor(Math.random() * 3)]);
  muzzle.material = tortieGinger;
  updatePawColors(furPalette.black);
}

function changePrimaryEyes(type) { 
  leftEyeMat.color.setHex(eyePalette[type]); 
  rightEyeMat.color.setHex(eyePalette[type]);
  updatePreviewInfo();
}

function changeLength(lengthType) {
  currentFurLength = lengthType;
  const hasFluff = lengthType !== 'short';
  fluffGroup.visible = hasFluff;
  
  if (lengthType === 'extra-long') {
    cheekL.scale.set(1.3, 1.3, 1.3);
    cheekR.scale.set(1.3, 1.3, 1.3);
    bushyT.scale.set(1.3, 1.3, 1.3);
  } else if (lengthType === 'long') {
    cheekL.scale.set(1.1, 1.1, 1.1);
    cheekR.scale.set(1.1, 1.1, 1.1);
    bushyT.scale.set(1.1, 1.1, 1.1);
  } else {
    cheekL.scale.set(1, 1, 1);
    cheekR.scale.set(1, 1, 1);
    bushyT.scale.set(1, 1, 1);
  }
  updatePreviewInfo();
}

function changeFurTexture(type) {
  currentFurTexture = type;
  let roughness = 0.7;
  
  switch(type) {
    case 'sleek': roughness = 0.3; break;
    case 'matte': roughness = 0.95; break;
    case 'rough': roughness = 0.85; break;
    case 'curly': roughness = 0.8; break;
  }
  
  mainFurMat.roughness = roughness;
  markingMat.roughness = roughness;
  updatePreviewInfo();
}

function changeBuild(type) {
  currentBuild = type;
  let scaleX = 1, scaleY = 1, scaleZ = 1;
  
  switch(type) {
    case 'lean':
      scaleX = 0.85; scaleY = 0.95;
      break;
    case 'muscular':
      scaleX = 1.15; scaleY = 1.1;
      break;
    case 'slender':
      scaleX = 0.8; scaleY = 1.05;
      break;
    case 'bulky':
      scaleX = 1.25; scaleY = 1.15;
      break;
  }
  
  playerGroup.children.forEach(child => {
    if (child !== fluffGroup) {
      child.scale.set(scaleX, scaleY, scaleZ);
    }
  });
  updatePreviewInfo();
}

function changeDistinctiveFeature(type) {
  currentDistinctiveFeature = type;
  switch(type) {
    case 'shortTail':
      tail.scale.z = 0.6;
      break;
    case 'whiteTip':
      tail.material = markingMat;
      break;
    default:
      tail.scale.z = 1;
      tail.material = mainFurMat;
  }
  updatePreviewInfo();
}

function updatePawColors(hexColor) {
  playerGroup.traverse((child) => { 
    if (child.name && child.name.includes("Paw")) {
      child.material = new THREE.MeshStandardMaterial({ color: hexColor, roughness: 0.7 }); 
    }
  });
}

function selectClan(clanName) {
  selectedClan = clanName;
  const env = clanEnvironments[clanName];
  floorMaterial.color.setHex(env.groundColor);
  scene.background.setHex(env.skyColor);
  sunLight.color.setHex(env.sunColor);
  sunLight.intensity = env.density;
  
  // Update clan badge
  const badge = document.getElementById('clanBadge');
  badge.className = 'clan-badge ' + Object.keys(clanEnvironments).find(key => key === clanName)?.toLowerCase();
  if (clanName === 'ThunderClan') badge.className = 'clan-badge tc';
  else if (clanName === 'RiverClan') badge.className = 'clan-badge rc';
  else if (clanName === 'WindClan') badge.className = 'clan-badge wc';
  else if (clanName === 'ShadowClan') badge.className = 'clan-badge sc';
  else if (clanName === 'SkyClan') badge.className = 'clan-badge kc';
  
  badge.innerHTML = `<span class="clan-icon">${env.icon}</span><span class="clan-name">${clanName}</span>`;
  updatePreviewInfo();
}
selectClan("ThunderClan");

// --- 5. DATA STATE & ENTITY ARRAYS ---
let catData = { prefix: "Fire", suffix: "kit", rank: "Kit", moons: 0, inventory: [], hp: 100, freshKill: 0 };
let selectedClan = "ThunderClan";
let gameStarted = false;

const herbsArray = [];
const preyArray = [];
const rogueArray = [];

function spawnHerb(x, z) {
  let m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 0.35, 5), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
  m.position.set(x, 0.15, z); scene.add(m); herbsArray.push(m);
}

function spawnPrey(x, z) {
  let m = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.3), new THREE.MeshStandardMaterial({ color: 0x828282 }));
  m.position.set(x, 0.08, z); m.direction = Math.random() * Math.PI * 2; scene.add(m); preyArray.push(m);
}

function spawnRogue(x, z) {
  let rogue = new THREE.Group();
  let rBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.2), new THREE.MeshStandardMaterial({ color: 0x242424 })); rBody.position.y = 0.5; rogue.add(rBody);
  let rHead = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x141414 })); rHead.position.set(0, 0.9, 0.4); rogue.add(rHead);
  let rEye = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.05), new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 })); rEye.position.set(0, 0.95, 0.61); rogue.add(rEye);
  rogue.position.set(x, 0, z); rogue.hp = 60; scene.add(rogue); rogueArray.push(rogue);
}

// Generate Starting Map Placements
spawnHerb(12, 10); spawnHerb(-10, -8);
spawnPrey(5, 5); spawnPrey(-12, 15); spawnPrey(18, -10);
spawnRogue(-15, -15); spawnRogue(20, 20);

// --- 6. SIMULATOR RUNTIME CONTROLS ---
function startGame() {
  catData.prefix = document.getElementById('nameInput').value.trim() || "Fire";
  document.getElementById('customizationMenu').style.display = 'none';
  document.getElementById('nurseryUI').style.display = 'flex';
  gameStarted = false;
}

function enterForest() {
  document.getElementById('nurseryUI').style.display = 'none';
  document.getElementById('gameStats').style.display = 'block';
  document.querySelector('.mobile-controls').classList.add('show');
  playerGroup.scale.set(0.4, 0.4, 0.4);
  camera.position.set(0, 2, 3);
  camera.lookAt(0, 0.5, 0);
  updateUI();
  gameStarted = true;
  animate();
  setInterval(ageOneMoon, 25000);
}

function backToCustomizer() {
  document.getElementById('nurseryUI').style.display = 'none';
  document.getElementById('customizationMenu').style.display = 'block';
}

function updateUI() {
  document.getElementById('catName').innerText = `Name: ${catData.prefix}${catData.suffix}`;
  document.getElementById('catClan').innerText = `Clan: ${selectedClan}`;
  document.getElementById('catRank').innerText = `Rank: ${catData.rank}`;
  document.getElementById('catAge').innerText = `Age: ${catData.moons} Moons`;
  document.getElementById('catHP').innerText = `Health: ${catData.hp}%`;
  document.getElementById('freshKill').innerText = `Fresh-Kill Pile: ${catData.freshKill}`;
}

function ageOneMoon() {
  catData.moons++;
  if (catData.moons === 6) catData.rank = "Apprentice";
  if (catData.moons === 12) catData.rank = "Warrior";
  updateUI();
}

// --- 7. INPUT HANDLING (Keyboard + Touch) ---
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Mobile Touch Controls
function setupMobileControls() {
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'mobile-controls';
  controlsDiv.innerHTML = `
    <div class="mobile-dpad">
      <button class="mobile-btn dpad-up" data-dir="up">▲</button>
      <button class="mobile-btn dpad-left" data-dir="left">◄</button>
      <button class="mobile-btn dpad-down" data-dir="down">▼</button>
      <button class="mobile-btn dpad-right" data-dir="right">►</button>
    </div>
    <button class="mobile-btn" id="attackBtn" style="width: 100px;">ATTACK</button>
  `;
  document.getElementById('uiOverlay').appendChild(controlsDiv);
  
  const mobileDirections = { up: false, down: false, left: false, right: false };
  
  document.querySelectorAll('.mobile-dpad button').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const dir = btn.dataset.dir;
      mobileDirections[dir] = true;
    });
    btn.addEventListener('pointerup', () => {
      const dir = btn.dataset.dir;
      mobileDirections[dir] = false;
    });
    btn.addEventListener('pointerleave', () => {
      const dir = btn.dataset.dir;
      mobileDirections[dir] = false;
    });
  });
  
  document.getElementById('attackBtn').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    keys[' '] = true;
  });
  document.getElementById('attackBtn').addEventListener('pointerup', () => {
    keys[' '] = false;
  });
  
  return mobileDirections;
}

const mobileDirections = setupMobileControls();

// Add event listeners for real-time preview updates
document.getElementById('nameInput').addEventListener('input', updatePreviewInfo);

// --- 8. MAIN ANIMATION LOOP ---
function animate() {
  if (!gameStarted) return;
  
  requestAnimationFrame(animate);
  
  // Move prey
  preyArray.forEach(prey => {
    prey.position.x += Math.cos(prey.direction) * 0.02;
    prey.position.z += Math.sin(prey.direction) * 0.02;
    if (Math.random() < 0.02) prey.direction = Math.random() * Math.PI * 2;
  });
  
  // Move player (Keyboard)
  if (keys['w']) playerGroup.position.z -= 0.1;
  if (keys['s']) playerGroup.position.z += 0.1;
  if (keys['a']) playerGroup.position.x -= 0.1;
  if (keys['d']) playerGroup.position.x += 0.1;
  
  // Move player (Mobile)
  if (mobileDirections.up) playerGroup.position.z -= 0.1;
  if (mobileDirections.down) playerGroup.position.z += 0.1;
  if (mobileDirections.left) playerGroup.position.x -= 0.1;
  if (mobileDirections.right) playerGroup.position.x += 0.1;
  
  // Spacebar/Attack - hunt/fight
  if (keys[' ']) {
    preyArray.forEach((prey, i) => {
      const dist = playerGroup.position.distanceTo(prey.position);
      if (dist < 1.5) {
        catData.freshKill++;
        scene.remove(prey);
        preyArray.splice(i, 1);
      }
    });
    
    rogueArray.forEach((rogue, i) => {
      const dist = playerGroup.position.distanceTo(rogue.position);
      if (dist < 2) {
        rogue.hp -= 10;
        if (rogue.hp <= 0) {
          scene.remove(rogue);
          rogueArray.splice(i, 1);
        }
        catData.hp = Math.max(0, catData.hp - 5);
      }
    });
    
    updateUI();
    keys[' '] = false;
  }
  
  // Camera follow
  camera.position.x = playerGroup.position.x;
  camera.position.z = playerGroup.position.z + 3;
  camera.lookAt(playerGroup.position);
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize preview
updatePreviewInfo();
