/**
 * Keypad.js
 * Hanterar skärmtangentbord samt tangentbordsinmatning (fysiskt tangentbord/Numpad).
 */
export class Keypad {
  constructor(inputAreaId, onSubmitAnswer) {
    this.inputArea = document.getElementById(inputAreaId);
    this.onSubmitAnswer = onSubmitAnswer;

    this.currentInput = '';
    this.isWaiting = false;

    this.initKeypadUI();
    this.initKeyboardListeners();
  }

  initKeypadUI() {
    if (!this.inputArea) return;
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

  initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      const gameScreen = document.getElementById('game-screen');
      const isGameVisible = gameScreen && !gameScreen.classList.contains('hidden');

      const settingsModal = document.getElementById('settings-modal');
      const helpModal = document.getElementById('help-modal');
      const isModalOpen = (settingsModal && !settingsModal.classList.contains('hidden')) ||
                          (helpModal && !helpModal.classList.contains('hidden'));

      if (isModalOpen || !isGameVisible) return;

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
    if (this.onSubmitAnswer) {
      this.onSubmitAnswer(this.currentInput);
    }
  }

  unlockInput() {
    this.isWaiting = false;
  }
}