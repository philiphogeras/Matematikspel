import { MathEngine } from './core/MathEngine.js';
import { VisualRenderer } from './graphics/VisualRenderer.js';
import { HUD } from './ui/HUD.js';

const canvas = document.getElementById('gameCanvas');
const levelIndicator = document.getElementById('level-indicator');

const mathEngine = new MathEngine();
const renderer = new VisualRenderer(canvas);

const hud = new HUD(
  (userAnswer) => handleAnswerSubmitted(userAnswer),
  () => startGame(),
  () => returnToMenu()
);

function startGame() {
  mathEngine.reset(); // Återställ till nivå 1 vid varje nytt spel
  loadNextQuestion();
}

function returnToMenu() {
  renderer.clear();
  hud.showStartScreen();
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
    
    if (result.isCompleted) {
      // Spelet är avklarat! Visa vinsttexten i 3 sekunder och skicka till menyn
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

    if (result.visualAidUpdated) {
      renderer.renderVisualAid(
        result.visualAidUpdated,
        mathEngine.currentQuestion.num1,
        mathEngine.currentQuestion.num2
      );
    }
  }
}