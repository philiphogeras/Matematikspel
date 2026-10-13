/**
 * HUD.js
 * Hanterar gränssnitt, inställningsmeny samt hjälpfunktionen för uppställning.
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

    this.currentInput = '';
    this.currentQuestion = null;
    this.isWaiting = false;

    this.initEventListeners();
    this.initKeypad();
  }

  initEventListeners() {
    // Inställningsmeny
    document.getElementById('btn-settings').onclick = () => {
      document.getElementById('reset-confirm-msg').classList.add('hidden');
      this.settingsModal.classList.remove('hidden');
    };

    document.getElementById('btn-close-settings').onclick = () => {
      this.settingsModal.classList.add('hidden');
    };

    // Hjälpmeny
    document.getElementById('btn-help').onclick = () => {
      this.renderHelpModal();
      this.helpModal.classList.remove('hidden');
    };

    document.getElementById('btn-close-help').onclick = () => {
      this.helpModal.classList.add('hidden');
    };

    // Volymreglage
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.oninput = (e) => {
      const vol = parseFloat(e.target.value) / 100;
      if (this.soundCallbacks.onVolumeChange) {
        this.soundCallbacks.onVolumeChange(vol);
      }
    };

    // Mute-knapp
    const muteBtn = document.getElementById('btn-toggle-mute');
    muteBtn.onclick = () => {
      this.isMuted = !this.isMuted;
      muteBtn.innerText = this.isMuted ? 'Ljud: Ljudlöst' : 'Ljud: På';
      if (this.soundCallbacks.onMuteToggle) {
        this.soundCallbacks.onMuteToggle(this.isMuted);
      }
    };

    // Nollställ framsteg
    document.getElementById('btn-reset-progress').onclick = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('completed_')) {
          localStorage.removeItem(key);
        }
      });
      this.updateTierButtons();
      document.getElementById('reset-confirm-msg').classList.remove('hidden');
    };

    // Navigering i menyer
    document.getElementById('btn-category-addition').onclick = () => {
      this.selectedOperation = 'addition';
      this.subcatMenuTitle.innerText = 'Addition (+)';
      this.menuMain.classList.add('hidden');
      this.menuSubcats.classList.remove('hidden');
    };

    document.getElementById('btn-category-subtraction').onclick = () => {
      this.selectedOperation = 'subtraction';
      this.subcatMenuTitle.innerText = 'Subtraktion (-)';
      this.menuMain.classList.add('hidden');
      this.menuSubcats.classList.remove('hidden');
    };

    document.getElementById('btn-back-to-main').onclick = () => {
      this.menuSubcats.classList.add('hidden');
      this.menuMain.classList.remove('hidden');
    };

    const subcatBtns = document.querySelectorAll('.btn-subcat');
    subcatBtns.forEach((btn) => {
      btn.onclick = () => {
        this.selectedCategory = btn.getAttribute('data-cat');
        const opNames = { addition: 'Addition', subtraction: 'Subtraktion' };
        const catNames = { ental: 'Ental', tiotal: 'Tiotal', hundratal: 'Hundratal' };
        
        this.tierMenuTitle.innerText = `${opNames[this.selectedOperation]} – ${catNames[this.selectedCategory]}`;

        this.menuSubcats.classList.add('hidden');
        this.menuTiers.classList.remove('hidden');
        this.updateTierButtons();
      };
    });

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

  /**
   * Genererar den visuella uppställningen och instruktionstexten i hjälpmodalen.
   */
  renderHelpModal() {
    if (!this.currentQuestion) return;

    const { num1, num2, operator } = this.currentQuestion;
    const num1Str = num1.toString();
    const num2Str = num2.toString();
    const maxLen = Math.max(num1Str.length, num2Str.length);

    const pad1 = num1Str.padStart(maxLen, ' ');
    const pad2 = num2Str.padStart(maxLen, ' ');

    const allCols = ['Hundratal', 'Tiotal', 'Ental'];
    const activeCols = allCols.slice(allCols.length - maxLen);

    let gridHTML = '<div class="setup-grid">';
    
    // Kolumnrubriker
    gridHTML += '<div class="grid-row"><div class="cell op-cell"></div>';
    activeCols.forEach(col => {
      gridHTML += `<div class="cell col-header col-${col.toLowerCase()}">${col}</div>`;
    });
    gridHTML += '</div>';

    // Rad 1 (Första talet)
    gridHTML += '<div class="grid-row"><div class="cell op-cell"></div>';
    for (let i = 0; i < maxLen; i++) {
      const digit = pad1[i] === ' ' ? '' : pad1[i];
      const colClass = `col-${activeCols[i].toLowerCase()}`;
      gridHTML += `<div class="cell ${colClass}">${digit}</div>`;
    }
    gridHTML += '</div>';

    // Rad 2 (Räknesätt + andra talet)
    gridHTML += `<div class="grid-row"><div class="cell op-cell">${operator}</div>`;
    for (let i = 0; i < maxLen; i++) {
      const digit = pad2[i] === ' ' ? '' : pad2[i];
      const colClass = `col-${activeCols[i].toLowerCase()}`;
      gridHTML += `<div class="cell ${colClass}">${digit}</div>`;
    }
    gridHTML += '</div>';

    // Linje
    gridHTML += '<div class="setup-line"></div>';
    gridHTML += '</div>';

    // Instruktionstext
    let instructionsHTML = '<p><strong>Så här ställer du upp och räknar:</strong></p><ol class="instructions-list">';
    
    if (operator === '+') {
      if (maxLen >= 1) {
        const e1 = parseInt(pad1[maxLen - 1] || '0', 10);
        const e2 = parseInt(pad2[maxLen - 1] || '0', 10);
        instructionsHTML += `<li>Börja med entalen till höger (blå): ${e1} + ${e2} = ${e1 + e2}.</li>`;
      }
      if (maxLen >= 2) {
        const t1 = parseInt(pad1[maxLen - 2] || '0', 10);
        const t2 = parseInt(pad2[maxLen - 2] || '0', 10);
        instructionsHTML += `<li>Räkna sedan tiotalen (röd): ${t1} + ${t2} = ${t1 + t2}.</li>`;
      }
      if (maxLen >= 3) {
        const h1 = parseInt(pad1[maxLen - 3] || '0', 10);
        const h2 = parseInt(pad2[maxLen - 3] || '0', 10);
        instructionsHTML += `<li>Räkna sist hundratalen (grön): ${h1} + ${h2} = ${h1 + h2}.</li>`;
      }
    } else {
      if (maxLen >= 1) {
        const e1 = parseInt(pad1[maxLen - 1] || '0', 10);
        const e2 = parseInt(pad2[maxLen - 1] || '0', 10);
        instructionsHTML += `<li>Börja med entalen till höger (blå): ${e1} - ${e2} = ${e1 - e2}.</li>`;
      }
      if (maxLen >= 2) {
        const t1 = parseInt(pad1[maxLen - 2] || '0', 10);
        const t2 = parseInt(pad2[maxLen - 2] || '0', 10);
        instructionsHTML += `<li>Räkna sedan tiotalen (röd): ${t1} - ${t2} = ${t1 - t2}.</li>`;
      }
      if (maxLen >= 3) {
        const h1 = parseInt(pad1[maxLen - 3] || '0', 10);
        const h2 = parseInt(pad2[maxLen - 3] || '0', 10);
        instructionsHTML += `<li>Räkna sist hundratalen (grön): ${h1} - ${h2} = ${h1 - h2}.</li>`;
      }
    }
    instructionsHTML += '</ol>';

    document.getElementById('vertical-setup').innerHTML = gridHTML;
    document.getElementById('help-instructions').innerHTML = instructionsHTML;
  }

  updateTierButtons() {
    const op = this.selectedOperation;
    const cat = this.selectedCategory;

    const isBronsDone = localStorage.getItem(`completed_${op}_${cat}_brons`) === 'true' || 
                       (op === 'addition' && localStorage.getItem(`completed_${cat}_brons`) === 'true');
    const isSilverDone = localStorage.getItem(`completed_${op}_${cat}_silver`) === 'true' || 
                        (op === 'addition' && localStorage.getItem(`completed_${cat}_silver`) === 'true');
    const isGuldDone = localStorage.getItem(`completed_${op}_${cat}_guld`) === 'true' || 
                      (op === 'addition' && localStorage.getItem(`completed_${cat}_guld`) === 'true');

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
    const catNames = { ental: 'Ental', tiotal: 'Tiotal', hundratal: 'Hundratal' };
    const tierNames = { brons: 'Brons', silver: 'Silver', guld: 'Guld' };
    const symbol = operation === 'subtraction' ? '–' : '+';

    this.levelIndicator.innerText = `${catNames[category]} (${symbol}): ${tierNames[tier]}`;
    this.roundIndicator.innerText = `Omgång ${round}/3`;

    const colors = { brons: '#e2a76f', silver: '#94a3b8', guld: '#fcd34d' };
    this.progressBar.style.width = `${percentage}%`;
    this.progressBar.style.backgroundColor = colors[tier] || '#3b82f6';
  }

  displayQuestion(question) {
    if (!question) return;
    this.currentQuestion = question;
    this.isWaiting = false;
    this.questionElement.innerText = `${question.num1} ${question.operator} ${question.num2} = ?`;
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