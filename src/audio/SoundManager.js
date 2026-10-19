/**
 * SoundManager.js
 * Syntetiserar ljudeffekter via Web Audio API helt utan externa filer eller setTimeout-strängar.
 */
export class SoundManager {
  constructor() {
    this.ctx = null;
    this.volume = 0.7;
    this.isMuted = false;
  }

  initContext() {
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

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setMuted(muted) {
    this.isMuted = !!muted;
  }

  playTone(freq, type, duration, delay = 0) {
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.volume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Ljudspelningsfel:', e);
    }
  }

  playCorrect() {
    this.playTone(523.25, 'sine', 0.15, 0);     // C5
    this.playTone(659.25, 'sine', 0.25, 0.12);  // E5
  }

  playIncorrect() {
    this.playTone(220, 'sawtooth', 0.2, 0);     // A3
    this.playTone(196, 'sawtooth', 0.3, 0.15);  // G3
  }

  playFanfare() {
    this.playTone(523.25, 'triangle', 0.12, 0);     // C5
    this.playTone(659.25, 'triangle', 0.12, 0.12);  // E5
    this.playTone(783.99, 'triangle', 0.12, 0.24);  // G5
    this.playTone(1046.50, 'triangle', 0.35, 0.36); // C6
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 880.00, 1046.50];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.25, i * 0.12);
    });
  }
}