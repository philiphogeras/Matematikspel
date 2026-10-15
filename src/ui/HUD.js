import { Sketchpad } from './Sketchpad.js';

/**
 * HUD.js
 * Hanterar gränssnitt, menyer, hjälp, tangentbordsinmatning och skissruta.
 */
export class HUD {
  constructor(onAnswerSubmit, onStartGame, onReturnToMenu, soundCallbacks) {
    this.onAnswerSubmit = onAnswerSubmit;
    this.onStartGame = onStartGame;
    this.onReturnToMenu = onReturnToMenu;
    this.soundCallbacks = soundCallbacks || {};

    this.selectedOperation = 'addition';
    this.selectedCategory = 'ental';
    this.isMuted = false;

    this.startScreen = document.getElementById('start-screen');
    this.gameScreen = document.getElementById('game-screen');
    
    this.menuMain = document.getElementById('menu-main');
    this.menuSubcats = document.getElementById('menu-subcategories');
    this.menuTiers = document.getElementById('menu-tiers');
    this.settingsModal = document.getElementById('settings-modal');
    this.helpModal = document.getElementById('help-modal');

    this.subcatMenuTitle = document.getElementById('subcat-menu-title');
    this.tierMenuTitle = document.getElementById('tier-menu-title');
    this.levelIndicator = document.getElementById('level-indicator');
    this.roundIndicator = document.getElementById('round-indicator');
    this.questionElement = document.getElementById('question-box');
    this.inputArea = document.getElementById('input-area');
    this.feedbackElement = document.getElementById('feedback-message');
    this.progressBar = document.getElementById('progress-bar');

    this.sketchpadPanel = document.getElementById('sketchpad-panel');
    this.btnSketch = document.getElementById('btn-sketch');

    this.currentInput = '';
    this.currentQuestion = null;
    this.isWaiting = false;

    // Initiera skissrutan
    this.sketchpad = new Sketchpad('sketchCanvas', 'btn-clear-sketch');

    this.initEventListeners();
    this.initKeypad();
  }

