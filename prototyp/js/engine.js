'use strict';

let canvas, ctx;
let keys = {};
let prevKeys = {};
let levelObjects = []; // Filled by each level's initLevel()
let camera = { x: 0, y: 0 };

const world = { width: 6000, height: 2500 };
const camBox = { xMargin: 0, yMargin: 0 };

// ---- Textured (tileable) images ----
// NOTE: type is "platform", file name is "plattform.png" per your assets.
const tex = {
  danger:   new Image(),
  platform: new Image(),
  catcher:  new Image(),
};
tex.danger.src   = 'Images/danger.png';
tex.platform.src = 'Images/plattform.png';
tex.catcher.src  = 'Images/catcher.png';

// ---- Parallax Background ----
const bg = {
  img: null,
  ready: false,
  fx: 0.25,  // <1 => moves slower than camera (far background)
  fy: 0.00,
  enabled: false,
};

function setBackground(src, opts = {}) {
  bg.img = new Image();
  bg.ready = false;
  bg.enabled = true;
  if (opts.fx != null) bg.fx = opts.fx;
  if (opts.fy != null) bg.fy = opts.fy;
  bg.img.onload = () => { bg.ready = true; };
  bg.img.src = src;
}

// ---- Level → Background mapping ----
const LEVEL_BACKGROUNDS = {
  zoo:        { src: 'Images/backgroundzoo.png',        fx: 0.25, fy: 0.00 },
  village:    { src: 'Images/backgroundvillage.png',    fx: 0.25, fy: 0.00 },
  forest:     { src: 'Images/backgroundforest.png',     fx: 0.25, fy: 0.00 },
  canyon:     { src: 'Images/backgroundcanyon.png',     fx: 0.25, fy: 0.00 },
  matterhorn: { src: 'Images/backgroundmatterhorn.png', fx: 0.25, fy: 0.00 },
};

// Call inside each level’s initLevel() after setting window.LEVEL_THEME
function applyLevelBackground() {
  const key = (window.LEVEL_THEME || '').toLowerCase();
  const cfg = LEVEL_BACKGROUNDS[key] || LEVEL_BACKGROUNDS.zoo;
  setBackground(cfg.src, { fx: cfg.fx, fy: cfg.fy });
}

function clearBackground() {
  bg.enabled = false;
  bg.img = null;
  bg.ready = false;
}

function drawParallaxBackground() {
  if (!bg.enabled || !bg.ready || !bg.img) return;

  const iw = bg.img.naturalWidth;
  const ih = bg.img.naturalHeight;
  if (!iw || !ih) return;

  // Offset relative to camera, slowed by parallax factors
  const ox = Math.floor(camera.x * bg.fx);
  const oy = Math.floor(camera.y * bg.fy);

  // Choose start tile so the screen is seamlessly filled
  const startX = -((ox % iw) + iw) % iw;
  const startY = -((oy % ih) + ih) % ih;

  for (let x = startX; x < canvas.width; x += iw) {
    for (let y = startY; y < canvas.height; y += ih) {
      ctx.drawImage(bg.img, x, y);
    }
  }
}

// ======================
// Init & Loop
// ======================
function initGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'e' && typeof toggleCamouflage === 'function') {
      toggleCamouflage();
    }
  });
  window.addEventListener('keyup', (e) => { keys[e.key] = false; });

  // Quiz -> carry over lives, if provided
  if (typeof window.playerLives !== 'undefined' && typeof player !== 'undefined') {
    player.lives = window.playerLives;
    console.log('[Engine] player.lives from Quiz:', player.lives);
  }

  // Level init
  try {
    if (typeof initLevel === 'function') initLevel();
    else console.warn('[Engine] initLevel() not defined. Ensure levelX.js is loaded.');
  } catch (e) {
    console.error('[Engine] Error in initLevel():', e);
  }

  // Ensure canvas is visible (in case quiz hid it)
  canvas.style.display = 'block';

  requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camBox.xMargin = canvas.width * 0.49; // < 0.5 to avoid snapping
  camBox.yMargin = canvas.height * 0.10;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// ======================
