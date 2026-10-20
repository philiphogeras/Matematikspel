import { AdditionEngine } from './generators/arithmetic/AdditionEngine.js';
import { SubtractionEngine } from './generators/arithmetic/SubtractionEngine.js';
import { MultiplicationEngine } from './generators/arithmetic/MultiplicationEngine.js';
import { DivisionEngine } from './generators/arithmetic/DivisionEngine.js';
import { ShapesEngine } from './generators/geometry/ShapesEngine.js';

/**
 * MathEngine.js
 * Huvudkoordinator med inbyggd kraschsäkring för räknekunskap och geometri.
 */
export class MathEngine {
  constructor() {
    this.initEngines();

    this.operation = 'addition';
    this.category = 'ental';
    this.tier = 'brons';
    this.currentRound = 1;
    this.questionsInRound = 5;
    this.correctInCurrentRound = 0;
    this.currentQuestion = null;
  }

  initEngines() {
    try { this.additionEngine = new AdditionEngine(); } catch (e) { this.additionEngine = null; }
    try { this.subtractionEngine = new SubtractionEngine(); } catch (e) { this.subtractionEngine = null; }
    try { this.multiplicationEngine = new MultiplicationEngine(); } catch (e) { this.multiplicationEngine = null; }
    try { this.divisionEngine = new DivisionEngine(); } catch (e) { this.divisionEngine = null; }
    try { this.shapesEngine = new ShapesEngine(); } catch (e) { this.shapesEngine = null; }
  }

  reset(operation, category, tier) {
    this.operation = operation || 'addition';
    this.category = category || 'ental';
    this.tier = tier || 'brons';
    this.currentRound = 1;
    this.correctInCurrentRound = 0;
    this.currentQuestion = null;
  }

  generateQuestion() {
    const op = (this.operation || '').toLowerCase();
    const cat = (this.category || '').toLowerCase();

    // 1. Försök använda generator-klasserna
    try {
      if ((op === 'shapes' || cat === 'former' || op === 'geometry') && this.shapesEngine && typeof this.shapesEngine.generateQuestion === 'function') {
        this.currentQuestion = this.shapesEngine.generateQuestion(this.tier);
        return this.currentQuestion;
      }
      if (op === 'subtraction' && this.subtractionEngine && typeof this.subtractionEngine.generateQuestion === 'function') {
        this.currentQuestion = this.subtractionEngine.generateQuestion(this.category, this.tier);
        return this.currentQuestion;
      }
      if (op === 'multiplication' && this.multiplicationEngine && typeof this.multiplicationEngine.generateQuestion === 'function') {
        this.currentQuestion = this.multiplicationEngine.generateQuestion(this.category, this.tier);
        return this.currentQuestion;
      }
      if (op === 'division' && this.divisionEngine && typeof this.divisionEngine.generateQuestion === 'function') {
        this.currentQuestion = this.divisionEngine.generateQuestion(this.category, this.tier);
        return this.currentQuestion;
      }
      if (op === 'addition' && this.additionEngine && typeof this.additionEngine.generateQuestion === 'function') {
        this.currentQuestion = this.additionEngine.generateQuestion(this.category, this.tier);
        return this.currentQuestion;
      }
    } catch (err) {
      console.warn('Generatormodul saknas eller har fel sökväg, använder inbyggd fallback:', err);
    }

    // 2. Felsäker inbyggd reserv om importen misslyckades
    this.currentQuestion = this.generateFallbackQuestion(op, cat, this.tier);
    return this.currentQuestion;
  }

  generateFallbackQuestion(op, cat, tier) {
    let num1 = Math.floor(Math.random() * 9) + 1;
    let num2 = Math.floor(Math.random() * 9) + 1;
    let operator = '+';
    let ans = num1 + num2;

    if (op === 'subtraction') {
      if (num1 < num2) [num1, num2] = [num2, num1];
      operator = '–';
      ans = num1 - num2;
    } else if (op === 'multiplication') {
      operator = '×';
      ans = num1 * num2;
    } else if (op === 'division') {
      ans = num1;
      num1 = num1 * num2;
      operator = '÷';
    }

    return {
      domain: 'arithmetic',
      operation: op,
      category: cat,
      tier: tier,
      num1: num1,
      num2: num2,
      operator: operator,
      correctAnswer: ans.toString(),
      text: `${num1} ${operator} ${num2} = ?`
    };
  }

  checkAnswer(userAnswer) {
    if (!this.currentQuestion) return { isCorrect: false, message: 'Ingen fråga laddad.' };

    const formattedUser = userAnswer.toString().trim();
    const formattedCorrect = this.currentQuestion.correctAnswer.toString().trim();

    const isCorrect = formattedUser === formattedCorrect;

    if (isCorrect) {
      this.correctInCurrentRound++;
      let isRoundCompleted = false;
      let isTierCompleted = false;

      if (this.correctInCurrentRound >= this.questionsInRound) {
        if (this.currentRound < 3) {
          this.currentRound++;
          this.correctInCurrentRound = 0;
          isRoundCompleted = true;
        } else {
          isTierCompleted = true;
        }
      }

      return {
        isCorrect: true,
        message: 'Rätt svar! Bra jobbat!',
        isRoundCompleted,
        isTierCompleted
      };
    } else {
      return {
        isCorrect: false,
        message: 'Inte riktigt. Försök igen!'
      };
    }
  }

  getRoundProgressPercentage() {
    return (this.correctInCurrentRound / this.questionsInRound) * 100;
  }
}