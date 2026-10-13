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
  (category, tier) => startGame(category, tier),
  () => returnToMenu()
);

function startGame(category, tier) {
  soundManager.init();
  mathEngine.reset(category, tier);
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
    mathEngine.category,
    mathEngine.tier,
    mathEngine.currentRound,
    mathEngine.getRoundProgressPercentage()
  );

  if (result.isCorrect) {
    hud.showFeedback(true, result.message);

    if (result.isTierCompleted) {
      // Hela nivån klarad -> Spara framsteg och spela vinst
      localStorage.setItem(`completed_${mathEngine.category}_${mathEngine.tier}`, 'true');
      soundManager.playVictory();
      renderer.startConfetti();

      setTimeout(() => {
        returnToMenu();
      }, 3500);

    } else if (result.isRoundCompleted) {
      // Omgång klarad
      soundManager.playVictory();

      setTimeout(() => {
        loadNextQuestion();
      }, 2000);

    } else {
      // Vanligt rätt svar
      soundManager.playCorrect();

      setTimeout(() => {
        loadNextQuestion();
      }, 1100);
    }

  } else {
    // Fel svar
    soundManager.playIncorrect();
    hud.showFeedback(false, result.message);
    hud.unlockInput();
  }
}