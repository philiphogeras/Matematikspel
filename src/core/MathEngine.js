/**
 * MathEngine.js
 * Hanterar matematiklogik, adaptivitet och exponentiell progressionskurva.
 */
export class MathEngine {
  constructor() {
    this.level = 1;
    this.consecutiveCorrect = 0; // Antal rätt i rad för nivåhopp
    this.currentQuestion = null;
  }

  /**
   * Beräknar högsta tillåtna värdet för termerna på den aktuella nivån.
   */
  getMaxTermForLevel(level) {
    if (level === 1) return 5;
    if (level === 2) return 8;

    // Exponentiell ökning från nivå 3 (Nivå 3: 12, Nivå 4: 17, Nivå 5: 25, Nivå 6: 36...)
    return Math.round(8 * Math.pow(1.45, level - 2));
  }

  /**
   * Genererar en matematikfråga utifrån spelarens nivå.
   */
  generateQuestion() {
    const maxTerm = this.getMaxTermForLevel(this.level);

    // Slumpa två termer mellan 0 och maxTerm
    const num1 = Math.floor(Math.random() * (maxTerm + 1));
    const num2 = Math.floor(Math.random() * (maxTerm + 1));
    const answer = num1 + num2;

    // Anpassa det visuella stödet efter svarstalets storlek
    let visualAidType = 'dots';
    if (answer <= 10) {
      visualAidType = 'ten-frame'; // Tiotalsram passar bäst för tal upp till 10
    } else if (answer <= 20) {
      visualAidType = 'dots';      // Prickar för tal upp till 20
    } else {
      visualAidType = 'none';      // Dölj grafiskt stöd vid högre tal
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
   * Rättar svaret och hanterar adaptiviteten.
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