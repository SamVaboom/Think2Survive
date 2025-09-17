// sound.js
'use strict';

class Sound {
  constructor(basePath = 'audio/') {
    this.base = basePath;

    // Einmalige Sounds (SFX)
    this.sfx = {
      jump:           this._make('jump.mp3'),            // Sprung
      checkpoint:     this._make('checkpoint.mp3'),      // Checkpoint erreicht
      losing:         this._make('losing.mp3'),          // Niederlage
      winning:        this._make('winning.mp3'),         // Sieg
      buttonmenu:     this._make('buttonmenu.mp3'),      // Klick im Menü
      correct:        this._make('correctanswere.mp3'),  // Quiz: richtige Antwort
      wrong:          this._make('wronganswere.mp3'),    // Quiz: falsche Antwort
    };

    // Wiederholende Sounds (Loops)
    this.music = this._make('music.mp3', { loop: true, volume: 0.0 });   // Hintergrundmusik
    this.walking = this._make('walking.mp3', { loop: true, volume: 0.20 }); // Gehgeräusch

    // Cooldowns (ms) → verhindert Sound-Spam
    this.cooldown = {
      jump: 120,        // Mindestabstand zwischen Sprüngen
      checkpoint: 200,  // Mindestabstand zwischen Checkpoint-Sounds
    };
    this._last = {};    // merkt sich letzte Abspielzeit pro Sound
  }

  // Aktuelle Zeit abrufen (für Cooldowns)
  _now() { return performance.now(); }

  // Audio-Objekt erstellen
  _make(file, opts = {}) {
    const a = new Audio(this.base + file);
    a.preload = 'auto'; // Vorladen
    a.loop = !!opts.loop;
    a.volume = (opts.volume != null) ? opts.volume : 0.8;
    a.playbackRate = opts.rate || 1.0;
    return a;
  }

  // --- MUSIK ---
  playMusic() { this._safePlay(this.music); }  // Musik starten
  stopMusic() { this._safeStop(this.music); }  // Musik stoppen

  // --- GEHEN (Loop) ---
  startWalk() { this._safePlay(this.walking); } // Geh-Sound starten
  stopWalk()  { this._safeStop(this.walking); } // Geh-Sound stoppen

  // --- UI-Sounds ---
  uiClick()   { this._playOnce('buttonmenu'); } // Klick im Menü

  // --- QUIZ-Sounds ---
  quizCorrect() { this._playOnce('correct'); } // Richtige Antwort
  quizWrong()   { this._playOnce('wrong'); }   // Falsche Antwort

  // --- GAMEPLAY-Sounds ---
  jump()       { this._playOnce('jump', this.cooldown.jump); }             // Sprung-Sound
  checkpoint() { this._playOnce('checkpoint', this.cooldown.checkpoint); } // Checkpoint
  win()        { this._playOnce('winning'); }                              // Sieg
  lose()       { this._playOnce('losing'); }                               // Niederlage

  // --- Hilfsfunktionen ---
  _playOnce(key, cd = 0) {
    const now = this._now();
    const last = this._last[key] || 0;
    if (now - last < cd) return; // noch im Cooldown → nicht abspielen

    const a = this.sfx[key];
    if (!a) return;
    try { 
      a.currentTime = 0; // zurückspulen
      a.play();          // abspielen
    } catch {}
    this._last[key] = now;
  }

  _safePlay(a) {
    try {
      if (a.paused) {
        a.currentTime = 0;
        a.play();
      }
    } catch {}
  }

  _safeStop(a) {
    try {
      a.pause();
      a.currentTime = 0;
    } catch {}
  }
}

// Eine globale Instanz bereitstellen (Pfad automatisch anpassen)
(function () {
  // Falls im /prototyp/-Pfad → anderes Basisverzeichnis verwenden
  const inPrototyp = /\/prototyp\//.test(location.pathname);
  const base = inPrototyp ? 'audio/' : 'prototyp/audio/';
  window.sound = new Sound(base);
})();
