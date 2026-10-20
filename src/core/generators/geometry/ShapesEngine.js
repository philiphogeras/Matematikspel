/**
 * ShapesEngine.js
 * Genererar frågor för geometriska former (Brons, Silver, Guld).
 */
export class ShapesEngine {
  constructor() {
    this.shapesBronze = [
      { name: 'kvadrat', displayName: 'Kvadrat', vertices: 4, sides: 4, optionKey: '1' },
      { name: 'rektangel', displayName: 'Rektangel', vertices: 4, sides: 4, optionKey: '2' },
      { name: 'triangel', displayName: 'Triangel', vertices: 3, sides: 3, optionKey: '3' },
      { name: 'cirkel', displayName: 'Cirkel', vertices: 0, sides: 0, optionKey: '4' }
    ];
  }

  /**
   * Huvudmetod för att generera en fråga baserat på nivå.
   */
  generateQuestion(tier = 'brons') {
    if (tier === 'brons') {
      return this.generateBronzeQuestion();
    }
    // Fallback för framtida Silver/Guld
    return this.generateBronzeQuestion();
  }

  generateBronzeQuestion() {
    const shape = this.shapesBronze[Math.floor(Math.random() * this.shapesBronze.length)];
    const questionType = Math.floor(Math.random() * 3); // 0: namnge, 1: hörn, 2: sidor

    if (questionType === 0) {
      // Frågetyp 1: Namnge figuren via val 1-4
      return {
        domain: 'geometry',
        subDomain: 'shapes',
        tier: 'brons',
        shapeType: shape.name,
        shapeDisplayName: shape.displayName,
        isGeometry: true,
        questionType: 'identify',
        text: `Vad heter figuren?\n1: Kvadrat   2: Rektangel\n3: Triangel   4: Cirkel`,
        correctAnswer: shape.optionKey,
        showVertices: false,
        explanation: `Figuren är en ${shape.displayName.toLowerCase()}. Svarsalternativ ${shape.optionKey}.`
      };
    } else if (questionType === 1) {
      // Frågetyp 2: Räkna hörn (visar röda hörnmarkeringar)
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
      // Frågetyp 3: Räkna raka sidor
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