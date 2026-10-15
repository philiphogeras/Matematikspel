/**
 * MultiplicationEngine.js
 * Genererar multiplikationsfrågor baserat på tabellgrupper och svårighetsgrad.
 */
export class MultiplicationEngine {
  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generate(category, tier) {
    let num1 = 0;
    let num2 = 0;

    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    const baseTable = tables[this.rand(0, tables.length - 1)];
    let factor = 1;

    if (tier === 'brons') {
      factor = this.rand(1, 5);
    } else if (tier === 'silver') {
      factor = this.rand(6, 10);
    } else {
      factor = this.rand(1, 10);
    }

    if (this.rand(0, 1) === 0) {
      num1 = baseTable;
      num2 = factor;
    } else {
      num1 = factor;
      num2 = baseTable;
    }

    return { num1, num2, operator: '×' };
  }
}