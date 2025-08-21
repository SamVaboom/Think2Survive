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

function initLevel() {
    // Spieler-Startposition - cha me apasse
    player.x = 100;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };


    levelObjects = [
        // Boden über ganzes level
        { x: -1000, y: world.height - 100, width: world.width + 1000, height: 100, type: 'platform' },
		// Wand level ende
		{ x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },
				
        // Duck-Passage: zum Ducken mit S
        { x: 300, y: world.height - 310, width: 200, height: 192, type: 'platform' },

        // Gegner hinter Duck-Passage
        { x: 700, y: world.height - 110, width: 704, height: 16, type: 'danger' },

        // Plattform zum Springen 
        { x: 600, y: world.height - 220, width: 160, height: 32, type: 'platform' },

		 // Plattform zum Springen 
        { x: 600, y: world.height - 420, width: 160, height: 32, type: 'platform' },

			 // Plattform zum Springen 
        { x: 850, y: world.height - 520, width: 160, height: 32, type: 'platform' },

		 // Plattform zum Springen 
        { x: 1020, y: world.height - 620, width: 80, height: 32, type: 'platform' },

		// Plattform zum Springen 
        { x: 1404, y: world.height - 600, width: 80, height: 600, type: 'platform' },

		// Plattform zum Springen 
        { x: 1604, y: world.height - 1000, width: 80, height: 600, type: 'platform' },

		// Plattform zum Springen 
        { x: 1804, y: world.height - 200, width: 80, height: 600, type: 'platform' },

		// Plattform zum Springen 
        { x: 2004, y: world.height - 300, width: 80, height: 600, type: 'platform' },

		// Plattform zum Springen 
        { x: 2204, y: world.height - 400, width: 80, height: 600, type: 'platform' },


        // Zungenobjekt über Plattform
        //{ x: 1150, y: world.height - 450, width: 20, height: 20, type: 'tongue' },

        // Catcher danach (nur mit Tarnung durch) -- mit bewegung
		{
			x: 1600,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 1550, //endposition links bzw oben wenn y achse
			max: 1700, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},

        // Plattform moving 
        {
			x: 1200,
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


        // Checkpoint
        { x: 1750, y: world.height - 132, width: 32, height: 32, type: 'checkpoint' },

        // Ziel ganz rechts
        { x: 2000, y: world.height - 130, width: 30, height: 30, type: 'goal' }
    ];
}

