/**
 * HUD.js
 * Hanterar användargränssnittet (startmeny, spelskärm, sifferknappar och feedback).
 */
export class HUD {
  constructor(onAnswerSubmit, onStartGame, onReturnToMenu) {
    this.onAnswerSubmit = onAnswerSubmit;
    this.onStartGame = onStartGame;
    this.onReturnToMenu = onReturnToMenu;

    this.startScreen = document.getElementById('start-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.questionElement = document.getElementById('question-box');
    this.inputArea = document.getElementById('input-area');
    this.feedbackElement = document.getElementById('feedback-message');
    
    this.currentInput = '';
    
    this.initEventListeners();
    this.initKeypad();
  }

  initEventListeners() {
    document.getElementById('btn-start').onclick = () => {
      this.showGameScreen();
      this.onStartGame();
    };

    document.getElementById('btn-menu').onclick = () => {
      this.showStartScreen();
      this.onReturnToMenu();
    };
  }

  showStartScreen() {
    this.startScreen.classList.remove('hidden');
    this.gameScreen.classList.add('hidden');
  }

  showGameScreen() {
    this.startScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
  }

  displayQuestion(question) {
    if (!question) return;
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
    if (this.currentInput.length < 3) {
      this.currentInput += digit;
      this.updateDisplay();
    }
  }

  clearInput() {
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
    if (this.currentInput === '') return;
    this.onAnswerSubmit(this.currentInput);
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