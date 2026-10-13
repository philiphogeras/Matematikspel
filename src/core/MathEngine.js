/**
 * MathEngine.js
 * Styr delmoment (Ental, Tiotal, Hundratal), nivåer (Brons, Silver, Guld),
 * samt omgångssystemet (3 omgångar × 5 tal).
 */
export class MathEngine {
  constructor() {
    this.category = 'ental';  // 'ental', 'tiotal', 'hundratal'
    this.tier = 'brons';      // 'brons', 'silver', 'guld'
    
    this.currentRound = 1;    // 1..3
    this.maxRounds = 3;
    
    this.correctInRound = 0;  // 0..5
    this.questionsPerRound = 5;

    this.currentQuestion = null;
  }

  reset(category = 'ental', tier = 'brons') {
    this.category = category;
    this.tier = tier;
    this.currentRound = 1;
    this.correctInRound = 0;
    this.currentQuestion = null;
  }

  /**
   * Beräknar procentuell framgång för mätaren i aktuell omgång (0-100%).
   */
  getRoundProgressPercentage() {
    return Math.round((this.correctInRound / this.questionsPerRound) * 100);
  }

  /**
   * Genererar anpassade tal baserat på delmoment och trofénivå.
   */
  generateQuestion() {
    let min1 = 0, max1 = 5, min2 = 0, max2 = 5;

    if (this.category === 'ental') {
      if (this.tier === 'brons') {
        min1 = 0; max1 = 5; min2 = 0; max2 = 4;
      } else if (this.tier === 'silver') {
        min1 = 2; max1 = 7; min2 = 1; max2 = 6;
      } else { // guld (tiotalsövergång)
        min1 = 5; max1 = 9; min2 = 5; max2 = 9;
      }
    } else if (this.category === 'tiotal') {
      if (this.tier === 'brons') { // Jämna tiotal
        min1 = 1; max1 = 4; min2 = 1; max2 = 5;
        const num1 = Math.floor(Math.random() * (max1 - min1 + 1) + min1) * 10;
        const num2 = Math.floor(Math.random() * (max2 - min2 + 1) + min2) * 10;
        this.currentQuestion = { num1, num2, operator: '+', answer: num1 + num2 };
        return this.currentQuestion;
      } else if (this.tier === 'silver') { // Tiotal + ental
        const num1 = Math.floor(Math.random() * 5 + 1) * 10;
        const num2 = Math.floor(Math.random() * 9 + 1);
        this.currentQuestion = { num1, num2, operator: '+', answer: num1 + num2 };
        return this.currentQuestion;
      } else { // Guld (Blandade tiotal)
        const num1 = Math.floor(Math.random() * 40 + 10);
        const num2 = Math.floor(Math.random() * 40 + 10);
        this.currentQuestion = { num1, num2, operator: '+', answer: num1 + num2 };
        return this.currentQuestion;
      }
    } else if (this.category === 'hundratal') {
      if (this.tier === 'brons') { // Jämna hundratal
        const num1 = Math.floor(Math.random() * 4 + 1) * 100;
        const num2 = Math.floor(Math.random() * 4 + 1) * 100;
        this.currentQuestion = { num1, num2, operator: '+', answer: num1 + num2 };
        return this.currentQuestion;
      } else if (this.tier === 'silver') { // Hundratal + tiotal
        const num1 = Math.floor(Math.random() * 4 + 1) * 100;
        const num2 = Math.floor(Math.random() * 8 + 1) * 10;
        this.currentQuestion = { num1, num2, operator: '+', answer: num1 + num2 };
        return this.currentQuestion;
      } else { // Guld (Blandade hundratal)
        const num1 = Math.floor(Math.random() * 300 + 100);
        const num2 = Math.floor(Math.random() * 300 + 100);
        this.currentQuestion = { num1, num2, operator: '+', answer: num1 + num2 };
        return this.currentQuestion;
      }
    }

    const num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    const num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;

    this.currentQuestion = {
      num1,
      num2,
      operator: '+',
      answer: num1 + num2
    };

    return this.currentQuestion;
  }

  /**
   * Rättar svaret och hanterar omgångar.
   */
  checkAnswer(userAnswer) {
    const numericAnswer = parseInt(userAnswer, 10);
    const isCorrect = numericAnswer === this.currentQuestion.answer;

    if (isCorrect) {
      this.correctInRound++;

      // Är omgången klar? (5 rätt)
      if (this.correctInRound >= this.questionsPerRound) {
        
        // Är alla 3 omgångar klarade? -> VINST FÖR HELA NIVÅN
        if (this.currentRound >= this.maxRounds) {
          return {
            isCorrect: true,
            isRoundCompleted: true,
            isTierCompleted: true,
            message: `🏆 FANTASTISKT! Du har klarat alla 3 omgångar i ${this.tier.toUpperCase()}! 🏆`
          };
        }

        // Annars gå till nästa omgång
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
      // Fel svar påverkar inte tidigare framsteg
      return {
        isCorrect: false,
        isRoundCompleted: false,
        isTierCompleted: false,
        message: 'Inte riktigt. Försök igen!'
      };
    }
  }
}