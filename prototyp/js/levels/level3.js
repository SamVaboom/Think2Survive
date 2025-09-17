/*

ERKLÄRUNG KOORDINATENSYSTEM:
Level ist 6000 * 2500 px groß. Es ist möglich, Objekte auch außerhalb davon zu platzieren.

y
|a*									 						b* 
|
|
|
|
|
|
|
|c* 														d* 
|_______________________________________________________________x

a* -> das ist (0, 0) ganz oben links
b* -> das ist (6000, 0) ganz oben rechts
c* -> das ist (0, 2500) ganz unten rechts
d* -> das ist (6000, 2500) ganz unten rechts 

Das heißt: je größer x, desto weiter rechts – je größer y, desto weiter unten.

world.height = 2500
world.width = 6000
world.height / 2 und world.width / 2 ist die Mitte des Levels

Wenn man y: world.height - "zahl" schreibt, ist es einfacher, sich das wie ein normales Koordinatensystem vorzustellen 
("zahl" größer heißt weiter oben und "world.height -" kann man sich wegdenken)

Der Spieler ist 250 breit
*/


/*
ERKLÄRUNG BEWEGUNG / MOVING:

Es ist relativ simpel: einfach rechts nach links und hoch nach runter und zurück – man kann jedem Level-Objekt folgende Attribute geben:
moving, axis, min, max, speed und direction. (Diese Attribute sind unten in Beispielen erklärt)

Man kann das jedem Objekt geben! Egal welchem Level-Objekt (Plattform, Gefahr, Ziel usw.)

Dann habe ich noch ein Delay hinzugefügt. Das ist optional, aber praktisch für zeitbasierte Hindernisse. 
Das Delay sorgt dafür, dass das Objekt bei min und max für eine gewisse Zeit stehen bleibt. 
Dafür muss man folgendes Attribut hinzufügen:
pauseDuration (Beispiel unten)

Standardmäßig ist das 0, also wenn man es nicht hinschreibt, gibt es keine Verzögerung. 
*/


/*
function initLevel() {
    // Spieler-Startposition – kann man anpassen
    player.x = 100;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };

    levelObjects = [
        // Boden über ganzes Level
        { x: -1000, y: world.height - 100, width: world.width + 1000, height: 100, type: 'platform' },
		
        // Wand am Level-Ende
		{ x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },
				
        // Duck-Passage: nur mit Ducken (S) passierbar
        { x: 300, y: world.height - 275, width: 200, height: 150, type: 'platform' },

        // Gegner hinter Duck-Passage
        { x: 600, y: world.height - 130, width: 30, height: 30, type: 'danger' },

        // Plattform zum Springen 
        { x: 900, y: world.height - 300, width: 150, height: 20, type: 'platform' },

        // Zungenobjekt über Plattform
        { x: 1150, y: world.height - 450, width: 20, height: 20, type: 'tongue' },

        // Catcher danach (nur mit Tarnung passierbar) – mit Bewegung
		{
			x: 1600,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, // wenn false, kann man es einfach weglassen
			axis: 'x', // x oder y
			min: 1500, // Endposition links bzw. oben (bei y-Achse)
			max: 1700, // Endposition rechts bzw. unten
			speed: 1, // je größer, desto schneller (Pixel pro Zyklus)
			direction: 1 // 1 = Start nach rechts/unten, 0 = Start nach links/oben
		},

        // Bewegliche Plattform
        {
			x: 1350,
			y: world.height - 250,
			width: 100,
			height: 20,
			type: 'platform',
			moving: true,
			axis: 'y',
			min: world.height - 500, 
			max: world.height -101, 
			speed: 1,
			direction: 1,
			pauseDuration: 60 // Frames (60 = 1 Sekunde)
		},

        // Checkpoint
        { x: 1800, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

        // Ziel ganz rechts
        { x: 2000, y: world.height - 130, width: 30, height: 30, type: 'goal' }
    ];
}
*/

window.LEVEL_THEME = 'forest';

