/**
 * HUD.js
 * Hanterar användargränssnittet (frågetext, svarsknappar och feedback).
 */
export class HUD {
  constructor(onAnswerSubmit) {
    this.onAnswerSubmit = onAnswerSubmit; // Funktion som anropas när eleven svarar
    this.questionElement = document.getElementById('question-box');
    this.inputArea = document.getElementById('input-area');
    this.feedbackElement = document.getElementById('feedback-message');
    
    this.currentInput = '';
    this.initKeypad();
  }

  /**
   * Visar den aktuella mattefrågan på skärmen
   */
  displayQuestion(question) {
    if (!question) return;
    this.questionElement.innerText = `${question.num1} ${question.operator} ${question.num2} = ?`;
    this.clearInput();
    this.clearFeedback();
  }

  /**
   * Bygger upp sifferknapparna (0-9, Rensa, Skicka)
   */
  initKeypad() {
    this.inputArea.innerHTML = '';

    // Visningsfält för vad eleven har tryckt in
    const display = document.createElement('div');
    display.id = 'answer-display';
    display.className = 'answer-display';
    display.innerText = '_';
    this.inputArea.appendChild(display);

    // Sifferknappar 1-9 och 0
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

  /**
   * Lägger till en siffra i svaret
   */
  appendDigit(digit) {
    if (this.currentInput.length < 3) { // Max 3 siffror
      this.currentInput += digit;
      this.updateDisplay();
    }
  }

  /**
   * Rensa inmatningen
   */
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

  /**
   * Skickar svaret vidare till spelloopen
   */
  submitAnswer() {
    if (this.currentInput === '') return;
    this.onAnswerSubmit(this.currentInput);
  }

  /**
   * Visar mjuk och tydlig feedback
   */
  showFeedback(isCorrect, message) {
    this.feedbackElement.innerText = message;
    this.feedbackElement.className = isCorrect ? 'feedback-success' : 'feedback-hint';
  }

  clearFeedback() {
    this.feedbackElement.innerText = '';
    this.feedbackElement.className = '';
  }
}