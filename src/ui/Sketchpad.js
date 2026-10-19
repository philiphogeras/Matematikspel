/**
 * Sketchpad.js
 * Hanterar ritsystemet på kladdblocket/skissrutan.
 */
export class Sketchpad {
  constructor(canvasOrId, clearBtnOrId) {
    this.canvas = typeof canvasOrId === 'string' ? document.getElementById(canvasOrId) : canvasOrId;
    this.clearBtn = typeof clearBtnOrId === 'string' ? document.getElementById(clearBtnOrId) : clearBtnOrId;

    if (!this.canvas) {
      console.warn('Sketchpad: Canvas-element hittades inte:', canvasOrId);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    this.initEvents();
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }
  }

  initEvents() {
    if (!this.canvas) return;

    const startDrawing = (e) => {
      this.isDrawing = true;
      const pos = this.getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
    };

    const draw = (e) => {
      if (!this.isDrawing || !this.ctx) return;
      const pos = this.getPos(e);

      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.strokeStyle = '#2563eb';
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      this.lastX = pos.x;
      this.lastY = pos.y;
    };

    const stopDrawing = () => {
      this.isDrawing = false;
    };

    this.canvas.addEventListener('mousedown', startDrawing);
    this.canvas.addEventListener('mousemove', draw);
    this.canvas.addEventListener('mouseup', stopDrawing);
    this.canvas.addEventListener('mouseleave', stopDrawing);

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrawing(e.touches[0]);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e.touches[0]);
    }, { passive: false });

    this.canvas.addEventListener('touchend', stopDrawing);

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clear());
    }
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  clear() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}