/**
 * AdditionEngine.js
 * Genererar additionsfrågor för ental, tiotal och hundratal.
 */
export class AdditionEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier) {
    let num1 = 0;
    let num2 = 0;

    if (category === 'ental') {
      if (tier === 'brons') {
        const sum = this.rand(1, 5);
        num1 = this.rand(0, sum);
        num2 = sum - num1;
      } else if (tier === 'silver') {
        const sum = this.rand(6, 10);
        num1 = this.rand(1, sum - 1);
        num2 = sum - num1;
      } else {
        const sum = this.rand(11, 18);
        num1 = this.rand(sum - 9, 9);
        num2 = sum - num1;
      }
    } else if (category === 'tiotal') {
      if (tier === 'brons') {
        num1 = this.rand(1, 4) * 10;
        num2 = this.rand(1, 5) * 10;
      } else if (tier === 'silver') {
        const t1 = this.rand(1, 8);
        const t2 = this.rand(1, 9 - t1);
        const e1 = this.rand(1, 8);
        const e2 = this.rand(1, 9 - e1);
        num1 = t1 * 10 + e1;
        num2 = t2 * 10 + e2;
      } else {
        const t1 = this.rand(1, 8);
        const t2 = this.rand(1, 8);
        const e1 = this.rand(2, 9);
        const e2 = this.rand(10 - e1, 9);
        num1 = t1 * 10 + e1;
        num2 = t2 * 10 + e2;
      }
    } else if (category === 'hundratal') {
      if (tier === 'brons') {
        num1 = this.rand(1, 4) * 100;
        num2 = this.rand(1, 5) * 100;
      } else if (tier === 'silver') {
        const h1 = this.rand(1, 4);
        const h2 = this.rand(1, 4);
        const t1 = this.rand(1, 8);
        const t2 = this.rand(1, 9 - t1);
        num1 = h1 * 100 + t1 * 10;
        num2 = h2 * 100 + t2 * 10;
      } else {
        const h1 = this.rand(1, 4);
        const h2 = this.rand(1, 4);
        const t1 = this.rand(1, 8);
        const t2 = this.rand(1, 9 - t1);
        const e1 = this.rand(1, 8);
        const e2 = this.rand(1, 9 - e1);
        num1 = h1 * 100 + t1 * 10 + e1;
        num2 = h2 * 100 + t2 * 10 + e2;
      }
    }

    return { num1, num2, operator: '+' };
  }
}