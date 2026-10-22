/**
 * GeometryHelpRenderer.js
 * Hjälpsystem anpassat för geometri/former:
 * 
 * Brons: Anatomi (1 form) -> Vardagskoppling -> Numrerad kontrollräkning
 * Silver: Sammansatta former (2 former) -> Delstegsräkning -> Ihopräkning med numrerade hörn
 * Guld: Återinför bilden för gåtor och textproblem -> Stegvis uteslutning -> Slutsats
 */
export class GeometryHelpRenderer {
  constructor() {
    this.shapesData = {
      triangel: { name: 'Triangel', corners: 3, sides: 3 },
      kvadrat: { name: 'Kvadrat', corners: 4, sides: 4 },
      rektangel: { name: 'Rektangel', corners: 4, sides: 4 },
      cirkel: { name: 'Cirkel', corners: 0, sides: 1 },
      femhorning: { name: 'Femhörning', corners: 5, sides: 5 },
      sexhorning: { name: 'Sexhörning', corners: 6, sides: 6 }
    };
  }

  isGeometry(q) {
    if (!q) return false;

    const domain = (q.domain || '').toString().toLowerCase();
    const operation = (q.operation || '').toString().toLowerCase();
    const category = (q.category || '').toString().toLowerCase();
    const isGeoProp = Boolean(q.isGeometry || q.isShapes || q.isGeometryQuestion);

    const text = (q.text || '').toString().toLowerCase();
    const ans = (q.correctAnswer || '').toString().toLowerCase();
    const shapeType = (q.shapeType || q.shape || '').toString().toLowerCase();

    const geoKeywords = [
      'shapes', 'geometry', 'geometri', 'former', 'vinklar', 'figur', 'form',
      'vinkel', 'hörn', 'sida', 'omkrets', 'area',
      'triangel', 'cirkel', 'kvadrat', 'rektangel', 'femhörning', 'femhorning',
      'sexhörning', 'sexhorning', 'pentagon', 'hexagon', 'romb', 'oval', 'kub'
    ];

    return isGeoProp ||
      ['geometry', 'shapes', 'former', 'vinklar', 'geometri'].includes(domain) ||
      ['geometry', 'shapes', 'former', 'vinklar', 'geometri'].includes(operation) ||
      ['former', 'vinklar', 'shapes', 'geometry', 'geometri'].includes(category) ||
      geoKeywords.some(k => text.includes(k)) ||
      geoKeywords.some(k => ans.includes(k)) ||
      geoKeywords.some(k => shapeType.includes(k));
  }

  detectShape(q) {
    const text = (q?.text || '').toString().toLowerCase();
    const ans = (q?.correctAnswer || '').toString().toLowerCase();
    const shapeType = (q?.shapeType || q?.shape || '').toString().toLowerCase();
    const combined = `${shapeType} ${ans} ${text}`.toLowerCase();

    if (combined.includes('cirkel')) return 'cirkel';
    if (combined.includes('kvadrat')) return 'kvadrat';
    if (combined.includes('rektangel')) return 'rektangel';
    if (combined.includes('femh') || combined.includes('pentagon')) return 'femhorning';
    if (combined.includes('sexh') || combined.includes('hexagon')) return 'sexhorning';
    return 'triangel';
  }

  render(page, q, instructionsEl, visualEl) {
    if (q?.isComposite || q?.secondaryShape) {
      this.renderSilverComposite(page, q, instructionsEl, visualEl);
    } else if (q?.tier === 'guld' || q?.isAbstractProblem) {
      this.renderGuldAbstract(page, q, instructionsEl, visualEl);
    } else {
      this.renderBronsSingle(page, q, instructionsEl, visualEl);
    }
  }

