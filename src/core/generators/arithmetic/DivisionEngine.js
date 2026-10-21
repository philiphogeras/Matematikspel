export class DivisionEngine {
  generateQuestion(category = 'tabell_2_5_10', tier = 'brons') {
    if (category === 'problemlosning') {
      return this.generateProblemQuestion(tier);
    }

    let tables = [2, 5, 10];
    if (category === 'tabell_3_4_6') tables = [3, 4, 6];
    if (category === 'tabell_7_8_9') tables = [7, 8, 9];

    // 1. BRONSNIVÅ: Standard två termer (a ÷ b = ?)
    if (tier === 'brons') {
      const divisor = tables[Math.floor(Math.random() * tables.length)];
      const quotient = Math.floor(Math.random() * 10) + 1;
      const dividend = divisor * quotient;

      return {
        domain: 'arithmetic',
        operation: 'division',
        category,
        tier,
        num1: dividend,
        num2: divisor,
        operator: '÷',
        correctAnswer: quotient.toString(),
        text: `${dividend} ÷ ${divisor} = ?`
      };
    }

    // 2. SILVERNIVÅ: Okänd term (a ÷ ? = c eller ? ÷ b = c)
    if (tier === 'silver') {
      const isMissingTerm = Math.random() > 0.3;
      const divisor = tables[Math.floor(Math.random() * tables.length)];
      const quotient = Math.floor(Math.random() * 10) + 1;
      const dividend = divisor * quotient;

      if (isMissingTerm) {
        const firstIsMissing = Math.random() > 0.5;
        if (firstIsMissing) {
          // ? ÷ divisor = quotient -> svar är dividend
          return {
            domain: 'arithmetic',
            operation: 'division',
            category,
            tier,
            operator: '÷',
            correctAnswer: dividend.toString(),
            isCustomFormat: true,
            text: `? ÷ ${divisor} = ${quotient}`
          };
        } else {
          // dividend ÷ ? = quotient -> svar är divisor
          return {
            domain: 'arithmetic',
            operation: 'division',
            category,
            tier,
            operator: '÷',
            correctAnswer: divisor.toString(),
            isCustomFormat: true,
            text: `${dividend} ÷ ? = ${quotient}`
          };
        }
      }

      return {
        domain: 'arithmetic',
        operation: 'division',
        category,
        tier,
        num1: dividend,
        num2: divisor,
        operator: '÷',
        correctAnswer: quotient.toString(),
        text: `${dividend} ÷ ${divisor} = ?`
      };
    }

    // 3. GULDNIVÅ: Flerstegsdivision (t.ex. 24 ÷ 2 ÷ 2 = ?)
    if (tier === 'guld') {
      const finalQuotient = Math.floor(Math.random() * 5) + 2; // 2-6
      const div1 = Math.floor(Math.random() * 3) + 2; // 2-4
      const div2 = Math.floor(Math.random() * 2) + 2; // 2-3
      const startNum = finalQuotient * div1 * div2;

      const isMissing = Math.random() > 0.4;

      if (isMissing) {
        // Fråga med okänd divisor i steg 1 eller 2 (t.ex. 24 ÷ ? ÷ 2 = 6)
        return {
          domain: 'arithmetic',
          operation: 'division',
          category,
          tier,
          operator: '÷',
          correctAnswer: div1.toString(),
          isCustomFormat: true,
          text: `${startNum} ÷ ? ÷ ${div2} = ${finalQuotient}`
        };
      } else {
        return {
          domain: 'arithmetic',
          operation: 'division',
          category,
          tier,
          operator: '÷',
          correctAnswer: finalQuotient.toString(),
          isCustomFormat: true,
          text: `${startNum} ÷ ${div1} ÷ ${div2} = ?`
        };
      }
    }

    return {
      domain: 'arithmetic',
      operation: 'division',
      category,
      tier,
      num1: 10,
      num2: 2,
      operator: '÷',
      correctAnswer: '5',
      text: '10 ÷ 2 = ?'
    };
  }

  generateProblemQuestion(tier) {
    const problems = [
      { text: '12 kakor ska delas lika på 3 barn.\nHur många kakor får varje barn?', ans: 4 },
      { text: 'En pizza delas i 8 bitar. 2 kompisar delar lika på den.\nHur många bitar får de var?', ans: 4 },
      { text: 'Du har 20 kronor och varje tuggummi kostar 5 kronor.\nHur många tuggummin kan du köpa?', ans: 4 }
    ];
    const p = problems[Math.floor(Math.random() * problems.length)];
    return {
      domain: 'arithmetic',
      operation: 'division',
      category: 'problemlosning',
      tier,
      operator: '÷',
      correctAnswer: p.ans.toString(),
      isTextProblem: true,
      text: p.text
    };
  }

  generate(category = 'tabell_2_5_10', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}