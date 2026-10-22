/**
 * ShapesEngine.js
 * Generator för geometriska former med 3-stegs kognitiv progression:
 * 
 * Brons: Enkel visuell igenkänning (Namngivning, Hörn/Sidor, Ja/Nej-frågor)
 * Silver: Sammansatta former (2 former ihop, Räkna totalt antal hörn, Identifiera par)
 * Guld: Abstrakt problemlösning (Ingen bild i frågan, Textbaserade gåtor, Uteslutning)
 */
export class ShapesEngine {
  constructor() {
    this.shapesData = {
      triangel: { name: 'Triangel', corners: 3, sides: 3 },
      kvadrat: { name: 'Kvadrat', corners: 4, sides: 4 },
      rektangel: { name: 'Rektangel', corners: 4, sides: 4 },
      cirkel: { name: 'Cirkel', corners: 0, sides: 1 },
      femhorning: { name: 'Femhörning', corners: 5, sides: 5 },
      sexhorning: { name: 'Sexhörning', corners: 6, sides: 6 }
    };
  }

  generateQuestion(category = 'former', tier = 'brons') {
    if (tier === 'silver') {
      return this.generateSilver();
    } else if (tier === 'guld') {
      return this.generateGuld();
    }
    return this.generateBrons();
  }

  // --- BRONSNIVÅ: ENKEL VISUELL IGENKÄNNING (1 FORM) ---
  generateBrons() {
    const keys = Object.keys(this.shapesData);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const shape = this.shapesData[key];
    const qtype = ['name', 'corners', 'sides', 'yesno'][Math.floor(Math.random() * 4)];

    if (qtype === 'name') {
      const options = this.shuffleOptions(shape.name, [
        'Triangel', 'Kvadrat', 'Rektangel', 'Cirkel', 'Femhörning', 'Sexhörning'
      ]);
      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'brons',
        shapeType: key,
        text: 'Vad heter den här formen?',
        correctAnswer: shape.name,
        options,
        isVisual: true
      };
    } else if (qtype === 'corners') {
      const correctAnswer = shape.corners.toString();
      const options = this.shuffleOptions(correctAnswer, ['0', '3', '4', '5', '6']);
      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'brons',
        shapeType: key,
        text: `Hur många hörn har en ${shape.name.toLowerCase()}?`,
        correctAnswer,
        options,
        isVisual: true
      };
    } else if (qtype === 'sides') {
      const correctAnswer = shape.sides.toString();
      const options = this.shuffleOptions(correctAnswer, ['1', '3', '4', '5', '6']);
      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'brons',
        shapeType: key,
        text: `Hur många sidor har en ${shape.name.toLowerCase()}?`,
        correctAnswer,
        options,
        isVisual: true
      };
    } else {
      // Ja/Nej (Sant/Falskt)
      const isTrue = Math.random() > 0.5;
      let text = '';
      let correctAnswer = '';

      if (isTrue) {
        text = `Har en ${shape.name.toLowerCase()} ${shape.corners} hörn?`;
        correctAnswer = 'Ja';
      } else {
        const wrongCorners = [0, 3, 4, 5, 6].filter(c => c !== shape.corners)[Math.floor(Math.random() * 4)];
        text = `Har en ${shape.name.toLowerCase()} ${wrongCorners} hörn?`;
        correctAnswer = 'Nej';
      }

      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'brons',
        shapeType: key,
        text,
        correctAnswer,
        options: ['Ja', 'Nej'],
        isVisual: true,
        isYesNo: true
      };
    }
  }

  // --- SILVERNIVÅ: SAMMANSATTA FORMER (2 FORMER IHOP) ---
  generateSilver() {
    const qtype = ['total_corners', 'identify_combination', 'double_shape'][Math.floor(Math.random() * 3)];
    const available = ['triangel', 'kvadrat', 'rektangel', 'femhorning', 'cirkel'];

    if (qtype === 'total_corners') {
      const k1 = available[Math.floor(Math.random() * available.length)];
      let k2 = available[Math.floor(Math.random() * available.length)];
      while (k1 === k2) k2 = available[Math.floor(Math.random() * available.length)];

      const s1 = this.shapesData[k1];
      const s2 = this.shapesData[k2];
      const tot = s1.corners + s2.corners;
      const correctAnswer = tot.toString();

      const options = this.shuffleOptions(correctAnswer, [
        correctAnswer,
        (tot - 1).toString(),
        (tot + 1).toString(),
        (tot + 2).toString()
      ]);

      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'silver',
        shapeType: k1,
        secondaryShape: k2,
        text: `Hur många hörn har en ${s1.name.toLowerCase()} och en ${s2.name.toLowerCase()} tillsammans?`,
        correctAnswer,
        options,
        isComposite: true
      };
    } else if (qtype === 'double_shape') {
      const k = ['triangel', 'kvadrat', 'femhorning'][Math.floor(Math.random() * 3)];
      const s = this.shapesData[k];
      const tot = s.corners * 2;
      const correctAnswer = tot.toString();

      const namePlural = k === 'triangel' ? 'trianglar' : `${s.name.toLowerCase()}er`;
      const options = this.shuffleOptions(correctAnswer, [
        correctAnswer,
        (tot - 2).toString(),
        (tot + 1).toString(),
        (tot + 2).toString()
      ]);

      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'silver',
        shapeType: k,
        secondaryShape: k,
        text: `Hur många hörn har två ${namePlural} tillsammans?`,
        correctAnswer,
        options,
        isComposite: true
      };
    } else {
      // Identifiera kombination
      const combos = [
        { k1: 'triangel', k2: 'kvadrat', sum: 7, label: 'Triangel + Kvadrat' },
        { k1: 'triangel', k2: 'triangel', sum: 6, label: 'Triangel + Triangel' },
        { k1: 'kvadrat', k2: 'kvadrat', sum: 8, label: 'Kvadrat + Kvadrat' },
        { k1: 'cirkel', k2: 'triangel', sum: 3, label: 'Cirkel + Triangel' },
        { k1: 'femhorning', k2: 'triangel', sum: 8, label: 'Femhörning + Triangel' }
      ];
      const target = combos[Math.floor(Math.random() * combos.length)];
      const options = this.shuffleOptions(target.label, combos.map(c => c.label));

      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'silver',
        shapeType: target.k1,
        secondaryShape: target.k2,
        text: `Vilka två former har tillsammans ${target.sum} hörn?`,
        correctAnswer: target.label,
        options,
        isComposite: true
      };
    }
  }

  // --- GULDNIVÅ: ABSTRAKT PROBLEMLÖSNING (INGEN BILD I FRÅGAN) ---
  generateGuld() {
    const qtype = ['riddle', 'word_problem', 'exclusion'][Math.floor(Math.random() * 3)];

    if (qtype === 'riddle') {
      const riddles = [
        {
          text: 'Jag är en form med 4 hörn. Alla mina 4 sidor är exakt lika långa. Vad är jag?',
          correctAnswer: 'Kvadrat',
          options: ['Kvadrat', 'Rektangel', 'Triangel', 'Cirkel'],
          shapeType: 'kvadrat'
        },
        {
          text: 'Jag har 4 hörn. Mina två långa sidor är lika långa och mina två korta sidor är lika långa. Vad är jag?',
          correctAnswer: 'Rektangel',
          options: ['Rektangel', 'Kvadrat', 'Triangel', 'Cirkel'],
          shapeType: 'rektangel'
        },
        {
          text: 'Jag är helt rund och har inga hörn alls. Jag kan rulla. Vad är jag?',
          correctAnswer: 'Cirkel',
          options: ['Cirkel', 'Kvadrat', 'Triangel', 'Femhörning'],
          shapeType: 'cirkel'
        },
        {
          text: 'Jag har 3 spetsiga hörn och 3 raka sidor. Vad är jag?',
          correctAnswer: 'Triangel',
          options: ['Triangel', 'Kvadrat', 'Cirkel', 'Sexhörning'],
          shapeType: 'triangel'
        }
      ];
      const p = riddles[Math.floor(Math.random() * riddles.length)];
      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'guld',
        shapeType: p.shapeType,
        text: p.text,
        correctAnswer: p.correctAnswer,
        options: this.shuffleArray([...p.options]),
        isAbstractProblem: true
      };
    } else if (qtype === 'word_problem') {
      const problems = [
        {
          text: 'Du har 3 trianglar på bordet. Hur många hörn har de tillsammans?',
          correctAnswer: '9',
          options: ['9', '6', '8', '12'],
          shapeType: 'triangel'
        },
        {
          text: 'Du har 2 kvadrater och 1 triangel. Hur många hörn har alla tre former tillsammans?',
          correctAnswer: '11',
          options: ['11', '10', '12', '9'],
          shapeType: 'kvadrat'
        },
        {
          text: 'En form har 5 hörn. Om du lägger till en triangel, hur många hörn har du totalt?',
          correctAnswer: '8',
          options: ['8', '7', '9', '10'],
          shapeType: 'femhorning'
        }
      ];
      const p = problems[Math.floor(Math.random() * problems.length)];
      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'guld',
        shapeType: p.shapeType,
        text: p.text,
        correctAnswer: p.correctAnswer,
        options: this.shuffleArray([...p.options]),
        isAbstractProblem: true
      };
    } else {
      const exclusions = [
        {
          text: 'Vilken form har FLER än 3 hörn?',
          correctAnswer: 'Kvadrat',
          options: ['Kvadrat', 'Triangel', 'Cirkel', 'Ingen av dem'],
          shapeType: 'kvadrat'
        },
        {
          text: 'Vilken form har FLER hörn än en triangel?',
          correctAnswer: 'Femhörning',
          options: ['Femhörning', 'Cirkel', 'Triangel', 'Ingen'],
          shapeType: 'femhorning'
        },
        {
          text: 'Vilken form har INGA hörn alls?',
          correctAnswer: 'Cirkel',
          options: ['Cirkel', 'Triangel', 'Kvadrat', 'Rektangel'],
          shapeType: 'cirkel'
        }
      ];
      const p = exclusions[Math.floor(Math.random() * exclusions.length)];
      return {
        domain: 'geometry',
        operation: 'shapes',
        category: 'former',
        tier: 'guld',
        shapeType: p.shapeType,
        text: p.text,
        correctAnswer: p.correctAnswer,
        options: this.shuffleArray([...p.options]),
        isAbstractProblem: true
      };
    }
  }

  shuffleOptions(correct, alternatives) {
    const set = new Set([correct]);
    alternatives.forEach(a => set.add(a));
    const arr = Array.from(set).slice(0, 4);
    return this.shuffleArray(arr);
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  generate(category = 'former', tier = 'brons') {
    return this.generateQuestion(category, tier);
  }
}

export default ShapesEngine;