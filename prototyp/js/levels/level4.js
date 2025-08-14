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
	// Spieler-Startposition
	player.x = 100;
	player.y = world.height - 130;
	player.spawnPoint = { x: player.x, y: player.y };

	levelObjects = [
		// Boden über ganzes level
		{ x: -1000, y: world.height - 100, width: world.width + 1000, height: 100, type: 'platform' },
		// Wand level ende
		{ x: -1000, y: world.height - 400, width: 50, height: 500, type: 'platform' },

		// Zungenobjekt über Plattform
		{ x: 150, y: world.height - 450, width: 20, height: 20, type: 'tongue' },

		// Duck-Passage
		{ x: 170, y: world.height - 275, width: 100, height: 180, type: 'platform' },
		{ x: 300, y: world.height - 400, width: 20, height: 180, type: 'platform' },
		{ x: 320, y: world.height - 150, width: 20, height: 200, type: 'platform' },
		{ x: 380, y: world.height - 150, width: 30, height: 30, type: 'danger' },
		{ x: 420, y: world.height - 180, width: 20, height: 300, type: 'platform' },
		{ x: 470, y: world.height - 275, width: 100, height: 180, type: 'platform' },
		{ x: 500, y: world.height - 400, width: 20, height: 50, type: 'platform' },
		{ x: 580, y: world.height - 450, width: 20, height: 120, type: 'platform' },

		{ x: 620, y: world.height - 150, width: 20, height: 200, type: 'platform' },
		{ x: 640, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 800, max: 950, speed: 4, direction: 1 },
		{ x: 650, y: world.height - 230, width: 30, height: 30, type: 'danger' },
		{ x: 720, y: world.height - 180, width: 20, height: 300, type: 'platform' },
		{ x: 800, y: world.height - 280, width: 20, height: 100, type: 'platform' },
		{ x: 900, y: world.height - 300, width: 150, height: 20, type: 'platform' },

		{ x: 1000, y: world.height - 210, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 1000, max: 1200, speed: 4, direction: 1 },
		{ x: 1000, y: world.height - 180, width: 250, height: 100, type: 'platform' },
		{ x: 1150, y: world.height - 550, width: 20, height: 20, type: 'tongue' },

		{ x: 1300, y: world.height - 275, width: 300, height: 120, type: 'platform' },
		{ x: 1300, y: world.height - 305, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 1300, max: 1600, speed: 5, direction: 1 },
		{ x: 1350, y: world.height - 250, width: 100, height: 20, type: 'platform', moving: true, axis: 'y', min: world.height - 600, max: world.height - 401, speed: 1, direction: 1, pauseDuration: 60 },

		{ x: 1800, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 2000, max: 2600, speed: 1, direction: 1 },
		{ x: 1800, y: world.height - 305, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 2000, max: 2600, speed: 3, direction: 1 },
		{ x: 1800, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 2700, max: 3100, speed: 3, direction: 1 },
		{ x: 1800, y: world.height - 200, width: 40, height: 40, type: 'platform' },
		{ x: 1800, y: world.height - 190, width: 40, height: 40, type: 'platform' },
		{ x: 1800, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

		{ x: 2000, y: world.height - 220, width: 40, height: 40, type: 'platform' },

		{ x: 2200, y: world.height - 275, width: 60, height: 80, type: 'platform' },

		{ x: 2350, y: world.height - 250, width: 100, height: 20, type: 'platform', moving: true, axis: 'y', min: world.height - 600, max: world.height - 401, speed: 1, direction: 1, pauseDuration: 60 },

		{ x: 2400, y: world.height - 220, width: 40, height: 40, type: 'platform' },
		{ x: 2450, y: world.height - 600, width: 20, height: 20, type: 'tongue' },

		{ x: 2600, y: world.height - 250, width: 40, height: 40, type: 'platform' },

		{ x: 2800, y: world.height - 600, width: 20, height: 20, type: 'tongue' },
		{ x: 2800, y: world.height - 275, width: 60, height: 80, type: 'platform' },

		{ x: 3000, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 1500, max: 1700, speed: 1, direction: 1 },

		{ x: 3150, y: world.height - 600, width: 20, height: 20, type: 'tongue' },

		{ x: 3200, y: world.height - 130, width: 30, height: 30, type: 'danger' },

		{ x: 3300, y: world.height - 230, width: 30, height: 250, type: 'platform' },
		
		{ x: 3800, y: world.height - 230, width: 30, height: 250, type: 'platform' },

		{ x: 3350, y: world.height - 250, width: 100, height: 20, type: 'platform', moving: true, axis: 'y', min: world.height - 800, max: world.height - 401, speed: 1, direction: 1, pauseDuration: 60 },

		{ x: 4100, y: world.height - 130, width: 30, height: 30, type: 'danger' },

		{ x: 4150, y: world.height - 600, width: 20, height: 20, type: 'tongue' },

		{ x: 4200, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 1500, max: 1700, speed: 1, direction: 1 },

		{ x: 4300, y: world.height - 230, width: 400, height: 10, type: 'platform' },

		{ x: 4350, y: world.height - 250, width: 100, height: 20, type: 'platform', moving: true, axis: 'y', min: world.height - 800, max: world.height - 401, speed: 1, direction: 1, pauseDuration: 60 },

		{ x: 4600, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 1500, max: 1700, speed: 1, direction: 1 },

		{ x: 4800, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

		{ x: 5200, y: world.height - 450, width: 20, height: 20, type: 'tongue' },

		{ x: 5300, y: world.height - 275, width: 300, height: 200, type: 'platform' },

		{ x: 5900, y: world.height - 130, width: 30, height: 30, type: 'danger' },

		{ x: 6000, y: world.height - 130, width: 30, height: 30, type: 'goal' }
	];
}
