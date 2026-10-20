/**
 * GeometryRenderer.js
 * Ritar ut 2D-figurer, vinklar och geometriska hjälplinjer på Canvas.
 * Anpassad med hög färgkontrast och pedagogiska stöd (t.ex. hörnmarkeringar).
 */
export class GeometryRenderer {
  constructor(canvasOrId) {
    this.canvas = typeof canvasOrId === 'string' ? document.getElementById(canvasOrId) : canvasOrId;
    
    if (!this.canvas) {
      console.warn('GeometryRenderer: Canvas-element hittades inte:', canvasOrId);
      this.ctx = null;
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (parent && parent.clientWidth > 0) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight || 400;
    }
  }

  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Ritar ut en geometrisk figur i mitten av canvasen.
   * @param {string} shapeType - 'kvadrat', 'rektangel', 'triangel', 'cirkel'
   * @param {Object} options - Valfria inställningar (t.ex. { showVertices: true })
   */
  drawShape(shapeType, options = {}) {
    if (!this.ctx || !this.canvas) return;

    this.clear();
    this.resize();

    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.42; // Välbalanserad storlek

    const strokeColor = options.strokeColor || '#1e40af'; // Mörkblå konturlinje
    const fillColor = options.fillColor || '#dbeafe';     // Ljusblå fyllning
    const lineWidth = options.lineWidth || 5;
    const showVertices = options.showVertices || false;   // Visa röda hörnmarkeringar

    this.ctx.save();
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineJoin = 'round';

    let vertices = [];
    const type = (shapeType || '').toLowerCase();

    if (type === 'kvadrat' || type === 'square') {
      const side = size;
      const x = centerX - side / 2;
      const y = centerY - side / 2;

      this.ctx.beginPath();
      this.ctx.rect(x, y, side, side);
      this.ctx.fill();
      this.ctx.stroke();

      vertices = [
        { x: x, y: y },
        { x: x + side, y: y },
        { x: x + side, y: y + side },
        { x: x, y: y + side }
      ];

    } else if (type === 'rektangel' || type === 'rectangle') {
      const w = size * 1.35;
      const h = size * 0.7;
      const x = centerX - w / 2;
      const y = centerY - h / 2;

      this.ctx.beginPath();
      this.ctx.rect(x, y, w, h);
      this.ctx.fill();
      this.ctx.stroke();

      vertices = [
        { x: x, y: y },
        { x: x + w, y: y },
        { x: x + w, y: y + h },
        { x: x, y: y + h }
      ];

    } else if (type === 'triangel' || type === 'triangle') {
      const h = size * 1.05;
      const w = size * 1.15;

      const p1 = { x: centerX, y: centerY - h / 1.7 };
      const p2 = { x: centerX + w / 2, y: centerY + h / 2.2 };
      const p3 = { x: centerX - w / 2, y: centerY + h / 2.2 };

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      vertices = [p1, p2, p3];

    } else if (type === 'cirkel' || type === 'circle') {
      const radius = size / 2;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      vertices = []; // Cirkel har 0 spetsiga hörn
    }

    // Ritar ut tydliga röda hörnpunkter om frågan kräver det
    if (showVertices && vertices.length > 0) {
      this.drawVertexDots(vertices);
    }

    this.ctx.restore();
  }

  /**
   * Ritar tydliga färgade punkter i hörnen för att underlätta hörnräkning.
   */
  drawVertexDots(vertices) {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.fillStyle = '#ef4444';   // Tydlig röd färg
    this.ctx.strokeStyle = '#ffffff'; // Vit kantlinje för kontrast
    this.ctx.lineWidth = 3;

    vertices.forEach((v) => {
      this.ctx.beginPath();
      this.ctx.arc(v.x, v.y, 9, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });

    this.ctx.restore();
  }
}