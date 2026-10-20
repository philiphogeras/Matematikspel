/**
 * DivisionEngine.js
 * Genererar divisionsfrågor anpassade efter kategori, tier och omgång (1-3).
 */
export class DivisionEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier, round = 1) {
    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    const divisor = tables[this.rand(0, tables.length - 1)];
    let quotient = 1;

    if (round === 1) {
      // Omgång 1: Låga kvoter (1 - 3)
      quotient = this.rand(1, 3);
    } else if (round === 2) {
      // Omgång 2: Medelhöga kvoter (4 - 7)
      quotient = this.rand(4, 7);
    } else {
      // Omgång 3: Utmanande kvoter (7 - 10)
      quotient = this.rand(7, 10);
    }

    const dividend = divisor * quotient;

    return {
      num1: dividend,
      num2: divisor,
      operator: '÷'
    };
  }
}