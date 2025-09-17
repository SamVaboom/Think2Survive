'use strict';

// Canvas und Kontext für das Spiel
let canvas, ctx;
// Tasteneingaben: aktuelle und vorherige
let keys = {};
let prevKeys = {};
// Objekte des Levels (Plattformen, Gefahren etc.)
let levelObjects = []; // Wird in jedem Level mit initLevel() gefüllt
// Kamera, die dem Spieler folgt
let camera = { x: 0, y: 0 };

// Spielfeldgröße (virtuelle Welt)
const world = { width: 6000, height: 2500 };
// Kamera-Begrenzung (Soft-Zone für Bewegungen)
const camBox = { xMargin: 0, yMargin: 0 };

// ---- Texturen (wiederholbare Bilder für Objekte) ----
const tex = {
  danger:   new Image(),   // Gefährliche Objekte (z. B. Lava)
  platform: new Image(),   // Plattformen
  catcher:  new Image(),   // Gegner/Fänger
};
// Bildpfade für Texturen
tex.danger.src   = 'Images/danger.png';
tex.platform.src = 'Images/plattform.png';
tex.catcher.src  = 'Images/catcher.png';

// ---- Parallax-Hintergrund ----
const bg = {
  img: null,       // Hintergrundbild
  ready: false,    // Status: Bild geladen?
  fx: 0.25,        // X-Parallax-Faktor (<1 bedeutet langsamer als Kamera → Tiefeneffekt)
  fy: 0.00,        // Y-Parallax-Faktor
  enabled: false,  // Aktiviert oder nicht
};

// Funktion zum Setzen eines Hintergrundbilds mit Parallax-Optionen
function setBackground(src, opts = {}) {
  bg.img = new Image();
  bg.ready = false;
  bg.enabled = true;
  if (opts.fx != null) bg.fx = opts.fx;
  if (opts.fy != null) bg.fy = opts.fy;
  bg.img.onload = () => { bg.ready = true; }; // Markiert als "fertig" wenn geladen
  bg.img.src = src;
}

// ---- Hintergrund-Konfiguration pro Level ----
const LEVEL_BACKGROUNDS = {
  zoo:        { src: 'Images/backgroundzoo.png',        fx: 0.25, fy: 0.00 },
  village:    { src: 'Images/backgroundvillage.png',    fx: 0.25, fy: 0.00 },
  forest:     { src: 'Images/backgroundforest.png',     fx: 0.25, fy: 0.00 },
  canyon:     { src: 'Images/backgroundcanyon.png',     fx: 0.25, fy: 0.00 },
  matterhorn: { src: 'Images/backgroundmatterhorn.png', fx: 0.25, fy: 0.00 },
};

// Hintergrund anwenden abhängig vom LEVEL_THEME
function applyLevelBackground() {
  const key = (window.LEVEL_THEME || '').toLowerCase();
  const cfg = LEVEL_BACKGROUNDS[key] || LEVEL_BACKGROUNDS.zoo;
  setBackground(cfg.src, { fx: cfg.fx, fy: cfg.fy });
}

// Hintergrund entfernen
function clearBackground() {
  bg.enabled = false;
  bg.img = null;
  bg.ready = false;
}

// Hintergrund mit Parallax-Effekt zeichnen
function drawParallaxBackground() {
  if (!bg.enabled || !bg.ready || !bg.img) return;

  const iw = bg.img.naturalWidth;
  const ih = bg.img.naturalHeight;
  if (!iw || !ih) return;

  // Offset relativ zur Kamera, verlangsamt durch Parallax-Faktoren
  const ox = Math.floor(camera.x * bg.fx);
  const oy = Math.floor(camera.y * bg.fy);

  // Start-Koordinaten, sodass das Bild nahtlos gekachelt wird
  const startX = -((ox % iw) + iw) % iw;
  const startY = -((oy % ih) + ih) % ih;

  // Hintergrund wiederholt über gesamte Canvas zeichnen
  for (let x = startX; x < canvas.width; x += iw) {
    for (let y = startY; y < canvas.height; y += ih) {
      ctx.drawImage(bg.img, x, y);
    }
  }
}

// ======================
// Init & Loop
// ======================

// Initialisierung des Spiels
function initGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false; // Pixelgrafik bleibt scharf

  resizeCanvas(); // Erstes Anpassen
  window.addEventListener('resize', resizeCanvas);

  // Tastatureingaben abfangen
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'e' && typeof toggleCamouflage === 'function') {
      toggleCamouflage(); // "Tarnung" ein-/ausschalten
    }
  });
  window.addEventListener('keyup', (e) => { keys[e.key] = false; });

  // Quiz → Leben übernehmen, falls gesetzt
  if (typeof window.playerLives !== 'undefined' && typeof player !== 'undefined') {
    player.lives = window.playerLives;
    console.log('[Engine] player.lives from Quiz:', player.lives);
  }

  // Level-Initialisierung
  try {
    if (typeof initLevel === 'function') initLevel();
    else console.warn('[Engine] initLevel() not defined. Ensure levelX.js is loaded.');
  } catch (e) {
    console.error('[Engine] Error in initLevel():', e);
  }

  // Canvas sichtbar machen (falls vorher versteckt)
  canvas.style.display = 'block';

  // Spielschleife starten
  requestAnimationFrame(gameLoop);
}

// Canvas-Größe an Fenster anpassen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camBox.xMargin = canvas.width * 0.49; // knapp unter 0.5 → verhindert Sprünge
  camBox.yMargin = canvas.height * 0.10;
}

// Spielschleife (läuft endlos)
function gameLoop() {
  update(); // Spiellogik
  draw();   // Zeichnen
  requestAnimationFrame(gameLoop); // Nächster Frame
}

