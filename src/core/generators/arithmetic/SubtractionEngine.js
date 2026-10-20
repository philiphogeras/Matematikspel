export class SubtractionEngine {
  generateQuestion(category = 'ental', tier = 'brons') {
    if (category === 'problemlosning') {
      const problems = [
        { text: 'Oskar har 10 godisbitar och äter upp 3.\nHur många godisbitar har han kvar?', n1: 10, n2: 3, ans: 7 },
        { text: 'Du har 50 kronor och köper en dricka för 15 kronor.\nHur mycket pengar har du kvar?', n1: 50, n2: 15, ans: 35 },
        { text: 'Det finns 15 elever i klassrummet. 6 elever går ut på rast.\nHur många elever är kvar?', n1: 15, n2: 6, ans: 9 },
        { text: 'En boksida har 20 rader. Du har läst 12 rader.\nHur många rader har du kvar att läsa?', n1: 20, n2: 12, ans: 8 },
        { text: 'Lina plockade 14 jordgubbar och åt upp 5.\nHur många jordgubbar har hon kvar?', n1: 14, n2: 5, ans: 9 }
      ];
      const p = problems[Math.floor(Math.random() * problems.length)];
      return {
        domain: 'arithmetic',
        operation: 'subtraction',
        category,
        tier,
        num1: p.n1,
        num2: p.n2,
        operator: '–',
        correctAnswer: p.ans.toString(),
        isTextProblem: true,
        text: p.text,
        explanation: `${p.n1} – ${p.n2} = ${p.ans}`
      };
    }

    let num1 = 0;
    let num2 = 0;

    if (category === 'ental') {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * (num1 + 1));
    } else if (category === 'tiotal') {
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * (num1 - 10 + 1)) + 10;
    } else if (category === 'hundratal') {
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * (num1 - 100 + 1)) + 100;
    } else {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * (num1 + 1));
    }

    return {
      domain: 'arithmetic',
      operation: 'subtraction',
      category,
      tier,
      num1,
      num2,
      operator: '–',
      correctAnswer: (num1 - num2).toString(),
      text: `${num1} – ${num2} = ?`
    };
  }

  generate(category = 'ental', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}