/**
 * HelpModal.js
 * Hanterar hjälpfönstret med färgkodad uppställning och upprepad addition.
 */
export class HelpModal {
  constructor() {
    this.helpModal = document.getElementById('help-modal');
    this.btnHelp = document.getElementById('btn-help');
    this.btnCloseHelp = document.getElementById('btn-close-help');

    this.currentQuestion = null;

    this.initEventListeners();
  }

  initEventListeners() {
    if (this.btnHelp) {
      this.btnHelp.onclick = () => {
        this.renderHelpModal();
        if (this.helpModal) {
          this.helpModal.classList.remove('hidden');
        }
      };
    }

    if (this.btnCloseHelp) {
      this.btnCloseHelp.onclick = () => {
        if (this.helpModal) {
          this.helpModal.classList.add('hidden');
        }
      };
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.helpModal && !this.helpModal.classList.contains('hidden')) {
        this.helpModal.classList.add('hidden');
      }
    });
  }

  setCurrentQuestion(question) {
    this.currentQuestion = question;
  }

  renderHelpModal() {
    if (!this.currentQuestion) return;

    const { num1, num2, operator } = this.currentQuestion;
    const titleElem = document.getElementById('help-modal-title');

    if (operator === '×') {
      if (titleElem) titleElem.innerText = 'Hjälp med multiplikation';

      const count = num1;
      const value = num2;
      const additionArray = Array(count).fill(value);
      const additionString = additionArray.join(' + ');

      const setupContainer = document.getElementById('vertical-setup');
      if (setupContainer) {
        setupContainer.innerHTML = `
          <div class="repeated-addition-box">${additionString}</div>
        `;
      }

      const instructionsContainer = document.getElementById('help-instructions');
      if (instructionsContainer) {
        instructionsContainer.innerHTML = `
          <p><strong>Så här kan du tänka:</strong></p>
          <p style="margin-top: 6px;"><strong>${num1} × ${num2}</strong> betyder att du har <strong>${num1} grupper</strong> med <strong>${num2}</strong> i varje grupp.</p>
          <p style="margin-top: 6px;">Du kan räkna det genom att addera <strong>${value}</strong> med sig självt <strong>${count} gånger</strong>.</p>
        `;
      }

    } else {
      if (titleElem) titleElem.innerText = 'Hjälp med uppställning';

      const num1Str = num1.toString();
      const num2Str = num2.toString();
      const maxLen = Math.max(num1Str.length, num2Str.length);

      const pad1 = num1Str.padStart(maxLen, ' ');
      const pad2 = num2Str.padStart(maxLen, ' ');

      const allCols = ['Hundratal', 'Tiotal', 'Ental'];
      const activeCols = allCols.slice(allCols.length - maxLen);

      let gridHTML = '<div class="setup-grid">';
      
      gridHTML += '<div class="grid-row"><div class="cell op-cell"></div>';
      activeCols.forEach(col => {
        gridHTML += `<div class="cell col-header col-${col.toLowerCase()}">${col}</div>`;
      });
      gridHTML += '</div>';

      gridHTML += '<div class="grid-row"><div class="cell op-cell"></div>';
      for (let i = 0; i < maxLen; i++) {
        const digit = pad1[i] === ' ' ? '' : pad1[i];
        const colClass = `col-${activeCols[i].toLowerCase()}`;
        gridHTML += `<div class="cell ${colClass}">${digit}</div>`;
      }
      gridHTML += '</div>';

      gridHTML += `<div class="grid-row"><div class="cell op-cell">${operator}</div>`;
      for (let i = 0; i < maxLen; i++) {
        const digit = pad2[i] === ' ' ? '' : pad2[i];
        const colClass = `col-${activeCols[i].toLowerCase()}`;
        gridHTML += `<div class="cell ${colClass}">${digit}</div>`;
      }
      gridHTML += '</div>';

      gridHTML += '<div class="setup-line"></div>';
      gridHTML += '</div>';

      let instructionsHTML = '<p><strong>Så här ställer du upp och räknar:</strong></p><ol class="instructions-list">';
      
      if (operator === '+') {
        if (maxLen >= 1) {
          const e1 = parseInt(pad1[maxLen - 1] || '0', 10);
          const e2 = parseInt(pad2[maxLen - 1] || '0', 10);
          instructionsHTML += `<li>Börja med entalen till höger (blå): <strong>${e1} + ${e2}</strong></li>`;
        }
        if (maxLen >= 2) {
          const t1 = parseInt(pad1[maxLen - 2] || '0', 10);
          const t2 = parseInt(pad2[maxLen - 2] || '0', 10);
          instructionsHTML += `<li>Räkna sedan tiotalen (röd): <strong>${t1} + ${t2}</strong></li>`;
        }
        if (maxLen >= 3) {
          const h1 = parseInt(pad1[maxLen - 3] || '0', 10);
          const h2 = parseInt(pad2[maxLen - 3] || '0', 10);
          instructionsHTML += `<li>Räkna sist hundratalen (grön): <strong>${h1} + ${h2}</strong></li>`;
        }
      } else {
        if (maxLen >= 1) {
          const e1 = parseInt(pad1[maxLen - 1] || '0', 10);
          const e2 = parseInt(pad2[maxLen - 1] || '0', 10);
          instructionsHTML += `<li>Börja med entalen till höger (blå): <strong>${e1} - ${e2}</strong></li>`;
        }
        if (maxLen >= 2) {
          const t1 = parseInt(pad1[maxLen - 2] || '0', 10);
          const t2 = parseInt(pad2[maxLen - 2] || '0', 10);
          instructionsHTML += `<li>Räkna sedan tiotalen (röd): <strong>${t1} - ${t2}</strong></li>`;
        }
        if (maxLen >= 3) {
          const h1 = parseInt(pad1[maxLen - 3] || '0', 10);
          const h2 = parseInt(pad2[maxLen - 3] || '0', 10);
          instructionsHTML += `<li>Räkna sist hundratalen (grön): <strong>${h1} - ${h2}</strong></li>`;
        }
      }
      instructionsHTML += '</ol>';

      const setupContainer = document.getElementById('vertical-setup');
      if (setupContainer) setupContainer.innerHTML = gridHTML;

      const instructionsContainer = document.getElementById('help-instructions');
      if (instructionsContainer) instructionsContainer.innerHTML = instructionsHTML;
    }
  }
}