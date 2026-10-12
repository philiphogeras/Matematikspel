import { MathEngine } from './core/MathEngine.js';
import { VisualRenderer } from './graphics/VisualRenderer.js';
import { HUD } from './ui/HUD.js';

const canvas = document.getElementById('gameCanvas');
const levelIndicator = document.getElementById('level-indicator');

const mathEngine = new MathEngine();
const renderer = new VisualRenderer(canvas);

// Skapa HUD med händelser för start, svar och återgång till meny
const hud = new HUD(
  (userAnswer) => handleAnswerSubmitted(userAnswer),
  () => startGame(),
  () => returnToMenu()
);

function startGame() {
  loadNextQuestion();
}

function returnToMenu() {
  renderer.clear();
}

function loadNextQuestion() {
  const question = mathEngine.generateQuestion();
  
  levelIndicator.innerText = `Nivå: ${mathEngine.level}`;
  hud.displayQuestion(question);

  renderer.renderVisualAid(question.visualAid, question.num1, question.num2);
}

function handleAnswerSubmitted(userAnswer) {
  const result = mathEngine.checkAnswer(userAnswer);

  if (result.isCorrect) {
    hud.showFeedback(true, result.message);
    
    setTimeout(() => {
      loadNextQuestion();
    }, 1200);
  } else {
    hud.showFeedback(false, result.message);

    if (result.visualAidUpdated) {
      renderer.renderVisualAid(
        result.visualAidUpdated,
        mathEngine.currentQuestion.num1,
        mathEngine.currentQuestion.num2
      );
    }
  }
}