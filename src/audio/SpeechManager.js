/**
 * SpeechManager.js
 * Hanterar text-till-tal (talsyntes) via Web Speech API.
 * Avstängd som standard (aktiveras i inställningar eller via högtalarknapp).
 */
export class SpeechManager {
  constructor() {
    this.synth = window.speechSynthesis || null;
    let savedSetting = null;
    try {
      savedSetting = localStorage.getItem('tts_enabled');
    } catch (e) {
      console.warn('LocalStorage ej tillgängligt:', e);
    }
    // Avstängd (false) som standard om inget val sparas tidigare
    this.isEnabled = savedSetting === 'true';
    this.voice = null;

    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;
    
    const loadVoices = () => {
      try {
        const voices = this.synth.getVoices();
        if (voices && voices.length > 0) {
          const svVoices = voices.filter(v => v.lang && (v.lang.startsWith('sv') || v.lang.includes('SE')));
          
          // Prioritera naturliga röster (som Google svensk eller molnröster) framför eSpeak/robotröster
          this.voice = svVoices.find(v => v.name.includes('Google')) ||
                       svVoices.find(v => v.name.includes('Natural')) ||
                       svVoices.find(v => !v.localService) ||
                       svVoices[0] ||
                       null;
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
  
  // Om det är en textfråga eller geometrifråga, läs upp texten som den är
  if (question.isTextProblem || question.isGeometry || question.text) {
    // Ta bort radbrytningar och menyvalssiffror vid uppläsning för renare tal
    return question.text.replace(/\n/g, ' ');
  }

  const ops = {
    '+': 'plus',
    '-': 'minus',
    '–': 'minus',
    '×': 'gånger',
    '÷': 'delat med'
  };
  const opWord = ops[question.operator] || question.operator;
  return `Vad blir ${question.num1} ${opWord} ${question.num2}?`;
}