/**
 * HelpModal.js
 * Hanterar hjälpfönstret med färgkodad uppställning, baklänges multiplikation och flerstegsnavigering.
 */
export class HelpModal {
  constructor() {
    this.helpModal = document.getElementById('help-modal');
    this.btnHelp = document.getElementById('btn-help');
    this.btnCloseHelp = document.getElementById('btn-close-help');

    this.btnNavPrev = document.getElementById('btn-help-prev');
    this.btnNavNext = document.getElementById('btn-help-next');
    this.pageIndicator = document.getElementById('help-page-indicator');

    this.currentQuestion = null;
    this.currentPage = 1;
    this.maxPages = 2;

    this.initEventListeners();
  }

  initEventListeners() {
    if (this.btnHelp) {
      this.btnHelp.onclick = () => {
        this.currentPage = 1;
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

    if (this.btnNavPrev) {
      this.btnNavPrev.onclick = () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderHelpModal();
        }
      };
    }

    if (this.btnNavNext) {
      this.btnNavNext.onclick = () => {
        if (this.currentPage < this.maxPages) {
          this.currentPage++;
          this.renderHelpModal();
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
    this.currentPage = 1;
  }

  renderHelpModal() {
    if (!this.currentQuestion) return;

    const { num1, num2, operator, isTextProblem, isMultiStep, step1, step2 } = this.currentQuestion;
    const titleElem = document.getElementById('help-modal-title');

    // Uppdatera sidindikator och knappars synlighet
    if (this.pageIndicator) {
      this.pageIndicator.innerText = `Sida ${this.currentPage} av ${this.maxPages}`;
    }
    if (this.btnNavPrev) {
      this.btnNavPrev.style.visibility = this.currentPage > 1 ? 'visible' : 'hidden';
    }
    if (this.btnNavNext) {
      this.btnNavNext.style.visibility = this.currentPage < this.maxPages ? 'visible' : 'hidden';
    }

    const setupContainer = document.getElementById('vertical-setup');
    const instructionsContainer = document.getElementById('help-instructions');

    // --- SIDA 1: HUVUDSTRATEGI ---
    if (this.currentPage === 1) {
      if (isTextProblem && isMultiStep) {
        if (titleElem) titleElem.innerText = 'Hjälp: Flerstegsuträkning (Steg 1)';

        if (setupContainer) {
          setupContainer.innerHTML = `
            <div class="repeated-addition-box">Steg 1: Räkna första delen</div>
          `;
        }

        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Det här problemet har två steg!</strong></p>
            <p style="margin-top: 8px;"><strong>Första steget:</strong> ${step1}</p>
            <p style="margin-top: 10px; color: #0284c7;"><em>Klicka på pilen till höger (→) för att se Steg 2!</em></p>
          `;
        }

      } else if (operator === '÷') {
        if (titleElem) titleElem.innerText = 'Hjälp med division (Sida 1)';

        if (setupContainer) {
          setupContainer.innerHTML = `
            <div class="repeated-addition-box">? × ${num2} = ${num1}</div>
          `;
        }

        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Tänk multiplikation baklänges:</strong></p>
            <p style="margin-top: 6px;"><strong>${num1} ÷ ${num2}</strong> betyder: <em>"Hur många gånger får <strong>${num2}</strong> plats i <strong>${num1}</strong>?"</em></p>
            <p style="margin-top: 6px;">Vilket tal ska du multiplicera med <strong>${num2}</strong> för att få <strong>${num1}</strong>?</p>
          `;
        }

      } else if (operator === '×') {
        if (titleElem) titleElem.innerText = 'Hjälp med multiplikation (Sida 1)';

        const count = num1;
        const value = num2;
        const additionArray = Array(Math.min(count, 10)).fill(value);
        const additionString = additionArray.join(' + ');

        if (setupContainer) {
          setupContainer.innerHTML = `
            <div class="repeated-addition-box">${additionString}</div>
          `;
        }

        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Upprepad addition:</strong></p>
            <p style="margin-top: 6px;"><strong>${num1} × ${num2}</strong> betyder att du har <strong>${num1} grupper</strong> med <strong>${num2}</strong> i varje grupp.</p>
            <p style="margin-top: 6px;">Addera <strong>${value}</strong> med sig självt <strong>${count} gånger</strong>.</p>
          `;
        }

      } else {
        // Addition / Subtraktion
        if (titleElem) titleElem.innerText = 'Hjälp med uppställning (Sida 1)';

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
        gridHTML += '</div><div class="setup-line"></div></div>';

        let instructionsHTML = '<p><strong>Så här ställer du upp:</strong></p><ol class="instructions-list">';
        if (maxLen >= 1) {
          instructionsHTML += `<li>Börja alltid med <strong>entalen (blå)</strong> längst till höger.</li>`;
        }
        if (maxLen >= 2) {
          instructionsHTML += `<li>Räkna sedan <strong>tiotalen (röd)</strong>.</li>`;
        }
        if (maxLen >= 3) {
          instructionsHTML += `<li>Räkna sist <strong>hundratalen (grön)</strong>.</li>`;
        }
        instructionsHTML += '</ol>';

        if (setupContainer) setupContainer.innerHTML = gridHTML;
        if (instructionsContainer) instructionsContainer.innerHTML = instructionsHTML;
      }
    }

    // --- SIDA 2: ALTERNATIV FÖRKLARING ---
    if (this.currentPage === 2) {
      if (isTextProblem && isMultiStep) {
        if (titleElem) titleElem.innerText = 'Hjälp: Flerstegsuträkning (Steg 2)';

        if (setupContainer) {
          setupContainer.innerHTML = `
            <div class="repeated-addition-box">Steg 2: Slutgiltigt svar</div>
          `;
        }

        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Andra steget:</strong></p>
            <p style="margin-top: 8px;">${step2}</p>
            <p style="margin-top: 12px; font-weight: bold; color: #166534;">Skriv in svaret i kalkylatorn när du är klar!</p>
          `;
        }

      } else if (operator === '÷') {
        if (titleElem) titleElem.innerText = 'Alternativt sätt: Gruppering (Sida 2)';

        if (setupContainer) {
          setupContainer.innerHTML = `
            <div class="repeated-addition-box">${num2} + ${num2} + ${num2} ... = ${num1}</div>
          `;
        }

        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Räkna med hopp/upprepad addition:</strong></p>
            <p style="margin-top: 6px;">Börja på 0 och hoppa med <strong>${num2}</strong> i taget tills du når <strong>${num1}</strong>.</p>
            <p style="margin-top: 6px;">Räkna hur många hoppa du behövde göra. Det antalet är svaret!</p>
          `;
        }

      } else if (operator === '×') {
        if (titleElem) titleElem.innerText = 'Alternativt sätt: Dela upp i tiotal (Sida 2)';

        if (setupContainer) {
          setupContainer.innerHTML = `
            <div class="repeated-addition-box">${num1} × ${num2}</div>
          `;
        }

        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Räkna i steg:</strong></p>
            <p style="margin-top: 6px;">Du kan byta plats på talen om det är lättare: <strong>${num1} × ${num2}</strong> är samma sak som <strong>${num2} × ${num1}</strong>.</p>
            <p style="margin-top: 6px;">Dubbelkolla gärna svaret på skissrutan!</p>
          `;
        }

      } else {
        // Addition / Subtraktion
        if (titleElem) titleElem.innerText = 'Alternativt sätt: Tiotalsuppdelning (Sida 2)';

        const t1 = Math.floor(num1 / 10) * 10;
        const e1 = num1 % 10;
        const t2 = Math.floor(num2 / 10) * 10;
        const e2 = num2 % 10;

        if (setupContainer) {
          setupContainer.innerHTML = `
            <div class="repeated-addition-box">${num1} ${operator} ${num2}</div>
          `;
        }

        let altText = '';
        if (operator === '+') {
          altText = `
            <p><strong>Dela upp i tiotal och ental:</strong></p>
            <ul class="instructions-list">
              <li>Addera tiotalen först: <strong>${t1} + ${t2} = ${t1 + t2}</strong></li>
              <li>Addera entalen sedan: <strong>${e1} + ${e2} = ${e1 + e2}</strong></li>
              <li>Slå ihop allt: <strong>${t1 + t2} + ${e1 + e2} = ${num1 + num2}</strong></li>
            </ul>
          `;
        } else {
          altText = `
            <p><strong>Räkna bakåt i tiotal:</strong></p>
            <ul class="instructions-list">
              <li>Ta bort tiotalen först: <strong>${num1} - ${t2} = ${num1 - t2}</strong></li>
              <li>Ta bort entalen sedan: <strong>${num1 - t2} - ${e2} = ${num1 - num2}</strong></li>
            </ul>
          `;
        }

        if (instructionsContainer) instructionsContainer.innerHTML = altText;
      }
    }
  }
}