// Update
// ======================
function update() {
  // --- Edge detect for jump BEFORE physics ---
  const wasOnGround = (typeof player !== 'undefined') ? !!player.onGround : false;
  const justJumpKey =
    (keys[' '] && !prevKeys[' ']) ||
    (keys['w'] && !prevKeys['w']) ||
    (keys['ArrowUp'] && !prevKeys['ArrowUp']);

  // --- Physics / player ---
  if (typeof updatePlayer === 'function') {
    updatePlayer(keys, prevKeys);
  }

  // jump sfx when jump started from ground
  if (justJumpKey && wasOnGround && window.sound) {
    sound.jump();
  }

  // --- Camera soft zone ---
  if (typeof player !== 'undefined') {
    const playerCenterX = player.x + player.width / 2;
    const camLeft  = camera.x + camBox.xMargin;
    const camRight = camera.x + canvas.width - camBox.xMargin;
    if (playerCenterX < camLeft) {
      camera.x = playerCenterX - camBox.xMargin;
    } else if (playerCenterX > camRight) {
      camera.x = playerCenterX - (canvas.width - camBox.xMargin);
    }

    const playerCenterY = player.y + player.height / 2;
    const camTop    = camera.y + camBox.yMargin;
    const camBottom = camera.y + canvas.height - camBox.yMargin;
    if (playerCenterY < camTop) {
      camera.y = playerCenterY - camBox.yMargin;
    } else if (playerCenterY > camBottom) {
      camera.y = playerCenterY - (canvas.height - camBox.yMargin);
    }
  }

  // --- Moving objects (INSIDE update) ---
  levelObjects.forEach(obj => {
    if (obj.moving) {
      if (!obj.pauseTimer || obj.pauseTimer <= 0) {
        if (obj.axis === 'x') obj.x += obj.direction * obj.speed;
        else if (obj.axis === 'y') obj.y += obj.direction * obj.speed;

        const pos = obj.axis === 'x' ? obj.x : obj.y;
        if (pos < obj.min || pos > obj.max) {
          obj.direction *= -1;
          if (pos < obj.min) { if (obj.axis === 'x') obj.x = obj.min; else obj.y = obj.min; }
          if (pos > obj.max) { if (obj.axis === 'x') obj.x = obj.max; else obj.y = obj.max; }
          obj.pauseTimer = obj.pauseDuration || 0;
        }
      } else {
        obj.pauseTimer--;
      }
    }
  });

  // --- Platform collisions (INSIDE update) ---
  if (typeof player !== 'undefined') {
    player.onGround = false;

    levelObjects.forEach(obj => {
      if (obj.type === 'platform' && collides(player, obj)) {
        const overlapX1 = (player.x + player.width) - obj.x;
        const overlapX2 = (obj.x + obj.width) - player.x;
        const overlapY1 = (player.y + player.height) - obj.y;
        const overlapY2 = (obj.y + obj.height) - player.y;

        const fixX = Math.min(overlapX1, overlapX2);
        const fixY = Math.min(overlapY1, overlapY2);

        if (fixX < fixY) {
          if (overlapX1 < overlapX2) player.x -= overlapX1;
          else                        player.x += overlapX2;
          player.dx = 0;
        } else {
          if (overlapY1 < overlapY2) { player.y -= overlapY1; player.onGround = true; }
          else                        player.y += overlapY2;
          player.dy = 0;
        }
      }
    });

    // --- Tongue interaction & other collisions (INSIDE update) ---
    levelObjects.forEach(obj => {
      if (obj.type === 'tongue') {
        const dx = player.x + player.width / 2 - (obj.x + obj.width / 2);
        const dy = player.y + player.height / 2 - (obj.y + obj.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const justPressedSpace = keys[' '] && !prevKeys[' '];
        if (dist < 200 && justPressedSpace && typeof pullTo === 'function') {
          pullTo(obj.x + obj.width / 2, obj.y + obj.height / 2);
        }
      } else if (collides(player, obj)) {
        handleCollision(obj);
      }
    });
  }

  // --- Walking loop AFTER collisions (onGround is correct) ---
  if (typeof player !== 'undefined' && window.sound) {
    const movingHoriz =
      Math.abs(player.dx || 0) > 0.1 ||
      keys['a'] || keys['d'] || keys['ArrowLeft'] || keys['ArrowRight'];
    if (player.onGround && movingHoriz) sound.startWalk();
    else                                sound.stopWalk();
  }

  // --- edge tracking for next frame (once) ---
  prevKeys = { ...keys };
}



  // Moving objects
  levelObjects.forEach(obj => {
    if (obj.moving) {
      if (!obj.pauseTimer || obj.pauseTimer <= 0) {
        if (obj.axis === 'x') obj.x += obj.direction * obj.speed;
        else if (obj.axis === 'y') obj.y += obj.direction * obj.speed;

        const pos = obj.axis === 'x' ? obj.x : obj.y;

        if (pos < obj.min || pos > obj.max) {
          // invert direction
          obj.direction *= -1;

          // clamp back inside range
          if (pos < obj.min) { if (obj.axis === 'x') obj.x = obj.min; else obj.y = obj.min; }
          if (pos > obj.max) { if (obj.axis === 'x') obj.x = obj.max; else obj.y = obj.max; }

          // optional pause
          obj.pauseTimer = obj.pauseDuration || 0;
        }
      } else {
        obj.pauseTimer--;
      }
    }
  });

  // Platform collisions
  if (typeof player !== 'undefined') {
    player.onGround = false;

    levelObjects.forEach(obj => {
      if (obj.type === 'platform' && collides(player, obj)) {
        const overlapX1 = (player.x + player.width) - obj.x;
        const overlapX2 = (obj.x + obj.width) - player.x;
        const overlapY1 = (player.y + player.height) - obj.y;
        const overlapY2 = (obj.y + obj.height) - player.y;

        const fixX = Math.min(overlapX1, overlapX2);
        const fixY = Math.min(overlapY1, overlapY2);

        if (fixX < fixY) {
          if (overlapX1 < overlapX2) player.x -= overlapX1;
          else                        player.x += overlapX2;
          player.dx = 0;
        } else {
          if (overlapY1 < overlapY2) { player.y -= overlapY1; player.onGround = true; }
          else                        player.y += overlapY2;
          player.dy = 0;
        }
      }
    });

    // Tongue interaction & remaining collisions
    levelObjects.forEach(obj => {
      if (obj.type === 'tongue') {
        const dx = player.x + player.width / 2 - (obj.x + obj.width / 2);
        const dy = player.y + player.height / 2 - (obj.y + obj.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const justPressedSpace = keys[' '] && !prevKeys[' '];

        if (dist < 200 && justPressedSpace && typeof pullTo === 'function') {
          pullTo(obj.x + obj.width / 2, obj.y + obj.height / 2);
        }
      } else if (collides(player, obj)) {
        handleCollision(obj);
      }
    });
  }

  prevKeys = { ...keys };


// ======================
// Draw
// ======================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1) Parallax background
  drawParallaxBackground();

  // 2) Level objects
  levelObjects.forEach(obj => {
    const screenX = obj.x - camera.x;
    const screenY = obj.y - camera.y;

    // Choose texture by type
    let imgToUse = null;
    if (obj.type === 'danger')        imgToUse = tex.danger;
    else if (obj.type === 'platform') imgToUse = tex.platform;
    else if (obj.type === 'catcher')  imgToUse = tex.catcher;

    if (imgToUse) {
      // Tiled texture fill
      drawTiledImage(imgToUse, screenX, screenY, obj.width, obj.height);
    } else {
      // Fallback: simple rect
      ctx.fillStyle = getColorByType(obj.type);
      ctx.fillRect(screenX, screenY, obj.width, obj.height);
    }

    // Optional visual for tongue radius
    if (obj.type === 'tongue') {
      ctx.beginPath();
      ctx.arc(
        obj.x + obj.width / 2 - camera.x,
        obj.y + obj.height / 2 - camera.y,
        200, 0, Math.PI * 2
      );
      ctx.strokeStyle = 'rgba(0,255,0,0.2)';
      ctx.stroke();
    }
  });

  // 3) Player
  if (typeof drawPlayer === 'function') drawPlayer(ctx);

  // 4) HUD – hearts
  if (typeof player !== 'undefined') {
    const heartSize = 22;
    const gap = 8;
    const startX = 12;
    const startY = 28;
    ctx.font = `${heartSize}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'red';
    for (let i = 0; i < player.lives; i++) {
      ctx.fillText('❤', startX + i * (heartSize + gap), startY);
    }
  }
}

// ======================
// Helpers
// ======================
function drawTiledImage(img, screenX, screenY, w, h) {
  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

  const tileW = img.naturalWidth;
  const tileH = img.naturalHeight;
  const fullTilesX = Math.floor(w / tileW);
  const fullTilesY = Math.floor(h / tileH);
  const remainderX = w % tileW;
  const remainderY = h % tileH;

  for (let i = 0; i <= fullTilesX; i++) {
    for (let j = 0; j <= fullTilesY; j++) {
      const x = screenX + i * tileW;
      const y = screenY + j * tileH;

      const isLastCol = i === fullTilesX;
      const isLastRow = j === fullTilesY;
      const drawW = isLastCol ? (remainderX || tileW) : tileW;
      const drawH = isLastRow ? (remainderY || tileH) : tileH;

      if ((x - screenX) < w && (y - screenY) < h) {
        ctx.drawImage(img, 0, 0, tileW, tileH, x, y, drawW, drawH);
      }
    }
  }
}

// ======================
// Collision & Utils
// ======================
function handleCollision(obj) {
  switch (obj.type) {
    case 'danger':
      if (window.sound) { sound.stopWalk(); sound.lose(); }
      if (typeof resetPlayer === 'function') resetPlayer();
      break;

    case 'goal':
      if (window.sound) { sound.stopWalk(); sound.win(); }
      alert('Level beendet!');
      window.history.back();
      break;

    case 'catcher':
      if (!player.isCamouflaged) {
        if (window.sound) { sound.stopWalk(); sound.lose(); }
        if (typeof resetPlayer === 'function') resetPlayer();
      }
      break;

    case 'checkpoint':
      player.spawnPoint = { x: obj.x, y: obj.y };
      if (window.sound) sound.checkpoint();
      break;
  }
}


function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function getColorByType(type) {
  switch (type) {
    case 'platform':   return 'grey';
    case 'danger':     return 'red';
    case 'goal':       return 'gold';
    case 'tongue':     return 'green';
    case 'catcher':    return 'purple';
    case 'checkpoint': return 'blue';
    default:           return 'black';
  }
}

/* ---------------------------------------------------------
   maybeStartGame: Called when quiz finishes.
   Waits until the level script has loaded, then inits.
--------------------------------------------------------- */
function maybeStartGame() {
  if (!window.quizFinished) return;

  if (!window.levelReady) {
    const interval = setInterval(() => {
      if (window.levelReady) {
        clearInterval(interval);
        initGame();
      }
    }, 200);
    return;
  }

  initGame();
}

// ---- Expose to global scope ----
window.maybeStartGame = maybeStartGame;
window.setBackground = setBackground;
window.clearBackground = clearBackground;
window.applyLevelBackground = applyLevelBackground;
