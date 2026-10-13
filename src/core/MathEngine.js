/**
 * MathEngine.js
 * Hanterar matematiklogik och svårighetsnivåer för Addition, Subtraktion och Multiplikation.
 */
export class MathEngine {
  constructor() {
    this.operation = 'addition';
    this.category = 'ental';
    this.tier = 'brons';
    
    this.currentRound = 1;
    this.maxRounds = 3;
    
    this.correctInRound = 0;
    this.questionsPerRound = 5;

    this.currentQuestion = null;
    this.lastQuestionKey = '';
  }

  reset(operation = 'addition', category = 'ental', tier = 'brons') {
    this.operation = operation;
    this.category = category;
    this.tier = tier;
    this.currentRound = 1;
    this.correctInRound = 0;
    this.currentQuestion = null;
    this.lastQuestionKey = '';
  }

  getRoundProgressPercentage() {
    return Math.round((this.correctInRound / this.questionsPerRound) * 100);
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateQuestion() {
    let num1 = 0;
    let num2 = 0;
    let operator = '+';
    let key = '';

    if (this.operation === 'subtraction') operator = '-';
    if (this.operation === 'multiplication') operator = '×';

    for (let attempt = 0; attempt < 30; attempt++) {
      if (this.operation === 'addition') {
        
        // --- ADDITION ---
        if (this.category === 'ental') {
          if (this.tier === 'brons') {
            const sum = this.rand(1, 5);
            num1 = this.rand(0, sum);
            num2 = sum - num1;
          } else if (this.tier === 'silver') {
            const sum = this.rand(6, 10);
            num1 = this.rand(1, sum - 1);
            num2 = sum - num1;
          } else { // Guld
            const sum = this.rand(11, 18);
            num1 = this.rand(sum - 9, 9);
            num2 = sum - num1;
          }

        } else if (this.category === 'tiotal') {
          if (this.tier === 'brons') {
            num1 = this.rand(1, 4) * 10;
            num2 = this.rand(1, 5) * 10;
          } else if (this.tier === 'silver') {
            const t1 = this.rand(1, 8);
            const t2 = this.rand(1, 9 - t1);
            const e1 = this.rand(1, 8);
            const e2 = this.rand(1, 9 - e1);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          } else { // Guld
            const t1 = this.rand(1, 8);
            const t2 = this.rand(1, 8);
            const e1 = this.rand(2, 9);
            const e2 = this.rand(10 - e1, 9);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          }

        } else if (this.category === 'hundratal') {
          if (this.tier === 'brons') {
            num1 = this.rand(1, 4) * 100;
            num2 = this.rand(1, 5) * 100;
          } else if (this.tier === 'silver') {
            const h1 = this.rand(1, 4);
            const h2 = this.rand(1, 4);
            const t1 = this.rand(1, 8);
            const t2 = this.rand(1, 9 - t1);
            num1 = h1 * 100 + t1 * 10;
            num2 = h2 * 100 + t2 * 10;
          } else { // Guld
            const h1 = this.rand(1, 4);
            const h2 = this.rand(1, 4);
            const t1 = this.rand(1, 8);
            const t2 = this.rand(1, 9 - t1);
            const e1 = this.rand(1, 8);
            const e2 = this.rand(1, 9 - e1);
            num1 = h1 * 100 + t1 * 10 + e1;
            num2 = h2 * 100 + t2 * 10 + e2;
          }
        }

      } else if (this.operation === 'subtraction') {

        // --- SUBTRAKTION ---
        if (this.category === 'ental') {
          if (this.tier === 'brons') {
            num1 = this.rand(1, 5);
            num2 = this.rand(0, num1);
          } else if (this.tier === 'silver') {
            num1 = this.rand(6, 10);
            num2 = this.rand(1, num1);
          } else { // Guld
            num1 = this.rand(11, 18);
            num2 = this.rand(num1 - 9, 9);
          }

        } else if (this.category === 'tiotal') {
          if (this.tier === 'brons') {
            num1 = this.rand(2, 9) * 10;
            num2 = this.rand(1, Math.floor(num1 / 10) - 1) * 10;
          } else if (this.tier === 'silver') {
            const t1 = this.rand(2, 9);
            const t2 = this.rand(1, t1 - 1);
            const e1 = this.rand(2, 9);
            const e2 = this.rand(1, e1);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          } else { // Guld
            const t1 = this.rand(2, 9);
            const t2 = this.rand(1, t1 - 1);
            const e1 = this.rand(0, 8);
            const e2 = this.rand(e1 + 1, 9);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          }

        } else if (this.category === 'hundratal') {
          if (this.tier === 'brons') {
            num1 = this.rand(2, 9) * 100;
            num2 = this.rand(1, Math.floor(num1 / 100) - 1) * 100;
          } else if (this.tier === 'silver') {
            const h1 = this.rand(3, 8);
            const t1 = this.rand(2, 9);
            const h2 = this.rand(1, h1 - 1);
            const t2 = this.rand(1, t1 - 1);
            num1 = h1 * 100 + t1 * 10;
            num2 = h2 * 100 + t2 * 10;
          } else { // Guld
            const h1 = this.rand(3, 8);
            const t1 = this.rand(2, 9);
            const e1 = this.rand(2, 9);
            const h2 = this.rand(1, h1 - 1);
            const t2 = this.rand(1, t1 - 1);
            const e2 = this.rand(1, e1 - 1);
            num1 = h1 * 100 + t1 * 10 + e1;
            num2 = h2 * 100 + t2 * 10 + e2;
          }
        }

      } else if (this.operation === 'multiplication') {

        // --- MULTIPLIKATION ---
        let tables = [2, 5, 10];
        if (this.category === 'tabell_3_4_6') tables = [3, 4, 6];
        if (this.category === 'tabell_7_8_9') tables = [7, 8, 9];

        const baseTable = tables[this.rand(0, tables.length - 1)];
        let factor = 1;

        if (this.tier === 'brons') {
          factor = this.rand(1, 5);
        } else if (this.tier === 'silver') {
          factor = this.rand(6, 10);
        } else { // Guld
          factor = this.rand(1, 10);
        }

        // Slumpa ordningen (faktorn först eller sist)
        if (this.rand(0, 1) === 0) {
          num1 = baseTable;
          num2 = factor;
        } else {
          num1 = factor;
          num2 = baseTable;
        }
      }

      key = `${num1}_${operator}_${num2}`;
      if (key !== this.lastQuestionKey) {
        break;
      }
    }

    this.lastQuestionKey = key;
    
    let answer = num1 + num2;
    if (this.operation === 'subtraction') answer = num1 - num2;
    if (this.operation === 'multiplication') answer = num1 * num2;

    this.currentQuestion = { num1, num2, operator, answer };
    return this.currentQuestion;
  }

  checkAnswer(userAnswer) {
    const numericAnswer = parseInt(userAnswer, 10);
    const isCorrect = numericAnswer === this.currentQuestion.answer;

    if (isCorrect) {
      this.correctInRound++;

      if (this.correctInRound >= this.questionsPerRound) {
        if (this.currentRound >= this.maxRounds) {
          return {
            isCorrect: true,
            isRoundCompleted: true,
            isTierCompleted: true,
            message: `Bra jobbat! Du har klarat alla 3 omgångar i ${this.tier.toUpperCase()}!`
          };
        }

        this.currentRound++;
        this.correctInRound = 0;

        return {
          isCorrect: true,
          isRoundCompleted: true,
          isTierCompleted: false,
          message: `Omgång ${this.currentRound - 1} klar! Nu startar Omggång ${this.currentRound}!`
        };
      }

      return {
        isCorrect: true,
        isRoundCompleted: false,
        isTierCompleted: false,
        message: 'Bra jobbat! Helt rätt!'
      };
    } else {
      return {
        isCorrect: false,
        isRoundCompleted: false,
        isTierCompleted: false,
        message: 'Inte riktigt. Försök igen!'
      };
    }
  }
}