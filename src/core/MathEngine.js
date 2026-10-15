import { AdditionEngine } from './generators/AdditionEngine.js';
import { SubtractionEngine } from './generators/SubtractionEngine.js';
import { MultiplicationEngine } from './generators/MultiplicationEngine.js';
import { WORD_PROBLEMS } from '../data/wordProblems.js';

/**
 * MathEngine.js
 * Huvudmotor som styr spelsessioner, omgångar samt anropar rätt delmotor för frågor.
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
    this.usedQuestionsInRound = [];
  }

  reset(operation = 'addition', category = 'ental', tier = 'brons') {
    this.operation = operation;
    this.category = category;
    this.tier = tier;
    this.currentRound = 1;
    this.correctInRound = 0;
    this.currentQuestion = null;
    this.usedQuestionsInRound = [];
    
    if (this.category === 'problemlosning') {
      this.questionsPerRound = 3;
    } else {
      this.questionsPerRound = 5;
    }
  }

  getRoundProgressPercentage() {
    return Math.round((this.correctInRound / this.questionsPerRound) * 100);
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateQuestion() {
    // 1. PROBLEMLÖSNING
    if (this.category === 'problemlosning') {
      const problemList = WORD_PROBLEMS[this.operation] || WORD_PROBLEMS.addition;
      let selectedProblem = null;

      for (let attempt = 0; attempt < 30; attempt++) {
        const randomIndex = this.rand(0, problemList.length - 1);
        if (!this.usedQuestionsInRound.includes(randomIndex)) {
          this.usedQuestionsInRound.push(randomIndex);
          selectedProblem = problemList[randomIndex]();
          break;
        }
      }

      if (!selectedProblem) {
        selectedProblem = problemList[0]();
      }

      this.currentQuestion = {
        isTextProblem: true,
        text: selectedProblem.text,
        num1: selectedProblem.num1,
        num2: selectedProblem.num2,
        operator: selectedProblem.operator,
        answer: selectedProblem.answer
      };

      return this.currentQuestion;
    }

    // 2. STANDARD RÄKNEFRÅGOR (via undermoduler)
    let generatedData = null;
    let key = '';

    for (let attempt = 0; attempt < 50; attempt++) {
      if (this.operation === 'addition') {
        generatedData = AdditionEngine.generate(this.category, this.tier);
      } else if (this.operation === 'subtraction') {
        generatedData = SubtractionEngine.generate(this.category, this.tier);
      } else if (this.operation === 'multiplication') {
        generatedData = MultiplicationEngine.generate(this.category, this.tier);
      }

      key = `${generatedData.num1}_${generatedData.operator}_${generatedData.num2}`;
      if (!this.usedQuestionsInRound.includes(key)) {
        break;
      }
    }

    this.usedQuestionsInRound.push(key);

    let answer = generatedData.num1 + generatedData.num2;
    if (this.operation === 'subtraction') answer = generatedData.num1 - generatedData.num2;
    if (this.operation === 'multiplication') answer = generatedData.num1 * generatedData.num2;

    this.currentQuestion = {
      isTextProblem: false,
      num1: generatedData.num1,
      num2: generatedData.num2,
      operator: generatedData.operator,
      answer
    };

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
        this.usedQuestionsInRound = [];

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