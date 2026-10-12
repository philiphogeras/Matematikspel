/**
 * HUD.js
 * Hanterar menyväxlingar, klarat-märken och mätaren under spelets gång.
 */
export class HUD {
  constructor(onAnswerSubmit, onStartGame, onReturnToMenu) {
    this.onAnswerSubmit = onAnswerSubmit;
    this.onStartGame = onStartGame;
    this.onReturnToMenu = onReturnToMenu;

    this.startScreen = document.getElementById('start-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.menuMain = document.getElementById('menu-main');
    this.menuAddition = document.getElementById('menu-addition');

    this.questionElement = document.getElementById('question-box');
    this.inputArea = document.getElementById('input-area');
    this.feedbackElement = document.getElementById('feedback-message');
    this.progressBar = document.getElementById('progress-bar');
    
    this.currentInput = '';
    this.isWaiting = false;
    
    this.initEventListeners();
    this.initKeypad();
    this.updateBadges();
  }

  initEventListeners() {
    document.getElementById('btn-category-addition').onclick = () => {
      this.menuMain.classList.add('hidden');
      this.menuAddition.classList.remove('hidden');
      this.updateBadges();
    };

    document.getElementById('btn-back-to-main').onclick = () => {
      this.menuAddition.classList.add('hidden');
      this.menuMain.classList.remove('hidden');
    };

    const tierButtons = document.querySelectorAll('.btn-tier');
    tierButtons.forEach((btn) => {
      btn.onclick = () => {
        const startLevel = parseInt(btn.getAttribute('data-start'), 10);
        const maxLevel = parseInt(btn.getAttribute('data-max'), 10);
        const tierName = btn.getAttribute('data-name');

        this.showGameScreen();
        this.onStartGame(startLevel, maxLevel, tierName);
      };
    });

    document.getElementById('btn-menu').onclick = () => {
      this.showStartScreen();
      this.onReturnToMenu();
    };
  }

  updateBadges() {
    const tiers = ['Brons', 'Silver', 'Guld'];
    tiers.forEach((tier) => {
      const isCompleted = localStorage.getItem(`completed_${tier}`) === 'true';
      const badgeElement = document.getElementById(`badge-${tier.toLowerCase()}`);
      if (badgeElement) {
        if (isCompleted) {
          badgeElement.classList.remove('hidden');
        } else {
          badgeElement.classList.add('hidden');
        }
      }
    });
  }

  showStartScreen() {
    this.startScreen.classList.remove('hidden');
    this.gameScreen.classList.add('hidden');
    this.menuMain.classList.remove('hidden');
    this.menuAddition.classList.add('hidden');
    this.isWaiting = false;
    this.updateBadges();
  }

  showGameScreen() {
    this.startScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
  }

  updateProgress(percentage, tierName) {
    if (!this.progressBar) {
      this.progressBar = document.getElementById('progress-bar');
    }
    if (!this.progressBar) return;

    const tierKey = tierName ? tierName.toLowerCase() : 'brons';

    // Färgkoder för mjukare nyanser för respektive nivå
    const colors = {
      brons: '#e2a76f',
      bronze: '#e2a76f',
      silver: '#94a3b8',
      guld: '#fcd34d',
      gold: '#fcd34d'
    };

    const activeColor = colors[tierKey] || '#e2a76f';

    // Sätt procent och färg direkt på mätarelementet
    this.progressBar.style.width = `${percentage}%`;
    this.progressBar.style.backgroundColor = activeColor;
    this.progressBar.className = `progress-${tierKey}`;
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