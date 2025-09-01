let canvas, ctx;
let keys = {};
let prevKeys = {};
let levelObjects = []; // Wird durch levelX.js gefüllt (z.B. initLevel)
let camera = { x: 0, y: 0 };
const world = { width: 6000, height: 2500 };

const camBox = { xMargin: 0, yMargin: 0 };

function initGame() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
        if (e.key === 'e') toggleCamouflage();
    });
    window.addEventListener("keyup", (e) => keys[e.key] = false);

    // Falls Quiz Leben gesetzt hat, übernehmen
    if (typeof window.playerLives !== 'undefined') {
        player.lives = window.playerLives;
        console.log('[Engine] player.lives gesetzt von Quiz:', player.lives);
    }

    // Fallback: falls level-Init-Funktion vorhanden ist, aufrufen.
    try {
        if (typeof initLevel === 'function') initLevel();
        else console.warn('[Engine] initLevel() nicht definiert. Stelle sicher, levelX.js ist geladen.');
    } catch (e) {
        console.error('[Engine] Fehler beim initLevel():', e);
    }

    // Canvas anzeigen (das Quiz versteckt Canvas zuvor)
    canvas.style.display = 'block';

    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camBox.xMargin = canvas.width * 0.49;
    camBox.yMargin = canvas.height * 0.1;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    updatePlayer(keys, prevKeys);

    // Kamera
    const playerCenterX = player.x + player.width / 2;
    const camLeft = camera.x + camBox.xMargin;
    const camRight = camera.x + canvas.width - camBox.xMargin;

    if (playerCenterX < camLeft) camera.x = playerCenterX - camBox.xMargin;
    else if (playerCenterX > camRight) camera.x = playerCenterX - (canvas.width - camBox.xMargin);

    const playerCenterY = player.y + player.height / 2;
    const camTop = camera.y + camBox.yMargin;
    const camBottom = camera.y + canvas.height - camBox.yMargin;

    if (playerCenterY < camTop) camera.y = playerCenterY - camBox.yMargin;
    else if (playerCenterY > camBottom) camera.y = playerCenterY - (canvas.height - camBox.yMargin);

    // Bewegliche Objekte
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

    // Plattform-Kollision
    player.onGround = false;
    levelObjects.forEach(obj => {
        if (obj.type === "platform" && collides(player, obj)) {
            const overlapX1 = (player.x + player.width) - obj.x;
            const overlapX2 = (obj.x + obj.width) - player.x;
            const overlapY1 = (player.y + player.height) - obj.y;
            const overlapY2 = (obj.y + obj.height) - player.y;

            const fixX = Math.min(overlapX1, overlapX2);
            const fixY = Math.min(overlapY1, overlapY2);

            if (fixX < fixY) {
                if (overlapX1 < overlapX2) player.x -= overlapX1;
                else player.x += overlapX2;
                player.dx = 0;
            } else {
                if (overlapY1 < overlapY2) { player.y -= overlapY1; player.onGround = true; }
                else player.y += overlapY2;
                player.dy = 0;
            }
        }
    });

    // Tongue & Collision Handling
    levelObjects.forEach(obj => {
        if (obj.type === 'tongue') {
            const dx = player.x + player.width / 2 - (obj.x + obj.width / 2);
            const dy = player.y + player.height / 2 - (obj.y + obj.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const justPressedSpace = keys[' '] && !prevKeys[' '];

            if (dist < 200 && justPressedSpace) {
                pullTo(obj.x + obj.width / 2, obj.y + obj.height / 2);
            }
        } else if (collides(player, obj)) {
            handleCollision(obj);
        }
    });

    prevKeys = { ...keys };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Objekte zeichnen
    levelObjects.forEach(obj => {
        const screenX = obj.x - camera.x;
        const screenY = obj.y - camera.y;

        ctx.fillStyle = getColorByType(obj.type);
        ctx.fillRect(screenX, screenY, obj.width, obj.height);

        if (obj.type === 'tongue') {
            ctx.beginPath();
            ctx.arc(obj.x + obj.width / 2 - camera.x, obj.y + obj.height / 2 - camera.y, 200, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0,255,0,0.2)';
            ctx.stroke();
        }
    });

    // Spieler zeichnen
    drawPlayer(ctx);

    // Leben als Herzen im Canvas (links oben)
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

// Collision handling
function handleCollision(obj) {
    switch (obj.type) {
        case "danger":
            resetPlayer();
            break;
        case "goal":
            alert("Level beendet!");
            window.history.back();
            break;
        case "catcher":
            if (!player.isCamouflaged) resetPlayer();
            break;
        case "checkpoint":
            player.spawnPoint = { x: obj.x, y: obj.y };
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
        case 'platform': return 'grey';
        case 'danger': return 'red';
        case 'goal': return 'gold';
        case 'tongue': return 'green';
        case 'catcher': return 'purple';
        case 'checkpoint': return 'blue';
        default: return 'black';
    }
}

/* ---------------------------------------------------------
   maybeStartGame: Wird aufgerufen, wenn das Quiz fertig ist.
   Wir warten hier zusätzlich, bis das Levelscript geladen wurde.
   Das Index-HTML setzt window.quizFinished und window.levelReady.
   --------------------------------------------------------- */
function maybeStartGame() {
    // Wenn Quiz noch nicht fertig -> warten
    if (!window.quizFinished) return;

    // Wenn Level noch nicht geladen -> warten
    if (!window.levelReady) {
        // Polling (kurz) bis Level geladen ist
        const interval = setInterval(() => {
            if (window.levelReady) {
                clearInterval(interval);
                // Starten
                initGame();
            }
        }, 200);
        // ansonsten return – wir starten später
        return;
    }

    // Wenn alles ready -> direkt starten
    initGame();
}

// Export in global scope (optional, schon global wenn engine.js geladen wird)
window.maybeStartGame = maybeStartGame;
