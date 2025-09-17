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

a* -> das ist (0, 0), ganz oben links
b* -> das ist (6000, 0), ganz oben rechts
c* -> das ist (0, 2500), ganz unten links
d* -> das ist (6000, 2500), ganz unten rechts 

Das heißt: je größer x, desto weiter rechts – je größer y, desto weiter unten.

world.height = 2500
world.width = 6000
world.height / 2 und world.width / 2 ist die Mitte des Levels

Wenn man y: world.height - "Zahl" schreibt, ist es einfacher, sich das Ganze wie in einem normalen Koordinatensystem vorzustellen 
(je größer "Zahl", desto weiter oben – man kann sich das "- world.height" also wegdenken).

Der Spieler ist 250 px breit und ...
*/

/*
ERKLÄRUNG BEWEGUNG / MOVING:

Die Logik ist relativ simpel: links nach rechts, hoch nach runter und wieder zurück.  
Man kann jedem Level-Objekt folgende Attribute zuweisen:
moving, axis, min, max, speed und direction. (Alle Attribute werden unten in einem Beispiel erklärt.)

Das funktioniert mit jedem Objekt! Egal ob Plattform, Gefahr, Ziel usw.

Zusätzlich gibt es noch ein optionales Delay, das ich eingebaut habe.  
Das ist nützlich für zeitbasierte Hindernisse.  
Mit dem Delay bleibt das Objekt an den Endpunkten (min und max) für eine bestimmte Zeit stehen.  
Dafür muss man folgendes Attribut hinzufügen:
pauseDuration (siehe Beispiel unten).

Standardmäßig ist das 0, also wenn man es nicht angibt, gibt es keine Pause.
*/

// Array von Nachrichten mit Farben und vertikaler Position
const messages = [
	{ text: "Move left and right with (A) and (D)", top: 50, color: "#ffffffff" },    // weiß
	{ text: "Jump with (W) or (space)", top: 100, color: "#ffffffff" },    // weiß
	{ text: "Duck with (S)", top: 150, color: "#ffffffff" },    // weiß
  	{ text: "Avoid purple Catchers with (E) for 3 Seconds", top: 250, color: "#e20ed1ff" },    // lila
  	{ text: "Danger: avoid red blocks", top: 200, color: "#f54444ff" },   // rot
  	{ text: "Doublejump with (space)", top: 300, color: "#10ce3fff" },   // grün
  	{ text: "Checkpoints are blue", top: 350, color: "#2980b9" },    // blau
  	{ text: "Finish is gold", top: 400, color: "#f1c40f" }   // gelb
];

// Jede Nachricht durchgehen und dem DOM hinzufügen
messages.forEach(msg => {
  const box = document.createElement("div");
  box.innerText = msg.text;

  // Style für den Text
  box.style.position = "absolute";
  box.style.top = msg.top + "px";       // vertikale Position
  box.style.left = "20%";               // horizontale Position
  box.style.transform = "translateX(-50%)";
  box.style.padding = "8px 16px";
  box.style.background = "#333";        // dunkler Hintergrund für Kontrast
  box.style.color = msg.color;          // individuelle Textfarbe
  box.style.fontSize = "18px";
  box.style.borderRadius = "6px";
  box.style.marginBottom = "20px";

  document.body.appendChild(box);
});

// Thema des Levels
window.LEVEL_THEME = 'zoo';

