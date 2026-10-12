/**
 * SoundManager.js
 * Genererar mjuka och positiva ljudeffekter via Web Audio API.
 * Innehåller automatisk upplåsning för alla webbläsare och mobila enheter.
 */
export class SoundManager {
  constructor() {
    this.ctx = null;

    // Lås upp ljudmotorn automatiskt vid första klicket/touchen på skärmen
    const unlock = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'running') {
        window.removeEventListener('click', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('keydown', unlock);
      }
    };

    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('keydown', unlock);
  }

  /**
   * Startar eller återupptar AudioContext.
   */
  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Spelar en mjuk, glad tretonssignal vid rätt svar (C5 -> E5 -> G5).
   */
  playCorrect() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // Frekvenser för C, E, G

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine'; // Mjuk sinusvåg
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.linearRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  /**
   * Spelar en mjuk, icke-bestraffande ton vid fel svar.
   */
  playIncorrect() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle'; // Mjuk triangelvåg
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Spelar en festlig fanfar när en hel trofénivå klaras av!
   */
  playVictory() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0, duration: 0.15 },
      { freq: 659.25, time: 0.15, duration: 0.15 },
      { freq: 783.99, time: 0.30, duration: 0.15 },
      { freq: 1046.50, time: 0.45, duration: 0.6 }
    ];

    notes.forEach((note) => {
      const startTime = now + note.time;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.linearRampToValueAtTime(0.001, startTime + note.duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.duration);
    });
  }
}