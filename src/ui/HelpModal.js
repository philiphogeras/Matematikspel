/**
 * HelpModal.js
 * Hanterar hjälpfönstret med steg-för-steg stöd för både räknekunskap och geometri.
 */
export class HelpModal {
  constructor() {
    this.modal = document.getElementById('help-modal');
    this.titleElem = document.getElementById('help-modal-title');
    this.verticalElem = document.getElementById('vertical-setup');
    this.instructionsElem = document.getElementById('help-instructions');
    this.pageIndicator = document.getElementById('help-page-indicator');
    this.btnPrev = document.getElementById('btn-help-prev');
    this.btnNext = document.getElementById('btn-help-next');

    this.currentQuestion = null;
    this.currentPage = 1;
    this.totalPages = 1;
  }

  setCurrentQuestion(question) {
    this.currentQuestion = question;
    this.currentPage = 1;
    this.updateTotalPages();
  }

  updateTotalPages() {
    if (!this.currentQuestion) {
      this.totalPages = 1;
      return;
    }

    if (this.currentQuestion.isGeometry) {
      this.totalPages = 1;
    } else if (this.currentQuestion.num1 !== undefined && this.currentQuestion.num2 !== undefined) {
      const isTwoDigit = this.currentQuestion.num1 >= 10 || this.currentQuestion.num2 >= 10;
      this.totalPages = isTwoDigit ? 2 : 1;
    } else {
      this.totalPages = 1;
    }
  }

  show() {
    if (this.modal) {
      this.modal.classList.remove('hidden');
      this.render();
    }
  }

  hide() {
    if (this.modal) {
      this.modal.classList.add('hidden');
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.render();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.render();
    }
  }

  render() {
    if (!this.currentQuestion) return;

    const q = this.currentQuestion;

    if (this.pageIndicator) {
      this.pageIndicator.innerText = `Sida ${this.currentPage} av ${this.totalPages}`;
    }

    if (this.btnPrev) {
      this.btnPrev.style.visibility = this.currentPage > 1 ? 'visible' : 'hidden';
    }
    if (this.btnNext) {
      this.btnNext.style.visibility = this.currentPage < this.totalPages ? 'visible' : 'hidden';
    }

    // GEOMETRIHJÄLP
    if (q.isGeometry) {
      if (this.titleElem) this.titleElem.innerText = 'Hjälp & Tips';
      if (this.verticalElem) this.verticalElem.style.display = 'none';

      if (this.instructionsElem) {
        let hint = q.explanation || '';
        if (q.questionType === 'vertices') {
          hint += '\n\n💡 Tips: Räkna de röda punkterna i figurernas hörn!';
        } else if (q.questionType === 'sides') {
          hint += '\n\n💡 Tips: Räkna de raka strecken runt figuren!';
        } else if (q.questionType === 'identify') {
          hint += '\n\n💡 Tips:\n• Triangel: 3 hörn\n• Kvadrat: 4 lika långa sidor\n• Rektangel: 4 sidor (2 långa, 2 korta)\n• Cirkel: Rund utan hörn';
        }
        this.instructionsElem.innerText = hint;
      }
      return;
    }

    // ARITMETIKHJÄLP (Sifferfrågor)
    if (q.num1 !== undefined && q.num2 !== undefined) {
      if (this.titleElem) this.titleElem.innerText = 'Hjälp med uträkning';
      if (this.verticalElem) this.verticalElem.style.display = 'block';

      const op = q.operator || '+';
      const n1 = q.num1;
      const n2 = q.num2;

      if (this.verticalElem) {
        this.verticalElem.innerHTML = `
          <div>&nbsp;${n1}</div>
          <div>${op} ${n2}</div>
        `;
      }

      if (this.instructionsElem) {
        if (this.currentPage === 1) {
          const ental1 = n1 % 10;
          const ental2 = n2 % 10;
          this.instructionsElem.innerText = `Steg 1: Räkna ihop entalen (blå siffror):\n${ental1} ${op} ${ental2}`;
        } else {
          const tiotal1 = Math.floor(n1 / 10);
          const tiotal2 = Math.floor(n2 / 10);
          this.instructionsElem.innerText = `Steg 2: Räkna ihop tiotalen (gula siffror):\n${tiotal1 * 10} ${op} ${tiotal2 * 10}`;
        }
      }
      return;
    }

    // TEXTFRÅGA / FALLBACK
    if (this.titleElem) this.titleElem.innerText = 'Hjälp';
    if (this.verticalElem) this.verticalElem.style.display = 'none';
    if (this.instructionsElem) {
      this.instructionsElem.innerText = q.explanation || q.text || 'Läs frågan noggrant och använd kladdblocket om du vill rita!';
    }
  }
}