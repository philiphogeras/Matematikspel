/**
 * SpeechManager.js
 * Hanterar text-till-tal (talsyntes) via webbläsarens inbyggda Web Speech API.
 * Innehåller anpassade uttal för matematiksymboler (+, -, ×, ÷).
 */
export class SpeechManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isEnabled = localStorage.getItem('tts_enabled') !== 'false'; // På som standard
    this.voice = null;

    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;
    
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Sök i första hand efter en svensk röst (sv-SE)
      this.voice = voices.find(v => v.lang && v.lang.startsWith('sv')) || null;
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  speak(text) {
    if (!this.synth || !this.isEnabled || !text) return;

    // Stoppa eventuell pågående uppläsning så att röster inte krockar
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.rate = 0.9; // Lite lugnare tempo för anpassat gymnasium

    this.synth.speak(utterance);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('tts_enabled', this.isEnabled ? 'true' : 'false');
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