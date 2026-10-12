import { MathEngine } from './core/MathEngine.js';
import { VisualRenderer } from './graphics/VisualRenderer.js';
import { HUD } from './ui/HUD.js';

const canvas = document.getElementById('gameCanvas');
const levelIndicator = document.getElementById('level-indicator');

const mathEngine = new MathEngine();
const renderer = new VisualRenderer(canvas);

const hud = new HUD(
  (userAnswer) => handleAnswerSubmitted(userAnswer),
  (startLevel, maxLevel, tierName) => startGame(startLevel, maxLevel, tierName),
  () => returnToMenu()
);

function startGame(startLevel, maxLevel, tierName) {
  mathEngine.reset(startLevel, maxLevel, tierName);
  renderer.clear();
  loadNextQuestion();
}

function returnToMenu() {
  renderer.clear();
  hud.showStartScreen();
}

function loadNextQuestion() {
  const question = mathEngine.generateQuestion();
  
  levelIndicator.innerText = `${mathEngine.tierName} – Nivå: ${mathEngine.level}`;
  hud.displayQuestion(question);
  renderer.clear();
}

function handleAnswerSubmitted(userAnswer) {
  const result = mathEngine.checkAnswer(userAnswer);

  if (result.isCorrect) {
    hud.showFeedback(true, result.message);
    
    if (result.isCompleted) {
      setTimeout(() => {
        returnToMenu();
      }, 3000);
    } else {
      setTimeout(() => {
        loadNextQuestion();
      }, 1200);
    }
  } else {
    hud.showFeedback(false, result.message);
  }
}