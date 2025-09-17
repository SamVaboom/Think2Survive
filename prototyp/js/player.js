// ----------------------
// Spieler-Definition & Setup
// ----------------------
const player = {
    x: 50,            // Startposition X
    y: 300,           // Startposition Y
    width: 64,        // Spielerbreite (wird beim Zeichnen skaliert)
    height: 32,       // Spielerhöhe
    baseHeight: 30,   // Standardhöhe (für Ducken)
    dx: 0,            // Geschwindigkeit in X-Richtung
    dy: 0,            // Geschwindigkeit in Y-Richtung
    speed: 4,         // Bewegungsgeschwindigkeit
    jumpPower: -12,   // Sprungkraft (negativ = nach oben)
    onGround: false,  // ob Spieler am Boden ist

    // Tarnung
    isCamouflaged: false, // aktiv/inaktiv
    CamoLimit: false,     // Cooldown-Sperre
    color: 'blue',        // Standardfarbe (Fallback)
    borderColor: 'black', // Umrandung bei Tarnung

    // Leben & Respawn
    lives: 3,                        // Startleben
    spawnPoint: { x: 50, y: 300 },   // Rücksetzpunkt

    // Sprite/Animation
    sprite: {
        img: (() => {                  // Bild laden
            const im = new Image();
            im.src = 'Images/NewChameleon.png'; // Sprite Sheet (achte auf Pfad/Case)
            return im;
        })(),
        rows: 3,          // 3 Frames übereinander (oben, idle, unten)
        frameW: 64,       // Breite eines Frames
        frameH: 32,       // Höhe eines Frames
        index: 1,         // Startframe (idle in der Mitte)
        orderWalk: [0, 1, 2], // Reihenfolge fürs Laufen
        timer: 0,         // Zeit für Animation
        fps: 8,           // Animationsgeschwindigkeit (Bilder pro Sekunde)
        facing: 1         // Blickrichtung (1 = rechts, -1 = links)
    }
};

// Player global verfügbar machen
window.player = player;

// Farbwechsel-Funktion für Chamäleon (Sprite austauschen)
player.setColor = function (newColor) {
  this.sprite.img.src = `Images/chameleon_${newColor}.png`;
};

// Wenn Bild geladen ist → Framehöhe/-breite anpassen
player.sprite.img.onload = () => {
    player.sprite.frameW = player.sprite.img.width;                 // gesamte Breite
    player.sprite.frameH = Math.floor(player.sprite.img.height / player.sprite.rows); // Höhe je Frame
};

// Erweiterte Farbwechsel-Funktion (speichert auch aktuelle Farbe)
player.setColor = function (newColor) {
  this.color = newColor;
  this.sprite.img.src = `Images/chameleon_${newColor}.png`; 
  // Erwartete Dateien: chameleon_green.png, chameleon_red.png, chameleon_purple.png, chameleon_yellow.png
};

// ----------------------
// Intern: Animation aktualisieren
// ----------------------
function updatePlayerAnimation(dt) {
    const s = player.sprite;

    // Blickrichtung ändern bei Bewegung
    if (player.dx > 0.1) s.facing = 1;
    if (player.dx < -0.1) s.facing = -1;

    const movingOnGround = Math.abs(player.dx) > 0.1 && player.onGround;

    // Idle → mittleres Bild
    if (!movingOnGround) {
        s.index = 1;
        s.timer = 0;
        return;
    }

    // Laufanimation (zyklisch)
    s.timer += dt;
    const step = 1 / s.fps;
    if (s.timer >= step) {
        s.timer -= step;
        const cur = s.orderWalk.indexOf(s.index);
        const next = (cur + 1) % s.orderWalk.length;
        s.index = s.orderWalk[next];
    }
}

// ----------------------
// Spieler-Update (Bewegung & Physik)
// ----------------------
function updatePlayer(keys, prevKeys) {
    // Steuerung links/rechts
    if (keys['a'])      player.dx = -player.speed;
    else if (keys['d']) player.dx =  player.speed;
    else                player.dx =  0;

    // Sprung (nur wenn am Boden)
    if ((keys['w'] || keys[' ']) && player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }

    // Ducken = halbe Höhe
    if (keys['s']) player.height = player.baseHeight / 2;
    else           player.height = player.baseHeight;

    // Gravitation + Bewegung
    player.dy += 0.5;     // konstante Schwerkraft
    player.x  += player.dx;
    player.y  += player.dy;

    // Animation updaten (angenommen 60 FPS falls dt nicht übergeben)
    updatePlayerAnimation(1 / 60);
}

// ----------------------
// Zunge: Spieler zum Objekt ziehen
// ----------------------
function pullTo(x, y) {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;

    // Geschwindigkeit Richtung Zielpunkt setzen
    player.dx = dx * 0.08;
    player.dy = dy * 0.08;
}

// ----------------------
// Spieler zeichnen
// ----------------------
function drawPlayer(ctx) {
    const camX = (typeof camera !== 'undefined' ? camera.x : 0);
    const camY = (typeof camera !== 'undefined' ? camera.y : 0);

    const s = player.sprite;
    const imgReady = s.img && s.img.complete && s.img.naturalWidth > 0;

    if (!imgReady) {
        // Fallback: farbiges Rechteck statt Sprite
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x - camX, player.y - camY, player.width, player.height);
    } else {
        // Sprite Frame berechnen
        const sx = 0;
        const sy = s.index * s.frameH;
        const sw = s.frameW;
        const sh = s.frameH;

        const dx = Math.floor(player.x - camX);
        const dy = Math.floor(player.y - camY);
        const dw = player.width;
        const dh = player.height;

        ctx.save();

        // Spiegeln wenn Blick nach links
        if (s.facing === -1) {
            ctx.translate(dx + dw / 2, dy + dh / 2);
            ctx.scale(-1, 1);
            ctx.translate(-(dx + dw / 2), -(dy + dh / 2));
        }

        // Sprite zeichnen
        ctx.drawImage(s.img, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.restore();
    }

    // Tarnungs-Rand
    if (player.isCamouflaged) {
        ctx.strokeStyle = player.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x - camX, player.y - camY, player.width, player.height);
    }
}

// ----------------------
// Tarnung umschalten
// ----------------------
function toggleCamouflage() {
    // Cooldown verhindern Spam
    if (player.CamoLimit === false) {
        player.isCamouflaged = !player.isCamouflaged;
        player.CamoLimit = true;
        setTimeout(limitCamouflage, 10000); // 10s Sperre
    } else if (player.CamoLimit === true && player.isCamouflaged === true) {
        // Vorzeitiges Ausschalten erlaubt
        player.isCamouflaged = !player.isCamouflaged;
    }

    if (player.isCamouflaged) {
        player.color = 'white';
        player.borderColor = 'blue';
        // Tarnung nur 1 Sekunde aktiv
        setTimeout(toggleCamouflage, 1000);
    } else {
        player.color = 'blue';
        player.borderColor = 'black';
    }
}

// Cooldown zurücksetzen
function limitCamouflage() {
    player.CamoLimit = false;
}

// ----------------------
// Reset bei Tod
// ----------------------
function resetPlayer() {
    player.lives--; // Leben abziehen
    if (player.lives <= 0) {
        alert("Game Over");
        window.history.back(); // zurück ins Menü
        player.lives = 3;      // Leben zurücksetzen
    }
    // Spieler zurück zum Spawn
    player.x = player.spawnPoint.x;
    player.y = player.spawnPoint.y;
    player.dx = 0;
    player.dy = 0;
}
