/**
 * wordProblems.js
 * Bank med 6 mallar per räknesätt för vardagsnära problemlösning.
 * Talen genereras dynamiskt inom rimliga ramar för anpassat gymnasium.
 */

const NAMES = ['Leo', 'Maja', 'Ali', 'Emma', 'Hugo', 'Sara', 'Liam', 'Elin'];
const ITEMS = ['äpplen', 'pennor', 'kort', 'klistermärken', 'bullar', 'böcker'];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const WORD_PROBLEMS = {
  addition: [
    () => {
      const name = getRandom(NAMES);
      const item = getRandom(ITEMS);
      const num1 = rand(5, 25);
      const num2 = rand(3, 15);
      return {
        text: `${name} har ${num1} ${item}. Hen får ${num2} ${item} till av en kompis. Hur många ${item} har ${name} nu?`,
        num1, num2, operator: '+', answer: num1 + num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(10, 50);
      const num2 = rand(10, 40);
      return {
        text: `${name} sparar pengar. Hen har ${num1} kr i plånboken och hittar ${num2} kr i en ficka. Hur mycket pengar har ${name} totalt?`,
        num1, num2, operator: '+', answer: num1 + num2
      };
    },
    () => {
      const name1 = getRandom(NAMES);
      let name2 = getRandom(NAMES);
      while (name1 === name2) name2 = getRandom(NAMES);
      const num1 = rand(8, 30);
      const num2 = rand(5, 25);
      return {
        text: `${name1} plockade ${num1} snäckor och ${name2} plockade ${num2} snäckor. Hur många snäckor plockade de tillsammans?`,
        num1, num2, operator: '+', answer: num1 + num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(15, 45);
      const num2 = rand(5, 20);
      return {
        text: `${name} bakade ${num1} chokladkakor på morgonen och ${num2} kakor på eftermiddagen. Hur många kakor bakade ${name} sammanlagt?`,
        num1, num2, operator: '+', answer: num1 + num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(20, 60);
      const num2 = rand(10, 30);
      return {
        text: `${name} gick ${num1} meter till bussen och sedan ${num2} meter till affären. Hur många meter gick ${name} totalt?`,
        num1, num2, operator: '+', answer: num1 + num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(12, 35);
      const num2 = rand(8, 25);
      return {
        text: `I ${name}s klass finns det ${num1} röda stolar och ${num2} blå stolar. Hur många stolar finns det totalt i klassrummet?`,
        num1, num2, operator: '+', answer: num1 + num2
      };
    }
  ],

  subtraction: [
    () => {
      const name = getRandom(NAMES);
      const item = getRandom(ITEMS);
      const num1 = rand(15, 40);
      const num2 = rand(5, num1 - 2);
      return {
        text: `${name} hade ${num1} ${item}. Hen gav bort ${num2} ${item} till sin bror. Hur många ${item} har ${name} kvar?`,
        num1, num2, operator: '-', answer: num1 - num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(30, 90);
      const num2 = rand(10, num1 - 5);
      return {
        text: `${name} hade ${num1} kr. Hen köpte en dricka för ${num2} kr. Hur mycket pengar har ${name} kvar?`,
        num1, num2, operator: '-', answer: num1 - num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(20, 50);
      const num2 = rand(5, num1 - 3);
      return {
        text: `${name} bakade ${num1} bullar. Kompisarna åt upp ${num2} av dem. Hur många bullar finns det kvar?`,
        num1, num2, operator: '-', answer: num1 - num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(25, 60);
      const num2 = rand(10, num1 - 5);
      return {
        text: `En bok har ${num1} sidor. ${name} har läst ${num2} sidor. Hur många sidor har ${name} kvar att läsa?`,
        num1, num2, operator: '-', answer: num1 - num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(15, 35);
      const num2 = rand(4, num1 - 2);
      return {
        text: `${name} hade ${num1} bussbiljetter. Hen har använt ${num2} biljetter. Hur många biljetter har ${name} kvar?`,
        num1, num2, operator: '-', answer: num1 - num2
      };
    },
    () => {
      const name = getRandom(NAMES);
      const num1 = rand(40, 100);
      const num2 = rand(15, num1 - 10);
      return {
        text: `${name}cyklade ${num1} kilometer på en vecka. Förra veckan cyklade hen ${num2} kilometer mindre. Hur många kilometer var det?`,
        num1, num2, operator: '-', answer: num1 - num2
      };
    }
  ],

  multiplication: [
    () => {
      const name = getRandom(NAMES);
      const groups = rand(2, 5);
      const perGroup = rand(2, 6);
      return {
        text: `${name} köper ${groups} påsar med ${perGroup} äpplen i varje påse. Hur många äpplen köpte ${name} totalt?`,
        num1: groups, num2: perGroup, operator: '×', answer: groups * perGroup
      };
    },
    () => {
      const name = getRandom(NAMES);
      const count = rand(2, 6);
      const price = rand(2, 10);
      return {
        text: `${name} köper ${count} glassar. Varje glass kostar ${price} kr. Hur mycket kostar alla glassar tillsammans?`,
        num1: count, num2: price, operator: '×', answer: count * price
      };
    },
    () => {
      const name = getRandom(NAMES);
      const boxes = rand(2, 5);
      const pencils = rand(3, 8);
      return {
        text: `${name} har ${boxes} askar med färgpennor. Det finns ${pencils} pennor i varje ask. Hur många pennor har ${name} sammanlagt?`,
        num1: boxes, num2: pencils, operator: '×', answer: boxes * pencils
      };
    },
    () => {
      const name = getRandom(NAMES);
      const days = rand(3, 7);
      const km = rand(2, 5);
      return {
        text: `${name} går ${km} kilometer varje dag i ${days} dagar. Hur många kilometer har ${name} gått totalt?`,
        num1: days, num2: km, operator: '×', answer: days * km
      };
    },
    () => {
      const name = getRandom(NAMES);
      const rows = rand(2, 5);
      const seats = rand(4, 8);
      return {
        text: `I en biosal finns det ${rows} rader med ${seats} stolar på varje rad. Hur många stolar finns det i salen?`,
        num1: rows, num2: seats, operator: '×', answer: rows * seats
      };
    },
    () => {
      const name = getRandom(NAMES);
      const packs = rand(2, 6);
      const cards = rand(5, 10);
      return {
        text: `${name} köpte ${packs} paket samlarkort. Det finns ${cards} kort i varje paket. Hur många kort fick ${name} sammanlagt?`,
        num1: packs, num2: cards, operator: '×', answer: packs * cards
      };
    }
  ]
};