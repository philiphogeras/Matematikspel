/**
 * SubtractionEngine.js
 * Genererar subtraktionsfrågor anpassade efter kategori, tier och omgång (1-3).
 */
export class SubtractionEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier, round = 1) {
    let num1 = 5;
    let num2 = 2;

    if (category === 'ental') {
      if (round === 1) {
        // Omgång 1: Låga ental utan krångel (t.ex. 5 - 2, 7 - 3)
        num1 = this.rand(3, 8);
        num2 = this.rand(1, num1 - 1);
      } else if (round === 2) {
        // Omgång 2: Medelhöga ental / över 10 (t.ex. 12 - 4)
        num1 = this.rand(8, 14);
        num2 = this.rand(2, Math.min(8, num1 - 1));
      } else {
        // Omgång 3: Tiotalsövergång (t.ex. 15 - 7, 17 - 9)
        num1 = this.rand(11, 18);
        num2 = this.rand(5, 9);
      }
    } else if (category === 'tiotal') {
      if (round === 1) {
        // Omgång 1: Rena tiotal (50 - 20)
        num1 = this.rand(3, 8) * 10;
        num2 = this.rand(1, (num1 / 10) - 1) * 10;
      } else if (round === 2) {
        // Omgång 2: Tiotal med ental utan låning (47 - 23)
        const t1 = this.rand(4, 8) * 10;
        const t2 = this.rand(1, (t1 / 10) - 1) * 10;
        const e1 = this.rand(4, 9);
        const e2 = this.rand(1, e1);
        num1 = t1 + e1;
        num2 = t2 + e2;
      } else {
        // Omgång 3: Subtraktion med tiotalsöverlämning/lån (52 - 27)
        const t1 = this.rand(4, 9) * 10;
        const t2 = this.rand(1, (t1 / 10) - 2) * 10;
        const e1 = this.rand(1, 4);
        const e2 = this.rand(5, 9);
        num1 = t1 + e1;
        num2 = t2 + e2;
      }
    } else if (category === 'hundratal') {
      if (round === 1) {
        // Omgång 1: Rena hundratal (500 - 200)
        num1 = this.rand(3, 8) * 100;
        num2 = this.rand(1, (num1 / 100) - 1) * 100;
      } else if (round === 2) {
        // Omgång 2: Hundratal + Tiotal (450 - 210)
        num1 = this.rand(300, 800);
        num2 = this.rand(100, num1 - 100);
      } else {
        // Omgång 3: Utmanande treställiga tal (532 - 267)
        num1 = this.rand(400, 900);
        num2 = this.rand(150, num1 - 50);
      }
    }

    return { num1, num2, operator: '–' };
  }
}