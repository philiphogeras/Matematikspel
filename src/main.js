import { SoundManager } from './audio/SoundManager.js';
import { MathEngine } from './core/MathEngine.js';
import { HUD } from './ui/HUD.js';
import { VisualRenderer } from './graphics/VisualRenderer.js';

/**
 * main.js
 * Huvudövergripande applikationsinitiering.
 */
class Game {
  constructor() {
    this.soundManager = new SoundManager();
    this.mathEngine = new MathEngine();
    this.visualRenderer = new VisualRenderer('gameCanvas');

    this.hud = new HUD(
      (answer) => this.handleAnswerSubmit(answer),
      (operation, category, tier) => this.startNewGame(operation, category, tier),
      () => this.returnToMenu(),
      {
        onVolumeChange: (vol) => this.soundManager.setVolume(vol),
        onMuteToggle: (isMuted) => this.soundManager.setMuted(isMuted)
      }
    );

    this.hud.showStartScreen();
  }

  // Timer-fri fördröjning via requestAnimationFrame (CSP-säker)
  delayCall(callback, ms) {
    const start = performance.now();
    const frame = (now) => {
      if (now - start >= ms) {
        callback();
      } else {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);
  }

  startNewGame(operation, category, tier) {
    this.mathEngine.reset(operation, category, tier);
    this.nextQuestion();
  }

  nextQuestion() {
    const question = this.mathEngine.generateQuestion();
    this.hud.displayQuestion(question);
    this.hud.updateTopBar(
      this.mathEngine.operation,
      this.mathEngine.category,
      this.mathEngine.tier,
      this.mathEngine.currentRound,
      this.mathEngine.getRoundProgressPercentage()
    );
  }

  handleAnswerSubmit(userAnswer) {
    const result = this.mathEngine.checkAnswer(userAnswer);

    if (result.isCorrect) {
      this.soundManager.playCorrect();
      this.hud.showFeedback(true, result.message);

      this.hud.updateTopBar(
        this.mathEngine.operation,
        this.mathEngine.category,
        this.mathEngine.tier,
        this.mathEngine.currentRound,
        this.mathEngine.getRoundProgressPercentage()
      );

      if (result.isTierCompleted) {
        try {
          const key = `completed_${this.mathEngine.operation}_${this.mathEngine.category}_${this.mathEngine.tier}`;
          localStorage.setItem(key, 'true');
        } catch (e) {
          console.warn('LocalStorage sparning misslyckades:', e);
        }

        this.soundManager.playVictory();
        if (this.visualRenderer) {
          this.visualRenderer.triggerConfetti();
        }

        this.delayCall(() => {
          this.hud.showTierMenu();
        }, 2200);

      } else if (result.isRoundCompleted) {
        this.soundManager.playFanfare();
        this.delayCall(() => {
          this.nextQuestion();
        }, 1200);

      } else {
        this.delayCall(() => {
          this.nextQuestion();
        }, 800);
      }

    } else {
      // FELAKTIGT SVAR:
      this.soundManager.playIncorrect();
      this.hud.showFeedback(false, result.message);

      // Nollställ svaret och lås upp tangentbordet automatiskt efter 3 sekunder (3000 ms)
      this.delayCall(() => {
        this.hud.clearInputAndUnlock();
      }, 3000);
    }
  }

  returnToMenu() {
    this.hud.showTierMenu();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});