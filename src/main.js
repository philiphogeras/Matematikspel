import { MathEngine } from './core/MathEngine.js';
import { VisualRenderer } from './graphics/VisualRenderer.js';
import { HUD } from './ui/HUD.js';
import { SoundManager } from './audio/SoundManager.js';

const canvas = document.getElementById('gameCanvas');
const levelIndicator = document.getElementById('level-indicator');

const mathEngine = new MathEngine();
const renderer = new VisualRenderer(canvas);
const soundManager = new SoundManager();

const hud = new HUD(
  (userAnswer) => handleAnswerSubmitted(userAnswer),
  (startLevel, maxLevel, tierName) => startGame(startLevel, maxLevel, tierName),
  () => returnToMenu()
);

function startGame(startLevel, maxLevel, tierName) {
  soundManager.init(); // Aktivera ljudmotorn
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
  hud.updateProgress(mathEngine.getProgressPercentage(), mathEngine.tierName);
  renderer.clear();
}

function handleAnswerSubmitted(userAnswer) {
  const result = mathEngine.checkAnswer(userAnswer);

  hud.updateProgress(mathEngine.getProgressPercentage(), mathEngine.tierName);

  if (result.isCorrect) {
    hud.showFeedback(true, result.message);
    
    if (result.isCompleted) {
      // Vinst! Spara framsteg, spela fanfar och kasta konfetti
      localStorage.setItem(`completed_${mathEngine.tierName}`, 'true');
      soundManager.playVictory();
      renderer.startConfetti();

      setTimeout(() => {
        returnToMenu();
      }, 3500);
    } else {
      // Rätt svar
      soundManager.playCorrect();

      setTimeout(() => {
        loadNextQuestion();
      }, 1200);
    }
  } else {
    // Fel svar
    soundManager.playIncorrect();
    hud.showFeedback(false, result.message);
    hud.unlockInput();
  }
}