  initEventListeners() {
    window.addEventListener('keydown', (e) => {
      const isGameVisible = !this.gameScreen.classList.contains('hidden');
      const isSettingsOpen = !this.settingsModal.classList.contains('hidden');
      const isHelpOpen = !this.helpModal.classList.contains('hidden');

      if (isSettingsOpen || isHelpOpen) {
        if (e.key === 'Escape') {
          this.settingsModal.classList.add('hidden');
          this.helpModal.classList.add('hidden');
        }
        return;
      }

      if (!isGameVisible) return;

      let digit = null;
      if (e.key >= '0' && e.key <= '9') {
        digit = e.key;
      } else if (e.code && e.code.startsWith('Numpad') && e.code.length === 7) {
        const num = e.code.replace('Numpad', '');
        if (num >= '0' && num <= '9') {
          digit = num;
        }
      }

      if (digit !== null) {
        e.preventDefault();
        this.appendDigit(digit);
        return;
      }

      if (e.key === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
        this.submitAnswer();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        this.backspace();
        return;
      }

      if (e.key === 'c' || e.key === 'C' || e.key === 'Delete') {
        e.preventDefault();
        this.clearInput();
        return;
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target && e.target.tagName === 'BUTTON') {
        e.target.blur();
      }
    });

    // Växla skissruta on/off
    this.btnSketch.onclick = () => {
      const isHidden = this.sketchpadPanel.classList.contains('hidden');
      if (isHidden) {
        this.sketchpadPanel.classList.remove('hidden');
        this.btnSketch.classList.add('btn-top-active');
        // Anpassa rit-ytan till nya panelstorleken
        setTimeout(() => this.sketchpad.resize(), 50);
      } else {
        this.sketchpadPanel.classList.add('hidden');
        this.btnSketch.classList.remove('btn-top-active');
      }
    };

    document.getElementById('btn-settings').onclick = () => {
      document.getElementById('reset-confirm-msg').classList.add('hidden');
      this.settingsModal.classList.remove('hidden');
    };

    document.getElementById('btn-close-settings').onclick = () => {
      this.settingsModal.classList.add('hidden');
    };

    document.getElementById('btn-help').onclick = () => {
      this.renderHelpModal();
      this.helpModal.classList.remove('hidden');
    };

    document.getElementById('btn-close-help').onclick = () => {
      this.helpModal.classList.add('hidden');
    };

    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.oninput = (e) => {
      const vol = parseFloat(e.target.value) / 100;
      if (this.soundCallbacks.onVolumeChange) {
        this.soundCallbacks.onVolumeChange(vol);
      }
    };

    const muteBtn = document.getElementById('btn-toggle-mute');
    muteBtn.onclick = () => {
      this.isMuted = !this.isMuted;
      muteBtn.innerText = this.isMuted ? 'Ljud: Ljudlöst' : 'Ljud: På';
      if (this.soundCallbacks.onMuteToggle) {
        this.soundCallbacks.onMuteToggle(this.isMuted);
      }
    };

    document.getElementById('btn-reset-progress').onclick = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('completed_')) {
          localStorage.removeItem(key);
        }
      });
      this.updateTierButtons();
      document.getElementById('reset-confirm-msg').classList.remove('hidden');
    };

    // Navigering huvudmeny
    document.getElementById('btn-category-addition').onclick = () => {
      this.setupSubcategoryMenu('addition', 'Addition (+)', [
        { label: 'Ental', key: 'ental' },
        { label: 'Tiotal', key: 'tiotal' },
        { label: 'Hundratal', key: 'hundratal' },
        { label: 'Problemlösning', key: 'problemlosning' }
      ]);
    };

    document.getElementById('btn-category-subtraction').onclick = () => {
      this.setupSubcategoryMenu('subtraction', 'Subtraktion (–)', [
        { label: 'Ental', key: 'ental' },
        { label: 'Tiotal', key: 'tiotal' },
        { label: 'Hundratal', key: 'hundratal' },
        { label: 'Problemlösning', key: 'problemlosning' }
      ]);
    };

    document.getElementById('btn-category-multiplication').onclick = () => {
      this.setupSubcategoryMenu('multiplication', 'Multiplikation (×)', [
        { label: '2, 5 & 10:an', key: 'tabell_2_5_10' },
        { label: '3, 4 & 6:an', key: 'tabell_3_4_6' },
        { label: '7, 8 & 9:an', key: 'tabell_7_8_9' },
        { label: 'Problemlösning', key: 'problemlosning' }
      ]);
    };

    document.getElementById('btn-back-to-subcats').onclick = () => {
      this.menuTiers.classList.add('hidden');
      this.menuSubcats.classList.remove('hidden');
    };

    const tierBtns = document.querySelectorAll('.btn-tier');
    tierBtns.forEach((btn) => {
      btn.onclick = () => {
        if (btn.disabled) return;
        const tier = btn.getAttribute('data-tier');
        this.showGameScreen();
        this.onStartGame(this.selectedOperation, this.selectedCategory, tier);
      };
    });

    document.getElementById('btn-menu').onclick = () => {
      this.showStartScreen();
      this.onReturnToMenu();
    };
  }

  setupSubcategoryMenu(operationKey, titleText, subcatList) {
    this.selectedOperation = operationKey;
    this.subcatMenuTitle.innerText = titleText;

    const container = this.menuSubcats.querySelector('.menu-buttons');
    container.innerHTML = '';

    subcatList.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'btn-subcat';
      if (item.key === 'problemlosning') {
        btn.classList.add('btn-problem');
      }
      btn.innerText = item.label;
      btn.onclick = () => {
        this.selectedCategory = item.key;
        const catLabels = {
          ental: 'Ental', tiotal: 'Tiotal', hundratal: 'Hundratal',
          tabell_2_5_10: '2, 5 & 10:an', tabell_3_4_6: '3, 4 & 6:an', tabell_7_8_9: '7, 8 & 9:an',
          problemlosning: 'Problemlösning'
        };
        const opLabels = { addition: 'Addition', subtraction: 'Subtraktion', multiplication: 'Multiplikation' };
        
        this.tierMenuTitle.innerText = `${opLabels[this.selectedOperation]} – ${catLabels[this.selectedCategory]}`;

        this.menuSubcats.classList.add('hidden');
        this.menuTiers.classList.remove('hidden');
        this.updateTierButtons();
      };
      container.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.id = 'btn-back-to-main';
    backBtn.className = 'btn-secondary';
    backBtn.innerText = 'Tillbaka';
    backBtn.onclick = () => {
      this.menuSubcats.classList.add('hidden');
      this.menuMain.classList.remove('hidden');
    };
    container.appendChild(backBtn);

    this.menuMain.classList.add('hidden');
    this.menuSubcats.classList.remove('hidden');
  }

  renderHelpModal() {
    if (!this.currentQuestion) return;

    const { num1, num2, operator } = this.currentQuestion;
    const titleElem = document.getElementById('help-modal-title');

    if (operator === '×') {
      titleElem.innerText = 'Hjälp med multiplikation';

      const count = num1;
      const value = num2;
      const additionArray = Array(count).fill(value);
      const additionString = additionArray.join(' + ');

      document.getElementById('vertical-setup').innerHTML = `
        <div class="repeated-addition-box">${additionString}</div>
      `;

      document.getElementById('help-instructions').innerHTML = `
        <p><strong>Så här kan du tänka:</strong></p>
        <p style="margin-top: 6px;"><strong>${num1} × ${num2}</strong> betyder att du har <strong>${num1} grupper</strong> med <strong>${num2}</strong> i varje grupp.</p>
        <p style="margin-top: 6px;">Du kan räkna det genom att addera <strong>${value}</strong> med sig självt <strong>${count} gånger</strong>.</p>
      `;

    } else {
      titleElem.innerText = 'Hjälp med uppställning';

      const num1Str = num1.toString();
      const num2Str = num2.toString();
      const maxLen = Math.max(num1Str.length, num2Str.length);

      const pad1 = num1Str.padStart(maxLen, ' ');
      const pad2 = num2Str.padStart(maxLen, ' ');

      const allCols = ['Hundratal', 'Tiotal', 'Ental'];
      const activeCols = allCols.slice(allCols.length - maxLen);

      let gridHTML = '<div class="setup-grid">';
      
      gridHTML += '<div class="grid-row"><div class="cell op-cell"></div>';
      activeCols.forEach(col => {
        gridHTML += `<div class="cell col-header col-${col.toLowerCase()}">${col}</div>`;
      });
      gridHTML += '</div>';

      gridHTML += '<div class="grid-row"><div class="cell op-cell"></div>';
      for (let i = 0; i < maxLen; i++) {
        const digit = pad1[i] === ' ' ? '' : pad1[i];
        const colClass = `col-${activeCols[i].toLowerCase()}`;
        gridHTML += `<div class="cell ${colClass}">${digit}</div>`;
      }
      gridHTML += '</div>';

      gridHTML += `<div class="grid-row"><div class="cell op-cell">${operator}</div>`;
      for (let i = 0; i < maxLen; i++) {
        const digit = pad2[i] === ' ' ? '' : pad2[i];
        const colClass = `col-${activeCols[i].toLowerCase()}`;
        gridHTML += `<div class="cell ${colClass}">${digit}</div>`;
      }
      gridHTML += '</div>';

      gridHTML += '<div class="setup-line"></div>';
      gridHTML += '</div>';

      let instructionsHTML = '<p><strong>Så här ställer du upp och räknar:</strong></p><ol class="instructions-list">';
      
      if (operator === '+') {
        if (maxLen >= 1) {
          const e1 = parseInt(pad1[maxLen - 1] || '0', 10);
          const e2 = parseInt(pad2[maxLen - 1] || '0', 10);
          instructionsHTML += `<li>Börja med entalen till höger (blå): <strong>${e1} + ${e2}</strong></li>`;
        }
        if (maxLen >= 2) {
          const t1 = parseInt(pad1[maxLen - 2] || '0', 10);
          const t2 = parseInt(pad2[maxLen - 2] || '0', 10);
          instructionsHTML += `<li>Räkna sedan tiotalen (röd): <strong>${t1} + ${t2}</strong></li>`;
        }
        if (maxLen >= 3) {
          const h1 = parseInt(pad1[maxLen - 3] || '0', 10);
          const h2 = parseInt(pad2[maxLen - 3] || '0', 10);
          instructionsHTML += `<li>Räkna sist hundratalen (grön): <strong>${h1} + ${h2}</strong></li>`;
        }
      } else {
        if (maxLen >= 1) {
          const e1 = parseInt(pad1[maxLen - 1] || '0', 10);
          const e2 = parseInt(pad2[maxLen - 1] || '0', 10);
          instructionsHTML += `<li>Börja med entalen till höger (blå): <strong>${e1} - ${e2}</strong></li>`;
        }
        if (maxLen >= 2) {
          const t1 = parseInt(pad1[maxLen - 2] || '0', 10);
          const t2 = parseInt(pad2[maxLen - 2] || '0', 10);
          instructionsHTML += `<li>Räkna sedan tiotalen (röd): <strong>${t1} - ${t2}</strong></li>`;
        }
        if (maxLen >= 3) {
          const h1 = parseInt(pad1[maxLen - 3] || '0', 10);
          const h2 = parseInt(pad2[maxLen - 3] || '0', 10);
          instructionsHTML += `<li>Räkna sist hundratalen (grön): <strong>${h1} - ${h2}</strong></li>`;
        }
      }
      instructionsHTML += '</ol>';

      document.getElementById('vertical-setup').innerHTML = gridHTML;
      document.getElementById('help-instructions').innerHTML = instructionsHTML;
    }
  }

  updateTierButtons() {
    const op = this.selectedOperation;
    const cat = this.selectedCategory;

    const isBronsDone = localStorage.getItem(`completed_${op}_${cat}_brons`) === 'true';
    const isSilverDone = localStorage.getItem(`completed_${op}_${cat}_silver`) === 'true';
    const isGuldDone = localStorage.getItem(`completed_${op}_${cat}_guld`) === 'true';

    this.setBtnState('btn-tier-brons', 'badge-brons', true, isBronsDone);
    this.setBtnState('btn-tier-silver', 'badge-silver', isBronsDone, isSilverDone);
    this.setBtnState('btn-tier-guld', 'badge-guld', isSilverDone, isGuldDone);
  }

  setBtnState(btnId, badgeId, isUnlocked, isCompleted) {
    const btn = document.getElementById(btnId);
    const badge = document.getElementById(badgeId);

    if (isUnlocked) {
      btn.disabled = false;
      btn.classList.remove('btn-locked');
      if (isCompleted) {
        badge.innerText = 'Klarad';
        badge.className = 'tier-status status-completed';
      } else {
        badge.innerText = 'Öppen';
        badge.className = 'tier-status';
      }
    } else {
      btn.disabled = true;
      btn.classList.add('btn-locked');
      badge.innerText = 'Låst';
      badge.className = 'tier-status';
    }
  }

  showStartScreen() {
    this.startScreen.classList.remove('hidden');
    this.gameScreen.classList.add('hidden');
    this.menuMain.classList.remove('hidden');
    this.menuSubcats.classList.add('hidden');
    this.menuTiers.classList.add('hidden');
    this.isWaiting = false;
  }

  showGameScreen() {
    this.startScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
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

    this.levelIndicator.innerText = `${catLabels[category]} (${symbol}): ${tierNames[tier]}`;
    this.roundIndicator.innerText = `Omgång ${round}/3`;

    const colors = { brons: '#e2a76f', silver: '#94a3b8', guld: '#fcd34d' };
    this.progressBar.style.width = `${percentage}%`;
    this.progressBar.style.backgroundColor = colors[tier] || '#3b82f6';
  }

  displayQuestion(question) {
    if (!question) return;
    this.currentQuestion = question;
    this.isWaiting = false;

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

    this.clearInput();
    this.clearFeedback();
  }

  initKeypad() {
    this.inputArea.innerHTML = '';

    const display = document.createElement('div');
    display.id = 'answer-display';
    display.className = 'answer-display';
    display.innerText = '_';
    this.inputArea.appendChild(display);

    const keypadGrid = document.createElement('div');
    keypadGrid.className = 'keypad-grid';

    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'];

    buttons.forEach((symbol) => {
      const btn = document.createElement('button');
      btn.className = 'keypad-btn';
      btn.innerText = symbol;

      if (symbol === 'C') {
        btn.classList.add('btn-clear');
        btn.onclick = () => this.clearInput();
      } else if (symbol === 'OK') {
        btn.classList.add('btn-submit');
        btn.onclick = () => this.submitAnswer();
      } else {
        btn.onclick = () => this.appendDigit(symbol);
      }

      keypadGrid.appendChild(btn);
    });

    this.inputArea.appendChild(keypadGrid);
  }

  appendDigit(digit) {
    if (this.isWaiting) return;
    if (this.currentInput.length < 4) {
      this.currentInput += digit;
      this.updateDisplay();
    }
  }

  backspace() {
    if (this.isWaiting) return;
    if (this.currentInput.length > 0) {
      this.currentInput = this.currentInput.slice(0, -1);
      this.updateDisplay();
    }
  }

  clearInput() {
    if (this.isWaiting) return;
    this.currentInput = '';
    this.updateDisplay();
  }

  updateDisplay() {
    const display = document.getElementById('answer-display');
    if (display) {
      display.innerText = this.currentInput !== '' ? this.currentInput : '_';
    }
  }

  submitAnswer() {
    if (this.currentInput === '' || this.isWaiting) return;
    this.isWaiting = true;
    this.onAnswerSubmit(this.currentInput);
  }

  unlockInput() {
    this.isWaiting = false;
  }

  showFeedback(isCorrect, message) {
    this.feedbackElement.innerText = message;
    this.feedbackElement.className = isCorrect ? 'feedback-success' : 'feedback-hint';
  }

  clearFeedback() {
    this.feedbackElement.innerText = '';
    this.feedbackElement.className = '';
  }
}