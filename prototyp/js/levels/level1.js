

/*
ERKLÄRUNG KOORDINATENSYSTEM:
Level isch 6000 * 2500 px gross. Es isch möglich Objekt usserhalb vo däm z'platziere.

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

a* -> das isch (0, 0) ganz obe links
b* -> das isch (6000, 0) ganz obe rechts
c* -> das isch (0, 2500) ganz unte rechts
d* -> das isch (6000, 2500) ganz unte rechts 

Das heisst desto grösser x desto weiter rechts - desto grösser y desto witer unte.

world.height = 2500
world.width = 6000
world.height / 2 und world.width / 2 isch mitti vom level

Wenn me y: world.height - "zahl" macht denn ischs chli eifacher zum sich vorstelle wius denn wie es normals koordinatesystem isch ("zahl" grösser heisst witter obe und "world.height -" cha me sich wegdenke)

Player cha 250 wit und 
*/


/*
ERKLÄRUNG BEWEGUNG / MOVING:

Es isch relativ simpel, eifach rechts nach links und ue nach abe und zrugg - Man cha jedem levelObjekt folgendi attribut zueweise:
moving, axis, min, max, speed und direction. (Ig ha alli die attribut unte im ne biispiu erklärt)

Me cha das allem zuewiise!! Egal welem Level-Objekt (plattform, danger, goal usw.)

Denn hani no e delay hinzuegfüegt. Das isch optional aber ig ha dänkt es isch vllt praktisch für de time-basierti hindernis. 
De delay macht dass s'Objekt bim min und max stah blibt für x time. Me muess folgendes attribut hinzuefüege:
pauseDuration (biispiu unte)

Standardmässig isch das 0 drum wenn mes nid schribt, denn gits ke delay. 
*/

// Array of messages with colors and vertical positions
const messages = [
	{ text: "Move left and richt with (A) and (D)", top: 50, color: "#ffffffff" },    // white
	{ text: "Jump wiht (W) or (space)", top: 100, color: "#ffffffff" },    // white
	{ text: "Duck with (S)", top: 150, color: "#ffffffff" },    // white
  { text: "Avoid purple Catchers with (E) for 3 Seconds", top: 250, color: "#e20ed1ff" },    // purple
  { text: "Danger avoid red blocks", top: 200, color: "#f54444ff" },   // red
  { text: "Doublejump with (space)", top: 300, color: "#10ce3fff" },   // green
  { text: "Checkpoints are blue", top: 350, color: "#2980b9" },    // blue
  { text: "Finish is gold", top: 400, color: "#f1c40f" }   // yellow
];

// Loop through each message and add it to the page
messages.forEach(msg => {
  const box = document.createElement("div");
  box.innerText = msg.text;

  // Style each text
  box.style.position = "absolute";
  box.style.top = msg.top + "px";       // vertical position
  box.style.left = "20%";               // horizontal center
  box.style.transform = "translateX(-50%)";
  box.style.padding = "8px 16px";
  box.style.background = "#333";        // dark background for contrast
  box.style.color = msg.color;          // unique text color
  box.style.fontSize = "18px";
  box.style.borderRadius = "6px";
  box.style.marginBottom = "20px";

  document.body.appendChild(box);
});

// top of file
window.LEVEL_THEME = 'zoo';





function initLevel() {
// inside initLevel(), first line
applyLevelBackground();
  
  {
    // Spieler-Startposition - cha me apasse
    player.x = 100;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };



    levelObjects = [
        //Tutorial
		// Boden über ganzes level
        { x: -1000, y: world.height - 100, width: world.width + 3000, height: 100, type: 'platform' },
		// Wand level ende
		{ x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },
		
		// Plattform zum Springen 
        { x: 304, y: world.height - 200, width: 80, height: 600, type: 'platform' },

	
  		// Duck-Passage: zum Ducken mit S
        { x: 800, y: world.height - 1110, width: 80, height: 992, type: 'platform' },

	   // Gegner hinter Duck-Passage
        { x: 1300, y: world.height - 132, width: 32, height: 32, type: 'danger' },

		// Passage: bei Catcher
        { x: 1880, y: world.height - 1110, width: 80, height: 952, type: 'platform' },

       // Catcher danach (nur mit Tarnung durch) -- mit bewegung
		{
			x: 1900,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: false, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 1300, //endposition links bzw oben wenn y achse
			max: 1300, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},

		 // Zungenobjekt über Plattform
        { x: 2350, y: world.height - 450, width: 20, height: 20, type: 'tongue' },

		// Plattform nach tongue
        { x: 2500, y: world.height - 310, width: 200, height: 250, type: 'platform' },

		// Checkpoint
        { x: 3300, y: world.height - 132, width: 32, height: 32, type: 'checkpoint' },



		// Level
        
		// Duck-Passage: zum Ducken mit S
        { x: 4000, y: world.height - 310, width: 200, height: 192, type: 'platform' },

		// Gegner hinter Duck-Passage
        { x: 4500, y: world.height - 110, width: 650, height: 16, type: 'danger' },

		// Plattform zum Springen 
        { x: 4300, y: world.height - 220, width: 160, height: 32, type: 'platform' },

		 // Plattform zum Springen 
        { x: 4300, y: world.height - 420, width: 160, height: 32, type: 'platform' },

			 // Plattform zum Springen 
        { x: 4550, y: world.height - 520, width: 160, height: 32, type: 'platform' },

		 // Plattform zum Springen 
        { x: 4720, y: world.height - 620, width: 80, height: 32, type: 'platform' },

		// Plattform moving 
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
			pauseDuration: 60 // das si ke milli-sekunde oder so. Das si frames. 60fps (frames pro sekunde) si standard. Drum 60 = 1s (öppe)
		},


		// Plattform zum Springen 
        { x: 5104, y: world.height - 600, width: 80, height: 600, type: 'platform' },

		// Plattform zum Springen 
        { x: 5304, y: world.height - 1000, width: 80, height: 600, type: 'platform' },

		// Plattform zum Springen 
        { x: 5504, y: world.height - 200, width: 80, height: 600, type: 'platform' },

		// Plattform zum Springen 
        { x: 5704, y: world.height - 300, width: 80, height: 32, type: 'platform' },

		// Plattform zum Springen 
        { x: 5900, y: world.height - 400, width: 80, height: 600, type: 'platform' },

		// Zungenobjekt über Plattform
        { x: 6200, y: world.height - 650, width: 20, height: 20, type: 'tongue' },

		// Plattform zum Springen 
        { x: 6300, y: world.height - 400, width: 80, height: 600, type: 'platform' },
		 
		// Gegner unter tongue
        { x: 5980, y: world.height - 132, width: 320, height: 32, type: 'danger' },


		{ x: 6800, y: world.height - 1000, width: 320, height: 1000, type: 'platform' },
       

        

       
// Catcher danach (nur mit Tarnung durch) -- mit bewegung
		{
			x: 1900,
			y: world.height - 150,
			width: 50,
			height: 50,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 6400, //endposition links bzw oben wenn y achse
			max: 6700, //endposition rechts bzw unte
			speed: 2, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},
        // Checkpoint
        { x: 5450, y: world.height - 132, width: 32, height: 32, type: 'checkpoint' },

        // Ziel ganz rechts
        { x: 6770, y: world.height - 130, width: 30, height: 30, type: 'goal' }
    ];
}

}
