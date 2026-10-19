import { MenuManager } from './MenuManager.js';
import { Keypad } from './Keypad.js';
import { HelpModal } from './HelpModal.js';
import { Sketchpad } from './Sketchpad.js';
import { SpeechManager } from '../audio/SpeechManager.js';

/**
 * HUD.js
 * Huvudkoordinator för gränssnittet.
 */
export class HUD {
  constructor(onAnswerSubmit, onStartGame, onReturnToMenu, soundCallbacks) {
    this.soundCallbacks = soundCallbacks || {};
    this.isMuted = false;

    this.menuManager = new MenuManager(onStartGame, onReturnToMenu);
    this.keypad = new Keypad('input-area', onAnswerSubmit);
    this.helpModal = new HelpModal();
    this.sketchpad = new Sketchpad('sketchCanvas', 'btn-clear-sketch');
    this.speechManager = new SpeechManager();

    this.levelIndicator = document.getElementById('level-indicator');
    this.roundIndicator = document.getElementById('round-indicator');
    this.questionElement = document.getElementById('question-box');
    this.feedbackElement = document.getElementById('feedback-message');
    this.progressBar = document.getElementById('progress-bar');

    this.settingsModal = document.getElementById('settings-modal');
    this.sketchpadPanel = document.getElementById('sketchpad-panel');
    this.btnSketch = document.getElementById('btn-sketch');
    this.btnReadAloud = document.getElementById('btn-read-aloud');

    this.currentQuestion = null;

    this.initSettingsEvents();
    this.initSketchpadEvents();
    this.initSpeechEvents();
    this.updateSpeakerButtonVisibility();
  }

  formatColoredNumber(num) {
    const str = num.toString();
    const len = str.length;
    const posClasses = ['digit-ental', 'digit-tiotal', 'digit-hundratal'];

    let html = '';
    for (let i = 0; i < len; i++) {
      const digit = str[i];
      const posIndex = len - 1 - i;
      const cls = posClasses[posIndex] || 'digit-ental';
      html += `<span class="${cls}">${digit}</span>`;
    }
    return html;
  }

