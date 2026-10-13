/**
 * HUD.js
 * Hanterar menyväxlingar för både Addition och Subtraktion.
 */
export class HUD {
  constructor(onAnswerSubmit, onStartGame, onReturnToMenu) {
    this.onAnswerSubmit = onAnswerSubmit;
    this.onStartGame = onStartGame;
    this.onReturnToMenu = onReturnToMenu;

    this.selectedOperation = 'addition';
    this.selectedCategory = 'ental';

    this.startScreen = document.getElementById('start-screen');
    this.gameScreen = document.getElementById('game-screen');
    
    this.menuMain = document.getElementById('menu-main');
    this.menuSubcats = document.getElementById('menu-subcategories');
    this.menuTiers = document.getElementById('menu-tiers');

    this.subcatMenuTitle = document.getElementById('subcat-menu-title');
    this.tierMenuTitle = document.getElementById('tier-menu-title');
    this.levelIndicator = document.getElementById('level-indicator');
    this.roundIndicator = document.getElementById('round-indicator');
    this.questionElement = document.getElementById('question-box');
    this.inputArea = document.getElementById('input-area');
    this.feedbackElement = document.getElementById('feedback-message');
    this.progressBar = document.getElementById('progress-bar');

    this.currentInput = '';
    this.isWaiting = false;

    this.initEventListeners();
    this.initKeypad();
  }

  initEventListeners() {
    // Öppna Addition
    document.getElementById('btn-category-addition').onclick = () => {
      this.selectedOperation = 'addition';
      this.subcatMenuTitle.innerText = 'Addition (+)';
      this.menuMain.classList.add('hidden');
      this.menuSubcats.classList.remove('hidden');
    };

    // Öppna Subtraktion
    document.getElementById('btn-category-subtraction').onclick = () => {
      this.selectedOperation = 'subtraction';
      this.subcatMenuTitle.innerText = 'Subtraktion (-)';
      this.menuMain.classList.add('hidden');
      this.menuSubcats.classList.remove('hidden');
    };

    // Tillbaka till Huvudmeny
    document.getElementById('btn-back-to-main').onclick = () => {
      this.menuSubcats.classList.add('hidden');
      this.menuMain.classList.remove('hidden');
    };

    // Klicka på Delmoment (Ental, Tiotal, Hundratal)
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

    // Tillbaka till Delmoment
    document.getElementById('btn-back-to-subcats').onclick = () => {
      this.menuTiers.classList.add('hidden');
      this.menuSubcats.classList.remove('hidden');
    };

    // Klicka på Nivåknapp (Brons, Silver, Guld)
    const tierBtns = document.querySelectorAll('.btn-tier');
    tierBtns.forEach((btn) => {
      btn.onclick = () => {
        if (btn.disabled) return;
        const tier = btn.getAttribute('data-tier');
        this.showGameScreen();
        this.onStartGame(this.selectedOperation, this.selectedCategory, tier);
      };
    });

    // Menyknapp under spelets gång
    document.getElementById('btn-menu').onclick = () => {
      this.showStartScreen();
      this.onReturnToMenu();
    };
  }

  /**
   * Uppdaterar låsstatus på Silver och Guld för den valda räknesättet och delmomentet.
   */
  updateTierButtons() {
    const op = this.selectedOperation;
    const cat = this.selectedCategory;

    // Bakåtkompatibilitet: Läser både nya 'completed_addition_ental_brons' och gamla 'completed_ental_brons'
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
        badge.innerText = '✓ Klarad!';
        badge.className = 'tier-status status-completed';
      } else {
        badge.innerText = 'Öppen';
        badge.className = 'tier-status';
      }
    } else {
      btn.disabled = true;
      btn.classList.add('btn-locked');
      badge.innerText = '🔒 Låst';
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