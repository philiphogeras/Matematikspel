/**
 * MultiplicationEngine.js
 * Genererar multiplikationsfrågor anpassade efter kategori, tier och omgång (1-3).
 */
export class MultiplicationEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier, round = 1) {
    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    const factor1 = tables[this.rand(0, tables.length - 1)];
    let factor2 = 1;

    if (round === 1) {
      // Omgång 1: Låga faktorer (1 - 4)
      factor2 = this.rand(1, 4);
    } else if (round === 2) {
      // Omgång 2: Medelhöga faktorer (4 - 7)
      factor2 = this.rand(4, 7);
    } else {
      // Omgång 3: Höga faktorer (7 - 10)
      factor2 = this.rand(7, 10);
    }

    return {
      num1: factor1,
      num2: factor2,
      operator: '×'
    };
  }
}