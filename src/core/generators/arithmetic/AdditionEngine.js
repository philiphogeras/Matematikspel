export class AdditionEngine {
  generateQuestion(category = 'ental', tier = 'brons') {
    if (category === 'problemlosning') {
      const problems = [
        { text: 'Emma har 5 äpplen och köper 4 till.\nHur många äpplen har hon sammanlagt?', n1: 5, n2: 4, ans: 9 },
        { text: 'Lukas har 12 kronor och får 15 kronor till.\nHur mycket pengar har han nu?', n1: 12, n2: 15, ans: 27 },
        { text: 'Det står 8 bilar på parkeringen. Det kommer 6 bilar till.\nHur många bilar står där nu?', n1: 8, n2: 6, ans: 14 },
        { text: 'Klassen läser 10 sidor på morgonen och 8 sidor på eftermiddagen.\nHur många sidor har de läst totalt?', n1: 10, n2: 8, ans: 18 },
        { text: 'Maja bakade 7 kanelbullar och 9 vaniljbullar.\nHur många bullar bakade hon sammanlagt?', n1: 7, n2: 9, ans: 16 }
      ];
      const p = problems[Math.floor(Math.random() * problems.length)];
      return {
        domain: 'arithmetic',
        operation: 'addition',
        category,
        tier,
        num1: p.n1,
        num2: p.n2,
        operator: '+',
        correctAnswer: p.ans.toString(),
        isTextProblem: true,
        text: p.text,
        explanation: `${p.n1} + ${p.n2} = ${p.ans}`
      };
    }

    let num1 = 0;
    let num2 = 0;

    if (category === 'ental') {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
    } else if (category === 'tiotal') {
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
    } else if (category === 'hundratal') {
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * 900) + 100;
    } else {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
    }

    return {
      domain: 'arithmetic',
      operation: 'addition',
      category,
      tier,
      num1,
      num2,
      operator: '+',
      correctAnswer: (num1 + num2).toString(),
      text: `${num1} + ${num2} = ?`
    };
  }

  generate(category = 'ental', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}