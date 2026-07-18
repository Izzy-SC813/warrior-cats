// ===== 2D CAT GRAPHICS =====
class Cat2D {
  constructor(x, y, catData) {
    this.x = x;
    this.y = y;
    this.catData = catData;
    this.scale = 1;
    this.rotation = 0;
    this.animationFrame = 0;
    this.animationSpeed = 0.1;
  }

  // Main draw function
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    // Draw body parts in order
    this.drawBody(ctx);
    this.drawLegs(ctx);
    this.drawTail(ctx);
    this.drawHead(ctx);
    this.drawEars(ctx);
    this.drawWhiskers(ctx);
    this.drawDistinctiveFeatures(ctx);

    ctx.restore();
  }

  // Body
  drawBody(ctx) {
    const body = this.catData.body || {};
    const length = body.length || 'medium';
    const build = this.catData.build || 'average';
    
    let bodyWidth = 60;
    let bodyHeight = 40;
    let bodyX = -30;
    let bodyY = -20;

    // Adjust for build
    if (build === 'lean') {
      bodyWidth *= 0.8;
      bodyHeight *= 0.9;
    } else if (build === 'muscular') {
      bodyWidth *= 1.2;
      bodyHeight *= 1.1;
    } else if (build === 'bulky') {
      bodyWidth *= 1.3;
      bodyHeight *= 1.2;
    }

    // Primary coat
    ctx.fillStyle = this.getColorHex(this.catData.primaryColor);
    this.roundRect(ctx, bodyX, bodyY, bodyWidth, bodyHeight, 15);
    ctx.fill();

    // Secondary markings on body
    if (this.catData.secondaryPattern && this.catData.secondaryPattern !== 'none') {
      this.drawPatternOnBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight);
    }

    // Tertiary markings
    if (this.catData.tertiaryPattern && this.catData.tertiaryPattern !== 'none') {
      this.drawTertiaryMarkings(ctx, bodyX, bodyY, bodyWidth, bodyHeight);
    }
  }

  // Head
  drawHead(ctx) {
    const headX = 25;
    const headY = -15;
    const headRadius = 20;

    // Head shape
    ctx.fillStyle = this.getColorHex(this.catData.primaryColor);
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle
    ctx.fillStyle = this.adjustBrightness(this.getColorHex(this.catData.primaryColor), 20);
    ctx.beginPath();
    ctx.ellipse(headX + 12, headY + 2, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(headX + 16, headY + 2, 3, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    this.drawEyes(ctx, headX, headY);

    // Blaze or face marking
    if (this.catData.secondaryPattern === 'blaze') {
      ctx.fillStyle = this.getColorHex(this.catData.secondaryColor);
      ctx.beginPath();
      ctx.moveTo(headX, headY - 18);
      ctx.lineTo(headX + 8, headY - 8);
      ctx.lineTo(headX + 5, headY + 5);
      ctx.lineTo(headX - 5, headY + 3);
      ctx.closePath();
      ctx.fill();
    }

    // Mask marking
    if (this.catData.secondaryPattern === 'mask') {
      ctx.fillStyle = this.getColorHex(this.catData.secondaryColor);
      ctx.beginPath();
      ctx.ellipse(headX + 5, headY + 2, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Eyes
  drawEyes(ctx, centerX, centerY) {
    const eyeColor = this.getColorHex(this.catData.eyeColor);
    const eyeSpacing = 10;
    const eyeY = centerY - 5;

    // Left eye
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.ellipse(centerX - eyeSpacing, eyeY, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    ctx.beginPath();
    ctx.ellipse(centerX + eyeSpacing, eyeY, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + eyeSpacing, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing + 1, eyeY - 1, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + eyeSpacing + 1, eyeY - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ears
  drawEars(ctx) {
    const earX = 15;
    const earY = -32;
    const earWidth = 8;
    const earHeight = 16;

    // Left ear
    ctx.fillStyle = this.getColorHex(this.catData.primaryColor);
    ctx.beginPath();
    ctx.moveTo(earX - 5, earY);
    ctx.lineTo(earX - 2, earY - earHeight);
    ctx.lineTo(earX - 8, earY);
    ctx.closePath();
    ctx.fill();

    // Right ear
    ctx.beginPath();
    ctx.moveTo(earX + 5, earY);
    ctx.lineTo(earX + 2, earY - earHeight);
    ctx.lineTo(earX + 8, earY);
    ctx.closePath();
    ctx.fill();

    // Inner ear flesh
    ctx.fillStyle = '#ffccaa';
    ctx.beginPath();
    ctx.moveTo(earX - 3, earY - 3);
    ctx.lineTo(earX - 1, earY - earHeight + 3);
    ctx.lineTo(earX - 5, earY - 3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(earX + 3, earY - 3);
    ctx.lineTo(earX + 1, earY - earHeight + 3);
    ctx.lineTo(earX + 5, earY - 3);
    ctx.closePath();
    ctx.fill();

    // Notched ear (if distinctive feature)
    if (this.catData.distinctiveFeature === 'notchedEar') {
      ctx.fillStyle = ctx.canvas.style.backgroundColor || '#fff';
      ctx.beginPath();
      ctx.moveTo(earX - 3, earY - 10);
      ctx.lineTo(earX + 1, earY - 8);
      ctx.lineTo(earX - 1, earY - 12);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Legs
  drawLegs(ctx) {
    const legWidth = 8;
    const legHeight = 25;
    const legY = 15;

    ctx.fillStyle = this.getColorHex(this.catData.primaryColor);

    // Front left leg
    this.roundRect(ctx, -25, legY, legWidth, legHeight, 3);
    ctx.fill();

    // Front right leg
    this.roundRect(ctx, -10, legY, legWidth, legHeight, 3);
    ctx.fill();

    // Back left leg
    this.roundRect(ctx, -20, legY, legWidth, legHeight, 3);
    ctx.fill();

    // Back right leg
    this.roundRect(ctx, -5, legY, legWidth, legHeight, 3);
    ctx.fill();

    // Paw pads
    if (this.catData.secondaryPattern === 'socks' || this.catData.secondaryPattern === 'mittens') {
      ctx.fillStyle = this.getColorHex(this.catData.secondaryColor);
      ctx.beginPath();
      ctx.ellipse(-22, legY + legHeight + 2, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-7, legY + legHeight + 2, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Tail
  drawTail(ctx) {
    const tailX = -35;
    const tailY = -5;
    const tailLength = 35;
    const curvature = Math.sin(this.animationFrame * 0.1) * 10;

    ctx.strokeStyle = this.getColorHex(this.catData.primaryColor);
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(tailX - 20, tailY - 20 + curvature, tailX - 30, tailY - 35 + curvature);
    ctx.stroke();

    // Tail rings (if distinctive feature)
    if (this.catData.secondaryPattern === 'rings') {
      ctx.strokeStyle = this.getColorHex(this.catData.secondaryColor);
      ctx.lineWidth = 3;
      for (let i = 1; i < 4; i++) {
        const progress = i / 4;
        const x = tailX + (tailX - 30 - tailX) * progress;
        const y = tailY + (tailY - 35 + curvature - tailY) * progress;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Tail tip color (if applicable)
    if (this.catData.quaternaryPattern === 'tail-tip') {
      ctx.fillStyle = this.getColorHex(this.catData.quaternaryColor || this.catData.secondaryColor);
      ctx.beginPath();
      ctx.ellipse(tailX - 28, tailY - 33 + curvature, 6, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Whiskers
  drawWhiskers(ctx) {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    const muzzleX = 40;
    const muzzleY = -13;

    // Left whiskers
    for (let i = 0; i < 3; i++) {
      const offsetY = (i - 1) * 4;
      ctx.beginPath();
      ctx.moveTo(muzzleX, muzzleY + offsetY);
      ctx.lineTo(muzzleX + 15, muzzleY + offsetY - 2);
      ctx.stroke();
    }

    // Right whiskers
    for (let i = 0; i < 3; i++) {
      const offsetY = (i - 1) * 4;
      ctx.beginPath();
      ctx.moveTo(muzzleX, muzzleY + offsetY);
      ctx.lineTo(muzzleX + 15, muzzleY + offsetY + 2);
      ctx.stroke();
    }
  }

  // Pattern on body
  drawPatternOnBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight) {
    ctx.fillStyle = this.getColorHex(this.catData.secondaryColor);

    switch (this.catData.secondaryPattern) {
      case 'socks':
        // White paws
        ctx.beginPath();
        ctx.ellipse(bodyX + bodyWidth * 0.2, bodyY + bodyHeight + 2, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'chest':
        // Chest patch
        ctx.beginPath();
        ctx.ellipse(bodyX + bodyWidth * 0.5, bodyY + bodyHeight * 0.6, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'bicolor':
        // Half and half
        ctx.fillRect(bodyX + bodyWidth / 2, bodyY, bodyWidth / 2, bodyHeight);
        break;
      case 'calico':
        // Random patches
        for (let i = 0; i < 3; i++) {
          const x = bodyX + Math.random() * bodyWidth;
          const y = bodyY + Math.random() * bodyHeight;
          ctx.beginPath();
          ctx.ellipse(x, y, 10, 8, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }
  }

  // Distinctive features
  drawDistinctiveFeatures(ctx) {
    const feature = this.catData.distinctiveFeature;

    if (feature === 'scar') {
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(35, -10);
      ctx.lineTo(45, -5);
      ctx.lineTo(40, 0);
      ctx.stroke();
    } else if (feature === 'shortTail') {
      // Already handled in drawTail
    } else if (feature === 'blindEye') {
      ctx.fillStyle = '#cccccc';
      ctx.beginPath();
      ctx.arc(30, -20, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Tertiary markings
  drawTertiaryMarkings(ctx, bodyX, bodyY, bodyWidth, bodyHeight) {
    ctx.fillStyle = this.getColorHex(this.catData.tertiaryColor || this.catData.secondaryColor);

    switch (this.catData.tertiaryPattern) {
      case 'spots':
        for (let i = 0; i < 5; i++) {
          const x = bodyX + Math.random() * bodyWidth;
          const y = bodyY + Math.random() * bodyHeight;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'stripe':
        ctx.fillRect(bodyX + 10, bodyY + 5, bodyWidth - 20, 3);
        break;
    }
  }

  // Utility: Round rectangle
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Color hex conversion
  getColorHex(colorName) {
    const colorMap = {
      orange: '#FF8C42',
      gray: '#A0A0A0',
      brown: '#8B4513',
      black: '#1a1a1a',
      white: '#F5F5F5',
      silver: '#C0C0C0',
      cream: '#FFFDD0',
      red: '#DC143C',
      cinnamon: '#CD853F',
      chocolate: '#7B3F00',
      fawn: '#E5D4C1',
      tortie: '#FF6B35'
    };
    return colorMap[colorName] || '#888888';
  }

  adjustBrightness(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  update() {
    this.animationFrame += this.animationSpeed;
  }
}

// ===== 2D NURSERY GRAPHICS =====
class Nursery2D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.time = 0;
    this.kittens = [];
  }

  drawNursery() {
    // Clear canvas
    this.ctx.fillStyle = '#8B7355';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Dirt walls
    this.drawDirtWalls();

    // Moss floor
    this.drawMossFloor();

    // Moss bedding
    this.drawMossBedding();

    // Sunlight effect
    this.drawSunlight();

    // Draw kittens
    this.drawKittens();

    // Draw entrance
    this.drawEntrance();

    this.time += 0.01;
  }

  drawDirtWalls() {
    // Back wall
    this.ctx.fillStyle = '#6B5444';
    this.ctx.fillRect(0, 0, this.width, this.height * 0.6);

    // Add texture
    this.ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * (this.height * 0.6);
      this.ctx.fillRect(x, y, Math.random() * 30, Math.random() * 20);
    }

    // Side walls
    this.ctx.fillStyle = '#6B5444';
    this.ctx.fillRect(0, 0, 20, this.height);
    this.ctx.fillRect(this.width - 20, 0, 20, this.height);
  }

  drawMossFloor() {
    // Base floor
    this.ctx.fillStyle = '#A0826D';
    this.ctx.fillRect(0, this.height * 0.6, this.width, this.height * 0.4);

    // Moss patches (darker)
    this.ctx.fillStyle = '#7A9E5F';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * this.width;
      const y = this.height * 0.6 + Math.random() * (this.height * 0.4);
      const size = Math.random() * 40 + 20;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawMossBedding() {
    // Large moss bed in the center
    this.ctx.fillStyle = '#8FBC8F';
    this.ctx.beginPath();
    this.ctx.ellipse(this.width * 0.5, this.height * 0.75, 80, 50, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Moss texture
    this.ctx.fillStyle = 'rgba(139, 195, 74, 0.4)';
    for (let i = 0; i < 30; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const distance = Math.random() * 70;
      const x = this.width * 0.5 + Math.cos(angle) * distance;
      const y = this.height * 0.75 + Math.sin(angle) * distance;
      const size = Math.random() * 5 + 2;
      this.ctx.fillRect(x, y, size, size);
    }
  }

  drawSunlight() {
    // Sunbeam effect from entrance
    const gradient = this.ctx.createLinearGradient(this.width * 0.5, 0, this.width * 0.5, this.height * 0.5);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width * 0.4, 0);
    this.ctx.lineTo(this.width * 0.6, 0);
    this.ctx.lineTo(this.width * 0.7, this.height * 0.5);
    this.ctx.lineTo(this.width * 0.3, this.height * 0.5);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawKittens() {
    for (let kitten of this.kittens) {
      kitten.update();
      kitten.draw(this.ctx);
    }
  }

  drawEntrance() {
    // Entrance tunnel opening
    this.ctx.fillStyle = '#3a3a3a';
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.5, 20, 30, 0, Math.PI, true);
    this.ctx.fill();

    // Moss covering entrance
    this.ctx.fillStyle = '#6B8E23';
    this.ctx.fillRect(this.width * 0.5 - 35, 5, 70, 20);

    // Frame the entrance
    this.ctx.strokeStyle = '#4A3728';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.5, 20, 30, 0, Math.PI, true);
    this.ctx.stroke();
  }

  addKitten(catData, x, y) {
    this.kittens.push(new Cat2D(x, y, catData));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

// ===== ANIMATION LOOP =====
function setupNurseryAnimation(canvasId, catData) {
  const nursery = new Nursery2D(canvasId);

  // Add your custom cat
  nursery.addKitten(catData, nursery.width * 0.5, nursery.height * 0.7);

  // Add some background kittens
  const backgroundCats = [
    { primaryColor: 'orange', secondaryColor: 'white', eyeColor: 'amber', build: 'average' },
    { primaryColor: 'gray', secondaryColor: 'white', eyeColor: 'green', build: 'lean' },
    { primaryColor: 'brown', secondaryColor: 'cream', eyeColor: 'gold', build: 'muscular' }
  ];

  for (let i = 0; i < backgroundCats.length; i++) {
    const x = nursery.width * 0.2 + i * (nursery.width * 0.3);
    const y = nursery.height * 0.65 + Math.random() * 20;
    nursery.addKitten(backgroundCats[i], x, y);
  }

  function animate() {
    nursery.drawNursery();
    requestAnimationFrame(animate);
  }

  animate();

  return nursery;
}