// ======================
// Update
// ======================

function update() {
  // Prüfen: Stand Spieler auf Boden? (vorheriger Frame)
  const wasOnGround = (typeof player !== 'undefined') ? !!player.onGround : false;

  // Spieler drückt Sprungtaste (nur beim ersten Drücken erkannt)
  const justJumpKey =
    (keys[' '] && !prevKeys[' ']) ||
    (keys['w'] && !prevKeys['w']) ||
    (keys['ArrowUp'] && !prevKeys['ArrowUp']);

  // Spieler-Update (Physik, Bewegung etc.)
  if (typeof updatePlayer === 'function') {
    updatePlayer(keys, prevKeys);
  }

  // Sprungsound abspielen, wenn Sprung vom Boden aus gestartet
  if (justJumpKey && wasOnGround && window.sound) {
    sound.jump();
  }

  // Kamera folgt dem Spieler mit Soft-Zone
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

  // Bewegende Objekte updaten
  levelObjects.forEach(obj => {
    if (obj.moving) {
      if (!obj.pauseTimer || obj.pauseTimer <= 0) {
        if (obj.axis === 'x') obj.x += obj.direction * obj.speed;
        else if (obj.axis === 'y') obj.y += obj.direction * obj.speed;

        const pos = obj.axis === 'x' ? obj.x : obj.y;
        if (pos < obj.min || pos > obj.max) {
          obj.direction *= -1; // Richtung umkehren
          // Position auf gültigen Bereich zurücksetzen
          if (pos < obj.min) { if (obj.axis === 'x') obj.x = obj.min; else obj.y = obj.min; }
          if (pos > obj.max) { if (obj.axis === 'x') obj.x = obj.max; else obj.y = obj.max; }
          obj.pauseTimer = obj.pauseDuration || 0; // ggf. Pause
        }
      } else {
        obj.pauseTimer--;
      }
    }
  });

  // Plattform-Kollisionen
  if (typeof player !== 'undefined') {
    player.onGround = false;

    levelObjects.forEach(obj => {
      if (obj.type === 'platform' && collides(player, obj)) {
        // Überlappung in X- und Y-Richtung berechnen
        const overlapX1 = (player.x + player.width) - obj.x;
        const overlapX2 = (obj.x + obj.width) - player.x;
        const overlapY1 = (player.y + player.height) - obj.y;
        const overlapY2 = (obj.y + obj.height) - player.y;

        const fixX = Math.min(overlapX1, overlapX2);
        const fixY = Math.min(overlapY1, overlapY2);

        // Kollision horizontal oder vertikal korrigieren
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

    // Zunge-Interaktion & andere Kollisionen
    levelObjects.forEach(obj => {
      if (obj.type === 'tongue') {
        const dx = player.x + player.width / 2 - (obj.x + obj.width / 2);
        const dy = player.y + player.height / 2 - (obj.y + obj.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const justPressedSpace = keys[' '] && !prevKeys[' '];
        // Spieler kann sich mit "Zunge" zum Objekt ziehen
        if (dist < 200 && justPressedSpace && typeof pullTo === 'function') {
          pullTo(obj.x + obj.width / 2, obj.y + obj.height / 2);
        }
      } else if (collides(player, obj)) {
        handleCollision(obj);
      }
    });
  }

  // Lauf-Sound: nur wenn Spieler am Boden und bewegt sich
  if (typeof player !== 'undefined' && window.sound) {
    const movingHoriz =
      Math.abs(player.dx || 0) > 0.1 ||
      keys['a'] || keys['d'] || keys['ArrowLeft'] || keys['ArrowRight'];
    if (player.onGround && movingHoriz) sound.startWalk();
    else                                sound.stopWalk();
  }

  // Eingaben merken für nächsten Frame
  prevKeys = { ...keys };
}


// (Du hast hier doppelte Update-Abschnitte → unverändert gelassen, da du wolltest, dass nichts gelöscht wird)

// ======================
// Draw
// ======================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1) Hintergrund zeichnen
  drawParallaxBackground();

  // 2) Levelobjekte zeichnen
  levelObjects.forEach(obj => {
    const screenX = obj.x - camera.x;
    const screenY = obj.y - camera.y;

    // Textur anhand Typ auswählen
    let imgToUse = null;
    if (obj.type === 'danger')        imgToUse = tex.danger;
    else if (obj.type === 'platform') imgToUse = tex.platform;
    else if (obj.type === 'catcher')  imgToUse = tex.catcher;

    if (imgToUse) {
      // Textur wiederholt zeichnen
      drawTiledImage(imgToUse, screenX, screenY, obj.width, obj.height);
    } else {
      // Fallback: Rechteck mit Farbe
      ctx.fillStyle = getColorByType(obj.type);
      ctx.fillRect(screenX, screenY, obj.width, obj.height);
    }

    // Zunge: Radius anzeigen
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

  // 3) Spieler zeichnen
  if (typeof drawPlayer === 'function') drawPlayer(ctx);

  // 4) HUD (Herzen für Leben)
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

// Zeichnet ein gekacheltes Bild für Plattformen
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
// Kollision & Utils
// ======================

// Kollisionsverhalten je nach Objekttyp
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

// Rechteck-Kollisionserkennung
function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Fallback-Farben für Objekttypen (falls keine Textur existiert)
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
   maybeStartGame: Wird nach Quiz-Ende aufgerufen.
   Wartet bis Levelscript geladen ist und startet dann.
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

// ---- Globale Funktionen verfügbar machen ----
window.maybeStartGame = maybeStartGame;
window.setBackground = setBackground;
window.clearBackground = clearBackground;
window.applyLevelBackground = applyLevelBackground;