function initLevel() {
  // Hintergrund anwenden
  applyLevelBackground();
  
  {
    // Spieler-Startposition – kann angepasst werden
    player.x = 100;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };

    levelObjects = [
        // Tutorial
		// Boden über das ganze Level
        { x: -1000, y: world.height - 100, width: world.width + 3000, height: 100, type: 'platform' },
		// Wand am Ende des Levels
		{ x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },
		
		// Plattform zum Springen 
        { x: 304, y: world.height - 200, width: 80, height: 600, type: 'platform' },

  		// Duck-Passage: ducken mit S
        { x: 800, y: world.height - 1110, width: 80, height: 992, type: 'platform' },

	    // Gegner hinter Duck-Passage
        { x: 1300, y: world.height - 132, width: 32, height: 32, type: 'danger' },

		// Passage: bei Catcher
        { x: 1880, y: world.height - 1110, width: 80, height: 952, type: 'platform' },

        // Catcher danach (nur mit Tarnung passierbar) – mit Bewegungs-Option
		{
			x: 1900,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: false, // wenn false, bewegt er sich nicht
			axis: 'x', // Bewegungsrichtung: x oder y
			min: 1300, // Endposition links bzw. oben (bei y)
			max: 1300, // Endposition rechts bzw. unten
			speed: 1, // je höher, desto schneller (Pixel pro Zyklus)
			direction: 1 // 1 = Start nach rechts/unten, 0 = Start nach links/oben
		},

		// Zungen-Objekt über Plattform
        { x: 2350, y: world.height - 450, width: 20, height: 20, type: 'tongue' },

		// Plattform nach Zunge
        { x: 2500, y: world.height - 310, width: 200, height: 250, type: 'platform' },

		// Checkpoint
        { x: 3300, y: world.height - 132, width: 32, height: 32, type: 'checkpoint' },

		// ---------------- LEVEL ----------------
        
		// Duck-Passage
        { x: 4000, y: world.height - 310, width: 200, height: 192, type: 'platform' },

		// Gegner hinter Duck-Passage
        { x: 4500, y: world.height - 110, width: 650, height: 16, type: 'danger' },

		// Mehrere Plattformen zum Springen
        { x: 4300, y: world.height - 220, width: 160, height: 32, type: 'platform' },
        { x: 4300, y: world.height - 420, width: 160, height: 32, type: 'platform' },
        { x: 4550, y: world.height - 520, width: 160, height: 32, type: 'platform' },
        { x: 4720, y: world.height - 620, width: 80, height: 32, type: 'platform' },

		// Bewegende Plattform
        {
			x: 4900,
			y: world.height - 250,
			width: 160,
			height: 16,
			type: 'platform',
			moving: true,
			axis: 'y',
			min: world.height - 500, 
			max: world.height -301, 
			speed: 1,
			direction: 1,
			pauseDuration: 60 // Frames (bei 60fps = 1 Sekunde Pause)
		},

		// Weitere Plattformen zum Springen
        { x: 5104, y: world.height - 600, width: 80, height: 600, type: 'platform' },
        { x: 5304, y: world.height - 1000, width: 80, height: 600, type: 'platform' },
        { x: 5504, y: world.height - 200, width: 80, height: 600, type: 'platform' },
        { x: 5704, y: world.height - 300, width: 80, height: 32, type: 'platform' },
        { x: 5900, y: world.height - 400, width: 80, height: 600, type: 'platform' },

		// Zungen-Objekt über Plattform
        { x: 6200, y: world.height - 650, width: 20, height: 20, type: 'tongue' },

		// Plattform danach
        { x: 6300, y: world.height - 400, width: 80, height: 600, type: 'platform' },
		 
		// Gegner unter Zunge
        { x: 5980, y: world.height - 132, width: 320, height: 32, type: 'danger' },

		// Hohe Plattform
		{ x: 6800, y: world.height - 1000, width: 320, height: 1000, type: 'platform' },
       
        // Catcher danach (nur mit Tarnung passierbar) – bewegend
		{
			x: 1900,
			y: world.height - 150,
			width: 50,
			height: 50,
			type: 'catcher',
			moving: true,
			axis: 'x', // Bewegungsrichtung: x oder y
			min: 6400, // Endposition links/oben
			max: 6700, // Endposition rechts/unten
			speed: 2, // je höher, desto schneller
			direction: 1
		},

        // Checkpoint
        { x: 5450, y: world.height - 132, width: 32, height: 32, type: 'checkpoint' },

        // Ziel ganz rechts
        { x: 6770, y: world.height - 130, width: 30, height: 30, type: 'goal' }
    ];
  }
}
