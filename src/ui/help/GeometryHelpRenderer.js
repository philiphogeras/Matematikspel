/**
 * GeometryHelpRenderer.js
 * Hanterar hjälpinnehåll för Former och Geometri (Egenskaper, Vardag, Räkna hörn).
 */
export class GeometryHelpRenderer {
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
    const shape = this.detectShape(q);
    if (page === 1) {
      this.renderPage1Anatomy(shape, instructionsEl, visualEl);
    } else if (page === 2) {
      this.renderPage2Connections(shape, instructionsEl, visualEl);
    } else if (page === 3) {
      this.renderPage3Count(shape, instructionsEl, visualEl);
    }
  }

  renderPage1Anatomy(shape, instructionsEl, visualEl) {
    const details = {
      triangel: { name: 'Triangel', desc: 'En triangel har alltid <strong>3 hörn</strong> och <strong>3 raka sidor</strong>.' },
      kvadrat: { name: 'Kvadrat', desc: 'En kvadrat har <strong>4 hörn</strong> och <strong>4 lika långa sidor</strong>.' },
      rektangel: { name: 'Rektangel', desc: 'En rektangel har <strong>4 hörn</strong>, med 2 långa och 2 korta sidor.' },
      cirkel: { name: 'Cirkel', desc: 'En cirkel är helt rund. Den har <strong>0 hörn</strong> och 1 böjd linje.' },
      femhorning: { name: 'Femhörning', desc: 'En femhörning har <strong>5 hörn</strong> och <strong>5 raka sidor</strong>.' },
      sexhorning: { name: 'Sexhörning', desc: 'En sexhörning har <strong>6 hörn</strong> och <strong>6 raka sidor</strong>.' }
    }[shape] || { name: 'Form', desc: 'Formens egenskaper.' };

    if (instructionsEl) {
      instructionsEl.innerHTML = `
        <strong>Formens egenskaper: ${details.name}</strong><br>
        ${details.desc}<br>
        <span style="color:#2563eb; font-weight:bold;">Blå prickar = Hörn</span> | 
        <span style="color:#16a34a; font-weight:bold;">Grön linje = Sidor</span>
      `;
    }

    if (visualEl) {
      visualEl.innerHTML = this.generateShapeSVG(shape, { showDots: true, numberCorners: false });
    }
  }

  renderPage2Connections(shape, instructionsEl, visualEl) {
    const info = {
      triangel: {
        title: 'Triangel i vardagen',
        examples: 'Pizzabit, Vägskylt (Varning), Tak',
        trick: 'Tänk på ordet "Tri" som betyder tre (tre hörn)!'
      },
      kvadrat: {
        title: 'Kvadrat i vardagen',
        examples: 'Schackbräde, Bordsyta, Tärning',
        trick: 'Alla fyra sidor är exakt lika långa!'
      },
      rektangel: {
        title: 'Rektangel i vardagen',
        examples: 'Dörr, Bok, Mobiltelefon, Fotbollsplan',
        trick: 'Formad som en utdragen kvadrat (2 långa + 2 korta sidor).'
      },
      cirkel: {
        title: 'Cirkel i vardagen',
        examples: 'Hjul, Klocka, Tallrik, Mynt',
        trick: 'Rund som en boll – inga vassa hörn alls!'
      },
      femhorning: {
        title: 'Femhörning i vardagen',
        examples: 'Fågelholk, Huset i ett spel',
        trick: 'Fem hörn – precis som fingrarna på en hand!'
      },
      sexhorning: {
        title: 'Sexhörning i vardagen',
        examples: 'Bikupa (honung), Snöflinga, Muttrar',
        trick: 'Sex hörn – ser ut som en bikaka!'
      }
    }[shape] || { title: 'Exempel', examples: 'Vardagsobjekt', trick: 'Kom ihåg formen!' };

    if (instructionsEl) {
      instructionsEl.innerHTML = `
        <strong>Minnesknep & Vardagsexempel:</strong><br>
        ${info.trick}
      `;
    }

    if (visualEl) {
      visualEl.innerHTML = `
        <div class="help-step-box">
          <div class="step-line"><strong>Form:</strong> ${info.title}</div>
          <div class="step-line"><strong>Ser ut som:</strong> ${info.examples}</div>
          <div class="step-summary">Känner du igen formen från klassrummet eller hemma?</div>
        </div>
      `;
    }
  }

  renderPage3Count(shape, instructionsEl, visualEl) {
    const counts = {
      triangel: 3, kvadrat: 4, rektangel: 4, cirkel: 0, femhorning: 5, sexhorning: 6
    }[shape] || 3;

    if (instructionsEl) {
      if (counts === 0) {
        instructionsEl.innerHTML = `
          <strong>Kontrollera cirkeln:</strong><br>
          Peka runt formen. Det finns <strong>0 hörn</strong> eftersom kanten är helt rund!
        `;
      } else {
        instructionsEl.innerHTML = `
          <strong>Peka och räkna hörnen:</strong><br>
          Räkna siffrorna vid varje spets på formen. Totalt hittar vi <strong style="color:#2563eb;">${counts} hörn</strong>!
        `;
      }
    }

    if (visualEl) {
      visualEl.innerHTML = this.generateShapeSVG(shape, { showDots: true, numberCorners: true });
    }
  }

  generateShapeSVG(shape, options = { showDots: true, numberCorners: false }) {
    const w = 340;
    const h = 135;
    const { showDots, numberCorners } = options;

    let pathSvg = '';
    let points = [];

    if (shape === 'triangel') {
      points = [{ x: 170, y: 20 }, { x: 80, y: 110 }, { x: 260, y: 110 }];
    } else if (shape === 'kvadrat') {
      points = [{ x: 115, y: 25 }, { x: 225, y: 25 }, { x: 225, y: 115 }, { x: 115, y: 115 }];
    } else if (shape === 'rektangel') {
      points = [{ x: 75, y: 35 }, { x: 265, y: 35 }, { x: 265, y: 105 }, { x: 75, y: 105 }];
    } else if (shape === 'femhorning') {
      points = [{ x: 170, y: 18 }, { x: 255, y: 52 }, { x: 222, y: 115 }, { x: 118, y: 115 }, { x: 85, y: 52 }];
    } else if (shape === 'sexhorning') {
      points = [{ x: 120, y: 20 }, { x: 220, y: 20 }, { x: 265, y: 68 }, { x: 220, y: 115 }, { x: 120, y: 115 }, { x: 75, y: 68 }];
    }

    if (shape === 'cirkel') {
      pathSvg = `<circle cx="170" cy="68" r="46" fill="#eff6ff" stroke="#16a34a" stroke-width="4" />`;
    } else {
      const ptsStr = points.map(p => `${p.x},${p.y}`).join(' ');
      pathSvg = `<polygon points="${ptsStr}" fill="#eff6ff" stroke="#16a34a" stroke-width="4" stroke-linejoin="round" />`;
    }

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
}