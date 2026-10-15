import { MenuManager } from './MenuManager.js';
import { Keypad } from './Keypad.js';
import { HelpModal } from './HelpModal.js';
import { Sketchpad } from './Sketchpad.js';

/**
 * HUD.js
 * Huvudkoordinator för gränssnittet. Delegerar till MenuManager, Keypad, HelpModal och Sketchpad.
 */
export class HUD {
  constructor(onAnswerSubmit, onStartGame, onReturnToMenu, soundCallbacks) {
    this.soundCallbacks = soundCallbacks || {};
    this.isMuted = false;

    // Skapa undermoduler
    this.menuManager = new MenuManager(onStartGame, onReturnToMenu);
    this.keypad = new Keypad('input-area', onAnswerSubmit);
    this.helpModal = new HelpModal();
    this.sketchpad = new Sketchpad('sketchCanvas', 'btn-clear-sketch');

    // UI-element för spelskärmen
    this.levelIndicator = document.getElementById('level-indicator');
    this.roundIndicator = document.getElementById('round-indicator');
    this.questionElement = document.getElementById('question-box');
    this.feedbackElement = document.getElementById('feedback-message');
    this.progressBar = document.getElementById('progress-bar');

    // Inställningar & Skissknapp
    this.settingsModal = document.getElementById('settings-modal');
    this.sketchpadPanel = document.getElementById('sketchpad-panel');
    this.btnSketch = document.getElementById('btn-sketch');

    this.initSettingsEvents();
    this.initSketchpadEvents();
  }

  initSettingsEvents() {
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');

    if (btnSettings) {
      btnSettings.onclick = () => {
        const msg = document.getElementById('reset-confirm-msg');
        if (msg) msg.classList.add('hidden');
        if (this.settingsModal) this.settingsModal.classList.remove('hidden');
      };
    }

    if (btnCloseSettings) {
      btnCloseSettings.onclick = () => {
        if (this.settingsModal) this.settingsModal.classList.add('hidden');
      };
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.settingsModal && !this.settingsModal.classList.contains('hidden')) {
        this.settingsModal.classList.add('hidden');
      }
    });

    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
      volumeSlider.oninput = (e) => {
        const vol = parseFloat(e.target.value) / 100;
        if (this.soundCallbacks.onVolumeChange) {
          this.soundCallbacks.onVolumeChange(vol);
        }
      };
    }

    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
      muteBtn.onclick = () => {
        this.isMuted = !this.isMuted;
        muteBtn.innerText = this.isMuted ? 'Ljud: Ljudlöst' : 'Ljud: På';
        if (this.soundCallbacks.onMuteToggle) {
          this.soundCallbacks.onMuteToggle(this.isMuted);
        }
      };
    }

    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.onclick = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('completed_')) {
            localStorage.removeItem(key);
          }
        });
        this.updateTierButtons();
        const msg = document.getElementById('reset-confirm-msg');
        if (msg) msg.classList.remove('hidden');
      };
    }
  }

  initSketchpadEvents() {
    if (this.btnSketch && this.sketchpadPanel) {
      this.btnSketch.onclick = () => {
        const isHidden = this.sketchpadPanel.classList.contains('hidden');
        if (isHidden) {
          this.sketchpadPanel.classList.remove('hidden');
          this.btnSketch.classList.add('btn-top-active');
          setTimeout(() => this.sketchpad.resize(), 50);
        } else {
          this.sketchpadPanel.classList.add('hidden');
          this.btnSketch.classList.remove('btn-top-active');
        }
      };
    }
  }

  // DELEGATMETODER (för bakåtkompatibilitet med main.js)
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
    if (this.menuManager) {
      this.menuManager.showStartScreen();
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

    if (this.helpModal) {
      this.helpModal.setCurrentQuestion(question);
    }
    this.unlockInput();

    if (this.questionElement) {
      if (question.isTextProblem) {
        this.questionElement.innerText = question.text;
        this.questionElement.style.fontSize = '1.35rem';
        this.questionElement.style.lineHeight = '1.5';
        this.questionElement.style.maxWidth = '750px';
      } else {
        this.questionElement.innerText = `${question.num1} ${question.operator} ${question.num2} = ?`;
        this.questionElement.style.fontSize = '3.2rem';
        this.questionElement.style.lineHeight = 'normal';
        this.questionElement.style.maxWidth = 'none';
      }
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