export class SubtractionEngine {
  generateQuestion(category = 'ental', tier = 'brons') {
    if (category === 'problemlosning') {
      return this.generateProblemQuestion(tier);
    }

    let maxNum = 10;
    let minNum = 1;
    if (category === 'tiotal') {
      maxNum = 50;
      minNum = 10;
    } else if (category === 'hundratal') {
      maxNum = 500;
      minNum = 100;
    }

    // 1. BRONSNIVÅ: Standard två termer (a - b = ?)
    if (tier === 'brons') {
      const b = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      const diff = Math.floor(Math.random() * maxNum) + 1;
      const a = b + diff; // Säkerställ positiva tal

      return {
        domain: 'arithmetic',
        operation: 'subtraction',
        category,
        tier,
        num1: a,
        num2: b,
        operator: '–',
        correctAnswer: diff.toString(),
        text: `${a} – ${b} = ?`
      };
    }

    // 2. SILVERNIVÅ: Okänd term (a – ? = c eller ? – b = c)
    if (tier === 'silver') {
      const isMissingTerm = Math.random() > 0.3; // 70% okänd term
      const b = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      const diff = Math.floor(Math.random() * maxNum) + 1;
      const a = b + diff;

      if (isMissingTerm) {
        const firstIsMissing = Math.random() > 0.5;
        if (firstIsMissing) {
          // ? - b = diff -> svar är a
          return {
            domain: 'arithmetic',
            operation: 'subtraction',
            category,
            tier,
            operator: '–',
            correctAnswer: a.toString(),
            isCustomFormat: true,
            text: `? – ${b} = ${diff}`
          };
        } else {
          // a - ? = diff -> svar är b
          return {
            domain: 'arithmetic',
            operation: 'subtraction',
            category,
            tier,
            operator: '–',
            correctAnswer: b.toString(),
            isCustomFormat: true,
            text: `${a} – ? = ${diff}`
          };
        }
      }

      return {
        domain: 'arithmetic',
        operation: 'subtraction',
        category,
        tier,
        num1: a,
        num2: b,
        operator: '–',
        correctAnswer: diff.toString(),
        text: `${a} – ${b} = ?`
      };
    }

    // 3. GULDNIVÅ: Flerstegsräkning (3-4 termer)
    if (tier === 'guld') {
      const termCount = Math.random() > 0.5 ? 3 : 4;
      const stepMax = category === 'ental' ? 4 : category === 'tiotal' ? 15 : 80;

      // Generera termer baklänges så resultat alltid blir positivt
      let currentResult = Math.floor(Math.random() * stepMax) + 1;
      const subTerms = [];
      for (let i = 0; i < termCount - 1; i++) {
        const sub = Math.floor(Math.random() * stepMax) + 1;
        subTerms.push(sub);
      }
      
      const startNum = currentResult + subTerms.reduce((acc, v) => acc + v, 0);
      const allTerms = [startNum, ...subTerms];
      const isMissing = Math.random() > 0.4;

      if (isMissing) {
        // Välj slumpmässigt en av subTerms som okänd
        const missingSubIndex = Math.floor(Math.random() * subTerms.length) + 1;
        const correctAnswer = allTerms[missingSubIndex].toString();
        const displayTerms = allTerms.map((t, idx) => (idx === missingSubIndex ? '?' : t));

        return {
          domain: 'arithmetic',
          operation: 'subtraction',
          category,
          tier,
          operator: '–',
          correctAnswer,
          isCustomFormat: true,
          text: `${displayTerms.join(' – ')} = ${currentResult}`
        };
      } else {
        return {
          domain: 'arithmetic',
          operation: 'subtraction',
          category,
          tier,
          operator: '–',
          correctAnswer: currentResult.toString(),
          isCustomFormat: true,
          text: `${allTerms.join(' – ')} = ?`
        };
      }
    }

    return {
      domain: 'arithmetic',
      operation: 'subtraction',
      category,
      tier,
      num1: 8,
      num2: 3,
      operator: '–',
      correctAnswer: '5',
      text: '8 – 3 = ?'
    };
  }

  generateProblemQuestion(tier) {
    const problems = [
      { text: 'Oskar har 10 godisbitar och äter upp 3.\nHur många har han kvar?', ans: 7 },
      { text: 'Det fanns 15 fåglar på grenen, men 6 flög iväg.\nHur många fåglar sitter kvar?', ans: 9 },
      { text: 'Elin sparade 20 kronor och köpte en dricka för 12 kronor.\nHur mycket har hon kvar?', ans: 8 }
    ];
    const p = problems[Math.floor(Math.random() * problems.length)];
    return {
      domain: 'arithmetic',
      operation: 'subtraction',
      category: 'problemlosning',
      tier,
      operator: '–',
      correctAnswer: p.ans.toString(),
      isTextProblem: true,
      text: p.text
    };
  }

  generate(category = 'ental', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}