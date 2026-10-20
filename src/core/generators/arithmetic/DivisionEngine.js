export class DivisionEngine {
  generateQuestion(category = 'tabell_2_5_10', tier = 'brons') {
    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    const divisor = tables[Math.floor(Math.random() * tables.length)];
    const quota = Math.floor(Math.random() * 10) + 1;
    const num1 = divisor * quota;
    const num2 = divisor;

    return {
      domain: 'arithmetic',
      operation: 'division',
      category,
      tier,
      num1,
      num2,
      operator: '÷',
      correctAnswer: quota.toString(),
      text: `${num1} ÷ ${num2} = ?`
    };
  }

  generate(category = 'tabell_2_5_10', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}