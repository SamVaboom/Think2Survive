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
    player.x = -900;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };


    levelObjects = [
        // Boden über ganzes level
        { x: -1000, y: world.height - 100, width: world.width +30, height: 100, type: 'platform' },
		// Wand level anfang
		{ x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },
		// Wand level ende
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


		// Gegner mit bewegung 1
		{
			x: 600,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 500, //endposition links bzw oben wenn y achse
			max: 800, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Plattform zum Springen 2
        { x: 600, y: world.height - 300, width: 200, height: 10, type: 'platform' },


		// Gegner 4
        { x: 870, y: world.height - 200, width: 30, height: 30, type: 'danger' },


		// Plattform moving 
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
			pauseDuration: 60 // das si ke milli-sekunde oder so. Das si frames. 60fps (frames pro sekunde) si standard. Drum 60 = 1s (öppe)
		},


		// Plattform zum Springen 3
        { x: 1000, y: world.height - 400, width: 200, height: 10, type: 'platform' },


		// Checkpoint 1 unten
        { x: 1100, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },


		// Checkpoint 1 oben
        { x: 1100, y: world.height - 410, width: 30, height: 10, type: 'checkpoint' },


		// Gegner 5
        { x: 1500, y: world.height - 330, width: 30, height: 30, type: 'danger' },


		// Gegner mit bewegung 2
		{
			x: 1500,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 1300, //endposition links bzw oben wenn y achse
			max: 1800, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Gegner mit bewegung 3
		{
			x: 1800,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 1300, //endposition links bzw oben wenn y achse
			max: 1800, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},

		// Plattform zum Springen 4
        { x: 1400, y: world.height - 300, width: 200, height: 10, type: 'platform' },


		// Gegner mit bewegung 4
		{
			x: 1600,
			y: world.height - 200,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'y', // x oder y
			min: world.height - 400, //endposition links bzw oben wenn y achse
			max: world.height - 250, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Plattform zum Springen 5
        { x: 1800, y: world.height - 200, width: 200, height: 10, type: 'platform' },


		// Gegner mit bewegung 5
		{
			x: 2000,
			y: world.height - 100,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'y', // x oder y
			min: world.height - 250, //endposition links bzw oben wenn y achse
			max: world.height - 100, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Gegner 6
        { x: 1800, y: world.height - 120, width: 20, height: 20, type: 'danger' },


		// Checkpoint 2
        { x: 2200, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },


		// Zungenobjekt über Plattform 1
        { x: 2200, y: world.height - 450, width: 20, height: 20, type: 'tongue' },


		//Duck-Passage 2
		{ x: 2300, y: world.height - 275, width: 100, height: 150, type: 'platform' },


		// Gegner 7
        { x: 2500, y: world.height - 130, width: 30, height: 30, type: 'danger' },


		// Zungenobjekt über Plattform 1
        { x: 2500, y: world.height - 450, width: 20, height: 20, type: 'tongue' },


		//Duck-Passage 3
		{ x: 2600, y: world.height - 275, width: 100, height: 150, type: 'platform' },


		// Plattform zum Springen 6
        { x: 2700, y: world.height - 275, width: 300, height: 10, type: 'platform' },


		// Gegner 8
        { x: 2800, y: world.height - 130, width: 30, height: 30, type: 'danger' },


		// Gegner 9
        { x: 2900, y: world.height - 130, width: 30, height: 30, type: 'danger' },


		// Gegner mit bewegung 6
		{
			x: 2800,
			y: world.height - 305,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 2800, //endposition links bzw oben wenn y achse
			max: 3100, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		//Duck-Passage 4
		{ x: 3000, y: world.height - 275, width: 250, height: 150, type: 'platform' },


		// Gegner mit bewegung 7
		{
			x: 3400,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 3400, //endposition links bzw oben wenn y achse
			max: 4600, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Gegner mit bewegung 8
		{
			x: 3600,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 3400, //endposition links bzw oben wenn y achse
			max: 4600, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Gegner mit bewegung 9
		{
			x: 4100,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 3400, //endposition links bzw oben wenn y achse
			max: 4600, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Gegner mit bewegung 10
		{
			x: 4300,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 3400, //endposition links bzw oben wenn y achse
			max: 4400, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Gegner mit bewegung 11
		{
			x: 4500,
			y: world.height - 200,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'y', // x oder y
			min: world.height - 250, //endposition links bzw oben wenn y achse
			max: world.height - 130, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},
		

		// Gegner mit bewegung 12
		{
			x: 4650,
			y: world.height - 160,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'y', // x oder y
			min: world.height - 250, //endposition links bzw oben wenn y achse
			max: world.height - 130, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


		// Gegner mit bewegung 13
		{
			x: 4800,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'y', // x oder y
			min: world.height - 250, //endposition links bzw oben wenn y achse
			max: world.height - 130, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},


        // Ziel ganz rechts
        { x: 4970, y: world.height - 120, width: 30, height: 20, type: 'goal' },


		// Ausserhalb Spielbereich
        { x: 0, y: world.height + 30, width: 6000, height: 30, type: 'danger' },




    ];
}


