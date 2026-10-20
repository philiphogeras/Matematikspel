/**
 * HelpModal.js
 * Hanterar hjälpfönstret med pedagogisk, färgkodad uppställning och steg för steg-stöd.
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

    if (this.currentQuestion.isGeometry || this.currentQuestion.isTextProblem) {
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

  formatColoredNumber(num) {
    if (num === undefined || num === null) return '';
    const str = num.toString();
    const len = str.length;
    const posClasses = ['digit-ental', 'digit-tiotal', 'digit-hundratal'];

    let html = '';
    for (let i = 0; i < len; i++) {
      const digit = str[i];
      const posIndex = len - 1 - i;
      const cls = posClasses[posIndex] || 'digit-ental';
      html += `<span class="${cls}">${digit}</span>`;
    }
    return html;
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

    // TEXTFRÅGOR / PROBLEMLÖSNING
    if (q.isTextProblem) {
      if (this.titleElem) this.titleElem.innerText = 'Hjälp med textuppgift';
      if (this.verticalElem) this.verticalElem.style.display = 'none';
      if (this.instructionsElem) {
        this.instructionsElem.innerHTML = `
          <div style="font-size: 1.1rem; line-height: 1.5; text-align: left;">
            <p style="margin-bottom: 10px;"><strong>Läs uppgiften steg för steg:</strong></p>
            <p style="background: #f1f5f9; padding: 10px; border-radius: 8px; margin-bottom: 10px;">${q.text.replace(/\n/g, '<br>')}</p>
            <p style="color: #2563eb; font-weight: 700;">Uträkning: ${q.explanation || ''}</p>
          </div>
        `;
      }
      return;
    }

    // ARITMETIKHJÄLP (Sifferfrågor med färgkodad uppställning)
    if (q.num1 !== undefined && q.num2 !== undefined) {
      if (this.titleElem) this.titleElem.innerText = 'Hjälp med uträkning';
      if (this.verticalElem) this.verticalElem.style.display = 'flex';

      const op = q.operator || '+';
      const n1Formatted = this.formatColoredNumber(q.num1);
      const n2Formatted = this.formatColoredNumber(q.num2);

      if (this.verticalElem) {
        this.verticalElem.innerHTML = `
          <div class="vertical-row">&nbsp;${n1Formatted}</div>
          <div class="vertical-row border-bottom"><span class="op-symbol">${op}</span>${n2Formatted}</div>
        `;
      }

      if (this.instructionsElem) {
        if (this.currentPage === 1) {
          const ental1 = q.num1 % 10;
          const ental2 = q.num2 % 10;
          this.instructionsElem.innerHTML = `
            <div style="text-align: center;">
              <p style="font-weight: 700; margin-bottom: 6px;">Steg 1: Räkna ihop entalen (<span class="digit-ental">blå siffror</span>)</p>
              <p style="font-size: 1.4rem; font-weight: 700;"><span class="digit-ental">${ental1}</span> ${op} <span class="digit-ental">${ental2}</span></p>
            </div>
          `;
        } else {
          const tiotal1 = Math.floor(q.num1 / 10);
          const tiotal2 = Math.floor(q.num2 / 10);
          this.instructionsElem.innerHTML = `
            <div style="text-align: center;">
              <p style="font-weight: 700; margin-bottom: 6px;">Steg 2: Räkna ihop tiotalen (<span class="digit-tiotal">gula/orange siffror</span>)</p>
              <p style="font-size: 1.4rem; font-weight: 700;"><span class="digit-tiotal">${tiotal1 * 10}</span> ${op} <span class="digit-tiotal">${tiotal2 * 10}</span></p>
            </div>
          `;
        }
      }
    }
  }
}