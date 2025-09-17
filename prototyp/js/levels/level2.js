/*
ERKLÄRUNG KOORDINATENSYSTEM:
Das Level ist 6000 * 2500 px groß. Es ist möglich, Objekte auch außerhalb davon zu platzieren.

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
c* -> das ist (0, 2500) ganz unten links
d* -> das ist (6000, 2500) ganz unten rechts 

Das heißt: je größer x, desto weiter rechts – je größer y, desto weiter unten.

world.height = 2500
world.width = 6000
world.height / 2 und world.width / 2 ist die Mitte des Levels

Wenn man y: world.height - "zahl" schreibt, ist es einfacher sich das wie ein normales Koordinatensystem vorzustellen 
("zahl" größer heißt weiter oben und "world.height -" kann man sich wegdenken).

Der Spieler ist 250 breit und 
*/


/*
ERKLÄRUNG BEWEGUNG / MOVING:

Es ist relativ simpel: einfach rechts nach links und hoch nach runter und zurück – man kann jedem Level-Objekt folgende Attribute geben:
moving, axis, min, max, speed und direction. (Diese Attribute habe ich unten im Beispiel erklärt)

Man kann das jedem Objekt geben! Egal welchem Level-Objekt (Plattform, Gefahr, Ziel usw.)

Dann habe ich noch ein Delay hinzugefügt. Das ist optional, aber ich dachte, es ist vielleicht praktisch für zeitbasierte Hindernisse. 
Das Delay sorgt dafür, dass das Objekt bei min und max für eine gewisse Zeit stehen bleibt. 
Dafür muss man folgendes Attribut hinzufügen:
pauseDuration (Beispiel unten)

Standardmäßig ist das 0, also wenn man es nicht hinschreibt, gibt es keine Verzögerung. 
*/

window.LEVEL_THEME = 'village';





