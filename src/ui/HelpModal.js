import { ArithmeticHelpRenderer } from './help/ArithmeticHelpRenderer.js';
import { GeometryHelpRenderer } from './help/GeometryHelpRenderer.js';

/**
 * HelpModal.js
 * Koordinatör och fönsterram för hjälprutan.
 * Delegerar allt ritande till ArithmeticHelpRenderer och GeometryHelpRenderer.
 */
export class HelpModal {
  constructor() {
    this.modal = document.getElementById('help-modal');
    this.pageIndicator = document.getElementById('help-page-indicator');
    this.instructionsEl = null;
    this.visualEl = null;
    
    this.currentPage = 1;
    this.totalPages = 3;
    this.currentQuestion = null;

    this.arithmeticRenderer = new ArithmeticHelpRenderer();
    this.geometryRenderer = new GeometryHelpRenderer();

    this.ensureElements();
  }

  ensureElements() {
    if (!this.modal) {
      this.modal = document.getElementById('help-modal');
    }

    if (this.modal) {
      const contentBox = this.modal.querySelector('.modal-content') || this.modal;

      this.instructionsEl = document.getElementById('help-instructions') || 
                           document.getElementById('help-text') ||
                           this.modal.querySelector('.help-instructions');
      
      if (!this.instructionsEl) {
        this.instructionsEl = document.createElement('div');
        this.instructionsEl.id = 'help-instructions';
        const footer = contentBox.querySelector('.help-modal-footer');
        if (footer) {
          contentBox.insertBefore(this.instructionsEl, footer);
        } else {
          contentBox.appendChild(this.instructionsEl);
        }
      }

      this.visualEl = document.getElementById('help-visual-area') || 
                      document.getElementById('help-visual') || 
                      document.getElementById('help-body') ||
                      this.modal.querySelector('.help-visual-area');

      if (!this.visualEl) {
        this.visualEl = document.createElement('div');
        this.visualEl.id = 'help-visual-area';
        const footer = contentBox.querySelector('.help-modal-footer');
        if (footer) {
          contentBox.insertBefore(this.visualEl, footer);
        } else {
          contentBox.appendChild(this.visualEl);
        }
      }

      if (!this.pageIndicator) {
        this.pageIndicator = document.getElementById('help-page-indicator');
      }
    }
  }

  setCurrentQuestion(question) {
    this.currentQuestion = question;
    if (!this.modal || this.modal.classList.contains('hidden')) return;
    this.renderPage();
  }

  show() {
    this.ensureElements();
    if (!this.modal) return;
    this.currentPage = 1;
    this.modal.classList.remove('hidden');
    this.renderPage();
  }

  hide() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage();
    }
  }

  renderPage() {
    this.ensureElements();

    if (this.pageIndicator) {
      this.pageIndicator.innerText = `Sida ${this.currentPage} av ${this.totalPages}`;
    }

    const q = this.currentQuestion || {
      num1: 5, num2: 3, operator: '+', correctAnswer: '8', text: '5 + 3 = ?'
    };

    if (this.geometryRenderer.isGeometry(q)) {
      this.geometryRenderer.render(this.currentPage, q, this.instructionsEl, this.visualEl);
    } else {
      this.arithmeticRenderer.render(this.currentPage, q, this.instructionsEl, this.visualEl);
    }
  }
}