/**
 * MathEngine.js
 * Hanterar matematiklogik, adaptivitet och nivåbaserade intervall för termer.
 */
export class MathEngine {
  constructor() {
    this.level = 1;
    this.consecutiveCorrect = 0; // Antal rätt i rad för nivåhopp
    this.currentQuestion = null;
  }

  /**
   * Hämtar min och max för termerna baserat på aktuell nivå.
   */
  getTermRangeForLevel(level) {
    switch (level) {
      case 1:
        return { min: 0, max: 5 };
      case 2:
        return { min: 5, max: 10 };
      case 3:
        return { min: 7, max: 13 };
      case 4:
        return { min: 9, max: 16 };
      default:
        // För nivåer över 4 ökar intervallet stegvis vidare
        const extra = level - 4;
        return {
          min: 9 + extra * 2,
          max: 16 + extra * 4
        };
    }
  }

  /**
   * Genererar en matematikfråga utifrån spelarens nivå.
   */
  generateQuestion() {
    const { min, max } = this.getTermRangeForLevel(this.level);

    // Slumpa två termer inom intervallet [min, max]
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const answer = num1 + num2;

    // Anpassa det visuella stödet efter svarstalets storlek
    let visualAidType = 'dots';
    if (answer <= 10) {
      visualAidType = 'ten-frame'; // Tiotalsram för summan 0-10
    } else if (answer <= 20) {
      visualAidType = 'dots';      // Prickar för summan 11-20
    } else {
      visualAidType = 'none';      // Rent sifferläge för högre summan
    }

    this.currentQuestion = {
      num1,
      num2,
      operator: '+',
      answer,
      visualAid: {
        type: visualAidType,
        colorA: '#2563eb', // Blå för första talet
        colorB: '#e11d48'  // Röd för andra talet
      }
    };

    return this.currentQuestion;
  }

  /**
   * Rättar svaret och hanterar nivåhopp.
   */
  checkAnswer(userAnswer) {
    const numericAnswer = parseInt(userAnswer, 10);
    const isCorrect = numericAnswer === this.currentQuestion.answer;

    if (isCorrect) {
      this.consecutiveCorrect++;

      // Gå upp i nivå efter 3 rätt i rad
      if (this.consecutiveCorrect >= 3) {
        this.level++;
        this.consecutiveCorrect = 0;
      }

      return {
        isCorrect: true,
        message: 'Bra jobbat! Helt rätt! 🎉'
      };
    } else {
      this.consecutiveCorrect = 0; // Nollställ sviten utan bestraffning

      return {
        isCorrect: false,
        message: 'Inte riktigt. Försök igen!',
        visualAidUpdated: this.currentQuestion.visualAid
      };
    }
  }
}