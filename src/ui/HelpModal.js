/**
 * HelpModal.js
 * Hanterar hjälpfönstret med färgkodad uppställning, pedagogisk tiotalsuppdelning
 * samt en dynamisk grafisk tallinje på Sida 3.
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
    this.maxPages = 3;

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

  /**
   * Genererar en grafisk SVG-tallinje för Sida 3.
   */
  renderNumberLineSVG(num1, num2, operator, answer) {
    const svgWidth = 580;
    const svgHeight = 110;
    const margin = 45;
    const lineY = 75;

    let minVal, maxVal, step;

    if (operator === '×') {
      minVal = 0;
      maxVal = Math.max(10, Math.ceil((answer + 2) / 5) * 5);
    } else if (operator === '÷') {
      minVal = 0;
      maxVal = Math.max(10, Math.ceil((num1 + 2) / 5) * 5);
    } else {
      const low = Math.min(num1, answer);
      const high = Math.max(num1, answer);
      const span = high - low;

      if (span <= 10) {
        minVal = Math.max(0, low - 2);
        maxVal = high + 2;
      } else {
        minVal = Math.max(0, Math.floor((low - 3) / 5) * 5);
        maxVal = Math.ceil((high + 3) / 5) * 5;
      }
    }

    const range = maxVal - minVal || 1;
    const getX = (val) => margin + ((val - minVal) / range) * (svgWidth - 2 * margin);

    // Ticks & siffror
    step = range <= 12 ? 1 : range <= 30 ? 5 : 10;
    let ticksHTML = '';
    for (let v = minVal; v <= maxVal; v += step) {
      const x = getX(v);
      ticksHTML += `
        <line x1="${x}" y1="${lineY - 6}" x2="${x}" y2="${lineY + 6}" stroke="#64748b" stroke-width="2" />
        <text x="${x}" y="${lineY + 22}" font-size="13" font-weight="bold" fill="#334155" text-anchor="middle">${v}</text>
      `;
    }

    // Rita Bågar / Hopp
    let arcsHTML = '';

    if (operator === '+' || operator === '-' || operator === '–') {
      const x1 = getX(num1);
      const x2 = getX(answer);
      const xMid = (x1 + x2) / 2;
      const arcHeight = Math.min(40, Math.abs(x2 - x1) * 0.35);
      const yTop = lineY - arcHeight;

      const sign = (operator === '+' ? '+' : '-');
      const strokeColor = operator === '+' ? '#0284c7' : '#dc2626';

      arcsHTML = `
        <path d="M ${x1} ${lineY - 8} Q ${xMid} ${yTop - 15} ${x2} ${lineY - 8}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-dasharray="4 2" />
        <circle cx="${x1}" cy="${lineY}" r="5" fill="#64748b" />
        <circle cx="${x2}" cy="${lineY}" r="6" fill="${strokeColor}" />
        <rect x="${xMid - 22}" y="${yTop - 22}" width="44" height="20" rx="6" fill="#ffffff" stroke="${strokeColor}" stroke-width="1.5" />
        <text x="${xMid}" y="${yTop - 8}" font-size="12" font-weight="bold" fill="${strokeColor}" text-anchor="middle">${sign}${num2}</text>
      `;
    } else if (operator === '×') {
      const jumpSize = num2;
      const count = num1;
      for (let i = 0; i < count; i++) {
        const vStart = i * jumpSize;
        const vEnd = (i + 1) * jumpSize;
        const x1 = getX(vStart);
        const x2 = getX(vEnd);
        const xMid = (x1 + x2) / 2;
        arcsHTML += `
          <path d="M ${x1} ${lineY - 6} Q ${xMid} ${lineY - 32} ${x2} ${lineY - 6}" fill="none" stroke="#16a34a" stroke-width="2.5" />
          <circle cx="${x2}" cy="${lineY}" r="4.5" fill="#16a34a" />
          <text x="${xMid}" y="${lineY - 36}" font-size="11" font-weight="bold" fill="#16a34a" text-anchor="middle">+${jumpSize}</text>
        `;
      }
    } else if (operator === '÷') {
      const jumpSize = num2;
      const count = answer;
      for (let i = 0; i < count; i++) {
        const vStart = num1 - i * jumpSize;
        const vEnd = num1 - (i + 1) * jumpSize;
        const x1 = getX(vStart);
        const x2 = getX(vEnd);
        const xMid = (x1 + x2) / 2;
        arcsHTML += `
          <path d="M ${x1} ${lineY - 6} Q ${xMid} ${lineY - 32} ${x2} ${lineY - 6}" fill="none" stroke="#d97706" stroke-width="2.5" />
          <circle cx="${x2}" cy="${lineY}" r="4.5" fill="#d97706" />
          <text x="${xMid}" y="${lineY - 36}" font-size="11" font-weight="bold" fill="#d97706" text-anchor="middle">-${jumpSize}</text>
        `;
      }
    }

    return `
      <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; margin-top:6px;">
        <line x1="${margin}" y1="${lineY}" x2="${svgWidth - margin}" y2="${lineY}" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
        ${ticksHTML}
        ${arcsHTML}
      </svg>
    `;
  }

  renderHelpModal() {
    if (!this.currentQuestion) return;

    const { num1, num2, operator, answer, isTextProblem, isMultiStep, step1, step2 } = this.currentQuestion;
    const titleElem = document.getElementById('help-modal-title');

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

    // ==================== SIDA 1 ====================
    if (this.currentPage === 1) {
      if (isTextProblem && isMultiStep) {
        if (titleElem) titleElem.innerText = 'Hjälp: Flerstegsuträkning (Steg 1)';
        if (setupContainer) setupContainer.innerHTML = `<div class="repeated-addition-box">Steg 1: Räkna första delen</div>`;
        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Det här problemet har två steg!</strong></p>
            <p style="margin-top: 8px;"><strong>Första steget:</strong> ${step1}</p>
            <p style="margin-top: 10px; color: #0284c7;"><em>Klicka på pilen till höger (→) för att se Steg 2!</em></p>
          `;
        }
      } else if (operator === '÷') {
        if (titleElem) titleElem.innerText = 'Hjälp med division (Sida 1)';
        if (setupContainer) setupContainer.innerHTML = `<div class="repeated-addition-box">? × ${num2} = ${num1}</div>`;
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
        if (setupContainer) setupContainer.innerHTML = `<div class="repeated-addition-box">${additionArray.join(' + ')}</div>`;
        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Upprepad addition:</strong></p>
            <p style="margin-top: 6px;"><strong>${num1} × ${num2}</strong> betyder att du har <strong>${num1} grupper</strong> med <strong>${num2}</strong> i varje grupp.</p>
            <p style="margin-top: 6px;">Addera <strong>${value}</strong> med sig självt <strong>${count} gånger</strong>.</p>
          `;
        }
      } else {
        // Addition & Subtraktion: Vertikal Uppställning
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
        if (maxLen >= 1) instructionsHTML += `<li>Börja alltid med <strong>entalen (blå)</strong> längst till höger.</li>`;
        if (maxLen >= 2) instructionsHTML += `<li>Räkna sedan <strong>tiotalen (röd)</strong>.</li>`;
        if (maxLen >= 3) instructionsHTML += `<li>Räkna sist <strong>hundratalen (grön)</strong>.</li>`;
        instructionsHTML += '</ol>';

        if (setupContainer) setupContainer.innerHTML = gridHTML;
        if (instructionsContainer) instructionsContainer.innerHTML = instructionsHTML;
      }
    }

    // ==================== SIDA 2 ====================
    if (this.currentPage === 2) {
      if (isTextProblem && isMultiStep) {
        if (titleElem) titleElem.innerText = 'Hjälp: Flerstegsuträkning (Steg 2)';
        if (setupContainer) setupContainer.innerHTML = `<div class="repeated-addition-box">Steg 2: Slutgiltigt svar</div>`;
        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Andra steget:</strong></p>
            <p style="margin-top: 8px;">${step2}</p>
            <p style="margin-top: 12px; font-weight: bold; color: #166534;">Skriv in svaret i kalkylatorn när du är klar!</p>
          `;
        }
      } else if (operator === '÷') {
        if (titleElem) titleElem.innerText = 'Alternativt sätt: Hopp/Gruppering (Sida 2)';
        if (setupContainer) setupContainer.innerHTML = `<div class="repeated-addition-box">${num2} + ${num2} + ${num2} ... = ${num1}</div>`;
        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Räkna med upprepad addition:</strong></p>
            <p style="margin-top: 6px;">Börja på 0 och lägg till <strong>${num2}</strong> i taget tills du når <strong>${num1}</strong>.</p>
            <p style="margin-top: 6px;">Räkna hur många gånger du behövde lägga till <strong>${num2}</strong>. Det antalet är svaret!</p>
          `;
        }
      } else if (operator === '×') {
        if (titleElem) titleElem.innerText = 'Alternativt sätt: Byt plats på talen (Sida 2)';
        if (setupContainer) setupContainer.innerHTML = `<div class="repeated-addition-box">${num1} × ${num2} = ${num2} × ${num1}</div>`;
        if (instructionsContainer) {
          instructionsContainer.innerHTML = `
            <p><strong>Kommutativa lagen:</strong></p>
            <p style="margin-top: 6px;">Det spelar ingen roll vilken ordning du multiplicerar!</p>
            <p style="margin-top: 6px;"><strong>${num1} × ${num2}</strong> ger exakt samma svar som <strong>${num2} × ${num1}</strong>. Välj den ordning som känns enklast att räkna i huvudet.</p>
          `;
        }
      } else {
        // Smart anpassning för Ental vs Tiotal (Addition & Subtraktion)
        if (setupContainer) setupContainer.innerHTML = `<div class="repeated-addition-box">${num1} ${operator} ${num2}</div>`;

        const isPureEntal = num1 < 10 && num2 < 10;

        if (isPureEntal) {
          if (titleElem) titleElem.innerText = 'Alternativt sätt: Stegräkning (Sida 2)';
          let steps = [];
          if (operator === '+') {
            for (let i = 1; i <= num2; i++) steps.push(num1 + i);
            if (instructionsContainer) {
              instructionsContainer.innerHTML = `
                <p><strong>Räkna vidare (Stegräkning):</strong></p>
                <p style="margin-top: 6px;">Starta på <strong>${num1}</strong> och räkna <strong>${num2}</strong> steg framåt:</p>
                <p style="margin-top: 8px; font-size: 1.2rem; font-weight: bold; color: #0284c7;">${steps.join(' → ')}</p>
              `;
            }
          } else {
            for (let i = 1; i <= num2; i++) steps.push(num1 - i);
            if (instructionsContainer) {
              instructionsContainer.innerHTML = `
                <p><strong>Räkna bakåt (Stegräkning):</strong></p>
                <p style="margin-top: 6px;">Starta på <strong>${num1}</strong> och räkna <strong>${num2}</strong> steg bakåt:</p>
                <p style="margin-top: 8px; font-size: 1.2rem; font-weight: bold; color: #dc2626;">${steps.join(' → ')}</p>
              `;
            }
          }
        } else {
          // Tal med Tiotal/Hundratal
          if (titleElem) titleElem.innerText = 'Alternativt sätt: Tiotalsuppdelning (Sida 2)';
          const t2 = Math.floor(num2 / 10) * 10;
          const e2 = num2 % 10;

          let textHTML = '<p><strong>Dela upp i tiotal och ental:</strong></p><ul class="instructions-list">';

          if (operator === '+') {
            if (t2 > 0) {
              textHTML += `<li>Lägg till tiotalen (${t2}) först: <strong>${num1} + ${t2} = ${num1 + t2}</strong></li>`;
              if (e2 > 0) {
                textHTML += `<li>Lägg till entalen (${e2}) sedan: <strong>${num1 + t2} + ${e2} = ${answer}</strong></li>`;
              } else {
                textHTML += `<li>Eftersom det är 0 ental är du färdig! Svaret är <strong>${answer}</strong>.</li>`;
              }
            } else {
              textHTML += `<li>Lägg till entalen (${num2}): <strong>${num1} + ${num2} = ${answer}</strong></li>`;
            }
          } else {
            if (t2 > 0) {
              textHTML += `<li>Ta bort tiotalen (${t2}) först: <strong>${num1} - ${t2} = ${num1 - t2}</strong></li>`;
              if (e2 > 0) {
                textHTML += `<li>Ta bort entalen (${e2}) sedan: <strong>${num1 - t2} - ${e2} = ${answer}</strong></li>`;
              } else {
                textHTML += `<li>Eftersom det är 0 ental att ta bort är du färdig! Svaret är <strong>${answer}</strong>.</li>`;
              }
            } else {
              textHTML += `<li>Ta bort entalen (${num2}): <strong>${num1} - ${num2} = ${answer}</strong></li>`;
            }
          }
          textHTML += '</ul>';

          if (instructionsContainer) instructionsContainer.innerHTML = textHTML;
        }
      }
    }

    // ==================== SIDA 3 ====================
    if (this.currentPage === 3) {
      if (titleElem) titleElem.innerText = 'Hjälp: Tallinje (Sida 3)';

      const svgHTML = this.renderNumberLineSVG(num1, num2, operator, answer);
      if (setupContainer) setupContainer.innerHTML = svgHTML;

      let lineText = '';
      if (operator === '+') {
        lineText = `<p><strong>Se uträkningen på tallinjen:</strong></p><p style="margin-top:6px;">Börja på <strong>${num1}</strong> och ta ett hopp på <strong>+${num2}</strong> framåt. Du hamnar på <strong>${answer}</strong>.</p>`;
      } else if (operator === '-' || operator === '–') {
        lineText = `<p><strong>Se uträkningen på tallinjen:</strong></p><p style="margin-top:6px;">Börja på <strong>${num1}</strong> och ta ett hopp på <strong>-${num2}</strong> bakåt. Du hamnar på <strong>${answer}</strong>.</p>`;
      } else if (operator === '×') {
        lineText = `<p><strong>Se uträkningen på tallinjen:</strong></p><p style="margin-top:6px;">Börja på <strong>0</strong> och ta <strong>${num1}</strong> lika stora hopp på <strong>+${num2}</strong> framåt. Du hamnar på <strong>${answer}</strong>.</p>`;
      } else if (operator === '÷') {
        lineText = `<p><strong>Se uträkningen på tallinjen:</strong></p><p style="margin-top:6px;">Börja på <strong>${num1}</strong> och ta hopp på <strong>-${num2}</strong> bakåt hela vägen till 0. Du behövde göra <strong>${answer}</strong> hopp!</p>`;
      }

      if (instructionsContainer) instructionsContainer.innerHTML = lineText;
    }
  }
}