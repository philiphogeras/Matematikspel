export class DivisionEngine {
  generateQuestion(category = 'tabell_2_5_10', tier = 'brons') {
    if (category === 'problemlosning') {
      const problems = [
        { text: '12 pennor ska delas lika mellan 3 elever.\nHur många pennor får varje elev?', n1: 12, n2: 3, ans: 4 },
        { text: 'Du har 20 kronor och varje frukt kostar 5 kronor.\nHur många frukter kan du köpa?', n1: 20, n2: 5, ans: 4 },
        { text: '15 kakor fördelas lika på 5 tallrikar.\nHur många kakor hamnar på varje tallrik?', n1: 15, n2: 5, ans: 3 },
        { text: 'En serie på 18 avsnitt delas upp på 3 kvällar.\nHur många avsnitt tittar du på per kväll?', n1: 18, n2: 3, ans: 6 },
        { text: '24 elever ska delas in i 4 lika stora lag.\nHur många elever blir det i varje lag?', n1: 24, n2: 4, ans: 6 }
      ];
      const p = problems[Math.floor(Math.random() * problems.length)];
      return {
        domain: 'arithmetic',
        operation: 'division',
        category,
        tier,
        num1: p.n1,
        num2: p.n2,
        operator: '÷',
        correctAnswer: p.ans.toString(),
        isTextProblem: true,
        text: p.text,
        explanation: `${p.n1} ÷ ${p.n2} = ${p.ans}`
      };
    }

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