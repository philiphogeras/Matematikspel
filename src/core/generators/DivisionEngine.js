/**
 * DivisionEngine.js
 * Genererar divisionsfrågor som alltid går jämnt ut.
 * Bygger på invers multiplikation (Produkt / Faktor = Kvot).
 */
export class DivisionEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier) {
    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    const divisor = tables[this.rand(0, tables.length - 1)]; // Nämnare (t.ex. 3)
    let quotient = 1; // Kvot (svaret, t.ex. 4)

    if (tier === 'brons') {
      quotient = this.rand(1, 5);
    } else if (tier === 'silver') {
      quotient = this.rand(6, 10);
    } else {
      quotient = this.rand(1, 10);
    }

    const dividend = divisor * quotient; // Täljare (t.ex. 12)

    return {
      num1: dividend,
      num2: divisor,
      operator: '÷'
    };
  }
}