export class MultiplicationEngine {
  generateQuestion(category = 'tabell_2_5_10', tier = 'brons') {
    if (category === 'problemlosning') {
      return this.generateProblemQuestion(tier);
    }

    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    // 1. BRONSNIVÅ: Standard två termer (a × b = ?)
    if (tier === 'brons') {
      const num1 = tables[Math.floor(Math.random() * tables.length)];
      const num2 = Math.floor(Math.random() * 10) + 1; // 1-10

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

    // 2. SILVERNIVÅ: Okänd term (a × ? = c eller ? × b = c)
    if (tier === 'silver') {
      const isMissingTerm = Math.random() > 0.3;
      const num1 = tables[Math.floor(Math.random() * tables.length)];
      const num2 = Math.floor(Math.random() * 10) + 1;
      const prod = num1 * num2;

      if (isMissingTerm) {
        const firstIsMissing = Math.random() > 0.5;
        if (firstIsMissing) {
          return {
            domain: 'arithmetic',
            operation: 'multiplication',
            category,
            tier,
            operator: '×',
            correctAnswer: num1.toString(),
            isCustomFormat: true,
            text: `? × ${num2} = ${prod}`
          };
        } else {
          return {
            domain: 'arithmetic',
            operation: 'multiplication',
            category,
            tier,
            operator: '×',
            correctAnswer: num2.toString(),
            isCustomFormat: true,
            text: `${num1} × ? = ${prod}`
          };
        }
      }

      return {
        domain: 'arithmetic',
        operation: 'multiplication',
        category,
        tier,
        num1,
        num2,
        operator: '×',
        correctAnswer: prod.toString(),
        text: `${num1} × ${num2} = ?`
      };
    }

    // 3. GULDNIVÅ: 3 termer (t.ex. 2 × 3 × 2 = ?)
    if (tier === 'guld') {
      // Håll talen låga så att produkten förblir rimlig
      const factor1 = Math.floor(Math.random() * 4) + 2; // 2-5
      const factor2 = Math.floor(Math.random() * 3) + 2; // 2-4
      const factor3 = Math.floor(Math.random() * 2) + 2; // 2-3
      const totalProd = factor1 * factor2 * factor3;

      const isMissing = Math.random() > 0.4;
      const factors = [factor1, factor2, factor3];

      if (isMissing) {
        const missingIndex = Math.floor(Math.random() * 3);
        const correctAnswer = factors[missingIndex].toString();
        const displayTerms = factors.map((f, idx) => (idx === missingIndex ? '?' : f));

        return {
          domain: 'arithmetic',
          operation: 'multiplication',
          category,
          tier,
          operator: '×',
          correctAnswer,
          isCustomFormat: true,
          text: `${displayTerms.join(' × ')} = ${totalProd}`
        };
      } else {
        return {
          domain: 'arithmetic',
          operation: 'multiplication',
          category,
          tier,
          operator: '×',
          correctAnswer: totalProd.toString(),
          isCustomFormat: true,
          text: `${factors.join(' × ')} = ?`
        };
      }
    }

    return {
      domain: 'arithmetic',
      operation: 'multiplication',
      category,
      tier,
      num1: 2,
      num2: 5,
      operator: '×',
      correctAnswer: '10',
      text: '2 × 5 = ?'
    };
  }

  generateProblemQuestion(tier) {
    const problems = [
      { text: 'Det står 4 påsar på bordet. I varje påse finns 5 äpplen.\nHur många äpplen finns det totalt?', ans: 20 },
      { text: 'En spindel har 8 ben. Hur många ben har 3 spindlar tillsammans?', ans: 24 },
      { text: 'Lina köper 6 pennor som kostar 3 kronor styck.\nHur mycket kostar det sammanlagt?', ans: 18 }
    ];
    const p = problems[Math.floor(Math.random() * problems.length)];
    return {
      domain: 'arithmetic',
      operation: 'multiplication',
      category: 'problemlosning',
      tier,
      operator: '×',
      correctAnswer: p.ans.toString(),
      isTextProblem: true,
      text: p.text
    };
  }

  generate(category = 'tabell_2_5_10', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}