// ----------------------
// Spieler-Definition & Setup
// ----------------------
const player = {
    x: 50,
    y: 300,
    width: 64,
    height: 32,
    baseHeight: 30,
    dx: 0,
    dy: 0,
    speed: 4,
    jumpPower: -12,
    onGround: false,

    // Tarnung
    isCamouflaged: false,
    CamoLimit: false,
    color: 'blue',
    borderColor: 'black',

    // Lives/Respawn (Default 3, kann durch Quiz überschrieben werden)
    lives: 3,
    spawnPoint: { x: 50, y: 300 },

    // Sprite/Animation
    sprite: {
        img: (() => {
            const im = new Image();
            im.src = 'Images/Chameleon_green.png'; // Standardfarbe = grün
            return im;
        })(),
        rows: 3,
        frameW: 64,
        frameH: 32,
        index: 1,
        orderWalk: [0,1,2],
        timer: 0,
        fps: 8,
        facing: 1
    },

    // Farbe ändern
    setColor(newColor) {
        this.color = newColor;
        this.sprite.img.src = `Images/chameleon_${newColor}.png`;
    }
};

player.sprite.img.onload = () => {
    player.sprite.frameW = player.sprite.img.width;
    player.sprite.frameH = Math.floor(player.sprite.img.height / player.sprite.rows);
};

// ----------------------
// Intern: Animation aktualisieren
// ----------------------
function updatePlayerAnimation(dt) {
    const s = player.sprite;
    if (player.dx > 0.1) s.facing = 1;
    if (player.dx < -0.1) s.facing = -1;

    const movingOnGround = Math.abs(player.dx) > 0.1 && player.onGround;

    if (!movingOnGround) {
        s.index = 1;
        s.timer = 0;
        return;
    }

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
// Spieler-Update
// ----------------------
function updatePlayer(keys, prevKeys) {
    if (keys['a'])      player.dx = -player.speed;
    else if (keys['d']) player.dx =  player.speed;
    else                player.dx =  0;

    if ((keys['w'] || keys[' ']) && player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }

    if (keys['s']) player.height = player.baseHeight / 2;
    else           player.height = player.baseHeight;

    // Physik
    player.dy += 0.5;
    player.x  += player.dx;
    player.y  += player.dy;

    // Animation (falls dt nicht übergeben, approximieren wir 1/60)
    updatePlayerAnimation(1/60);
}

// ----------------------
// Ziehen mit Zunge
// ----------------------
function pullTo(x, y) {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
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
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x - camX, player.y - camY, player.width, player.height);
    } else {
        const sx = 0;
        const sy = s.index * s.frameH;
        const sw = s.frameW;
        const sh = s.frameH;

        const dx = Math.floor(player.x - camX);
        const dy = Math.floor(player.y - camY);
        const dw = player.width;
        const dh = player.height;

        ctx.save();

        if (s.facing === -1) {
            ctx.translate(dx + dw / 2, dy + dh / 2);
            ctx.scale(-1, 1);
            ctx.translate(-(dx + dw / 2), -(dy + dh / 2));
        }

        ctx.drawImage(s.img, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.restore();
    }

    if (player.isCamouflaged) {
        ctx.strokeStyle = player.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x - camX, player.y - camY, player.width, player.height);
    }
}

// ----------------------
// Tarne
// ----------------------
function toggleCamouflage() {
    if (player.CamoLimit === false) {
        player.isCamouflaged = !player.isCamouflaged;
        player.CamoLimit = true;
        setTimeout(limitCamouflage, 10000);
    } else if (player.CamoLimit === true && player.isCamouflaged === true) {
        player.isCamouflaged = !player.isCamouflaged;
    }

    if (player.isCamouflaged) {
        player.color = 'white';
        player.borderColor = 'blue';
        setTimeout(toggleCamouflage, 1000);
    } else {
        player.color = 'blue';
        player.borderColor = 'black';
    }
}

function limitCamouflage() {
    player.CamoLimit = false;
}

// ----------------------
// Reset bei Tod
// ----------------------
function resetPlayer() {
    player.lives--;
    if (player.lives <= 0) {
        alert("Game Over");
        window.history.back();
        player.lives = 3;
    }
    player.x = player.spawnPoint.x;
    player.y = player.spawnPoint.y;
    player.dx = 0;
    player.dy = 0;
}
