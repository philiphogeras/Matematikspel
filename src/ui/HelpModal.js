/**
 * HelpModal.js
 * Pedagogisk hjälpruta i tre delsteg:
 * Sida 1: Uppställning med färgkodade sifferrutor (ental/tiotal/hundratal)
 * Sida 2: Delstegsberäkning / Alternativt räknesätt
 * Sida 3: Visuell Tallinje
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

      // Hitta eller skapa instruktionsrutan
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

      // Hitta eller skapa den visuella utritningsytan
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

    const parsed = this.parseQuestionNumbers(q);
    const numbers = parsed.numbers;
    const operator = q.operator || '+';

    let html = `<div class="vertical-setup-grid">`;

    const maxLen = Math.max(...numbers.map(n => n.toString().length), (parsed.target || 0).toString().length, 2);

    numbers.forEach((num, index) => {
      const isLast = index === numbers.length - 1;
      const numStr = num.toString();
      const padded = numStr.padStart(maxLen, ' ');

      html += `<div class="vertical-grid-row ${isLast ? 'border-bottom' : ''}">`;
      html += `<span class="op-symbol">${isLast ? operator : ''}</span>`;

      for (let i = 0; i < maxLen; i++) {
        const char = padded[i];
        if (char === ' ') {
          html += `<div class="grid-cell empty"></div>`;
        } else {
          const posIdx = maxLen - 1 - i;
          const cls = posIdx === 0 ? 'cell-ental' : posIdx === 1 ? 'cell-tiotal' : 'cell-hundratal';
          html += `<div class="grid-cell ${cls}">${char}</div>`;
        }
      }
      html += `</div>`;
    });

    // Svarsrad / Frågeteckensrad
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

  // --- SIDA 2: DELSTEGSBERÄKNING / ALTERNATIVT RÄKNESÄTT ---
  renderPage2Steps(q) {
    const parsed = this.parseQuestionNumbers(q);

    let instrHtml = '';
    let visualHtml = '';

    if (q.text && q.text.includes('? +')) {
      const known = parsed.numbers[0] || 5;
      const total = parsed.target || 11;
      const ans = this.safeInt(q.correctAnswer, total - known);

      instrHtml = `
        <strong>Okänd term (Hitta det saknade talet):</strong><br>
        Tänk baklänges med minus, eller räkna uppåt från <span class="digit-ental">${known}</span> till <span class="digit-tiotal">${Math.floor(total/10) || ''}</span><span class="digit-ental">${total % 10}</span>.
      `;

      visualHtml = `
        <div class="help-step-box">
          <div class="step-line"><strong>Sätt 1 (Räkna uppåt):</strong> Starta på ${known} ➔ Hoppa ${ans} steg ➔ Nå ${total}</div>
          <div class="step-line"><strong>Sätt 2 (Minus):</strong> ${total} - ${known} = <span class="highlight-ans">${ans}</span></div>
          <div class="step-summary">Svar: Det saknade talet är <strong>${ans}</strong></div>
        </div>
      `;
    } else if (q.text && q.text.includes('+ ?')) {
      const known = parsed.numbers[0] || 6;
      const total = parsed.target || 11;
      const ans = this.safeInt(q.correctAnswer, total - known);

      instrHtml = `
        <strong>Okänd term (Hitta det saknade talet):</strong><br>
        Hur mycket fattas för att nå från <span class="digit-ental">${known}</span> upp till <span class="digit-tiotal">${Math.floor(total/10) || ''}</span><span class="digit-ental">${total % 10}</span>?
      `;

      visualHtml = `
        <div class="help-step-box">
          <div class="step-line"><strong>Sätt 1:</strong> Starta på ${known} och räkna upp till ${total} (+${ans}).</div>
          <div class="step-line"><strong>Sätt 2:</strong> Ta hela summan ${total} och dra bort ${known} (${total} - ${known} = <span class="highlight-ans">${ans}</span>).</div>
          <div class="step-summary">Svar: ? = <strong>${ans}</strong></div>
        </div>
      `;
    } else if (parsed.numbers.length > 2) {
      const nums = parsed.numbers;
      let stepHtml = '';
      let currentSum = nums[0];

      for (let i = 1; i < nums.length; i++) {
        const prev = currentSum;
        const next = nums[i];
        currentSum += next;
        stepHtml += `<div class="step-line">Steg ${i}: ${prev} + ${next} = <strong>${currentSum}</strong></div>`;
      }

      instrHtml = `
        <strong>Räkna i delsteg:</strong><br>
        När du har flera tal lägger du ihop dem ett i taget från vänster till höger!
      `;

      visualHtml = `
        <div class="help-step-box">
          ${stepHtml}
          <div class="step-summary">Totalt: <strong>${currentSum}</strong></div>
        </div>
      `;
    } else {
      const num1 = parsed.numbers[0] || 12;
      const num2 = parsed.numbers[1] || 15;
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

  // --- SIDA 3: TALLINJE ---
  renderPage3NumberLine(q) {
    const parsed = this.parseQuestionNumbers(q);
    const numbers = parsed.numbers;

    let start = numbers[0] || 0;
    let end = parsed.target || (numbers.reduce((a, b) => a + b, 0));

    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }

    if (end === start) end = start + 10;

    const minVal = Math.max(0, start - 2);
    const maxVal = end + 2;

    if (this.instructionsEl) {
      this.instructionsEl.innerHTML = `
        <strong>Tallinje:</strong><br>
        Starta vid <span style="color:#2563eb; font-weight:bold;">${start}</span> och hoppa framåt till <span style="color:#16a34a; font-weight:bold;">${end}</span> på tallinjen.
      `;
    }

    const svgWidth = 440;
    const svgHeight = 130;
    const lineY = 80;
    const margin = 35;
    const usableWidth = svgWidth - margin * 2;
    const range = Math.max(1, maxVal - minVal);

    const getX = (val) => margin + ((val - minVal) / range) * usableWidth;

    let ticksSvg = '';
    const step = range > 30 ? 5 : 1;

    for (let v = minVal; v <= maxVal; v += step) {
      const x = getX(v);
      const isKey = v === start || v === end;
      ticksSvg += `
        <line x1="${x}" y1="${lineY - 6}" x2="${x}" y2="${lineY + 6}" stroke="${isKey ? '#1e293b' : '#94a3b8'}" stroke-width="${isKey ? 2.5 : 1.5}" />
        <text x="${x}" y="${lineY + 22}" font-size="${isKey ? '13' : '11'}" font-weight="${isKey ? 'bold' : 'normal'}" fill="${isKey ? '#1e3a8a' : '#64748b'}" text-anchor="middle">${v}</text>
      `;
    }

    const x1 = getX(start);
    const x2 = getX(end);
    const midX = (x1 + x2) / 2;
    const arcHeight = Math.min(40, Math.abs(x2 - x1) * 0.35);
    const controlY = lineY - arcHeight - 12;

    const arcSvg = `
      <path d="M ${x1} ${lineY - 6} Q ${midX} ${controlY} ${x2} ${lineY - 6}" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="4,2" />
      <polygon points="${x2},${lineY - 6} ${x2 - 6},${lineY - 14} ${x2 + 2},${lineY - 14}" fill="#2563eb" />
      <text x="${midX}" y="${controlY - 4}" font-size="14" font-weight="bold" fill="#2563eb" text-anchor="middle">+${end - start}</text>
    `;

    const pointsSvg = `
      <circle cx="${x1}" cy="${lineY}" r="5" fill="#2563eb" />
      <circle cx="${x2}" cy="${lineY}" r="5" fill="#16a34a" />
    `;

    if (this.visualEl) {
      this.visualEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; display:block; margin:auto;">
          <line x1="${margin - 10}" y1="${lineY}" x2="${svgWidth - margin + 10}" y2="${lineY}" stroke="#475569" stroke-width="3" />
          ${ticksSvg}
          ${arcSvg}
          ${pointsSvg}
        </svg>
      `;
    }
  }

  safeInt(val, fallback = 0) {
    if (val === null || val === undefined) return fallback;
    const res = parseInt(val, 10);
    return isNaN(res) ? fallback : res;
  }

  parseQuestionNumbers(q) {
    if (!q) return { numbers: [5, 3], target: 8 };

    if (q.num1 !== undefined && q.num2 !== undefined && !q.isCustomFormat) {
      const n1 = this.safeInt(q.num1, 5);
      const n2 = this.safeInt(q.num2, 3);
      const ans = this.safeInt(q.correctAnswer, n1 + n2);
      return { numbers: [n1, n2], target: ans };
    }

    if (q.text) {
      const matchTarget = q.text.match(/=\s*(\d+|\?)/);
      let target = null;
      if (matchTarget) {
        if (matchTarget[1] !== '?') {
          target = this.safeInt(matchTarget[1], null);
        } else if (q.correctAnswer) {
          target = this.safeInt(q.correctAnswer, null);
        }
      }

      const leftPart = q.text.split('=')[0] || q.text;
      const numMatches = leftPart.match(/\d+/g) || [];
      const numbers = numMatches.map(n => this.safeInt(n, 0));

      if (numbers.length === 0) {
        numbers.push(5);
      }

      return { numbers, target: target !== null ? target : this.safeInt(q.correctAnswer, 10) };
    }

    return { numbers: [5, 3], target: 8 };
  }
}