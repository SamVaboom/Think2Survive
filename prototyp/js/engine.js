let canvas, ctx;
let keys = {};
let prevKeys = {};
let levelObjects = []; // Wird später durch level1.js gefüllt
let camera = { x: 0, y: 0 };
const world = {
    width: 6000,
    height: 2500
};

const camBox = {
    xMargin: 0,
    yMargin: 0
};

function initGame() {
    canvas = document.getElementById("gameCanvas"); //canvas hole
    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas); // spiu-feld wird de grössi vom Bildschirm apasst

    window.addEventListener("keydown", (e) => { //wenn e drückt wird denn tarnig (SetReset system)
        keys[e.key] = true;
        if (e.key === 'e') toggleCamouflage();
    });
    window.addEventListener("keyup", (e) => keys[e.key] = false);

    initLevel();



    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {  // wenn me sich nach links und rechts bewegt denn chunnt "Kamera" mit chli delay mit
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camBox.xMargin = canvas.width * 0.49; //cha maximal 0.49 si - >= 0.5 und es geit kaputt
    camBox.yMargin = canvas.height * 0.1; // aktivierbar bei vertikalem Scrollen - zurzit nur rechts-links
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    updatePlayer(keys, prevKeys);

    // Kamera folgt Spieler mit Soft-Zone
    const playerCenterX = player.x + player.width / 2;
    const camLeft = camera.x + camBox.xMargin;
    const camRight = camera.x + canvas.width - camBox.xMargin;

    if (playerCenterX < camLeft) {
        camera.x = playerCenterX - camBox.xMargin;
    } else if (playerCenterX > camRight) {
        camera.x = playerCenterX - (canvas.width - camBox.xMargin);
    }

    const playerCenterY = player.y + player.height / 2;
    const camTop = camera.y + camBox.yMargin;
    const camBottom = camera.y + canvas.height - camBox.yMargin;

    if (playerCenterY < camTop) {
        camera.y = playerCenterY - camBox.yMargin;
    } else if (playerCenterY > camBottom) {
        camera.y = playerCenterY - (canvas.height - camBox.yMargin);
    }

	// --- Bewegliche Objekte aktualisieren ---
	levelObjects.forEach(obj => {
		if (obj.moving) {
			if (!obj.pauseTimer || obj.pauseTimer <= 0) {
				if (obj.axis === 'x') obj.x += obj.direction * obj.speed;
				else if (obj.axis === 'y') obj.y += obj.direction * obj.speed;

				const pos = obj.axis === 'x' ? obj.x : obj.y;

				if (pos < obj.min || pos > obj.max) {
					// Richtung umkehren
					obj.direction *= -1;

					// zurück innerhalb der Grenzen setzen
					if (pos < obj.min) {
						if (obj.axis === 'x') obj.x = obj.min;
						else obj.y = obj.min;
					}
					if (pos > obj.max) {
						if (obj.axis === 'x') obj.x = obj.max;
						else obj.y = obj.max;
					}

					// Pause setzen (wenn definiert)
					obj.pauseTimer = obj.pauseDuration || 0;
				}
			} else {
				obj.pauseTimer--;
			}
		}
	});

    // Plattform-Kollision damit Player kollision het
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
                if (overlapX1 < overlapX2) {
                    player.x -= overlapX1;
                } else {
                    player.x += overlapX2;
                }
                player.dx = 0;
            } else {
                if (overlapY1 < overlapY2) {
                    player.y -= overlapY1;
                    player.onGround = true;
                } else {
                    player.y += overlapY2;
                }
                player.dy = 0;
            }
        }
    });

    // Tuet luege ob es Zunge-Objekt ir nöchi isch wo de Spieler sich hänezieh cha
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

    // Bi jedem Frame wird s'ganze level neu zeichnet (Objekt)
    levelObjects.forEach(obj => {
        const screenX = obj.x - camera.x;
        const screenY = obj.y - camera.y;

        ctx.fillStyle = getColorByType(obj.type);
        ctx.fillRect(screenX, screenY, obj.width, obj.height);

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

    drawPlayer(ctx);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("Lives: " + player.lives, 10, 20);
}

// Die richtig Funktion wird ufgruefe, je nach dem weles Objekt berüehrt wird
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

//definiert Kollision
function collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// farb vo de verschidene Objekt wird definiert. Cha me später no ersetze
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
