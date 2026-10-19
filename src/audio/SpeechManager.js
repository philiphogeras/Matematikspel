/**
 * SpeechManager.js
 * Hanterar text-till-tal (talsyntes) via webbläsarens inbyggda Web Speech API.
 */
export class SpeechManager {
  constructor() {
    this.synth = window.speechSynthesis || null;
    let savedSetting = 'true';
    try {
      savedSetting = localStorage.getItem('tts_enabled');
    } catch (e) {
      console.warn('LocalStorage ej tillgängligt:', e);
    }
    this.isEnabled = savedSetting === null ? true : savedSetting === 'true';
    this.voice = null;

    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;
    
    const loadVoices = () => {
      try {
        const voices = this.synth.getVoices();
        if (voices && voices.length > 0) {
          this.voice = voices.find(v => v.lang && v.lang.startsWith('sv')) || null;
        }
      } catch (e) {
        console.warn('Röster kunde inte laddas:', e);
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  speak(text) {
    if (!this.synth || !this.isEnabled || !text) {
      this.cancel();
      return;
    }

    try {
      this.cancel();

      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sv-SE';
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = 0.9;

      this.synth.speak(utterance);
    } catch (e) {
      console.error('Talsyntesfel:', e);
    }
  }

  cancel() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
    try {
      localStorage.setItem('tts_enabled', this.isEnabled ? 'true' : 'false');
    } catch (e) {}
    if (!this.isEnabled) {
      this.cancel();
    }
    return this.isEnabled;
  }

  formatQuestionForSpeech(question) {
    if (!question) return '';
    
    if (question.isTextProblem) {
      return question.text;
    }

    const ops = {
      '+': 'plus',
      '-': 'minus',
      '–': 'minus',
      '×': 'gånger',
      '÷': 'delat med'
    };
    const opWord = ops[question.operator] || question.operator;
    return `${question.num1} ${opWord} ${question.num2}, vad blir det?`;
  }
}