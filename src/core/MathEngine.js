/**
 * MathEngine.js
 * Hanterar matematiklogik, adaptivitet och nivåbaserade intervall för termer.
 */
export class MathEngine {
  constructor() {
    this.maxLevel = 10;
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

    this.currentQuestion = {
      num1,
      num2,
      operator: '+',
      answer
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

      // När spelaren får 3 rätt i rad
      if (this.consecutiveCorrect >= 3) {
        
        // Om vi redan är på sista nivån (Nivå 10) -> Vinst!
        if (this.level >= this.maxLevel) {
          return {
            isCorrect: true,
            isCompleted: true,
            message: '🏆 GRATTIS! Du har klarat alla 10 nivåer! 🏆'
          };
        }

        // Annars gå upp en nivå och nollställ sviten
        this.level++;
        this.consecutiveCorrect = 0;
      }

      return {
        isCorrect: true,
        isCompleted: false,
        message: 'Bra jobbat! Helt rätt! 🎉'
      };
    } else {
      this.consecutiveCorrect = 0;

      return {
        isCorrect: false,
        isCompleted: false,
        message: 'Inte riktigt. Försök igen!'
      };
    }
  }
}