function initLevel() {

applyLevelBackground();	
    // Spieler-Startposition – kann man anpassen
    player.x = -900;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };


    levelObjects = [
        // Boden über das ganze Level
        { x: -1000, y: world.height - 100, width: world.width +30, height: 100, type: 'platform' },
		// Wand am Level-Anfang
		{ x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },
		// Wand am Level-Ende
		//{ x: world.width, y: world.height - 400, width: 50, height: 500, type: 'platform' },
			
        // Duck-Passage 1
        { x: -700, y: world.height - 275, width: 200, height: 150, type: 'platform' },

		
        // Gegner 1
        { x: -400, y: world.height - 130, width: 30, height: 30, type: 'danger' },


		// Gegner 2
        { x: -100, y: world.height - 130, width: 30, height: 30, type: 'danger' },


        // Plattform zum Springen 1
        { x: 300, y: world.height - 200, width: 200, height: 10, type: 'platform' },


		// Gegner 3
        { x: 400, y: world.height - 120, width: 20, height: 20, type: 'danger' },


		// Gegner mit Bewegung 1
		{
			x: 600,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, // wenn false, kann man es einfach weglassen. Wenn es sich bewegen soll, muss true gesetzt sein
			axis: 'x', // x oder y
			min: 500, // Endposition links bzw. oben (bei y-Achse)
			max: 800, // Endposition rechts bzw. unten
			speed: 1, // je größer, desto schneller (Pixel + oder - pro Zyklus)
			direction: 1 // 1 heißt Start nach rechts (bei x-Achse) oder nach unten (bei y-Achse). Mit 0 geht es nach links / oben. Nicht wirklich relevant (wird immer bei min und max gewechselt)		
		},


		// Plattform zum Springen 2
        { x: 600, y: world.height - 300, width: 200, height: 10, type: 'platform' },


		// Gegner 4
        { x: 870, y: world.height - 200, width: 30, height: 30, type: 'danger' },


		// Plattform mit Bewegung 
        {
			x: 900,
			y: world.height - 250,
			width: 100,
			height: 20,
			type: 'platform',
			moving: true,
			axis: 'y',
			min: world.height - 400, 
			max: world.height -101, 
			speed: 1,
			direction: 1,
			pauseDuration: 60 // das sind keine Millisekunden, sondern Frames. 60fps (Frames pro Sekunde) sind Standard. Also 60 = 1 Sekunde
		},


		// Plattform zum Springen 3
        { x: 1000, y: world.height - 400, width: 200, height: 10, type: 'platform' },


		// Checkpoint 1 unten
        { x: 1100, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },


		// Checkpoint 1 oben
        { x: 1100, y: world.height - 410, width: 30, height: 10, type: 'checkpoint' },


		// Gegner 5
        { x: 1500, y: world.height - 330, width: 30, height: 30, type: 'danger' },


		// Gegner mit Bewegung 2
		{
			x: 1500,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'x',
			min: 1300,
			max: 1800,
			speed: 1,
			direction: 1		
		},


		// Gegner mit Bewegung 3
		{
			x: 1800,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'x',
			min: 1300,
			max: 1800,
			speed: 1,
			direction: 1		
		},

		// Plattform zum Springen 4
        { x: 1400, y: world.height - 300, width: 200, height: 10, type: 'platform' },


		// Gegner mit Bewegung 4
		{
			x: 1600,
			y: world.height - 200,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'y',
			min: world.height - 400,
			max: world.height - 250,
			speed: 1,
			direction: 1		
		},


		// Plattform zum Springen 5
        { x: 1800, y: world.height - 200, width: 200, height: 10, type: 'platform' },


		// Gegner mit Bewegung 5
		{
			x: 2000,
			y: world.height - 100,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'y',
			min: world.height - 250,
			max: world.height - 100,
			speed: 1,
			direction: 1		
		},


		// Gegner 6
        { x: 1800, y: world.height - 120, width: 20, height: 20, type: 'danger' },


		// Checkpoint 2
        { x: 2200, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },


		// Zungenobjekt über Plattform 1
        { x: 2200, y: world.height - 450, width: 20, height: 20, type: 'tongue' },


		// Duck-Passage 2
		{ x: 2300, y: world.height - 275, width: 100, height: 150, type: 'platform' },


		// Gegner 7
        { x: 2500, y: world.height - 130, width: 30, height: 30, type: 'danger' },


		// Zungenobjekt über Plattform 2
        { x: 2500, y: world.height - 450, width: 20, height: 20, type: 'tongue' },


		// Duck-Passage 3
		{ x: 2600, y: world.height - 275, width: 100, height: 150, type: 'platform' },


		// Plattform zum Springen 6
        { x: 2700, y: world.height - 275, width: 300, height: 10, type: 'platform' },


		// Gegner 8
        { x: 2800, y: world.height - 130, width: 30, height: 30, type: 'danger' },


		// Gegner 9
        { x: 2900, y: world.height - 130, width: 30, height: 30, type: 'danger' },


		// Gegner mit Bewegung 6
		{
			x: 2800,
			y: world.height - 305,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'x',
			min: 2800,
			max: 3100,
			speed: 1,
			direction: 1		
		},


		// Duck-Passage 4
		{ x: 3000, y: world.height - 275, width: 250, height: 150, type: 'platform' },


		// Gegner mit Bewegung 7
		{
			x: 3400,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'x',
			min: 3400,
			max: 4600,
			speed: 1,
			direction: 1		
		},


		// Gegner mit Bewegung 8
		{
			x: 3600,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'x',
			min: 3400,
			max: 4600,
			speed: 1,
			direction: 1		
		},


		// Gegner mit Bewegung 9
		{
			x: 4100,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'x',
			min: 3400,
			max: 4600,
			speed: 1,
			direction: 1		
		},


		// Gegner mit Bewegung 10
		{
			x: 4300,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'x',
			min: 3400,
			max: 4400,
			speed: 1,
			direction: 1		
		},


		// Gegner mit Bewegung 11
		{
			x: 4500,
			y: world.height - 200,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'y',
			min: world.height - 250,
			max: world.height - 130,
			speed: 1,
			direction: 1		
		},
		

		// Gegner mit Bewegung 12
		{
			x: 4650,
			y: world.height - 160,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'y',
			min: world.height - 250,
			max: world.height - 130,
			speed: 1,
			direction: 1		
		},


		// Gegner mit Bewegung 13
		{
			x: 4800,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true,
			axis: 'y',
			min: world.height - 250,
			max: world.height - 130,
			speed: 1,
			direction: 1		
		},


        // Ziel ganz rechts
        { x: 4970, y: world.height - 120, width: 30, height: 20, type: 'goal' },


		// Bereich außerhalb vom Spielfeld
        { x: 0, y: world.height + 30, width: 6000, height: 30, type: 'danger' },




    ];
}
