import { MathEngine } from './core/MathEngine.js';
import { VisualRenderer } from './graphics/VisualRenderer.js';
import { HUD } from './ui/HUD.js';
import { SoundManager } from './audio/SoundManager.js';

const canvas = document.getElementById('gameCanvas');

const mathEngine = new MathEngine();
const renderer = new VisualRenderer(canvas);
const soundManager = new SoundManager();

const hud = new HUD(
  (userAnswer) => handleAnswerSubmitted(userAnswer),
  (operation, category, tier) => startGame(operation, category, tier),
  () => returnToMenu()
);

function startGame(operation, category, tier) {
  soundManager.init();
  mathEngine.reset(operation, category, tier);
  renderer.clear();
  loadNextQuestion();
}

function returnToMenu() {
  renderer.clear();
  hud.showStartScreen();
}

function loadNextQuestion() {
  const question = mathEngine.generateQuestion();
  hud.displayQuestion(question);
  hud.updateTopBar(
    mathEngine.operation,
    mathEngine.category,
    mathEngine.tier,
    mathEngine.currentRound,
    mathEngine.getRoundProgressPercentage()
  );
  renderer.clear();
}

function handleAnswerSubmitted(userAnswer) {
  const result = mathEngine.checkAnswer(userAnswer);

  hud.updateTopBar(
    mathEngine.operation,
    mathEngine.category,
    mathEngine.tier,
    mathEngine.currentRound,
    mathEngine.getRoundProgressPercentage()
  );

  if (result.isCorrect) {
    hud.showFeedback(true, result.message);

    if (result.isTierCompleted) {
      // Spara framsteg unikt för räknesätt (t.ex. completed_subtraktion_ental_brons)
      localStorage.setItem(`completed_${mathEngine.operation}_${mathEngine.category}_${mathEngine.tier}`, 'true');
      soundManager.playVictory();
      renderer.startConfetti();

      setTimeout(() => {
        returnToMenu();
      }, 3500);

    } else if (result.isRoundCompleted) {
      soundManager.playVictory();

      setTimeout(() => {
        loadNextQuestion();
      }, 2000);

    } else {
      soundManager.playCorrect();

      setTimeout(() => {
        loadNextQuestion();
      }, 1100);
    }

  } else {
    soundManager.playIncorrect();
    hud.showFeedback(false, result.message);
    hud.unlockInput();
  }
}