// sound.js
'use strict';

class Sound {
  constructor(basePath = 'audio/') {
    this.base = basePath;

    // One-shots (simple)
    this.sfx = {
      jump:           this._make('jump.mp3'),
      checkpoint:     this._make('checkpoint.mp3'),
      losing:         this._make('losing.mp3'),
      winning:        this._make('winning.mp3'),
      buttonmenu:     this._make('buttonmenu.mp3'),
      correct:        this._make('correctanswere.mp3'),
      wrong:          this._make('wronganswere.mp3'),
    };

    // Loops
    this.music = this._make('music.mp3', { loop: true, volume: 0.0 });
    this.walking = this._make('walking.mp3', { loop: true, volume: 0.20 });

    // Basic cooldowns to avoid spam (ms)
    this.cooldown = {
      jump: 120,
      checkpoint: 200,
    };
    this._last = {};
  }

  _now() { return performance.now(); }

  _make(file, opts = {}) {
    const a = new Audio(this.base + file);
    a.preload = 'auto';
    a.loop = !!opts.loop;
    a.volume = (opts.volume != null) ? opts.volume : 0.8;
    a.playbackRate = opts.rate || 1.0;
    return a;
  }

  // --- MUSIC
  playMusic() { this._safePlay(this.music); }
  stopMusic() { this._safeStop(this.music); }

  // --- WALK LOOP
  startWalk() { this._safePlay(this.walking); }
  stopWalk()  { this._safeStop(this.walking); }

  // --- UI
  uiClick()   { this._playOnce('buttonmenu'); }

  // --- QUIZ
  quizCorrect() { this._playOnce('correct'); }
  quizWrong()   { this._playOnce('wrong'); }

  // --- GAMEPLAY SFX
  jump()       { this._playOnce('jump', this.cooldown.jump); }
  checkpoint() { this._playOnce('checkpoint', this.cooldown.checkpoint); }
  win()        { this._playOnce('winning'); }
  lose()       { this._playOnce('losing'); }

  // --- helpers
  _playOnce(key, cd = 0) {
    const now = this._now();
    const last = this._last[key] || 0;
    if (now - last < cd) return;

    const a = this.sfx[key];
    if (!a) return;
    try { a.currentTime = 0; a.play(); } catch {}
    this._last[key] = now;
  }

  _safePlay(a) {
    try {
      if (a.paused) { a.currentTime = 0; a.play(); }
    } catch {}
  }

  _safeStop(a) {
    try {
      a.pause();
      a.currentTime = 0;
    } catch {}
  }
}

// Expose single instance (auto-detect base so it works on both pages)
(function () {
  // Root page uses "prototyp/audio/", quiz/game page uses "audio/"
  const inPrototyp = /\/prototyp\//.test(location.pathname);
  const base = inPrototyp ? 'audio/' : 'prototyp/audio/';
  window.sound = new Sound(base);
})();
