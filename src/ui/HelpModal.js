/**
 * HelpModal.js
 * Pedagogisk hjälpruta för alla fyra räknesätt (+, –, ×, ÷):
 * Sida 1: Uppställning i färgkodade rutor
 * Sida 2: Strategi & Delsteg (anpassad efter räknesätt)
 * Sida 3: Visuell Tallinje / Gruppering
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

    if (this.currentPage === 1) {
      this.renderPage1VerticalSetup(q);
    } else if (this.currentPage === 2) {
      this.renderPage2Steps(q);
    } else if (this.currentPage === 3) {
      this.renderPage3NumberLine(q);
    }
  }

  // --- SIDA 1: UPPTÄLLNING I FÄRGKODADE RUTOR ---
  renderPage1VerticalSetup(q) {
    if (this.instructionsEl) {
      this.instructionsEl.innerHTML = `
        <strong>Uppställning:</strong><br>
        Sätt talen under varandra. Räkna från höger till vänster:<br>
        <span style="color:#2563eb; font-weight:bold;">Blå = Ental</span> | 
        <span style="color:#d97706; font-weight:bold;">Orange = Tiotal</span> | 
        <span style="color:#16a34a; font-weight:bold;">Grön = Hundratal</span>
      `;
    }

    const parsed = this.parseQuestion(q);
    const { terms, operator, target } = parsed;

    let html = `<div class="vertical-setup-grid">`;

    const maxLen = Math.max(
      ...terms.map(t => (t === '?' ? 1 : t.toString().length)),
      (target || 0).toString().length,
      2
    );

    terms.forEach((term, index) => {
      const isLast = index === terms.length - 1;
      const str = term.toString();
      const padded = str.padStart(maxLen, ' ');

      html += `<div class="vertical-grid-row ${isLast ? 'border-bottom' : ''}">`;
      html += `<span class="op-symbol">${isLast ? operator : ''}</span>`;

      for (let i = 0; i < maxLen; i++) {
        const char = padded[i];
        if (char === ' ') {
          html += `<div class="grid-cell empty"></div>`;
        } else if (char === '?') {
          html += `<div class="grid-cell cell-unknown">?</div>`;
        } else {
          const posIdx = maxLen - 1 - i;
          const cls = posIdx === 0 ? 'cell-ental' : posIdx === 1 ? 'cell-tiotal' : 'cell-hundratal';
          html += `<div class="grid-cell ${cls}">${char}</div>`;
        }
      }
      html += `</div>`;
    });

    const targetStr = target !== null && !isNaN(target) ? target.toString() : '?';
    const paddedTarget = targetStr.padStart(maxLen, ' ');

    html += `<div class="vertical-grid-row result-row">`;
    html += `<span class="op-symbol">=</span>`;
    for (let i = 0; i < maxLen; i++) {
      const char = paddedTarget[i];
      if (char === ' ') {
        html += `<div class="grid-cell empty"></div>`;
      } else if (char === '?') {
        html += `<div class="grid-cell cell-unknown">?</div>`;
      } else {
        const posIdx = maxLen - 1 - i;
        const cls = posIdx === 0 ? 'cell-ental' : posIdx === 1 ? 'cell-tiotal' : 'cell-hundratal';
        html += `<div class="grid-cell ${cls}">${char}</div>`;
      }
    }
    html += `</div></div>`;

    if (this.visualEl) {
      this.visualEl.innerHTML = html;
    }
  }

  // --- SIDA 2: STRATEGI & DELSTEGSBERÄKNING ---
  renderPage2Steps(q) {
    const parsed = this.parseQuestion(q);
    const { terms, operator, missingIndex, target, correctAnswer } = parsed;

    let instrHtml = '';
    let visualHtml = '';

    if (operator === '–') {
      // SUBTRAKTION
      if (missingIndex === 0) { // ? - b = c -> ? = c + b
        const b = terms[1];
        instrHtml = `<strong>Okänd start (Subtraktion):</strong><br>När det första talet saknas lägger du ihop svar och del:`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">Räkna baklänges med plus: ${target} + ${b} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: Det saknade talet är <strong>${correctAnswer}</strong></div>
        </div>`;
      } else if (missingIndex === 1) { // a - ? = c -> ? = a - c
        const a = terms[0];
        instrHtml = `<strong>Okänd del (Subtraktion):</strong><br>Ta bort svaret från starttalet:`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">Dra bort svaret: ${a} – ${target} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: ? = <strong>${correctAnswer}</strong></div>
        </div>`;
      } else {
        instrHtml = `<strong>Minska i delsteg:</strong><br>Ta bort tiotal först, sedan ental:`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">Starta på <strong>${terms[0]}</strong> och ta bort <strong>${terms[1]}</strong></div>
          <div class="step-summary">Kvar = <strong>${correctAnswer}</strong></div>
        </div>`;
      }
    } else if (operator === '×') {
      // MULTIPLIKATION
      if (missingIndex !== -1) {
        const known = terms.find(t => typeof t === 'number') || 2;
        instrHtml = `<strong>Okänd faktor (Multiplikation):</strong><br>Använd division för att hitta det saknade talet:`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">Dela produkten med den kända faktorn: ${target} ÷ ${known} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: ? = <strong>${correctAnswer}</strong></div>
        </div>`;
      } else {
        instrHtml = `<strong>Upprepad addition:</strong><br>Multiplikation innebär att lägga ihop lika stora grupper:`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">${terms[0]} × ${terms[1]} betyder ${terms[0]} grupper med ${terms[1]} i varje.</div>
          <div class="step-summary">Totalt = <strong>${correctAnswer}</strong></div>
        </div>`;
      }
    } else if (operator === '÷') {
      // DIVISION
      if (missingIndex === 0) { // ? ÷ b = c -> ? = b * c
        const b = terms[1];
        instrHtml = `<strong>Okänd täljare (Division):</strong><br>Multiplicera nämnare och svar för att få det ursprungliga talet:`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">Gångra ihop: ${b} × ${target} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: ? = <strong>${correctAnswer}</strong></div>
        </div>`;
      } else if (missingIndex === 1) { // a ÷ ? = c -> ? = a / c
        const a = terms[0];
        instrHtml = `<strong>Okänd nämnare (Division):</strong><br>Dela starttalet med svaret:`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">Dela: ${a} ÷ ${target} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: ? = <strong>${correctAnswer}</strong></div>
        </div>`;
      } else {
        instrHtml = `<strong>Dela lika:</strong><br>Hur många får varje grupp när du delar ${terms[0]} på ${terms[1]}?`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line">Dela ${terms[0]} i ${terms[1]} lika stora delar.</div>
          <div class="step-summary">Varje del blir <strong>${correctAnswer}</strong></div>
        </div>`;
      }
    } else {
      // ADDITION (Standard)
      if (missingIndex !== -1 && terms.length > 2) {
        const knownTerms = terms.filter(t => typeof t === 'number');
        const knownStr = knownTerms.join(' + ');
        const knownSum = knownTerms.reduce((a, b) => a + b, 0);

        instrHtml = `<strong>Okänd term i flerstegsräkning:</strong><br>Slå ihop de kända talen först!`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line"><strong>Steg 1 (Kända tal):</strong> ${knownStr} = <strong>${knownSum}</strong></div>
          <div class="step-line"><strong>Steg 2 (Förenkla):</strong> <strong>${knownSum}</strong> + ? = ${target}</div>
          <div class="step-line"><strong>Steg 3 (Hitta ?):</strong> ${target} - ${knownSum} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: Det saknade talet är <strong>${correctAnswer}</strong></div>
        </div>`;
      } else if (missingIndex !== -1) {
        const known = terms.find(t => typeof t === 'number') || 0;
        instrHtml = `<strong>Okänd term (Hitta det saknade talet):</strong><br>Hur mycket fattas upp till ${target}?`;
        visualHtml = `<div class="help-step-box">
          <div class="step-line"><strong>Sätt 1:</strong> Starta på ${known} ➔ Hoppa till ${target} (+${correctAnswer}).</div>
          <div class="step-line"><strong>Sätt 2:</strong> ${target} - ${known} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: ? = <strong>${correctAnswer}</strong></div>
        </div>`;
      } else {
        let stepHtml = '';
        let currentSum = terms[0] || 0;
        for (let i = 1; i < terms.length; i++) {
          const prev = currentSum;
          const next = terms[i];
          currentSum += next;
          stepHtml += `<div class="step-line">Steg ${i}: ${prev} + ${next} = <strong>${currentSum}</strong></div>`;
        }

        instrHtml = `<strong>Räkna i delsteg:</strong><br>Lägg ihop talen ett i taget från vänster till höger!`;
        visualHtml = `<div class="help-step-box">
          ${stepHtml}
          <div class="step-summary">Totalt: <strong>${currentSum}</strong></div>
        </div>`;
      }
    }

    if (this.instructionsEl) this.instructionsEl.innerHTML = instrHtml;
    if (this.visualEl) this.visualEl.innerHTML = visualHtml;
  }

  // --- SIDA 3: VISUELL TALLINJE / ILLUSTRATION ---
  renderPage3NumberLine(q) {
    const parsed = this.parseQuestion(q);
    const { terms, operator, missingIndex, target, correctAnswer } = parsed;

    const svgWidth = 440;
    const svgHeight = 130;
    const lineY = 80;
    const margin = 35;
    const usableWidth = svgWidth - margin * 2;

    let startVal = 0;
    let endVal = target || 10;

    if (operator === '–') {
      startVal = terms[0] && typeof terms[0] === 'number' ? terms[0] : 10;
      endVal = target || 0;
    } else if (typeof terms[0] === 'number') {
      startVal = terms[0];
    }

    const minVal = Math.max(0, Math.min(startVal, endVal) - 2);
    const maxVal = Math.max(startVal, endVal, 10) + 2;
    const range = Math.max(1, maxVal - minVal);

    const getX = (val) => margin + ((val - minVal) / range) * usableWidth;

    if (this.instructionsEl) {
      this.instructionsEl.innerHTML = `
        <strong>Tallinje:</strong><br>
        Starta vid <span style="color:#2563eb; font-weight:bold;">${startVal}</span> och gå till <span style="color:#16a34a; font-weight:bold;">${endVal}</span>.
      `;
    }

    let ticksSvg = '';
    const step = range > 30 ? 5 : 1;

    for (let v = minVal; v <= maxVal; v += step) {
      const x = getX(v);
      const isKey = (v === startVal || v === endVal);

      ticksSvg += `
        <line x1="${x}" y1="${lineY - 6}" x2="${x}" y2="${lineY + 6}" stroke="${isKey ? '#1e293b' : '#94a3b8'}" stroke-width="${isKey ? 2.5 : 1.5}" />
        <text x="${x}" y="${lineY + 22}" font-size="${isKey ? '13' : '11'}" font-weight="${isKey ? 'bold' : 'normal'}" fill="${isKey ? '#1e3a8a' : '#64748b'}" text-anchor="middle">${v}</text>
      `;
    }

    const x1 = getX(startVal);
    const x2 = getX(endVal);
    const mid = (x1 + x2) / 2;
    const arcH = Math.min(40, Math.abs(x2 - x1) * 0.35);
    const ctrlY = lineY - arcH - 12;

    const isBackwards = x2 < x1;
    const arrowX = isBackwards ? x2 + 6 : x2 - 6;

    const arcSvg = `
      <path d="M ${x1} ${lineY - 6} Q ${mid} ${ctrlY} ${x2} ${lineY - 6}" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="${missingIndex !== -1 ? '4,2' : 'none'}" />
      <polygon points="${x2},${lineY - 6} ${arrowX},${lineY - 14} ${x2 + (isBackwards ? 8 : -2)},${lineY - 14}" fill="#2563eb" />
      <text x="${mid}" y="${ctrlY - 4}" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">${missingIndex !== -1 ? `? = ${correctAnswer}` : `${operator}${Math.abs(endVal - startVal)}`}</text>
      <circle cx="${x1}" cy="${lineY}" r="5" fill="#2563eb" />
      <circle cx="${x2}" cy="${lineY}" r="5" fill="#16a34a" />
    `;

    if (this.visualEl) {
      this.visualEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; display:block; margin:auto;">
          <line x1="${margin - 10}" y1="${lineY}" x2="${svgWidth - margin + 10}" y2="${lineY}" stroke="#475569" stroke-width="3" />
          ${ticksSvg}
          ${arcSvg}
        </svg>
      `;
    }
  }

  safeInt(val, fallback = 0) {
    if (val === null || val === undefined) return fallback;
    const res = parseInt(val, 10);
    return isNaN(res) ? fallback : res;
  }

  parseQuestion(q) {
    if (!q) {
      return { terms: [5, 3], operator: '+', missingIndex: -1, target: 8, correctAnswer: '8' };
    }

    const text = q.text || '';
    const operator = q.operator || (text.includes('–') ? '–' : text.includes('×') ? '×' : text.includes('÷') ? '÷' : '+');
    const correctAnswer = (q.correctAnswer !== undefined && q.correctAnswer !== null) ? q.correctAnswer.toString() : '';

    if (q.num1 !== undefined && q.num2 !== undefined && !q.isCustomFormat) {
      const n1 = this.safeInt(q.num1, 5);
      const n2 = this.safeInt(q.num2, 3);
      const ans = this.safeInt(correctAnswer, n1 + n2);
      return {
        terms: [n1, n2],
        operator,
        missingIndex: -1,
        target: ans,
        correctAnswer: ans.toString()
      };
    }

    const matchTarget = text.match(/=\s*(\d+|\?)/);
    let target = null;
    if (matchTarget) {
      if (matchTarget[1] !== '?') {
        target = this.safeInt(matchTarget[1], null);
      } else if (correctAnswer) {
        target = this.safeInt(correctAnswer, null);
      }
    }

    const leftPart = text.split('=')[0] || text;
    const splitRegex = /[\+–\-×\*÷\/]/;
    const rawTokens = leftPart.split(splitRegex).map(t => t.trim());

    const terms = [];
    let missingIndex = -1;

    rawTokens.forEach((token, idx) => {
      if (token.includes('?')) {
        missingIndex = idx;
        terms.push('?');
      } else {
        const m = token.match(/\d+/);
        if (m) {
          terms.push(this.safeInt(m[0], 0));
        }
      }
    });

    if (terms.length === 0) {
      terms.push(5, 3);
    }

    if (target === null) {
      target = this.safeInt(correctAnswer, 10);
    }

    return {
      terms,
      operator,
      missingIndex,
      target,
      correctAnswer
    };
  }
}