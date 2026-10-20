export class AdditionEngine {
  generateQuestion(category = 'ental', tier = 'brons') {
    // 1. TEXTUPPGIFTER / PROBLEMLÖSNING
    if (category === 'problemlosning') {
      return this.generateProblemQuestion(tier);
    }

    // Bestäm sifferintervall baserat på kategori
    let maxNum = 9;
    let minNum = 0;
    if (category === 'tiotal') {
      maxNum = 50;
      minNum = 10;
    } else if (category === 'hundratal') {
      maxNum = 500;
      minNum = 100;
    }

    // 2. BRONSNIVÅ: Standard två termer (a + b = ?)
    if (tier === 'brons') {
      const num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      const num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      
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

    // 3. SILVERNIVÅ: Okänd term (a + ? = c eller ? + b = c)
    if (tier === 'silver') {
      const isMissingTerm = Math.random() > 0.3; // 70% chans för okänd term
      const num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      const num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      const sum = num1 + num2;

      if (isMissingTerm) {
        const firstIsMissing = Math.random() > 0.5;
        if (firstIsMissing) {
          return {
            domain: 'arithmetic',
            operation: 'addition',
            category,
            tier,
            correctAnswer: num1.toString(),
            isCustomFormat: true,
            text: `? + ${num2} = ${sum}`
          };
        } else {
          return {
            domain: 'arithmetic',
            operation: 'addition',
            category,
            tier,
            correctAnswer: num2.toString(),
            isCustomFormat: true,
            text: `${num1} + ? = ${sum}`
          };
        }
      }

      return {
        domain: 'arithmetic',
        operation: 'addition',
        category,
        tier,
        num1,
        num2,
        operator: '+',
        correctAnswer: sum.toString(),
        text: `${num1} + ${num2} = ?`
      };
    }

    // 4. GULDNIVÅ: 3-4 termer, ibland med okänd term
    if (tier === 'guld') {
      const termCount = Math.random() > 0.5 ? 3 : 4;
      const terms = [];

      const stepMax = category === 'ental' ? 6 : category === 'tiotal' ? 25 : 150;
      
      for (let i = 0; i < termCount; i++) {
        terms.push(Math.floor(Math.random() * stepMax) + 1);
      }

      const totalSum = terms.reduce((a, b) => a + b, 0);
      const isMissing = Math.random() > 0.4;

      if (isMissing) {
        const missingIndex = Math.floor(Math.random() * termCount);
        const correctAnswer = terms[missingIndex].toString();
        const displayTerms = terms.map((t, idx) => (idx === missingIndex ? '?' : t));
        
        return {
          domain: 'arithmetic',
          operation: 'addition',
          category,
          tier,
          correctAnswer,
          isCustomFormat: true,
          text: `${displayTerms.join(' + ')} = ${totalSum}`
        };
      } else {
        return {
          domain: 'arithmetic',
          operation: 'addition',
          category,
          tier,
          correctAnswer: totalSum.toString(),
          isCustomFormat: true,
          text: `${terms.join(' + ')} = ?`
        };
      }
    }

    return {
      domain: 'arithmetic',
      operation: 'addition',
      category,
      tier,
      num1: 2,
      num2: 3,
      operator: '+',
      correctAnswer: '5',
      text: '2 + 3 = ?'
    };
  }

  generateProblemQuestion(tier) {
    const problems = [
      { text: 'Emma har 5 äpplen och köper 4 till.\nHur många äpplen har hon sammanlagt?', ans: 9 },
      { text: 'Lukas har 12 kronor och får 15 kronor till.\nHur mycket pengar har han nu?', ans: 27 },
      { text: 'Det står 8 bilar på parkeringen. Det kommer 6 bilar till.\nHur många bilar står där nu?', ans: 14 },
      { text: 'Klassen läser 10 sidor på morgonen och 8 sidor på eftermiddagen.\nHur många sidor har de läst totalt?', ans: 18 },
      { text: 'Maja bakade 7 kanelbullar och 9 vaniljbullar.\nHur många bullar bakade hon sammanlagt?', ans: 16 }
    ];
    const p = problems[Math.floor(Math.random() * problems.length)];
    return {
      domain: 'arithmetic',
      operation: 'addition',
      category: 'problemlosning',
      tier,
      operator: '+',
      correctAnswer: p.ans.toString(),
      isTextProblem: true,
      text: p.text
    };
  }

  generate(category = 'ental', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}