/*

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

/*

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
        { x: 300, y: world.height - 275, width: 200, height: 150, type: 'platform' },

        // Gegner hinter Duck-Passage
        { x: 600, y: world.height - 130, width: 30, height: 30, type: 'danger' },

        // Plattform zum Springen 
        { x: 900, y: world.height - 300, width: 150, height: 20, type: 'platform' },

        // Zungenobjekt über Plattform
        { x: 1150, y: world.height - 450, width: 20, height: 20, type: 'tongue' },

        // Catcher danach (nur mit Tarnung durch) -- mit bewegung
		{
			x: 1600,
			y: world.height - 130,
			width: 30,
			height: 30,
			type: 'catcher',
			moving: true, //wenn false, denn cha mes eifach wegloh und es isch okay. wenn sichs bewege söu denn muess true si
			axis: 'x', // x oder y
			min: 1500, //endposition links bzw oben wenn y achse
			max: 1700, //endposition rechts bzw unte
			speed: 1, // desto grösser desto schneller (pixel + oder - pro zyklus)
			direction: 1 // 1 heisst me startet nach rechts wenn x achse/ nach unte wenn y achse. mit 0 geit me nach links / ufe. Nid würk relevant (wird immer bim min und max gswitched)		
		},

        // Plattform moving 
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
			pauseDuration: 60 // das si ke milli-sekunde oder so. Das si frames. 60fps (frames pro sekunde) si standard. Drum 60 = 1s (öppe)
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
    player.x = 100;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };

    levelObjects = [
        // Boden durchgehend
        { x: -1000, y: world.height - 100, width: world.width + 2000, height: 100, type: 'platform', color: 'gold' },

        // Wand Anfang
        { x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },

        // === 0–1000 === Einstieg ===
        { x: 300, y: world.height - 500, width: 300, height: 380, type: 'platform', color: 'grey' }, // Duckpassage
        { x: 700, y: world.height - 180, width: 60, height: 66, type: 'danger', color: 'red' }, // 1. Roter Block
        { x: 700, y: world.height - 200, width: 120, height: 20, type: 'platform', color: 'blue' },
		{ x: 800, y: world.height - 300, width: 120, height: 20, type: 'platform', color: 'blue' },

        // === 1000–2000 aa===
        { x: 900, y: world.height - 280, width: 20, height: 150, type: 'danger', color: 'red' }, //Block nach 2. Stufe
        { x: 1150, y: world.height - 450, width: 20, height: 20, type: 'tongue', color: 'pink' },//tongue

        {
            x: 800, //Feind 1
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

       

        {
            x: 1300, // Lift 1
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

        {
            x: 1600, //Feind
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

        { x: 1800, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

        // === 2000–3000 === Sprung & Falle ===
        { x: 2000, y: world.height - 200, width: 80, height: 20, type: 'platform' },
        {
            x: 2050,
            y: world.height - 130, // Bewegender Roter vor hohem Hinderniss
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

        { x: 2200, y: world.height - 250, width: 200, height: 150, type: 'platform', color: 'grey' }, // Grosser Block
        { x: 2275, y: world.height - 275, width: 30, height: 30, type: 'danger', color: 'red' }, // Falle Auf Passage
        { x: 2400, y: world.height - 130, width: 90, height: 30, type: 'danger', color: 'red' }, // Danger vor Lift 2
        {
            x: 2500,  //Lift 2
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
        
        { x: 2600, y: world.height - 600, width: 20, height: 600, type: 'platform', color: 'grey' }, // hoher Balken
        { x: 2750, y: world.height - 130, width: 30, height: 30, type: 'danger', color: 'red' },

        { x: 2900, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },
        { x: 3000, y: world.height - 450, width: 20, height: 20, type: 'tongue', color: 'pink' },//tongue

        // === 3000–4000 === Jump-Wave + Gegnerkette ===
        { x: 3100, y: world.height - 250, width: 80, height: 20, type: 'platform' },
        { x: 3200, y: world.height - 300, width: 80, height: 20, type: 'platform' },
        { x: 3300, y: world.height - 350, width: 80, height: 20, type: 'platform' },

        // Gegnerkette
        { x: 3100, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3200, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3300, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3400, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3500, y: world.height - 130, width: 30, height: 30, type: 'danger' },
        { x: 3600, y: world.height - 130, width: 30, height: 30, type: 'danger' },

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

        { x: 3700, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

        // === 4000–5000 === Duck + Jump Chaos ===
        { x: 3800, y: world.height - 275, width: 180, height: 150, type: 'platform', color: 'grey' },
        
        { // y Feind 
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
        { // y Feind
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
        { // y Feind
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
                { // y Feind
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

        { x: 4600, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },
        { x: 4600, y: world.height - 450, width: 20, height: 20, type: 'tongue', color: 'pink' },//tongue
        { x: 4800, y: world.height - 400, width: 200, height: 20, type: 'platform' },
        { x: 5100, y: world.height - 400, width: 200, height: 20, type: 'platform' },
        { x: 4800, y: world.height - 130, width: 30, height: 30, type: 'danger' }, //Gefahren Treppe
        { x: 4830, y: world.height - 160, width: 30, height: 60, type: 'danger' },
        { x: 4860, y: world.height - 190, width: 30, height: 90, type: 'danger' },
        { x: 4890, y: world.height - 220, width: 30, height: 120, type: 'danger' },

        {
            x: 5100, //Feind x 2
            y: world.height -430,
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
       

        

        // === 5000–6000 === Endkampf + ZIEL ===
        { x: 5100, y: world.height - 200, width: 80, height: 20, type: 'platform' },
        { x: 5200, y: world.height - 250, width: 80, height: 20, type: 'platform' },
        { x: 5300, y: world.height - 130, width: 120, height: 30, type: 'danger' },
       

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

        { x: 5600, y: world.height - 700, width: 20, height: 20, type: 'tongue' },
        { x: 5585, y: world.height - 600, width: 60, height: 500, type: 'danger', color: 'black' },
        { x: 5900, y: world.height - 130, width: 30, height: 30, type: 'goal', color: 'gold' }
    ];
}
