import { MathEngine } from './core/MathEngine.js';
import { VisualRenderer } from './graphics/VisualRenderer.js';
import { HUD } from './ui/HUD.js';

// Hämta HTML-element
const canvas = document.getElementById('gameCanvas');
const levelIndicator = document.getElementById('level-indicator');

// Initiera modulerna
const mathEngine = new MathEngine();
const renderer = new VisualRenderer(canvas);

// Skapa HUD och skicka med funktionen som körs när eleven klickar på "OK"
const hud = new HUD((userAnswer) => handleAnswerSubmitted(userAnswer));

/**
 * Laddar och visar nästa fråga
 */
function loadNextQuestion() {
  const question = mathEngine.generateQuestion();
  
  // Uppdatera gränssnittet
  levelIndicator.innerText = `Nivå: ${mathEngine.level}`;
  hud.displayQuestion(question);

  // Rita det visuella stödet på Canvasen
  renderer.renderVisualAid(question.visualAid, question.num1, question.num2);
}

/**
 * Hanterar spelarens svar
 */
function handleAnswerSubmitted(userAnswer) {
  const result = mathEngine.checkAnswer(userAnswer);

  if (result.isCorrect) {
    hud.showFeedback(true, result.message);
    
    // Vänta 1.2 sekunder så eleven hinner se att det blev rätt innan nästa fråga laddas
    setTimeout(() => {
      loadNextQuestion();
    }, 1200);
  } else {
    hud.showFeedback(false, result.message);

    // Om spelet gav ett utökat visuellt stöd vid fel svar, uppdatera Canvasen
    if (result.visualAidUpdated) {
      renderer.renderVisualAid(
        result.visualAidUpdated,
        mathEngine.currentQuestion.num1,
        mathEngine.currentQuestion.num2
      );
    }
  }
}

// Starta spelet första gången
loadNextQuestion();