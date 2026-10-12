/**
 * MathEngine.js
 * Hanterar matematiklogik, adaptivitet, intervall och framstegsberäkning.
 */
export class MathEngine {
  constructor() {
    this.startLevel = 1;
    this.maxLevel = 10;
    this.tierName = 'Brons';
    this.reset();
  }

  reset(startLevel = 1, maxLevel = 10, tierName = 'Brons') {
    this.startLevel = startLevel;
    this.level = startLevel;
    this.maxLevel = maxLevel;
    this.tierName = tierName;
    this.consecutiveCorrect = 0;
    this.currentQuestion = null;
  }

  /**
   * Beräknar hur många procent av den aktuella trofégraden som spelaren har klarat.
   */
  getProgressPercentage() {
    const totalLevelsInTier = this.maxLevel - this.startLevel + 1; // t.ex. 10 nivåer
    const totalQuestions = totalLevelsInTier * 3; // 30 frågor totalt per trofé

    const completedLevels = this.level - this.startLevel;
    const completedQuestions = completedLevels * 3 + this.consecutiveCorrect;

    const percentage = Math.round((completedQuestions / totalQuestions) * 100);
    return Math.min(100, percentage);
  }

  getTermRangeForLevel(level) {
    if (level === 1) return { min: 0, max: 5 };
    if (level === 2) return { min: 5, max: 10 };
    if (level === 3) return { min: 7, max: 13 };
    if (level === 4) return { min: 9, max: 16 };
    if (level <= 10) {
      const extra = level - 4;
      return { min: 9 + extra * 2, max: 16 + extra * 4 };
    }

    if (level <= 20) {
      const step = level - 10;
      return {
        min: 10 + step * 3,
        max: 25 + step * 8
      };
    }

    const step = level - 20;
    return {
      min: 40 + step * 10,
      max: 100 + step * 40
    };
  }

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

  checkAnswer(userAnswer) {
    const numericAnswer = parseInt(userAnswer, 10);
    const isCorrect = numericAnswer === this.currentQuestion.answer;

    if (isCorrect) {
      this.consecutiveCorrect++;

      if (this.consecutiveCorrect >= 3) {
        if (this.level >= this.maxLevel) {
          return {
            isCorrect: true,
            isCompleted: true,
            message: `🏆 GRATTIS! Du har klarat alla nivåer i ${this.tierName}! 🏆`
          };
        }

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