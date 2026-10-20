/**
 * HelpModal.js
 * Pedagogisk hjälpruta i tre delsteg:
 * Sida 1: Uppställning med färgkodade sifferrutor (ental/tiotal/hundratal)
 * Sida 2: Strategi & Delstegsberäkning ("Slå ihop kända tal först")
 * Sida 3: Visuell Flera-stegs-tallinje (visar kända hopp och okänd "lucka")
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
    const terms = parsed.terms;
    const operator = q.operator || '+';

    let html = `<div class="vertical-setup-grid">`;

    const maxLen = Math.max(
      ...terms.map(t => (t === '?' ? 1 : t.toString().length)),
      (parsed.target || 0).toString().length,
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

    // Svarsrad / Summa
    const targetStr = parsed.target !== null && !isNaN(parsed.target) ? parsed.target.toString() : '?';
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

  // --- SIDA 2: STRATEGI ("Slå ihop kända tal först") ---
  renderPage2Steps(q) {
    const parsed = this.parseQuestion(q);
    const { terms, missingIndex, target, knownSum, correctAnswer } = parsed;

    let instrHtml = '';
    let visualHtml = '';

    if (missingIndex !== -1 && terms.length > 2) {
      // GULD: Flerstegsräkning med okänd term (t.ex. 2 + ? + 4 = 9)
      const knownTerms = terms.filter(t => typeof t === 'number');
      const knownStr = knownTerms.join(' + ');

      instrHtml = `
        <strong>Okänd term i flerstegsräkning:</strong><br>
        Slå ihop de kända talen först för att göra uppgiften enklare!
      `;

      visualHtml = `
        <div class="help-step-box">
          <div class="step-line"><strong>Steg 1 (Kända tal):</strong> ${knownStr} = <strong>${knownSum}</strong></div>
          <div class="step-line"><strong>Steg 2 (Förenkla):</strong> <strong>${knownSum}</strong> + ? = ${target}</div>
          <div class="step-line"><strong>Steg 3 (Hitta ?):</strong> ${target} - ${knownSum} = <span class="highlight-ans">${correctAnswer}</span></div>
          <div class="step-summary">Svar: Det saknade talet är <strong>${correctAnswer}</strong></div>
        </div>
      `;
    } else if (missingIndex !== -1) {
      // SILVER: Okänd term med två tal (t.ex. ? + 5 = 11 eller 6 + ? = 11)
      const known = knownSum;
      const total = target;
      const ans = correctAnswer;

      instrHtml = `
        <strong>Okänd term (Hitta det saknade talet):</strong><br>
        Hur mycket fattas för att nå från <span class="digit-ental">${known}</span> upp till <span class="digit-tiotal">${Math.floor(total/10) || ''}</span><span class="digit-ental">${total % 10}</span>?
      `;

      visualHtml = `
        <div class="help-step-box">
          <div class="step-line"><strong>Sätt 1 (Räkna uppåt):</strong> Starta på ${known} ➔ Hoppa ${ans} ➔ Nå ${total}</div>
          <div class="step-line"><strong>Sätt 2 (Minus):</strong> ${total} - ${known} = <span class="highlight-ans">${ans}</span></div>
          <div class="step-summary">Svar: ? = <strong>${ans}</strong></div>
        </div>
      `;
    } else if (terms.length > 2) {
      // GULD: Flerstegsräkning utan okänd term (t.ex. 2 + 3 + 4 = ?)
      let stepHtml = '';
      let currentSum = terms[0];

      for (let i = 1; i < terms.length; i++) {
        const prev = currentSum;
        const next = terms[i];
        currentSum += next;
        stepHtml += `<div class="step-line">Steg ${i}: ${prev} + ${next} = <strong>${currentSum}</strong></div>`;
      }

      instrHtml = `
        <strong>Räkna i delsteg:</strong><br>
        Lägg ihop talen ett i taget från vänster till höger!
      `;

      visualHtml = `
        <div class="help-step-box">
          ${stepHtml}
          <div class="step-summary">Totalt: <strong>${currentSum}</strong></div>
        </div>
      `;
    } else {
      // BRONS: Vanlig tvåstegsräkning (t.ex. 12 + 15 = ?)
      const num1 = terms[0] || 5;
      const num2 = terms[1] || 3;
      const t1 = Math.floor(num1 / 10) * 10;
      const e1 = num1 % 10;
      const t2 = Math.floor(num2 / 10) * 10;
      const e2 = num2 % 10;
      const sumT = t1 + t2;
      const sumE = e1 + e2;
      const total = sumT + sumE;

      if (num1 >= 10 || num2 >= 10) {
        instrHtml = `
          <strong>Dela upp i tiotal och ental:</strong><br>
          Räkna tiotalen för sig och entalen för sig, sedan lägger du ihop allt.
        `;

        visualHtml = `
          <div class="help-step-box">
            <div class="step-line">1. Tiotal: ${t1} + ${t2} = <strong>${sumT}</strong></div>
            <div class="step-line">2. Ental: ${e1} + ${e2} = <strong>${sumE}</strong></div>
            <div class="step-line">3. Lägg ihop: ${sumT} + ${sumE} = <strong>${total}</strong></div>
          </div>
        `;
      } else {
        instrHtml = `
          <strong>Räkna vidare:</strong><br>
          Börja på det största talet och räkna uppåt med det andra talet.
        `;

        visualHtml = `
          <div class="help-step-box">
            <div class="step-line">Börja på <strong>${Math.max(num1, num2)}</strong></div>
            <div class="step-line">Lägg till <strong>${Math.min(num1, num2)}</strong> enstaka steg.</div>
            <div class="step-summary">Svar = <strong>${num1 + num2}</strong></div>
          </div>
        `;
      }
    }

    if (this.instructionsEl) this.instructionsEl.innerHTML = instrHtml;
    if (this.visualEl) this.visualEl.innerHTML = visualHtml;
  }

  // --- SIDA 3: TALLINJE (Visualiserar kända hopp & luckan) ---
  renderPage3NumberLine(q) {
    const parsed = this.parseQuestion(q);
    const { terms, missingIndex, target, knownSum, correctAnswer } = parsed;

    const svgWidth = 440;
    const svgHeight = 130;
    const lineY = 80;
    const margin = 35;
    const usableWidth = svgWidth - margin * 2;

    let startVal = 0;
    let endVal = target;

    if (missingIndex === -1 && terms.length === 2) {
      startVal = typeof terms[0] === 'number' ? terms[0] : 0;
      endVal = target;
    }

    const minVal = startVal === 0 ? 0 : Math.max(0, startVal - 2);
    const maxVal = Math.max(endVal + 2, 10);
    const range = Math.max(1, maxVal - minVal);

    const getX = (val) => margin + ((val - minVal) / range) * usableWidth;

    if (this.instructionsEl) {
      if (missingIndex !== -1 && terms.length > 2) {
        this.instructionsEl.innerHTML = `
          <strong>Tallinje:</strong><br>
          Kända tal ger ett hopp till <span style="color:#2563eb; font-weight:bold;">${knownSum}</span>. Hur lång är "luckan" fram till <span style="color:#16a34a; font-weight:bold;">${target}</span>?
        `;
      } else {
        this.instructionsEl.innerHTML = `
          <strong>Tallinje:</strong><br>
          Starta vid <span style="color:#2563eb; font-weight:bold;">${startVal}</span> och hoppa framåt till <span style="color:#16a34a; font-weight:bold;">${endVal}</span>.
        `;
      }
    }

    let ticksSvg = '';
    const step = range > 30 ? 5 : 1;

    for (let v = minVal; v <= maxVal; v += step) {
      const x = getX(v);
      const isKey = (missingIndex !== -1 && terms.length > 2) 
        ? (v === 0 || v === knownSum || v === target)
        : (v === startVal || v === endVal);

      ticksSvg += `
        <line x1="${x}" y1="${lineY - 6}" x2="${x}" y2="${lineY + 6}" stroke="${isKey ? '#1e293b' : '#94a3b8'}" stroke-width="${isKey ? 2.5 : 1.5}" />
        <text x="${x}" y="${lineY + 22}" font-size="${isKey ? '13' : '11'}" font-weight="${isKey ? 'bold' : 'normal'}" fill="${isKey ? '#1e3a8a' : '#64748b'}" text-anchor="middle">${v}</text>
      `;
    }

    let arcsSvg = '';

    if (missingIndex !== -1 && terms.length > 2) {
      // GULD OKÄND TERM: Två bågar (Kända summan -> Luckan)
      const x0 = getX(0);
      const xk = getX(knownSum);
      const xt = getX(target);

      // Båge 1: Kända tal
      const mid1 = (x0 + xk) / 2;
      const arcH1 = Math.min(35, Math.abs(xk - x0) * 0.35);
      const ctrlY1 = lineY - arcH1 - 10;
      arcsSvg += `
        <path d="M ${x0} ${lineY - 6} Q ${mid1} ${ctrlY1} ${xk} ${lineY - 6}" fill="none" stroke="#2563eb" stroke-width="3" />
        <text x="${mid1}" y="${ctrlY1 - 3}" font-size="12" font-weight="bold" fill="#2563eb" text-anchor="middle">Kända = ${knownSum}</text>
        <circle cx="${xk}" cy="${lineY}" r="4" fill="#2563eb" />
      `;

      // Båge 2: Saknade luckan (?)
      const mid2 = (xk + xt) / 2;
      const arcH2 = Math.min(35, Math.abs(xt - xk) * 0.45);
      const ctrlY2 = lineY - arcH2 - 10;
      arcsSvg += `
        <path d="M ${xk} ${lineY - 6} Q ${mid2} ${ctrlY2} ${xt} ${lineY - 6}" fill="none" stroke="#9333ea" stroke-width="3" stroke-dasharray="4,2" />
        <polygon points="${xt},${lineY - 6} ${xt - 6},${lineY - 14} ${xt + 2},${lineY - 14}" fill="#9333ea" />
        <text x="${mid2}" y="${ctrlY2 - 3}" font-size="13" font-weight="bold" fill="#9333ea" text-anchor="middle">? = ${correctAnswer}</text>
        <circle cx="${xt}" cy="${lineY}" r="5" fill="#16a34a" />
      `;
    } else if (terms.length > 2 && missingIndex === -1) {
      // GULD VANLIG: Sekventiella bågar för varje term
      let curr = 0;
      const colors = ['#2563eb', '#d97706', '#16a34a', '#9333ea'];

      terms.forEach((term, idx) => {
        if (typeof term === 'number') {
          const nxt = curr + term;
          const x1 = getX(curr);
          const x2 = getX(nxt);
          const mid = (x1 + x2) / 2;
          const arcH = Math.min(30, Math.abs(x2 - x1) * 0.4);
          const ctrlY = lineY - arcH - 10;
          const col = colors[idx % colors.length];

          arcsSvg += `
            <path d="M ${x1} ${lineY - 6} Q ${mid} ${ctrlY} ${x2} ${lineY - 6}" fill="none" stroke="${col}" stroke-width="2.5" />
            <polygon points="${x2},${lineY - 6} ${x2 - 5},${lineY - 12} ${x2 + 2},${lineY - 12}" fill="${col}" />
            <text x="${mid}" y="${ctrlY - 3}" font-size="12" font-weight="bold" fill="${col}" text-anchor="middle">+${term}</text>
          `;
          curr = nxt;
        }
      });
    } else {
      // STANDARD 2-TERMER (Brons / Silver)
      const x1 = getX(startVal);
      const x2 = getX(endVal);
      const mid = (x1 + x2) / 2;
      const arcH = Math.min(40, Math.abs(x2 - x1) * 0.35);
      const ctrlY = lineY - arcH - 12;
      const label = missingIndex !== -1 ? `? = ${correctAnswer}` : `+${endVal - startVal}`;

      arcsSvg += `
        <path d="M ${x1} ${lineY - 6} Q ${mid} ${ctrlY} ${x2} ${lineY - 6}" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="${missingIndex !== -1 ? '4,2' : 'none'}" />
        <polygon points="${x2},${lineY - 6} ${x2 - 6},${lineY - 14} ${x2 + 2},${lineY - 14}" fill="#2563eb" />
        <text x="${mid}" y="${ctrlY - 4}" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">${label}</text>
        <circle cx="${x1}" cy="${lineY}" r="5" fill="#2563eb" />
        <circle cx="${x2}" cy="${lineY}" r="5" fill="#16a34a" />
      `;
    }

    if (this.visualEl) {
      this.visualEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; display:block; margin:auto;">
          <line x1="${margin - 10}" y1="${lineY}" x2="${svgWidth - margin + 10}" y2="${lineY}" stroke="#475569" stroke-width="3" />
          ${ticksSvg}
          ${arcsSvg}
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
      return { terms: [5, 3], missingIndex: -1, target: 8, knownSum: 8, correctAnswer: '8' };
    }

    const num1 = q.num1;
    const num2 = q.num2;
    const isCustomFormat = q.isCustomFormat;
    const correctAnswer = (q.correctAnswer !== undefined && q.correctAnswer !== null) ? q.correctAnswer.toString() : '';
    const text = q.text || '';

    if (num1 !== undefined && num2 !== undefined && !isCustomFormat) {
      const n1 = this.safeInt(num1, 5);
      const n2 = this.safeInt(num2, 3);
      const ans = this.safeInt(correctAnswer, n1 + n2);
      return {
        terms: [n1, n2],
        missingIndex: -1,
        target: ans,
        knownSum: n1 + n2,
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
    const rawTokens = leftPart.split('+').map(t => t.trim());

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

    const knownSum = terms.reduce((acc, t) => (typeof t === 'number' ? acc + t : acc), 0);

    if (target === null) {
      if (missingIndex !== -1 && correctAnswer) {
        target = knownSum + this.safeInt(correctAnswer, 0);
      } else {
        target = correctAnswer ? this.safeInt(correctAnswer, knownSum) : knownSum;
      }
    }

    let ansStr = correctAnswer;
    if (!ansStr) {
      if (missingIndex !== -1) {
        ansStr = (target - knownSum).toString();
      } else {
        ansStr = knownSum.toString();
      }
    }

    return {
      terms,
      missingIndex,
      target,
      knownSum,
      correctAnswer: ansStr
    };
  }
}