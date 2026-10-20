import { AdditionEngine } from './generators/arithmetic/AdditionEngine.js';
import { SubtractionEngine } from './generators/arithmetic/SubtractionEngine.js';
import { MultiplicationEngine } from './generators/arithmetic/MultiplicationEngine.js';
import { DivisionEngine } from './generators/arithmetic/DivisionEngine.js';
import { ShapesEngine } from './generators/geometry/ShapesEngine.js';

/**
 * MathEngine.js
 * Huvudkoordinator för frågegenerering och rättning.
 */
export class MathEngine {
  constructor() {
    this.additionEngine = new AdditionEngine();
    this.subtractionEngine = new SubtractionEngine();
    this.multiplicationEngine = new MultiplicationEngine();
    this.divisionEngine = new DivisionEngine();
    this.shapesEngine = new ShapesEngine();

    this.operation = 'addition';
    this.category = 'ental';
    this.tier = 'brons';
    this.currentRound = 1;
    this.questionsInRound = 5;
    this.correctInCurrentRound = 0;
    this.currentQuestion = null;
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

    if (op === 'shapes' || cat === 'former' || op === 'geometry') {
      this.currentQuestion = this.shapesEngine.generateQuestion(this.tier);
    } else if (op === 'subtraction') {
      this.currentQuestion = this.subtractionEngine.generateQuestion(this.category, this.tier);
    } else if (op === 'multiplication') {
      this.currentQuestion = this.multiplicationEngine.generateQuestion(this.category, this.tier);
    } else if (op === 'division') {
      this.currentQuestion = this.divisionEngine.generateQuestion(this.category, this.tier);
    } else {
      this.currentQuestion = this.additionEngine.generateQuestion(this.category, this.tier);
    }

    return this.currentQuestion;
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