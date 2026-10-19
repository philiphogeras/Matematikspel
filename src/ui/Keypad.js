/**
 * Keypad.js
 * Hanterar det virtuella tangentbordet och fysisk tangentbordsinmatning.
 */
export class Keypad {
  constructor(containerId, onSubmit) {
    this.container = document.getElementById(containerId);
    this.onSubmit = onSubmit;
    this.currentInput = '';
    this.isLocked = false;
    this.autoClearTimer = null;

    this.render();
    this.initKeyboardEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="answer-display" id="answer-display">?</div>
      <div class="keypad-grid">
        <button class="keypad-btn" data-key="1">1</button>
        <button class="keypad-btn" data-key="2">2</button>
        <button class="keypad-btn" data-key="3">3</button>
        <button class="keypad-btn" data-key="4">4</button>
        <button class="keypad-btn" data-key="5">5</button>
        <button class="keypad-btn" data-key="6">6</button>
        <button class="keypad-btn" data-key="7">7</button>
        <button class="keypad-btn" data-key="8">8</button>
        <button class="keypad-btn" data-key="9">9</button>
        <button class="keypad-btn btn-clear" data-key="clear">Rensa</button>
        <button class="keypad-btn" data-key="0">0</button>
        <button class="keypad-btn btn-submit" data-key="submit">OK</button>
      </div>
    `;

    this.displayElement = document.getElementById('answer-display');

    const buttons = this.container.querySelectorAll('.keypad-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (e) e.preventDefault();
        const key = btn.getAttribute('data-key');
        this.handleKeyPress(key);
      });
    });
  }

  handleKeyPress(key) {
    // Om det finns en väntande automatisk rensning, avbryt den direkt när användaren trycker
    if (this.autoClearTimer) {
      clearTimeout(this.autoClearTimer);
      this.autoClearTimer = null;
    }

    // Lås upp omedelbart vid knapptryck
    this.isLocked = false;

    if (key === 'clear') {
      this.clearInput();
      return;
    }

    if (key === 'submit') {
      if (this.currentInput !== '' && this.onSubmit) {
        const inputToSend = this.currentInput;
        this.isLocked = true;
        this.onSubmit(inputToSend);
      }
      return;
    }

    // Siffertryck (0-9)
    if (this.currentInput.length < 5) {
      this.currentInput += key;
      this.updateDisplay();
    }
  }

  scheduleWrongAnswerReset(ms = 3000, onReset) {
    if (this.autoClearTimer) {
      clearTimeout(this.autoClearTimer);
    }
    this.isLocked = false; // Tillåt direkt inmatning eller klick på Rensa

    this.autoClearTimer = setTimeout(() => {
      this.clearInput();
      this.autoClearTimer = null;
      if (onReset) onReset();
    }, ms);
  }

  updateDisplay() {
    if (this.displayElement) {
      this.displayElement.innerText = this.currentInput === '' ? '?' : this.currentInput;
    }
  }

  clearInput() {
    if (this.autoClearTimer) {
      clearTimeout(this.autoClearTimer);
      this.autoClearTimer = null;
    }
    this.currentInput = '';
    this.updateDisplay();
  }

  unlockInput() {
    this.isLocked = false;
  }

  initKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        this.handleKeyPress(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        this.handleKeyPress('clear');
      } else if (e.key === 'Enter') {
        this.handleKeyPress('submit');
      }
    });
  }
}