  // --- BRONS: 1 FORM (Anatomi, Vardag, Räkna) ---
  renderBronsSingle(page, q, instructionsEl, visualEl) {
    const shape = this.detectShape(q);
    const data = this.shapesData[shape] || this.shapesData['triangel'];

    if (page === 1) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Formens egenskaper: ${data.name}</strong><br>
          En ${data.name.toLowerCase()} har <strong>${data.corners} hörn</strong> och <strong>${data.sides} sidor</strong>.<br>
          <span style="color:#2563eb; font-weight:bold;">Blå prickar = Hörn</span> | 
          <span style="color:#16a34a; font-weight:bold;">Grön linje = Sidor</span>
        `;
      }
      if (visualEl) visualEl.innerHTML = this.generateSingleShapeSVG(shape, { showDots: true, numberCorners: false });
    } else if (page === 2) {
      const info = {
        triangel: 'Tänk på "Tri" som betyder tre (3 hörn) – som en pizzabit eller vägskylt!',
        kvadrat: 'Alla fyra sidor är exakt lika långa – som en tärning eller ett schackbräde!',
        rektangel: 'Formad som en utdragen kvadrat – 2 långa och 2 korta sidor (som en bok eller mobil)!',
        cirkel: 'Helt rund utan hörn – som en klocka, tallrik eller ett hjul!',
        femhorning: 'Fem hörn – precis som fingrarna på en hand (som en fågelholk)!',
        sexhorning: 'Sex hörn – ser ut som en bikaka i en bikupa!'
      }[shape] || 'Känner du igen formen från klassrummet?';

      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Minnesknep & Vardagsexempel:</strong><br>${info}
        `;
      }
      if (visualEl) {
        visualEl.innerHTML = `
          <div class="help-step-box">
            <div class="step-line"><strong>Form:</strong> ${data.name}</div>
            <div class="step-line"><strong>Antal hörn:</strong> ${data.corners}</div>
            <div class="step-summary">Kom ihåg formens kännetecken!</div>
          </div>
        `;
      }
    } else if (page === 3) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Peka och räkna hörnen:</strong><br>
          Peka på varje sifferprick runt formen. Totalt hittar vi <strong style="color:#2563eb;">${data.corners} hörn</strong>!
        `;
      }
      if (visualEl) visualEl.innerHTML = this.generateSingleShapeSVG(shape, { showDots: true, numberCorners: true });
    }
  }

  // --- SILVER: SAMMANSATTA FORMER (2 FORMER IHOP) ---
  renderSilverComposite(page, q, instructionsEl, visualEl) {
    const s1Key = q.shapeType || 'triangel';
    const s2Key = q.secondaryShape || 'kvadrat';

    const s1 = this.shapesData[s1Key] || this.shapesData['triangel'];
    const s2 = this.shapesData[s2Key] || this.shapesData['kvadrat'];
    const totalCorners = s1.corners + s2.corners;

    if (page === 1) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Dela upp i två kända former:</strong><br>
          ${s1.name} (<span style="color:#16a34a; font-weight:bold;">${s1.corners} hörn</span>) och 
          ${s2.name} (<span style="color:#2563eb; font-weight:bold;">${s2.corners} hörn</span>).
        `;
      }
      if (visualEl) visualEl.innerHTML = this.generateDualShapeSVG(s1Key, s2Key, false);
    } else if (page === 2) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Slå ihop hörnen steg-för-steg:</strong><br>
          Räkna hörnen för varje form för sig och lägg ihop dem med plus!
        `;
      }
      if (visualEl) {
        visualEl.innerHTML = `
          <div class="help-step-box">
            <div class="step-line">Form 1 (${s1.name}): <strong>${s1.corners} hörn</strong></div>
            <div class="step-line">Form 2 (${s2.name}): <strong>${s2.corners} hörn</strong></div>
            <div class="step-line">Lägg ihop: ${s1.corners} + ${s2.corners} = <span class="highlight-ans">${totalCorners}</span></div>
            <div class="step-summary">Totalt = <strong>${totalCorners} hörn</strong></div>
          </div>
        `;
      }
    } else if (page === 3) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Kontrollräkna alla hörn i ordning:</strong><br>
          Starta på <span style="color:#16a34a; font-weight:bold;">1 till ${s1.corners}</span> på första formen och fortsätt med <span style="color:#2563eb; font-weight:bold;">${s1.corners + 1} till ${totalCorners}</span> på andra!
        `;
      }
      if (visualEl) visualEl.innerHTML = this.generateDualShapeSVG(s1Key, s2Key, true);
    }
  }

  // --- GULD: ABSTRAKT PROBLEMLÖSNING (ÅTERINFÖR BILDEN I HJÄLPEN) ---
  renderGuldAbstract(page, q, instructionsEl, visualEl) {
    const shapeKey = this.detectShape(q);
    const data = this.shapesData[shapeKey] || this.shapesData['triangel'];
    const ans = q.correctAnswer || data.name;

    if (page === 1) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Visuellt stöd för gåtan:</strong><br>
          När frågan saknar bild kan du rita upp formen i huvudet eller på papper!
        `;
      }
      if (visualEl) visualEl.innerHTML = this.generateSingleShapeSVG(shapeKey, { showDots: true, numberCorners: false });
    } else if (page === 2) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Stegvis ledtråd:</strong><br>
          Jämför frågans beskrivning med formens egenskaper.
        `;
      }
      if (visualEl) {
        visualEl.innerHTML = `
          <div class="help-step-box">
            <div class="step-line"><strong>Fråga:</strong> "${q.text || ''}"</div>
            <div class="step-line"><strong>Ledtråd:</strong> Formen vi söker har <strong>${data.corners} hörn</strong>.</div>
            <div class="step-summary">Rätt svar är <strong>${ans}</strong>!</div>
          </div>
        `;
      }
    } else if (page === 3) {
      if (instructionsEl) {
        instructionsEl.innerHTML = `
          <strong>Slutsats:</strong><br>
          Formen har numrerade hörn så att du kan dubbelkolla.
        `;
      }
      if (visualEl) visualEl.innerHTML = this.generateSingleShapeSVG(shapeKey, { showDots: true, numberCorners: true });
    }
  }

  // --- SVG RITARE FOR 1 FORM ---
  generateSingleShapeSVG(shape, options = { showDots: true, numberCorners: false }) {
    const w = 340;
    const h = 135;
    const { showDots, numberCorners } = options;

    let points = [];
    if (shape === 'triangel') points = [{ x: 170, y: 20 }, { x: 80, y: 110 }, { x: 260, y: 110 }];
    else if (shape === 'kvadrat') points = [{ x: 115, y: 25 }, { x: 225, y: 25 }, { x: 225, y: 115 }, { x: 115, y: 115 }];
    else if (shape === 'rektangel') points = [{ x: 75, y: 35 }, { x: 265, y: 35 }, { x: 265, y: 105 }, { x: 75, y: 105 }];
    else if (shape === 'femhorning') points = [{ x: 170, y: 18 }, { x: 255, y: 52 }, { x: 222, y: 115 }, { x: 118, y: 115 }, { x: 85, y: 52 }];
    else if (shape === 'sexhorning') points = [{ x: 120, y: 20 }, { x: 220, y: 20 }, { x: 265, y: 68 }, { x: 220, y: 115 }, { x: 120, y: 115 }, { x: 75, y: 68 }];

    let pathSvg = shape === 'cirkel'
      ? `<circle cx="170" cy="68" r="46" fill="#eff6ff" stroke="#16a34a" stroke-width="4" />`
      : `<polygon points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="#eff6ff" stroke="#16a34a" stroke-width="4" stroke-linejoin="round" />`;

    let dotsSvg = '';
    if (showDots && shape !== 'cirkel') {
      points.forEach((p, idx) => {
        dotsSvg += `<circle cx="${p.x}" cy="${p.y}" r="7" fill="#2563eb" stroke="#ffffff" stroke-width="2" />`;
        if (numberCorners) {
          const offsetX = p.x > 170 ? 16 : p.x < 170 ? -16 : 0;
          const offsetY = p.y > 68 ? 16 : -14;
          dotsSvg += `<text x="${p.x + offsetX}" y="${p.y + offsetY}" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">${idx + 1}</text>`;
        }
      });
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${h}" viewBox="0 0 ${w} ${h}" style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; display:block; margin:auto;">
        ${pathSvg}
        ${dotsSvg}
      </svg>
    `;
  }

  // --- SVG RITARE FÖR 2 SAMMANSATTA FORMER (SILVER) ---
  generateDualShapeSVG(s1Key, s2Key, numberCorners = false) {
    const w = 380;
    const h = 135;

    const getPoints = (shape, offsetX) => {
      if (shape === 'triangel') return [{ x: offsetX + 60, y: 25 }, { x: offsetX + 15, y: 105 }, { x: offsetX + 105, y: 105 }];
      if (shape === 'kvadrat') return [{ x: offsetX + 20, y: 25 }, { x: offsetX + 100, y: 25 }, { x: offsetX + 100, y: 105 }, { x: offsetX + 20, y: 105 }];
      if (shape === 'rektangel') return [{ x: offsetX + 10, y: 35 }, { x: offsetX + 110, y: 35 }, { x: offsetX + 110, y: 95 }, { x: offsetX + 10, y: 95 }];
      if (shape === 'femhorning') return [{ x: offsetX + 60, y: 18 }, { x: offsetX + 105, y: 52 }, { x: offsetX + 90, y: 105 }, { x: offsetX + 30, y: 105 }, { x: offsetX + 15, y: 52 }];
      return [];
    };

    const pts1 = getPoints(s1Key, 20);
    const pts2 = getPoints(s2Key, 200);

    const path1 = s1Key === 'cirkel'
      ? `<circle cx="80" cy="65" r="40" fill="#eff6ff" stroke="#16a34a" stroke-width="3" />`
      : `<polygon points="${pts1.map(p => `${p.x},${p.y}`).join(' ')}" fill="#eff6ff" stroke="#16a34a" stroke-width="3" stroke-linejoin="round" />`;

    const path2 = s2Key === 'cirkel'
      ? `<circle cx="260" cy="65" r="40" fill="#f0fdf4" stroke="#2563eb" stroke-width="3" />`
      : `<polygon points="${pts2.map(p => `${p.x},${p.y}`).join(' ')}" fill="#f0fdf4" stroke="#2563eb" stroke-width="3" stroke-linejoin="round" />`;

    let dots1 = '';
    let counter = 1;
    pts1.forEach((p) => {
      dots1 += `<circle cx="${p.x}" cy="${p.y}" r="6" fill="#16a34a" />`;
      if (numberCorners) {
        dots1 += `<text x="${p.x}" y="${p.y - 8}" font-size="12" font-weight="bold" fill="#15803d" text-anchor="middle">${counter}</text>`;
        counter++;
      }
    });

    let dots2 = '';
    pts2.forEach((p) => {
      dots2 += `<circle cx="${p.x}" cy="${p.y}" r="6" fill="#2563eb" />`;
      if (numberCorners) {
        dots2 += `<text x="${p.x}" y="${p.y - 8}" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">${counter}</text>`;
        counter++;
      }
    });

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${h}" viewBox="0 0 ${w} ${h}" style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; display:block; margin:auto;">
        ${path1}
        ${path2}
        ${dots1}
        ${dots2}
        <text x="190" y="75" font-size="28" font-weight="bold" fill="#64748b" text-anchor="middle">+</text>
      </svg>
    `;
  }
}