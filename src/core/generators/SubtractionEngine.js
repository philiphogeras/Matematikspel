/**
 * SubtractionEngine.js
 * Genererar subtraktionsfrågor för ental, tiotal och hundratal.
 */
export class SubtractionEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier) {
    let num1 = 0;
    let num2 = 0;

    if (category === 'ental') {
      if (tier === 'brons') {
        num1 = this.rand(1, 5);
        num2 = this.rand(0, num1);
      } else if (tier === 'silver') {
        num1 = this.rand(6, 10);
        num2 = this.rand(1, num1);
      } else {
        num1 = this.rand(11, 18);
        num2 = this.rand(num1 - 9, 9);
      }
    } else if (category === 'tiotal') {
      if (tier === 'brons') {
        num1 = this.rand(2, 9) * 10;
        num2 = this.rand(1, Math.floor(num1 / 10) - 1) * 10;
      } else if (tier === 'silver') {
        const t1 = this.rand(2, 9);
        const t2 = this.rand(1, t1 - 1);
        const e1 = this.rand(2, 9);
        const e2 = this.rand(1, e1);
        num1 = t1 * 10 + e1;
        num2 = t2 * 10 + e2;
      } else {
        const t1 = this.rand(2, 9);
        const t2 = this.rand(1, t1 - 1);
        const e1 = this.rand(0, 8);
        const e2 = this.rand(e1 + 1, 9);
        num1 = t1 * 10 + e1;
        num2 = t2 * 10 + e2;
      }
    } else if (category === 'hundratal') {
      if (tier === 'brons') {
        num1 = this.rand(2, 9) * 100;
        num2 = this.rand(1, Math.floor(num1 / 100) - 1) * 100;
      } else if (tier === 'silver') {
        const h1 = this.rand(3, 8);
        const t1 = this.rand(2, 9);
        const h2 = this.rand(1, h1 - 1);
        const t2 = this.rand(1, t1 - 1);
        num1 = h1 * 100 + t1 * 10;
        num2 = h2 * 100 + t2 * 10;
      } else {
        const h1 = this.rand(3, 8);
        const t1 = this.rand(2, 9);
        const e1 = this.rand(2, 9);
        const h2 = this.rand(1, h1 - 1);
        const t2 = this.rand(1, t1 - 1);
        const e2 = this.rand(1, e1 - 1);
        num1 = h1 * 100 + t1 * 10 + e1;
        num2 = h2 * 100 + t2 * 10 + e2;
      }
    }

    return { num1, num2, operator: '-' };
  }
}