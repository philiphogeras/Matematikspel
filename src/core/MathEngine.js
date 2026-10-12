/**
 * MathEngine.js
 * Hanterar matematiklogik, frågegenerering och adaptiv svårighetsgrad.
 */
export class MathEngine {
  constructor() {
    this.level = 1;
    this.consecutiveCorrect = 0;
    this.consecutiveIncorrect = 0;
    this.currentQuestion = null;
  }

  /**
   * Genererar en ny fråga baserad på nuvarande nivå och anpassning
   */
  generateQuestion() {
    let num1, num2, operator, visualAidType;

    switch (this.level) {
      case 1:
        // Addition upp till 5 med tiotalsram som stöd
        num1 = Math.floor(Math.random() * 4) + 1;
        num2 = Math.floor(Math.random() * (5 - num1)) + 1;
        operator = '+';
        visualAidType = 'ten-frame';
        break;

      case 2:
        // Addition upp till 10 med tiotalsram
        num1 = Math.floor(Math.random() * 8) + 1;
        num2 = Math.floor(Math.random() * (10 - num1)) + 1;
        operator = '+';
        visualAidType = 'ten-frame';
        break;

      case 3:
        // Samma talområde (1-10), men utan det visuella stödet (mer abstrakt)
        num1 = Math.floor(Math.random() * 8) + 1;
        num2 = Math.floor(Math.random() * (10 - num1)) + 1;
        operator = '+';
        visualAidType = 'none';
        break;

      case 4:
        // Enkel subtraktion inom 10
        num1 = Math.floor(Math.random() * 8) + 2; // 2 till 9
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // Ser till att svaret blir positivt
        operator = '-';
        visualAidType = 'dots';
        break;

      default:
        // Högre nivåer (större talområden)
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = '+';
        visualAidType = 'none';
        break;
    }

    const answer = operator === '+' ? num1 + num2 : num1 - num2;

    this.currentQuestion = {
      id: `q_${Date.now()}`,
      num1,
      num2,
      operator,
      answer,
      visualAid: {
        type: visualAidType,
        colorA: '#3B82F6', // Tydlig blå
        colorB: '#F97316'  // Tydlig orange
      }
    };

    return this.currentQuestion;
  }

  /**
   * Utvärderar spelarens svar och justerar svårighetsgraden automatiskt
   */
  checkAnswer(userAnswer) {
    if (!this.currentQuestion) return null;

    const parsedAnswer = parseInt(userAnswer, 10);
    const isCorrect = parsedAnswer === this.currentQuestion.answer;

    if (isCorrect) {
      this.consecutiveCorrect++;
      this.consecutiveIncorrect = 0;

      // Höj nivån automatiskt efter 3 rätt i rad
      if (this.consecutiveCorrect >= 3) {
        this.level++;
        this.consecutiveCorrect = 0;
      }

      return {
        isCorrect: true,
        message: 'Bra jobbat! Rätt svar.',
        currentLevel: this.level
      };
    } else {
      this.consecutiveIncorrect++;
      this.consecutiveCorrect = 0;

      let hint = 'Försök igen!';
      
      // Om spelaren kör fast (2 fel i rad), aktiveras det visuella stödet igen
      if (this.consecutiveIncorrect >= 2) {
        this.currentQuestion.visualAid.type = 'ten-frame';
        hint = 'Ta hjälp av rutorna på skärmen för att räkna!';
      }

      return {
        isCorrect: false,
        message: hint,
        visualAidUpdated: this.currentQuestion.visualAid
      };
    }
  }
}