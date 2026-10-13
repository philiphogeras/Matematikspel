/**
 * MathEngine.js
 * Hanterar matematiklogik och svårighetsnivåer med en exakt positionsprogression:
 * 
 * Tiotal:
 * - Brons: Jämna tiotal (20 + 30)
 * - Silver: Båda termerna har tiotal och ental, utan tiotalsövergång (43 + 32, 15 + 12, 87 + 11)
 * - Guld: Båda termerna har tiotal och ental, med tiotalsövergång (48 + 37, 59 + 43, 88 + 94)
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
    const operator = this.operation === 'subtraction' ? '-' : '+';
    let key = '';

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
          } else { // Guld (över 10)
            const sum = this.rand(11, 18);
            num1 = this.rand(sum - 9, 9);
            num2 = sum - num1;
          }

        } else if (this.category === 'tiotal') {
          if (this.tier === 'brons') {
            // Brons: Jämna tiotal (t.ex. 20 + 30 = 50)
            num1 = this.rand(1, 4) * 10;
            num2 = this.rand(1, 5) * 10;
          } else if (this.tier === 'silver') {
            // Silver: Tiotal + ental på båda termerna, utan tiotalsövergång (t.ex. 43 + 32 = 75)
            const t1 = this.rand(1, 8);
            const t2 = this.rand(1, 9 - t1);
            const e1 = this.rand(1, 8);
            const e2 = this.rand(1, 9 - e1);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          } else {
            // Guld: Tiotal + ental på båda termerna, med tiotalsövergång (t.ex. 48 + 37 = 85)
            const t1 = this.rand(1, 8);
            const t2 = this.rand(1, 8);
            const e1 = this.rand(2, 9);
            const e2 = this.rand(10 - e1, 9);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          }

        } else if (this.category === 'hundratal') {
          if (this.tier === 'brons') {
            // Brons: Jämna hundratal (t.ex. 100 + 200 = 300)
            num1 = this.rand(1, 4) * 100;
            num2 = this.rand(1, 5) * 100;
          } else if (this.tier === 'silver') {
            // Silver: Hundratal + tiotal, slutar på 0 (t.ex. 140 + 250 = 390)
            const h1 = this.rand(1, 4);
            const h2 = this.rand(1, 4);
            const t1 = this.rand(1, 8);
            const t2 = this.rand(1, 9 - t1);
            num1 = h1 * 100 + t1 * 10;
            num2 = h2 * 100 + t2 * 10;
          } else {
            // Guld: Treställiga tal med alla tre positioner aktiva (t.ex. 347 + 112 = 459)
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

      } else {

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
            // Brons: Jämna tiotal (t.ex. 50 - 20 = 30)
            num1 = this.rand(2, 9) * 10;
            num2 = this.rand(1, Math.floor(num1 / 10) - 1) * 10;
          } else if (this.tier === 'silver') {
            // Silver: Tvåsiffriga tal utan tiotalsväxling (t.ex. 45 - 12 = 33)
            const t1 = this.rand(2, 9);
            const t2 = this.rand(1, t1 - 1);
            const e1 = this.rand(2, 9);
            const e2 = this.rand(1, e1);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          } else {
            // Guld: Tvåsiffriga tal med tiotalsväxling (t.ex. 43 - 27 = 16)
            const t1 = this.rand(2, 9);
            const t2 = this.rand(1, t1 - 1);
            const e1 = this.rand(1, 8);
            const e2 = this.rand(e1 + 1, 9);
            num1 = t1 * 10 + e1;
            num2 = t2 * 10 + e2;
          }

        } else if (this.category === 'hundratal') {
          if (this.tier === 'brons') {
            // Brons: Jämna hundratal (t.ex. 300 - 100 = 200)
            num1 = this.rand(2, 9) * 100;
            num2 = this.rand(1, Math.floor(num1 / 100) - 1) * 100;
          } else if (this.tier === 'silver') {
            // Silver: Hundratal med tiotal (t.ex. 390 - 140 = 250)
            const h1 = this.rand(3, 8);
            const t1 = this.rand(2, 9);
            const h2 = this.rand(1, h1 - 1);
            const t2 = this.rand(1, t1 - 1);
            num1 = h1 * 100 + t1 * 10;
            num2 = h2 * 100 + t2 * 10;
          } else {
            // Guld: Treställiga tal (t.ex. 459 - 112 = 347)
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
      }

      key = `${num1}_${operator}_${num2}`;
      if (key !== this.lastQuestionKey) {
        break;
      }
    }

    this.lastQuestionKey = key;
    const answer = this.operation === 'subtraction' ? num1 - num2 : num1 + num2;
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
          message: `Omgång ${this.currentRound - 1} klar! Nu startar Omgång ${this.currentRound}!`
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