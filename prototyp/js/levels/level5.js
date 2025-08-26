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
    player.x = -800;
    player.y = world.height - 130;
    player.spawnPoint = { x: player.x, y: player.y };


    levelObjects = [
		// Turm anfang
		{ x: -500, y: world.height - 1000, width: 100, height: 182, type: 'platform' },
		{ x: -500, y: world.height - 800, width: 100, height: 800, type: 'platform' },
		{ x: -600, y: world.height - 800, width: 110, height: 30, type: 'platform' },
		{ x: -750, y: world.height - 420, width: 15, height: 15, type: 'tongue' },
		{ x: -910, y: world.height - 575, width: 15, height: 15, type: 'tongue' },
		{ x: -750, y: world.height - 730, width: 15, height: 15, type: 'tongue' },
		{ x: -910, y: world.height - 885, width: 15, height: 15, type: 'tongue' },
		{ x: -750, y: world.height - 1000, width: 15, height: 15, type: 'tongue' },
		
		//Runter
		{ x: -410, y: world.height - 800, width: 110, height: 30, type: 'platform' },
		{ x: -410, y: world.height - 600, width: 110, height: 30, type: 'platform' },
		{ x: -410, y: world.height - 400, width: 110, height: 30, type: 'platform' },		
		{ x: -410, y: world.height - 200, width: 110, height: 30, type: 'platform' },
		{ x: -300, y: world.height - 799, width: 80, height: 230, type: 'danger', moving: true, axis: 'y', min: world.height - 800, max: world.height - 330, speed: 3, direction: 1, pauseDuration: 30},					
		{ x: -400, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },
		// Turm 2
		{ x: -220, y: world.height - 1000, width: 100, height: 860, type: 'platform' },
		{ x: -220, y: world.height - 139, width: 100, height: 40, type: 'danger', moving: true, axis: 'y', min: world.height - 140, max: world.height - 99, speed: 1, direction: 1, pauseDuration: 157},
		
		{ x: -2000, y: world.height - 99, width: 1000, height: 100, type: 'danger' },
        // Boden Start 
        { x: -1000, y: world.height - 100, width: 1200, height: 100, type: 'platform' },
		// Boden Lava lol
		{ x: 200, y: world.height - 99, width: 5000, height: 100, type: 'danger' },
		
		//Gondel
		{
			x: 500,
			y: world.height - 150,
			width: 110,
			height: 20,
			type: 'platform',
			moving: true,
			axis: 'x',
			min: 300, 
			max: 1000, 
			speed: 2.5,
			direction: 1,
			pauseDuration: 30 
		},
		
		// Jump & Run über lava
		{ x: 400, y: world.height - 180, width: 30, height: 30, type: 'danger' },
		{ x: 700, y: world.height - 180, width: 30, height: 30, type: 'danger' },
		{ x: 1150, y: world.height - 200, width: 80, height: 30, type: 'platform' },
		{ x: 1350, y: world.height - 250, width: 80, height: 30, type: 'platform' },
		{ x: 1525, y: world.height - 300, width: 80, height: 30, type: 'platform' },
		{ x: 1545, y: world.height - 309, width: 40, height: 29, type: 'danger', moving: true, axis: 'y', min: world.height - 329, max: world.height - 299, speed: 1.5, direction: 1, pauseDuration: 60},		
		{ x: 1725, y: world.height - 300, width: 50, height: 30, type: 'platform' },
		{ x: 2000, y: world.height - 135, width: 50, height: 30, type: 'platform' },
		{ x: 2200, y: world.height - 175, width: 80, height: 30, type: 'platform' },
		{ x: 2300, y: world.height - 135, width: 50, height: 30, type: 'platform', moving: true, axis: 'y', min: world.height - 800, max: world.height - 135, speed: 1, direction: 1, pauseDuration: 60},
		{ x: 2550, y: world.height - 135, width: 50, height: 30, type: 'platform', moving: true, axis: 'y', min: world.height - 800, max: world.height - 135, speed: 1, direction: 1, pauseDuration: 60 },		
		{ x: 2300, y: world.height - 350, width: 50, height: 100, type: 'danger' },
		{ x: 2550, y: world.height - 600, width: 50, height: 100, type: 'danger' },
		{ x: 2300, y: world.height - 850, width: 50, height: 100, type: 'danger' },
		
		//Drop und Pattform		
		{ x: 2700, y: world.height - 850, width: 200, height: 850, type: 'platform' },
		{ x: 2750, y: world.height - 860, width: 30, height: 10, type: 'checkpoint' },	
		{ x: 2900, y: world.height - 849, width: 205, height: 498, type: 'catcher' },	
		{ x: 3100, y: world.height - 1000, width: 50, height: 650, type: 'platform' },
		{ x: 2890, y: world.height - 105, width: 500, height: 105, type: 'platform' },
	
		// Turm 3
		
		
    ];
}

