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
	
		{ x: 3300, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 3400, max: 3650, speed: 1, direction: 1 },
	{ x: 3700, y: world.height - 230, width: 200, height: 60, type: 'platform' },
	{ x: 3900, y: world.height - 330, width: 200, height: 60, type: 'platform' },	


		{ x: 4150, y: world.height - 600, width: 20, height: 20, type: 'tongue' },

		{ x: 4300, y: world.height - 270, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 4300, max: 4700, speed: 1, direction: 1 },
		{ x: 4300, y: world.height - 230, width: 400, height: 10, type: 'platform' },

		{ x: 4300, y: world.height - 230, width: 400, height: 10, type: 'platform' },
		{ x: 4500, y: world.height - 530, width: 200, height: 10, type: 'platform' },

		
		{ x: 4300, y: world.height - 440, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 4300, max: 4600, speed: 1, direction: 1 },
		{ x: 4800, y: world.height - 440, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 4800, max: 6000, speed: 1, direction: 1 },
		{ x: 4400, y: world.height - 400, width: 400, height: 60, type: 'platform' },
		
{ x: 4300, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 4000, max: 4700, speed: 5, direction: 1 },
{ x: 4800, y: world.height - 130, width: 30, height: 30, type: 'catcher', moving: true, axis: 'x', min: 4900, max: 6000, speed: 5, direction: 1 },
		{ x: 4800, y: world.height - 110, width: 30, height: 10, type: 'checkpoint' },

		{ x: 4800, y: world.height - 250, width: 30, height: 20, type: 'platform' },
		{ x: 4900, y: world.height - 280, width: 30, height: 20, type: 'platform' },
		{ x: 5000, y: world.height - 400, width: 30, height: 20, type: 'platform' },
		{ x: 5100, y: world.height - 520, width: 30, height: 20, type: 'platform' },
		{ x: 5200, y: world.height - 250, width: 30, height: 20, type: 'platform' },
		{ x: 5300, y: world.height - 320, width: 30, height: 20, type: 'platform' },
		{ x: 5400, y: world.height - 420, width: 30, height: 20, type: 'platform' },
		{ x: 5500, y: world.height - 510, width: 30, height: 20, type: 'platform' },		
		{ x: 5600, y: world.height - 500, width: 30, height: 20, type: 'platform' },
		{ x: 5700, y: world.height - 580, width: 30, height: 20, type: 'platform' },
		{ x: 5800, y: world.height - 600, width: 30, height: 20, type: 'platform' },
		{ x: 6000, y: world.height - 650, width: 30, height: 30, type: 'goal' }
	];
}


