/**
 * ShapesEngine.js
 * Genererar frågor för geometriska former (Brons, Silver, Guld).
 */
export class ShapesEngine {
  constructor() {
    this.shapesBronze = [
      { name: 'kvadrat', displayName: 'Kvadrat', vertices: 4, sides: 4 },
      { name: 'rektangel', displayName: 'Rektangel', vertices: 4, sides: 4 },
      { name: 'triangel', displayName: 'Triangel', vertices: 3, sides: 3 },
      { name: 'cirkel', displayName: 'Cirkel', vertices: 0, sides: 0 }
    ];
  }

  generateQuestion(tier = 'brons') {
    const shape = this.shapesBronze[Math.floor(Math.random() * this.shapesBronze.length)];
    const questionType = Math.floor(Math.random() * 3); // 0: namnge, 1: hörn, 2: sidor

    if (questionType === 0) {
      // Frågetyp 1: Namnge figuren med svarsknappar ("svar-rutor")
      return {
        domain: 'geometry',
        subDomain: 'shapes',
        tier: 'brons',
        shapeType: shape.name,
        shapeDisplayName: shape.displayName,
        isGeometry: true,
        questionType: 'identify',
        text: 'Vad heter figuren?',
        options: [
          { label: 'Kvadrat', value: 'kvadrat' },
          { label: 'Rektangel', value: 'rektangel' },
          { label: 'Triangel', value: 'triangel' },
          { label: 'Cirkel', value: 'cirkel' }
        ],
        correctAnswer: shape.name,
        showVertices: false,
        explanation: `Figuren är en ${shape.displayName.toLowerCase()}.`
      };
    } else if (questionType === 1) {
      // Frågetyp 2: Räkna hörn (använder sifferknappsats)
      return {
        domain: 'geometry',
        subDomain: 'shapes',
        tier: 'brons',
        shapeType: shape.name,
        shapeDisplayName: shape.displayName,
        isGeometry: true,
        questionType: 'vertices',
        text: `Hur många hörn har en ${shape.displayName.toLowerCase()}?`,
        correctAnswer: shape.vertices.toString(),
        showVertices: true,
        explanation: `En ${shape.displayName.toLowerCase()} har ${shape.vertices} hörn.`
      };
    } else {
      // Frågetyp 3: Räkna raka sidor (använder sifferknappsats)
      return {
        domain: 'geometry',
        subDomain: 'shapes',
        tier: 'brons',
        shapeType: shape.name,
        shapeDisplayName: shape.displayName,
        isGeometry: true,
        questionType: 'sides',
        text: `Hur många raka sidor har en ${shape.displayName.toLowerCase()}?`,
        correctAnswer: shape.sides.toString(),
        showVertices: false,
        explanation: `En ${shape.displayName.toLowerCase()} har ${shape.sides} raka sidor.`
      };
    }
  }
}