/**
 * MathEngine.js
 * Hanterar matematiklogik för både Addition (+) och Subtraktion (-).
 */
export class MathEngine {
  constructor() {
    this.operation = 'addition';  // 'addition' eller 'subtraction'
    this.category = 'ental';       // 'ental', 'tiotal', 'hundratal'
    this.tier = 'brons';           // 'brons', 'silver', 'guld'
    
    this.currentRound = 1;         // 1..3
    this.maxRounds = 3;
    
    this.correctInRound = 0;       // 0..5
    this.questionsPerRound = 5;

    this.currentQuestion = null;
  }

  reset(operation = 'addition', category = 'ental', tier = 'brons') {
    this.operation = operation;
    this.category = category;
    this.tier = tier;
    this.currentRound = 1;
    this.correctInRound = 0;
    this.currentQuestion = null;
  }

  getRoundProgressPercentage() {
    return Math.round((this.correctInRound / this.questionsPerRound) * 100);
  }

  /**
   * Genererar anpassade frågor för både Addition och Subtraktion.
   */
  generateQuestion() {
    let num1 = 0;
    let num2 = 0;
    const operator = this.operation === 'subtraction' ? '-' : '+';

    if (this.operation === 'addition') {
      // ADDITION LOGIK
      if (this.category === 'ental') {
        if (this.tier === 'brons') { num1 = this.rand(0, 5); num2 = this.rand(0, 4); }
        else if (this.tier === 'silver') { num1 = this.rand(2, 7); num2 = this.rand(1, 6); }
        else { num1 = this.rand(5, 9); num2 = this.rand(5, 9); }
      } else if (this.category === 'tiotal') {
        if (this.tier === 'brons') { num1 = this.rand(1, 4) * 10; num2 = this.rand(1, 5) * 10; }
        else if (this.tier === 'silver') { num1 = this.rand(1, 5) * 10; num2 = this.rand(1, 9); }
        else { num1 = this.rand(10, 40); num2 = this.rand(10, 40); }
      } else if (this.category === 'hundratal') {
        if (this.tier === 'brons') { num1 = this.rand(1, 4) * 100; num2 = this.rand(1, 4) * 100; }
        else if (this.tier === 'silver') { num1 = this.rand(1, 4) * 100; num2 = this.rand(1, 8) * 10; }
        else { num1 = this.rand(100, 300); num2 = this.rand(100, 300); }
      }
      this.currentQuestion = { num1, num2, operator, answer: num1 + num2 };

    } else {
      // SUBTRAKTION LOGIK (Alltid num1 >= num2 så svaret blir positivt)
      if (this.category === 'ental') {
        if (this.tier === 'brons') {
          num1 = this.rand(1, 5);
          num2 = this.rand(0, num1);
        } else if (this.tier === 'silver') {
          num1 = this.rand(4, 10);
          num2 = this.rand(1, num1);
        } else { // guld (tiotalsövergång, t.ex. 14 - 6)
          num1 = this.rand(11, 18);
          num2 = this.rand(2, 9);
        }
      } else if (this.category === 'tiotal') {
        if (this.tier === 'brons') { // Jämna tiotal (50 - 20)
          num1 = this.rand(2, 5) * 10;
          num2 = this.rand(1, num1 / 10) * 10;
        } else if (this.tier === 'silver') { // Tiotal - ental (48 - 5)
          num1 = this.rand(2, 9) * 10 + this.rand(1, 9);
          num2 = this.rand(1, num1 % 10 || 5);
        } else { // Blandade tiotal (52 - 27)
          num1 = this.rand(30, 99);
          num2 = this.rand(10, num1 - 1);
        }
      } else if (this.category === 'hundratal') {
        if (this.tier === 'brons') { // Jämna hundratal (500 - 200)
          num1 = this.rand(2, 5) * 100;
          num2 = this.rand(1, num1 / 100) * 100;
        } else if (this.tier === 'silver') { // Hundratal - tiotal (400 - 30)
          num1 = this.rand(2, 8) * 100;
          num2 = this.rand(1, 9) * 10;
        } else { // Blandade hundratal (450 - 180)
          num1 = this.rand(200, 900);
          num2 = this.rand(100, num1 - 1);
        }
      }
      this.currentQuestion = { num1, num2, operator, answer: num1 - num2 };
    }

    return this.currentQuestion;
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
            message: `🏆 FANTASTISKT! Du har klarat alla 3 omgångar i ${this.tier.toUpperCase()}! 🏆`
          };
        }

        this.currentRound++;
        this.correctInRound = 0;

        return {
          isCorrect: true,
          isRoundCompleted: true,
          isTierCompleted: false,
          message: `🌟 Omgång ${this.currentRound - 1} klar! Nu startar Omgång ${this.currentRound}! 🎉`
        };
      }

      return {
        isCorrect: true,
        isRoundCompleted: false,
        isTierCompleted: false,
        message: 'Bra jobbat! Helt rätt! ⭐'
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