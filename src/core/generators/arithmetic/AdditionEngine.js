/**
 * AdditionEngine.js
 * Genererar additionsfrågor anpassade efter kategori, tier och omgång (1-3).
 */
export class AdditionEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier, round = 1) {
    let num1 = 1;
    let num2 = 1;

    if (category === 'ental') {
      if (round === 1) {
        // Omgång 1: Enkla ental (summa <= 10)
        num1 = this.rand(1, 5);
        num2 = this.rand(1, 5);
      } else if (round === 2) {
        // Omgång 2: Medelsvåra ental (summa 8 - 14)
        num1 = this.rand(4, 8);
        num2 = this.rand(3, 7);
      } else {
        // Omgång 3: Utmanande ental med tiotalsövergång (summa 11 - 18)
        num1 = this.rand(6, 9);
        num2 = this.rand(5, 9);
      }
    } else if (category === 'tiotal') {
      if (round === 1) {
        // Omgång 1: Rena tiotal (20 + 30)
        num1 = this.rand(1, 4) * 10;
        num2 = this.rand(1, 5) * 10;
      } else if (round === 2) {
        // Omgång 2: Tiotal med ental utan övergång (23 + 15)
        const t1 = this.rand(1, 4) * 10;
        const t2 = this.rand(1, 4) * 10;
        const e1 = this.rand(1, 4);
        const e2 = this.rand(1, 5);
        num1 = t1 + e1;
        num2 = t2 + e2;
      } else {
        // Omgång 3: Tiotal med övergång / högre tal (38 + 27)
        const t1 = this.rand(2, 5) * 10;
        const t2 = this.rand(2, 4) * 10;
        const e1 = this.rand(5, 9);
        const e2 = this.rand(4, 8);
        num1 = t1 + e1;
        num2 = t2 + e2;
      }
    } else if (category === 'hundratal') {
      if (round === 1) {
        // Omgång 1: Rena hundratal (100 + 300)
        num1 = this.rand(1, 4) * 100;
        num2 = this.rand(1, 5) * 100;
      } else if (round === 2) {
        // Omgång 2: Hundratal + Tiotal (120 + 230)
        num1 = this.rand(1, 4) * 100 + this.rand(1, 8) * 10;
        num2 = this.rand(1, 4) * 100 + this.rand(1, 8) * 10;
      } else {
        // Omgång 3: Fulla treställiga tal (145 + 238)
        num1 = this.rand(100, 450);
        num2 = this.rand(100, 450);
      }
    }

    return { num1, num2, operator: '+' };
  }
}