/**
/**
 * MathEngine.js
 * Hanterar matematiklogik, adaptivitet och nivåbaserade intervall för termer.
 */
export class MathEngine {
  constructor() {
    this.reset();
  }

  /**
   * Återställer motorn till startläget (Nivå 1)
   */
  reset() {
    this.level = 1;
    this.consecutiveCorrect = 0;
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

    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const answer = num1 + num2;

    let visualAidType = 'dots';
    if (answer <= 10) {
      visualAidType = 'ten-frame';
    } else if (answer <= 20) {
      visualAidType = 'dots';
    } else {
      visualAidType = 'none';
    }

    this.currentQuestion = {
      num1,
      num2,
      operator: '+',
      answer,
      visualAid: {
        type: visualAidType,
        colorA: '#2563eb',
        colorB: '#e11d48'
      }
    };

    return this.currentQuestion;
  }

  /**
   * Rättar svaret och hanterar nivåhopp samt vinstvillkor.
   */
  checkAnswer(userAnswer) {
    const numericAnswer = parseInt(userAnswer, 10);
    const isCorrect = numericAnswer === this.currentQuestion.answer;

    if (isCorrect) {
      this.consecutiveCorrect++;

      // Om spelaren svarar rätt 3 gånger på nivå 10 -> Spelet avklarat!
      if (this.consecutiveCorrect >= 3 && this.level >= 10) {
        return {
          isCorrect: true,
          isCompleted: true,
          message: '🏆 GRATTIS! Du har klarat alla 10 nivåer! 🏆'
        };
      }

      // Gå upp i nivå efter 3 rätt i rad
      if (this.consecutiveCorrect >= 3) {
        this.level++;
        this.consecutiveCorrect = 0;
      }

      return {
        isCorrect: true,
        isCompleted: false,
        message: 'Bra jobbat! Helt rätt! 🎉'
      };
    } else {
      this.consecutiveCorrect = 0; // Nollställ sviten utan bestraffning

      return {
        isCorrect: false,
        isCompleted: false,
        message: 'Inte riktigt. Försök igen!',
        visualAidUpdated: this.currentQuestion.visualAid
      };
    }
  }
}