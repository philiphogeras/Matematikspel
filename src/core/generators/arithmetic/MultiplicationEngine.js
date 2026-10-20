export class MultiplicationEngine {
  generateQuestion(category = 'tabell_2_5_10', tier = 'brons') {
    if (category === 'problemlosning') {
      const problems = [
        { text: 'Du har 3 påsar med 5 bullar i varje påse.\nHur många bullar finns det totalt?', n1: 3, n2: 5, ans: 15 },
        { text: 'En bil har 4 hjul.\nHur många hjul har 5 bilar tillsammans?', n1: 5, n2: 4, ans: 20 },
        { text: 'Du köper 2 glassar som kostar 10 kronor styck.\nHur mycket kostar det sammanlagt?', n1: 2, n2: 10, ans: 20 },
        { text: 'En stol har 4 ben.\nHur många ben har 6 stolar?', n1: 6, n2: 4, ans: 24 },
        { text: 'En vecka har 7 dagar.\nHur många dagar är det på 3 veckor?', n1: 3, n2: 7, ans: 21 }
      ];
      const p = problems[Math.floor(Math.random() * problems.length)];
      return {
        domain: 'arithmetic',
        operation: 'multiplication',
        category,
        tier,
        num1: p.n1,
        num2: p.n2,
        operator: '×',
        correctAnswer: p.ans.toString(),
        isTextProblem: true,
        text: p.text,
        explanation: `${p.n1} × ${p.n2} = ${p.ans}`
      };
    }

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

  generate(category = 'tabell_2_5_10', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}