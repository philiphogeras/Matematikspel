/**
 * Sketchpad.js
 * Hanterar skissrutan/kladdblocket med stöd för mus, touch och pennor (Smart-board).
 */
export class Sketchpad {
  constructor(canvasId, clearBtnId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.clearBtn = document.getElementById(clearBtnId);

    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    this.init();
  }

  init() {
    if (!this.canvas) return;

    // Pointer-events fungerar sömlöst för både mus, touch och pekskärmar
    this.canvas.addEventListener('pointerdown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('pointermove', (e) => this.draw(e));
    this.canvas.addEventListener('pointerup', () => this.stopDrawing());
    this.canvas.addEventListener('pointerleave', () => this.stopDrawing());
    this.canvas.addEventListener('pointercancel', () => this.stopDrawing());

    if (this.clearBtn) {
      this.clearBtn.onclick = () => this.clear();
    }
  }

  resize() {
    if (!this.canvas) return;

    // Anpassa canvasens faktiska rit-upplösning till dess synliga storlek i CSS
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      // Spara bilden om man redan ritat något innan resize
      const tempImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;

      // Återställ linjeinställningar
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = '#334155'; // Mörkgrå pennfärg
      this.ctx.lineWidth = 4;

      this.ctx.putImageData(tempImage, 0, 0);
    }
  }

  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
    this.canvas.setPointerCapture(e.pointerId);
  }

  draw(e) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}