  initSettingsEvents() {
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');

    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        const msg = document.getElementById('reset-confirm-msg');
        if (msg) msg.classList.add('hidden');
        if (this.settingsModal) this.settingsModal.classList.remove('hidden');
      });
    }

    if (btnCloseSettings) {
      btnCloseSettings.addEventListener('click', () => {
        if (this.settingsModal) this.settingsModal.classList.add('hidden');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.settingsModal && !this.settingsModal.classList.contains('hidden')) {
        this.settingsModal.classList.add('hidden');
      }
    });

    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value) / 100;
        if (this.soundCallbacks.onVolumeChange) {
          this.soundCallbacks.onVolumeChange(vol);
        }
      });
    }

    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        muteBtn.innerText = this.isMuted ? 'Ljudeffekter: Av' : 'Ljudeffekter: På';
        if (this.soundCallbacks.onMuteToggle) {
          this.soundCallbacks.onMuteToggle(this.isMuted);
        }
      });
    }

    const ttsBtn = document.getElementById('btn-toggle-tts');
    if (ttsBtn) {
      this.updateTTSButtonText(ttsBtn);

      ttsBtn.addEventListener('click', () => {
        this.speechManager.toggleEnabled();
        this.updateTTSButtonText(ttsBtn);
        this.updateSpeakerButtonVisibility();
      });
    }

    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        try {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('completed_')) {
              localStorage.removeItem(key);
            }
          });
        } catch (e) {}
        this.updateTierButtons();
        const msg = document.getElementById('reset-confirm-msg');
        if (msg) msg.classList.remove('hidden');
      });
    }
  }

  updateTTSButtonText(btn) {
    if (!btn) return;
    btn.innerText = this.speechManager.isEnabled 
      ? 'Uppläsning (Text-till-tal): På' 
      : 'Uppläsning (Text-till-tal): Av';
  }

  updateSpeakerButtonVisibility() {
    if (this.btnReadAloud) {
      if (this.speechManager.isEnabled) {
        this.btnReadAloud.classList.remove('hidden');
      } else {
        this.btnReadAloud.classList.add('hidden');
      }
    }
  }

  initSketchpadEvents() {
    if (this.btnSketch && this.sketchpadPanel) {
      this.btnSketch.addEventListener('click', () => {
        const isHidden = this.sketchpadPanel.classList.contains('hidden');
        if (isHidden) {
          this.sketchpadPanel.classList.remove('hidden');
          this.btnSketch.classList.add('btn-top-active');
          requestAnimationFrame(() => this.sketchpad.resize());
        } else {
          this.sketchpadPanel.classList.add('hidden');
          this.btnSketch.classList.remove('btn-top-active');
        }
      });
    }
  }

  initSpeechEvents() {
    if (this.btnReadAloud) {
      this.btnReadAloud.addEventListener('click', () => {
        if (this.currentQuestion && this.speechManager.isEnabled) {
          const textToRead = this.speechManager.formatQuestionForSpeech(this.currentQuestion);
          this.speechManager.speak(textToRead);
        }
      });
    }
  }

  updateTierButtons() {
    if (this.menuManager) {
      this.menuManager.updateTierButtons();
    }
  }

  setupSubcategoryMenu(operationKey, titleText, subcatList) {
    if (this.menuManager) {
      this.menuManager.setupSubcategoryMenu(operationKey, titleText, subcatList);
    }
  }

  showStartScreen() {
    if (this.speechManager) {
      this.speechManager.cancel();
    }
    if (this.menuManager) {
      this.menuManager.showStartScreen();
    }
    this.unlockInput();
  }

  showTierMenu() {
    if (this.speechManager) {
      this.speechManager.cancel();
    }
    if (this.menuManager) {
      this.menuManager.showTierMenu();
    }
    this.unlockInput();
  }

  showGameScreen() {
    if (this.menuManager) {
      this.menuManager.showGameScreen();
    }
  }

  updateTopBar(operation, category, tier, round, percentage) {
    const catLabels = {
      ental: 'Ental', tiotal: 'Tiotal', hundratal: 'Hundratal',
      tabell_2_5_10: '2, 5 & 10:an', tabell_3_4_6: '3, 4 & 6:an', tabell_7_8_9: '7, 8 & 9:an',
      problemlosning: 'Problemlösning'
    };
    const tierNames = { brons: 'Brons', silver: 'Silver', guld: 'Guld' };
    
    let symbol = '+';
    if (operation === 'subtraction') symbol = '–';
    if (operation === 'multiplication') symbol = '×';
    if (operation === 'division') symbol = '÷';

    if (this.levelIndicator) {
      this.levelIndicator.innerText = `${catLabels[category] || category} (${symbol}): ${tierNames[tier] || tier}`;
    }
    if (this.roundIndicator) {
      this.roundIndicator.innerText = `Omgång ${round}/3`;
    }

    const colors = { brons: '#e2a76f', silver: '#94a3b8', guld: '#fcd34d' };
    if (this.progressBar) {
      this.progressBar.style.width = `${percentage}%`;
      this.progressBar.style.backgroundColor = colors[tier] || '#3b82f6';
    }
  }

  displayQuestion(question) {
    if (!question) return;

    this.currentQuestion = question;

    if (this.helpModal) {
      this.helpModal.setCurrentQuestion(question);
    }
    this.unlockInput();

    if (this.questionElement) {
      if (question.isTextProblem) {
        this.questionElement.innerText = question.text;
        this.questionElement.style.fontSize = '1.35rem';
        this.questionElement.style.lineHeight = '1.5';
        this.questionElement.style.maxWidth = '700px';
      } else {
        const coloredNum1 = this.formatColoredNumber(question.num1);
        const coloredNum2 = this.formatColoredNumber(question.num2);
        
        this.questionElement.innerHTML = `${coloredNum1} ${question.operator} ${coloredNum2} = ?`;
        this.questionElement.style.fontSize = '3.2rem';
        this.questionElement.style.lineHeight = 'normal';
        this.questionElement.style.maxWidth = 'none';
      }
    }

    if (this.speechManager && this.speechManager.isEnabled) {
      const textToRead = this.speechManager.formatQuestionForSpeech(question);
      this.speechManager.speak(textToRead);
    } else if (this.speechManager) {
      this.speechManager.cancel();
    }

    if (this.keypad) {
      this.keypad.clearInput();
    }
    this.clearFeedback();
  }

  unlockInput() {
    if (this.keypad) {
      this.keypad.unlockInput();
    }
  }

  clearInputAndUnlock() {
    if (this.keypad) {
      this.keypad.clearInput();
      this.keypad.unlockInput();
    }
    this.clearFeedback();
  }

  showFeedback(isCorrect, message) {
    if (this.feedbackElement) {
      this.feedbackElement.innerText = message;
      this.feedbackElement.className = isCorrect ? 'feedback-success' : 'feedback-hint';
    }
  }

  clearFeedback() {
    if (this.feedbackElement) {
      this.feedbackElement.innerText = '';
      this.feedbackElement.className = '';
    }
  }
}