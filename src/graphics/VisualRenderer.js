/**
 * VisualRenderer.js
 * Ansvarar för att rita ut allt pedagogiskt stöd (tiotalsramar, prickar) på Canvasen.
 */
export class VisualRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  /**
   * Rensar ritytan inför en ny rendering
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Huvudmetod som kollar vilket visuellt stöd frågan vill visa och ritar det
   */
  renderVisualAid(visualAid, num1, num2) {
    this.clear();

    if (!visualAid || visualAid.type === 'none') {
      return; // Inget visuellt stöd ska visas på denna nivå
    }

    if (visualAid.type === 'ten-frame') {
      // Centrera tiotalsramen horisontellt på skärmen
      const frameWidth = 5 * (50 + 6);
      const startX = (this.canvas.width - frameWidth) / 2;
      const startY = 180;

      this.drawTenFrame(startX, startY, num1, visualAid.colorA, num2, visualAid.colorB);
    } else if (visualAid.type === 'dots') {
      const startX = 200;
      const startY = 220;
      this.drawDots(startX, startY, num1, visualAid.colorA, num2, visualAid.colorB);
    }
  }

  /**
   * Ritar en tiotalsram (2 rader x 5 rutor) med färgade cirklar
   */
  drawTenFrame(startX, startY, countA, colorA, countB = 0, colorB = null) {
    const boxSize = 50;
    const padding = 6;
    const columns = 5;

    // 1. Rita bakgrundsramen (10 gråa rutor)
    for (let i = 0; i < 10; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = startX + col * (boxSize + padding);
      const y = startY + row * (boxSize + padding);

      this.ctx.fillStyle = '#F1F5F9';
      this.ctx.strokeStyle = '#94A3B8';
      this.ctx.lineWidth = 2;

      this.ctx.fillRect(x, y, boxSize, boxSize);
      this.ctx.strokeRect(x, y, boxSize, boxSize);
    }

    // 2. Fyll i cirklar för första talet
    let totalDrawn = 0;
    for (let i = 0; i < countA && totalDrawn < 10; i++) {
      this.drawDotInBox(startX, startY, totalDrawn, colorA, boxSize, padding);
      totalDrawn++;
    }

    // 3. Fyll i cirklar för andra talet (om det finns)
    for (let i = 0; i < countB && totalDrawn < 10; i++) {
      this.drawDotInBox(startX, startY, totalDrawn, colorB, boxSize, padding);
      totalDrawn++;
    }
  }

  /**
   * Hjälpfunktion för att rita en enskild cirkel i en viss ruta i tiotalsramen
   */
  drawDotInBox(startX, startY, index, color, boxSize, padding) {
    const col = index % 5;
    const row = Math.floor(index / 5);
    const centerX = startX + col * (boxSize + padding) + boxSize / 2;
    const centerY = startY + row * (boxSize + padding) + boxSize / 2;
    const radius = boxSize / 3;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * Ritar ut fristående grupper av prickar (används t.ex. vid subtraktion)
   */
  drawDots(startX, startY, countA, colorA, countB = 0, colorB = null) {
    const radius = 18;
    const gap = 45;

    // Grupp A
    for (let i = 0; i < countA; i++) {
      this.ctx.beginPath();
      this.ctx.arc(startX + i * gap, startY, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = colorA;
      this.ctx.fill();
      this.ctx.closePath();
    }

    // Grupp B (om tillämpligt)
    if (countB > 0) {
      const startXB = startX + countA * gap + 40;
      for (let i = 0; i < countB; i++) {
        this.ctx.beginPath();
        this.ctx.arc(startXB + i * gap, startY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = colorB;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }
}