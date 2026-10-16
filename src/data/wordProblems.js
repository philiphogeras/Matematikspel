/**
 * wordProblems.js
 * Bank med nivåuppdelade textfrågor för Brons, Silver och Guld (Flerstegsfrågor).
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
  addition: {
    brons: [
      () => {
        const name = getRandom(NAMES);
        const item = getRandom(ITEMS);
        const num1 = rand(2, 6);
        const num2 = rand(1, 4);
        return {
          text: `${name} har ${num1} ${item}. Hen får ${num2} ${item} till. Hur många ${item} har ${name} nu?`,
          num1, num2, operator: '+', answer: num1 + num2
        };
      },
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(10, 40);
        const num2 = rand(10, 30);
        return {
          text: `${name} har ${num1} kr och hittar ${num2} kr till. Hur mycket pengar har ${name} totalt?`,
          num1, num2, operator: '+', answer: num1 + num2
        };
      },
      () => {
        const name1 = getRandom(NAMES);
        let name2 = getRandom(NAMES);
        while (name1 === name2) name2 = getRandom(NAMES);
        const num1 = rand(3, 8);
        const num2 = rand(2, 6);
        return {
          text: `${name1} åt ${num1} köttbullar och ${name2} åt ${num2} köttbullar. Hur många åt de tillsammans?`,
          num1, num2, operator: '+', answer: num1 + num2
        };
      }
    ],
    silver: [
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(8, 15);
        const num2 = rand(6, 12);
        return {
          text: `${name} plockade ${num1} röda äpplen och ${num2} gröna äpplen. Hur många äpplen plockade ${name} totalt?`,
          num1, num2, operator: '+', answer: num1 + num2
        };
      },
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(15, 35);
        const num2 = rand(15, 25);
        return {
          text: `${name} cyklade ${num1} meter på morgonen och ${num2} meter på eftermiddagen. Hur långt cyklade ${name}?`,
          num1, num2, operator: '+', answer: num1 + num2
        };
      },
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(12, 28);
        const num2 = rand(8, 18);
        return {
          text: `${name} läste ${num1} sidor igår och ${num2} sidor idag. Hur många sidor har ${name} läst totalt?`,
          num1, num2, operator: '+', answer: num1 + num2
        };
      }
    ],
    guld: [
      () => {
        // Flersteg: Köpa bok + 2 pennor
        const name = getRandom(NAMES);
        const book = rand(25, 45);
        const pencil = rand(10, 20);
        const total = book + pencil + pencil;
        return {
          text: `${name} köper en bok för ${book} kr och två pennor som kostar ${pencil} kr styck. Hur mycket kostar det totalt?`,
          num1: book, num2: pencil * 2, operator: '+', answer: total,
          isMultiStep: true,
          step1: `Räkna ut pennorna först: ${pencil} + ${pencil} = ${pencil * 2} kr.`,
          step2: `Lägg till boken: ${book} + ${pencil * 2} = ${total} kr.`
        };
      },
      () => {
        // Flersteg: Sparade maj + dubbelt i juni
        const name = getRandom(NAMES);
        const maj = rand(15, 30);
        const juni = maj * 2;
        const total = maj + juni;
        return {
          text: `${name} sparade ${maj} kr i maj. I juni sparade hen dubbelt så mycket (${juni} kr). Hur mycket har ${name} sparat totalt?`,
          num1: maj, num2: juni, operator: '+', answer: total,
          isMultiStep: true,
          step1: `Maj: ${maj} kr. Juni: ${juni} kr.`,
          step2: `Lägg ihop båda månaderna: ${maj} + ${juni} = ${total} kr.`
        };
      },
      () => {
        // Flersteg: Kort sedan tidigare + 2 nya paket
        const name = getRandom(NAMES);
        const start = rand(15, 30);
        const pack = rand(10, 15);
        const total = start + pack * 2;
        return {
          text: `${name} har ${start} samlarkort. Hen köper 2 nya paket med ${pack} kort i varje. Hur många kort har ${name} nu?`,
          num1: start, num2: pack * 2, operator: '+', answer: total,
          isMultiStep: true,
          step1: `Räkna ut nya korten: 2 × ${pack} = ${pack * 2} kort.`,
          step2: `Lägg till de gamla korten: ${start} + ${pack * 2} = ${total} kort.`
        };
      }
    ]
  },

  subtraction: {
    brons: [
      () => {
        const name = getRandom(NAMES);
        const item = getRandom(ITEMS);
        const num1 = rand(5, 9);
        const num2 = rand(1, 4);
        return {
          text: `${name} hade ${num1} ${item}. Hen gav bort ${num2} ${item}. Hur många har ${name} kvar?`,
          num1, num2, operator: '-', answer: num1 - num2
        };
      },
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(30, 80);
        const num2 = rand(10, 30);
        return {
          text: `${name} hade ${num1} kr och köpte en dricka för ${num2} kr. Hur mycket pengar har ${name} kvar?`,
          num1, num2, operator: '-', answer: num1 - num2
        };
      },
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(6, 10);
        const num2 = rand(2, 5);
        return {
          text: `${name} bakade ${num1} kakor. Kompisarna åt upp ${num2} kakor. Hur många kakor finns kvar?`,
          num1, num2, operator: '-', answer: num1 - num2
        };
      }
    ],
    silver: [
      () => {
        const name1 = getRandom(NAMES);
        let name2 = getRandom(NAMES);
        while (name1 === name2) name2 = getRandom(NAMES);
        const num2 = rand(5, 12);
        const diff = rand(3, 8);
        const num1 = num2 + diff;
        return {
          text: `${name1} har ${num1} klistermärken och ${name2} har ${num2} klistermärken. Hur många fler har ${name1}?`,
          num1, num2, operator: '-', answer: diff
        };
      },
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(25, 45);
        const num2 = rand(8, 18);
        return {
          text: `En bok har ${num1} sidor. ${name} har läst ${num2} sidor. Hur många sidor är det kvar?`,
          num1, num2, operator: '-', answer: num1 - num2
        };
      },
      () => {
        const name = getRandom(NAMES);
        const num1 = rand(40, 75);
        const num2 = rand(15, 35);
        return {
          text: `${name} hade ${num1} kr i sin plånbok. Hen handlade mat för ${num2} kr. Hur mycket finns kvar?`,
          num1, num2, operator: '-', answer: num1 - num2
        };
      }
    ],
    guld: [
      () => {
        // Flersteg: Startar med 100 kr, köper två saker
        const name = getRandom(NAMES);
        const item1 = rand(20, 35);
        const item2 = rand(15, 30);
        const left = 100 - item1 - item2;
        return {
          text: `${name} har 100 kr. Hen köper en dricka för ${item1} kr och en macka för ${item2} kr. Hur mycket pengar har ${name} kvar?`,
          num1: 100, num2: item1 + item2, operator: '-', answer: left,
          isMultiStep: true,
          step1: `Räkna ut vad sakerna kostar tillsammans: ${item1} + ${item2} = ${item1 + item2} kr.`,
          step2: `Dra av från 100 kr: 100 - ${item1 + item2} = ${left} kr.`
        };
      },
      () => {
        // Flersteg: Bakade bullar, åt på morgon och eftermiddag
        const name = getRandom(NAMES);
        const start = rand(40, 60);
        const eat1 = rand(10, 20);
        const eat2 = rand(10, 20);
        const left = start - eat1 - eat2;
        return {
          text: `${name} bakade ${start} bullar. Kompisarna åt ${eat1} bullar på morgonen och ${eat2} på eftermiddagen. Hur många bullar finns kvar?`,
          num1: start, num2: eat1 + eat2, operator: '-', answer: left,
          isMultiStep: true,
          step1: `Hur många bullar åt de upp totalt? ${eat1} + ${eat2} = ${eat1 + eat2} bullar.`,
          step2: `Ta bort dem från starten: ${start} - ${eat1 + eat2} = ${left} bullar.`
        };
      },
      () => {
        // Flersteg: Biljett + ge pengar till bror
        const name = getRandom(NAMES);
        const start = rand(60, 90);
        const ticket = rand(25, 40);
        const gift = rand(15, 25);
        const left = start - ticket - gift;
        return {
          text: `${name} hade ${start} kr. Hen köpte en biobiljett för ${ticket} kr och gav ${gift} kr till sin bror. Hur mycket har ${name} kvar?`,
          num1: start, num2: ticket + gift, operator: '-', answer: left,
          isMultiStep: true,
          step1: `Räkna ut hur mycket pengar som försvann: ${ticket} + ${gift} = ${ticket + gift} kr.`,
          step2: `Räkna vad som är kvar: ${start} - ${ticket + gift} = ${left} kr.`
        };
      }
    ]
  },

  multiplication: {
    brons: [
      () => {
        const name = getRandom(NAMES);
        const groups = rand(2, 4);
        const perGroup = rand(2, 5);
        return {
          text: `${name} har ${groups} askar med ${perGroup} pennor i varje. Hur många pennor har ${name}?`,
          num1: groups, num2: perGroup, operator: '×', answer: groups * perGroup
        };
      },
      () => {
        const name = getRandom(NAMES);
        const count = rand(2, 5);
        const price = rand(2, 5);
        return {
          text: `${name} köper ${count} tuggummin. Varje tuggummi kostar ${price} kr. Vad kostar det totalt?`,
          num1: count, num2: price, operator: '×', answer: count * price
        };
      },
      () => {
        const name = getRandom(NAMES);
        const bags = rand(2, 4);
        const apples = rand(3, 5);
        return {
          text: `${name} bär ${bags} påsar med ${apples} äpplen i varje påse. Hur många äpplen är det?`,
          num1: bags, num2: apples, operator: '×', answer: bags * apples
        };
      }
    ],
    silver: [
      () => {
        const name = getRandom(NAMES);
        const count = rand(3, 6);
        const price = rand(6, 10);
        return {
          text: `${name} köper ${count} fika-bullar. Varje bulle kostar ${price} kr. Hur mycket kostar alla bullar?`,
          num1: count, num2: price, operator: '×', answer: count * price
        };
      },
      () => {
        const name = getRandom(NAMES);
        const rows = rand(3, 6);
        const seats = rand(4, 8);
        return {
          text: `I biosalen finns ${rows} rader med ${seats} stolar på varje rad. Hur många stolar finns det?`,
          num1: rows, num2: seats, operator: '×', answer: rows * seats
        };
      },
      () => {
        const name = getRandom(NAMES);
        const days = rand(4, 7);
        const km = rand(3, 6);
        return {
          text: `${name} går ${km} kilometer varje dag i ${days} dagar. Hur långt har ${name} gått totalt?`,
          num1: days, num2: km, operator: '×', answer: days * km
        };
      }
    ],
    guld: [
      () => {
        // Flersteg: Påsar med äpplen + lösa äpplen
        const name = getRandom(NAMES);
        const bags = rand(3, 5);
        const perBag = rand(4, 6);
        const extra = rand(3, 8);
        const total = bags * perBag + extra;
        return {
          text: `${name} köper ${bags} påsar äpplen med ${perBag} äpplen i varje, plus ${extra} lösa äpplen. Hur många äpplen har ${name} totalt?`,
          num1: bags * perBag, num2: extra, operator: '+', answer: total,
          isMultiStep: true,
          step1: `Räkna äpplena i påsarna först: ${bags} × ${perBag} = ${bags * perBag} äpplen.`,
          step2: `Lägg till de lösa äpplena: ${bags * perBag} + ${extra} = ${total} äpplen.`
        };
      },
      () => {
        // Flersteg: Jobbar lördag och söndag med timlön
        const name = getRandom(NAMES);
        const sat = rand(2, 4);
        const sun = rand(2, 4);
        const pay = rand(10, 20);
        const total = (sat + sun) * pay;
        return {
          text: `${name} jobbar ${sat} timmar på lördag och ${sun} timmar på söndag. Hen får ${pay} kr per timme. Hur mycket tjänar ${name} totalt?`,
          num1: sat + sun, num2: pay, operator: '×', answer: total,
          isMultiStep: true,
          step1: `Räkna totala timmarna först: ${sat} + ${sun} = ${sat + sun} timmar.`,
          step2: `Multiplicera med timlönen: ${sat + sun} × ${pay} = ${total} kr.`
        };
      },
      () => {
        // Flersteg: Kartonger med ägg minus använda ägg
        const name = getRandom(NAMES);
        const boxes = rand(3, 5);
        const perBox = rand(6, 10);
        const used = rand(4, 10);
        const total = boxes * perBox - used;
        return {
          text: `${name} köper ${boxes} kartonger med ${perBox} ägg i varje. Hen använder ${used} ägg till en tårta. Hur många ägg har ${name} kvar?`,
          num1: boxes * perBox, num2: used, operator: '-', answer: total,
          isMultiStep: true,
          step1: `Hur många ägg fanns det från början? ${boxes} × ${perBox} = ${boxes * perBox} ägg.`,
          step2: `Ta bort de använda äggens antal: ${boxes * perBox} - ${used} = ${total} ägg.`
        };
      }
    ]
  },

  division: {
    brons: [
      () => {
        const name = getRandom(NAMES);
        const people = rand(2, 4);
        const perPerson = rand(2, 5);
        const total = people * perPerson;
        return {
          text: `${name} vill dela ${total} kex lika med ${people} kompisar. Hur många kex får var och en?`,
          num1: total, num2: people, operator: '÷', answer: perPerson
        };
      },
      () => {
        const name = getRandom(NAMES);
        const notes = rand(2, 4);
        const val = rand(2, 5);
        const total = notes * val;
        return {
          text: `${name} har ${total} kr uppdelat på ${notes} lika stora mynt. Vad är varje mynt värt?`,
          num1: total, num2: notes, operator: '÷', answer: val
        };
      },
      () => {
        const name = getRandom(NAMES);
        const boxes = 2;
        const perBox = rand(3, 6);
        const total = boxes * perBox;
        return {
          text: `${name} lägger ${total} äpplen lika i ${boxes} skålar. Hur många äpplen hamnar i varje skål?`,
          num1: total, num2: boxes, operator: '÷', answer: perBox
        };
      }
    ],
    silver: [
      () => {
        const name = getRandom(NAMES);
        const groups = rand(3, 6);
        const perGroup = rand(4, 8);
        const total = groups * perGroup;
        return {
          text: `${total} elever ska dela upp sig i ${groups} lika stora grupper. Hur många blir det i varje grupp?`,
          num1: total, num2: groups, operator: '÷', answer: perGroup
        };
      },
      () => {
        const name = getRandom(NAMES);
        const price = rand(4, 7);
        const count = rand(3, 6);
        const total = price * count;
        return {
          text: `${name} har ${total} kr. En glass kostar ${price} kr. Hur många glassar kan ${name} köpa?`,
          num1: total, num2: price, operator: '÷', answer: count
        };
      },
      () => {
        const name = getRandom(NAMES);
        const perPack = 6;
        const packs = rand(3, 7);
        const total = perPack * packs;
        return {
          text: `${name} har ${total} kakor och packar ${perPack} kakor i varje påse. Hur många påsar blir det?`,
          num1: total, num2: perPack, operator: '÷', answer: packs
        };
      }
    ],
    guld: [
      () => {
        // Flersteg: Har pengar + får mer pengar -> köpa glassar
        const name = getRandom(NAMES);
        const start = rand(15, 25);
        const gift = rand(10, 20);
        const totalMoney = start + gift;
        const icePrice = rand(5, 10);
        // Säkerställ att summan är delbar
        const count = Math.floor(totalMoney / icePrice);
        const exactTotal = count * icePrice;
        const adjustedGift = exactTotal - start;
        return {
          text: `${name} har ${start} kr och får ${adjustedGift} kr till. Hen köper glassar för ${icePrice} kr styck. Hur många glassar räcker pengarna till?`,
          num1: start + adjustedGift, num2: icePrice, operator: '÷', answer: count,
          isMultiStep: true,
          step1: `Räkna ihop alla pengar först: ${start} + ${adjustedGift} = ${start + adjustedGift} kr.`,
          step2: `Dela med glasspriset: ${start + adjustedGift} ÷ ${icePrice} = ${count} glassar.`
        };
      },
      () => {
        // Flersteg: Två personer slår ihop sina pengar och delar på kompisar
        const name1 = getRandom(NAMES);
        let name2 = getRandom(NAMES);
        while (name1 === name2) name2 = getRandom(NAMES);
        const p1 = rand(15, 30);
        const p2 = rand(15, 30);
        const sum = p1 + p2;
        const friends = rand(2, 5);
        const perFriend = Math.floor(sum / friends);
        const exactSum = friends * perFriend;
        const adjP2 = exactSum - p1;
        return {
          text: `${name1} har ${p1} kr och ${name2} har ${adjP2} kr. De slår ihop sina pengar och delar lika på ${friends} personer. Hur mycket får varje person?`,
          num1: p1 + adjP2, num2: friends, operator: '÷', answer: perFriend,
          isMultiStep: true,
          step1: `Slå ihop pengarna först: ${p1} + ${adjP2} = ${p1 + adjP2} kr.`,
          step2: `Dela på antalet personer: ${p1 + adjP2} ÷ ${friends} = ${perFriend} kr.`
        };
      },
      () => {
        // Flersteg: Pennor minus bortgivna -> dela i askar
        const name = getRandom(NAMES);
        const totalPencils = rand(30, 50);
        const givenAway = rand(6, 12);
        const remain = totalPencils - givenAway;
        const boxes = rand(2, 4);
        const perBox = Math.floor(remain / boxes);
        const exactRemain = boxes * perBox;
        const adjGiven = totalPencils - exactRemain;
        const finalRemain = totalPencils - adjGiven;
        return {
          text: `${name} har ${totalPencils} pennor. Hen ger bort ${adjGiven} pennor och delar upp resten lika i ${boxes} askar. Hur många pennor hamnar i varje ask?`,
          num1: finalRemain, num2: boxes, operator: '÷', answer: perBox,
          isMultiStep: true,
          step1: `Räkna hur många pennor som är kvar: ${totalPencils} - ${adjGiven} = ${finalRemain} pennor.`,
          step2: `Dela upp i askarna: ${finalRemain} ÷ ${boxes} = ${perBox} pennor.`
        };
      }
    ]
  }
};