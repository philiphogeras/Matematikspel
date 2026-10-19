/**
 * VisualRenderer.js
 * Hanterar konfetti och visuella effekter på bakgrundscanvasen.
 */
export class VisualRenderer {
  constructor(canvasOrId) {
    if (typeof canvasOrId === 'string') {
      this.canvas = document.getElementById(canvasOrId);
    } else {
      this.canvas = canvasOrId;
    }

    if (!this.canvas) {
      console.warn('VisualRenderer: Canvas-element hittades inte:', canvasOrId);
      this.ctx = null;
      this.particles = [];
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animating = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth || 1200;
      this.canvas.height = parent.clientHeight || 800;
    }
  }

  triggerConfetti() {
    if (!this.ctx || !this.canvas) return;
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8'];
    this.particles = [];

    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() * 200 - 100),
        y: this.canvas.height / 2 - 100 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -12 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.animate();
    }
  }

  animate() {
    if (!this.ctx || !this.animating || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeParticles = 0;

    for (let p of this.particles) {
      if (p.opacity <= 0) continue;

      activeParticles++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.vRot;
      p.opacity -= 0.008;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }

    if (activeParticles > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}