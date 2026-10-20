/**
 * GeometryRenderer.js
 * Ritar ut 2D-figurer, vinklar och geometriska hjälplinjer på Canvas.
 * Anpassad med kompakt storlek för hög synbarhet.
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
      this.canvas.width = Math.min(parent.clientWidth, 260);
      this.canvas.height = 110;
    }
  }

  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawShape(shapeType, options = {}) {
    if (!this.ctx || !this.canvas) return;

    this.clear();
    this.resize();

    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.72;

    const strokeColor = options.strokeColor || '#1e40af';
    const fillColor = options.fillColor || '#dbeafe';
    const lineWidth = options.lineWidth || 3.5;
    const showVertices = options.showVertices || false;

    this.ctx.save();
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineJoin = 'round';

    let vertices = [];
    const type = (shapeType || '').toLowerCase();

    if (type === 'kvadrat' || type === 'square') {
      const side = size * 0.8;
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
      const w = size * 1.1;
      const h = size * 0.6;
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
      const h = size * 0.85;
      const w = size * 0.95;

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
      const radius = (size * 0.75) / 2;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      vertices = [];
    }

    if (showVertices && vertices.length > 0) {
      this.drawVertexDots(vertices);
    }

    this.ctx.restore();
  }

  drawVertexDots(vertices) {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.fillStyle = '#ef4444';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2.5;

    vertices.forEach((v) => {
      this.ctx.beginPath();
      this.ctx.arc(v.x, v.y, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });

    this.ctx.restore();
  }
}