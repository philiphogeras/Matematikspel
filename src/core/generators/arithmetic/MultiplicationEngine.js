export class MultiplicationEngine {
  generateQuestion(category = 'tabell_2_5_10', tier = 'brons') {
    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    const num1 = tables[Math.floor(Math.random() * tables.length)];
    const num2 = Math.floor(Math.random() * 10) + 1;

    return {
      domain: 'arithmetic',
      operation: 'multiplication',
      category,
      tier,
      num1,
      num2,
      operator: '×',
      correctAnswer: (num1 * num2).toString(),
      text: `${num1} × ${num2} = ?`
    };
  }
}