function initLevel() {

    applyLevelBackground();

    // Spieler-Startposition
    player.x = 100;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };

    levelObjects = [
        // Boden über das gesamte Level
        { x: -1000, y: world.height - 100, width: world.width + 2000, height: 100, type: 'platform', color: 'gold' },

        // Wand am Anfang
        { x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },

        // === 0–1000 === Einstieg ===
        { x: 300, y: world.height - 500, width: 300, height: 380, type: 'platform', color: 'grey' }, // Duckpassage
        { x: 700, y: world.height - 180, width: 60, height: 66, type: 'danger', color: 'red' }, // 1. Roter Block
        { x: 700, y: world.height - 200, width: 120, height: 20, type: 'platform', color: 'blue' },
		{ x: 800, y: world.height - 300, width: 120, height: 20, type: 'platform', color: 'blue' },

        // === 1000–2000 ===
        { x: 900, y: world.height - 280, width: 20, height: 150, type: 'danger', color: 'red' }, // Block nach 2. Stufe
        { x: 1150, y: world.height - 450, width: 20, height: 20, type: 'tongue', color: 'pink' }, // Zunge

        // Beweglicher Catcher (Feind)
        {
            x: 800,
            y: world.height - 130,
            width: 30,
            height: 30,
            type: 'catcher',
            moving: true,
            axis: 'x',
            min: 800,
            max: 1200,
            speed: 2,
            direction: 1,
            color: 'black'
        },

        // Lift 1
        {
            x: 1300,
            y: world.height - 250,
            width: 80,
            height: 20,
            type: 'platform',
            moving: true,
            axis: 'y',
            min: world.height - 500,
            max: world.height - 150,
            speed: 2,
            direction: 1,
            pauseDuration: 60,
            color: 'purple'
        },
        { x: 1400, y: world.height - 410, width: 150, height: 20, type: 'platform' },
		{ x: 1400, y: world.height - 120 , width: 180, height: 20, type: 'danger', color: 'red' },
        { x: 1400, y: world.height - 470, width: 150, height: 30, type: 'danger', color: 'red' },

        // Beweglicher Catcher
        {
            x: 1600,
            y: world.height - 130,
            width: 30,
            height: 30,
            type: 'catcher',
            moving: true,
            axis: 'x',
            min: 1550,
            max: 1750,
            speed: 1.5,
            direction: 1,
            color: 'black'
        },

        // Checkpoint
        { x: 1800, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

        // === 2000–3000 === Sprung & Falle ===
        { x: 2000, y: world.height - 200, width: 80, height: 20, type: 'platform' },

        // Bewegender roter Block
        {
            x: 2050,
            y: world.height - 130,
            width: 30,
            height: 30,
            type: 'danger',
            moving: true,
            axis: 'x',
            min: 2000,
            max: 2200,
            speed: 3,
            direction: 1,
            pauseDuration: 20,
            color: 'red'
        },

        { x: 2200, y: world.height - 250, width: 200, height: 150, type: 'platform', color: 'grey' }, // Großer Block
        { x: 2275, y: world.height - 275, width: 30, height: 30, type: 'danger', color: 'red' }, // Falle auf Passage
        { x: 2400, y: world.height - 130, width: 90, height: 30, type: 'danger', color: 'red' }, // Danger vor Lift 2

        // Lift 2
        {
            x: 2500,
            y: world.height - 250,
            width: 100,
            height: 20,
            type: 'platform',
            moving: true,
            axis: 'y',
            min: world.height - 500,
            max: world.height - 150,
            speed: 2,
            direction: 1,
            pauseDuration: 30,
            color: 'yellow'
        },
        
        { x: 2600, y: world.height - 600, width: 20, height: 600, type: 'platform', color: 'grey' }, // Hoher Balken
        { x: 2750, y: world.height - 130, width: 30, height: 30, type: 'danger', color: 'red' },

        // Checkpoint
        { x: 2900, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

        // Zunge
        { x: 3000, y: world.height - 450, width: 20, height: 20, type: 'tongue', color: 'pink' },

        // === 3000–4000 === Jump-Wave + Gegnerkette ===
        { x: 3100, y: world.height - 250, width: 80, height: 20, type: 'platform' },
        { x: 3200, y: world.height - 300, width: 80, height: 20, type: 'platform' },
        { x: 3300, y: world.height - 350, width: 80, height: 20, type: 'platform' },

        // Gegnerkette am Boden
        { x: 3100, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3200, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3300, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3400, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3500, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3600, y: world.height - 130, width: 30, height: 30, type: 'danger' },

        // Bewegliche Plattform
        {
            x: 3400,
            y: world.height - 200,
            width: 80,
            height: 20,
            type: 'platform',
            moving: true,
            axis: 'x',
            min: 3400,
            max: 3600,
            speed: 2,
            direction: 1,
            pauseDuration: 40,
            color: 'cyan'
        },

        // Checkpoint
        { x: 3700, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

        // === 4000–5000 === Duck + Jump Chaos ===
        { x: 3800, y: world.height - 275, width: 180, height: 150, type: 'platform', color: 'grey' },
        
        // Bewegliche Gefahren (Y-Achse)
        { 
            x: 4100,
            y: world.height - 130,
            width: 30,
            height: 30,
            type: 'danger',
            moving: true,
            axis: 'y',
            min: world.height - 300,
            max: world.height - 130,
            speed: 2,
            direction: 1,
            pauseDuration: 10
        },
        { 
            x: 4200,
            y: world.height - 130,
            width: 30,
            height: 30,
            type: 'danger',
            moving: true,
            axis: 'y',
            min: world.height - 300,
            max: world.height - 130,
            speed: 3,
            direction: 1,
            pauseDuration: 10
        },
        { 
            x: 4300,
            y: world.height - 130,
            width: 30,
            height: 30,
            type: 'danger',
            moving: true,
            axis: 'y',
            min: world.height - 300,
            max: world.height - 130,
            speed: 4,
            direction: 1,
            pauseDuration: 10
        },
        { 
            x: 4400,
            y: world.height - 130,
            width: 30,
            height: 30,
            type: 'danger',
            moving: true,
            axis: 'y',
            min: world.height - 300,
            max: world.height - 130,
            speed: 5,
            direction: 1,
            pauseDuration: 10
        },

        // Checkpoint + Zunge
        { x: 4600, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },
        { x: 4600, y: world.height - 450, width: 20, height: 20, type: 'tongue', color: 'pink' },

        // Plattformen
        { x: 4800, y: world.height - 400, width: 200, height: 20, type: 'platform' },
        { x: 5100, y: world.height - 400, width: 200, height: 20, type: 'platform' },

        // Gefahren-Treppe
        { x: 4800, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 4830, y: world.height - 160, width: 30, height: 60, type: 'danger' },
        { x: 4860, y: world.height - 190, width: 30, height: 90, type: 'danger' },
        { x: 4890, y: world.height - 220, width: 30, height: 120, type: 'danger' },

        // Beweglicher Catcher
        {
            x: 5100,
            y: world.height - 430,
            width: 30,
            height: 30,
            type: 'catcher',
            moving: true,
            axis: 'x',
            min: 5200,
            max: 5400,
            speed: 4,
            direction: 1,
            color: 'black'
        },

        // === 5000–6000 === Endkampf + Ziel ===
        { x: 5100, y: world.height - 200, width: 80, height: 20, type: 'platform' },
        { x: 5200, y: world.height - 250, width: 80, height: 20, type: 'platform' },
        { x: 5300, y: world.height - 130, width: 120, height: 30, type: 'danger' },

        // Bewegliche Plattform
        {
            x: 5400,
            y: world.height - 300,
            width: 100,
            height: 20,
            type: 'platform',
            moving: true,
            axis: 'y',
            min: world.height - 400,
            max: world.height - 150,
            speed: 2,
            direction: 1,
            pauseDuration: 60,
            color: 'blue'
        },

        // Zunge und Endhindernis
        { x: 5600, y: world.height - 700, width: 20, height: 20, type: 'tongue' },
        { x: 5585, y: world.height - 600, width: 60, height: 500, type: 'danger', color: 'black' },

        // Ziel
        { x: 5900, y: world.height - 130, width: 30, height: 30, type: 'goal', color: 'gold' }
    ];
}
