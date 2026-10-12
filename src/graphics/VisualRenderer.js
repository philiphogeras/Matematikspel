/**
 * VisualRenderer.js
 * Hanterar grafik och visuella effekter som konfettiregn vid vinst.
 */
export class VisualRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.confettiParticles = [];
    this.animationFrame = null;
  }

  /**
   * Rensar canvasen och stoppar eventuell pågående animation.
   */
  clear() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Startar ett färgstarkt konfettiregn på canvasen.
   */
  startConfetti() {
    this.clear();

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#eab308'];
    this.confettiParticles = [];

    // Skapa 130 konfettibitar i olika färger, storlekar och hastigheter
    for (let i = 0; i < 130; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.confettiParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Om konfettibiten faller utanför botten, snurra om den från toppen
        if (p.y > this.canvas.height) {
          p.y = -10;
          p.x = Math.random() * this.canvas.width;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }
}