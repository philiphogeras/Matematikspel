export const WORD_PROBLEMS = {
  // ... (behåll addition, subtraction, multiplication)

  division: [
    () => {
      const name = getRandom(NAMES);
      const item = getRandom(ITEMS);
      const people = rand(2, 5);
      const perPerson = rand(2, 6);
      const total = people * perPerson;
      return {
        text: `${name} har ${total} ${item} som hen vill dela lika med ${people} kompisar. Hur många ${item} får varje kompis?`,
        num1: total, num2: people, operator: '÷', answer: perPerson
      };
    },
    () => {
      const name = getRandom(NAMES);
      const total = rand(2, 6) * 10;
      const notes = rand(2, 5);
      const noteValue = total / notes;
      return {
        text: `${name} har ${total} kr uppdelat på ${notes} lika stora sedlar. Hur mycket är varje sedel värd?`,
        num1: total, num2: notes, operator: '÷', answer: noteValue
      };
    },
    () => {
      const name = getRandom(NAMES);
      const totalPencils = rand(3, 8) * 4;
      const boxes = 4;
      return {
        text: `${name} delar upp ${totalPencils} pennor lika i ${boxes} askar. Hur många pennor hamnar i varje ask?`,
        num1: totalPencils, num2: boxes, operator: '÷', answer: totalPencils / boxes
      };
    },
    () => {
      const name = getRandom(NAMES);
      const groups = rand(2, 5);
      const perGroup = rand(3, 8);
      const total = groups * perGroup;
      return {
        text: `${total} elever ska dela upp sig i ${groups} lika stora grupper. Hur många elever blir det i varje grupp?`,
        num1: total, num2: groups, operator: '÷', answer: perGroup
      };
    },
    () => {
      const name = getRandom(NAMES);
      const totalKakor = rand(2, 5) * 6;
      const kakorPerPase = 6;
      return {
        text: `${name} har bakat ${totalKakor} kakor och lägger ${kakorPerPase} kakor i varje påse. Hur många påsar blir det?`,
        num1: totalKakor, num2: kakorPerPase, operator: '÷', answer: totalKakor / kakorPerPase
      };
    },
    () => {
      const name = getRandom(NAMES);
      const totalKr = rand(2, 6) * 5;
      const pricePerGlass = 5;
      return {
        text: `${name} har ${totalKr} kr. En tuggummiboll kostar ${pricePerGlass} kr. Hur många bollar kan ${name} köpa?`,
        num1: totalKr, num2: pricePerGlass, operator: '÷', answer: totalKr / pricePerGlass
      };
    }
  ]
};