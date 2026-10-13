/**
 * MathEngine.js
 * Hanterar matematiklogik och svårighetsnivåer utan upprepade frågor.
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

    // Förhindra att exakt samma fråga genereras två gånger i rad
    for (let attempt = 0; attempt < 30; attempt++) {
      if (this.operation === 'addition') {
        if (this.category === 'ental') {
          if (this.tier === 'brons') {
            // Summa maximalt 10
            const sum = this.rand(1, 10);
            num1 = this.rand(0, sum);
            num2 = sum - num1;
          } else if (this.tier === 'silver') {
            // Summa nära 10 (7-10)
            const sum = this.rand(7, 10);
            num1 = this.rand(1, sum - 1);
            num2 = sum - num1;
          } else {
            // Guld: Över 10 men under 19 (11-18)
            const sum = this.rand(11, 18);
            num1 = this.rand(sum - 9, 9);
            num2 = sum - num1;
          }
        } else if (this.category === 'tiotal') {
          if (this.tier === 'brons') {
            // Summa maximalt 100
            const sum = this.rand(2, 10) * 10;
            num1 = this.rand(1, (sum / 10) - 1) * 10;
            num2 = sum - num1;
          } else if (this.tier === 'silver') {
            // Summa nära 100 (70-100)
            const sum = this.rand(7, 10) * 10;
            num1 = this.rand(1, (sum / 10) - 1) * 10;
            num2 = sum - num1;
          } else {
            // Guld: Över 100 men under 190 (110-180)
            const sum = this.rand(11, 18) * 10;
            num1 = this.rand((sum / 10) - 9, 9) * 10;
            num2 = sum - num1;
          }
        } else if (this.category === 'hundratal') {
          if (this.tier === 'brons') {
            const sum = this.rand(2, 10) * 100;
            num1 = this.rand(1, (sum / 100) - 1) * 100;
            num2 = sum - num1;
          } else if (this.tier === 'silver') {
            const sum = this.rand(7, 10) * 100;
            num1 = this.rand(1, (sum / 100) - 1) * 100;
            num2 = sum - num1;
          } else {
            const sum = this.rand(11, 18) * 100;
            num1 = this.rand((sum / 100) - 9, 9) * 100;
            num2 = sum - num1;
          }
        }
      } else {
        // Subtraktion
        if (this.category === 'ental') {
          if (this.tier === 'brons') {
            num1 = this.rand(1, 10);
            num2 = this.rand(0, num1);
          } else if (this.tier === 'silver') {
            num1 = this.rand(7, 10);
            num2 = this.rand(1, num1);
          } else {
            // Guld: Minuend 11-18, subtrahend ger ental som svar (1-9)
            num1 = this.rand(11, 18);
            num2 = this.rand(num1 - 9, 9);
          }
        } else if (this.category === 'tiotal') {
          if (this.tier === 'brons') {
            num1 = this.rand(2, 10) * 10;
            num2 = this.rand(1, num1 / 10) * 10;
          } else if (this.tier === 'silver') {
            num1 = this.rand(7, 10) * 10;
            num2 = this.rand(1, num1 / 10) * 10;
          } else {
            // Guld: Minuend 110-180
            num1 = this.rand(11, 18) * 10;
            num2 = this.rand((num1 / 10) - 9, 9) * 10;
          }
        } else if (this.category === 'hundratal') {
          if (this.tier === 'brons') {
            num1 = this.rand(2, 10) * 100;
            num2 = this.rand(1, num1 / 100) * 100;
          } else if (this.tier === 'silver') {
            num1 = this.rand(7, 10) * 100;
            num2 = this.rand(1, num1 / 100) * 100;
          } else {
            num1 = this.rand(11, 18) * 100;
            num2 = this.rand((num1 / 100) - 9, 9) * 100;
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