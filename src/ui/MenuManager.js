/**
 * MenuManager.js
 * Hanterar menyflödet mellan domäner, räknesätt, delmoment och nivåer.
 */
export class MenuManager {
  constructor(onStartGame, onReturnToMenu) {
    this.onStartGame = onStartGame;
    this.onReturnToMenu = onReturnToMenu;

    this.selectedOperation = 'addition';
    this.selectedCategory = 'ental';
    this.selectedTier = 'brons';

    this.screenStart = document.getElementById('start-screen');
    this.screenGame = document.getElementById('game-screen');

    this.stepMain = document.getElementById('menu-main');
    this.stepOperations = document.getElementById('menu-operations');
    this.stepSubcategories = document.getElementById('menu-subcategories');
    this.stepTiers = document.getElementById('menu-tiers');

    this.initEvents();
  }

  initEvents() {
    // Steg 1: Domänval
    const btnDomainArithmetic = document.getElementById('btn-domain-arithmetic');
    const btnDomainGeometry = document.getElementById('btn-domain-geometry');

    if (btnDomainArithmetic) {
      btnDomainArithmetic.addEventListener('click', () => {
        // Nollställ till addition när man går in i Räknekunskap
        this.selectedOperation = 'addition';
        this.selectedCategory = 'ental';
        this.showStep(this.stepOperations);
      });
    }

    if (btnDomainGeometry) {
      btnDomainGeometry.addEventListener('click', () => {
        this.setupGeometrySubcategories();
      });
    }

    // Tillbaka till domäner
    const btnBackToDomains = document.getElementById('btn-back-to-domains');
    if (btnBackToDomains) {
      btnBackToDomains.addEventListener('click', () => {
        this.selectedOperation = 'addition';
        this.selectedCategory = 'ental';
        this.showStep(this.stepMain);
      });
    }

    // Steg 2: Räknesätt (Aritmetik)
    const opButtons = [
      { id: 'btn-category-addition', key: 'addition', title: 'Addition', subcats: [
        { key: 'ental', label: 'Ental (0-9)' },
        { key: 'tiotal', label: 'Tiotal (10-99)' },
        { key: 'hundratal', label: 'Hundratal (100-999)' },
        { key: 'problemlosning', label: 'Problemlösning' }
      ]},
      { id: 'btn-category-subtraction', key: 'subtraction', title: 'Subtraktion', subcats: [
        { key: 'ental', label: 'Ental (0-9)' },
        { key: 'tiotal', label: 'Tiotal (10-99)' },
        { key: 'hundratal', label: 'Hundratal (100-999)' },
        { key: 'problemlosning', label: 'Problemlösning' }
      ]},
      { id: 'btn-category-multiplication', key: 'multiplication', title: 'Multiplikation', subcats: [
        { key: 'tabell_2_5_10', label: '2, 5 & 10:ans tabell' },
        { key: 'tabell_3_4_6', label: '3, 4 & 6:ans tabell' },
        { key: 'tabell_7_8_9', label: '7, 8 & 9:ans tabell' },
        { key: 'problemlosning', label: 'Problemlösning' }
      ]},
      { id: 'btn-category-division', key: 'division', title: 'Division', subcats: [
        { key: 'tabell_2_5_10', label: '2, 5 & 10:ans tabell' },
        { key: 'tabell_3_4_6', label: '3, 4 & 6:ans tabell' },
        { key: 'tabell_7_8_9', label: '7, 8 & 9:ans tabell' },
        { key: 'problemlosning', label: 'Problemlösning' }
      ]}
    ];

    opButtons.forEach(item => {
      const btn = document.getElementById(item.id);
      if (btn) {
        btn.addEventListener('click', () => {
          this.setupSubcategoryMenu(item.key, item.title, item.subcats);
        });
      }
    });

    // Tillbaka till delmoment
    const btnBackToSubcats = document.getElementById('btn-back-to-subcats');
    if (btnBackToSubcats) {
      btnBackToSubcats.addEventListener('click', () => {
        this.showStep(this.stepSubcategories);
      });
    }

    // Steg 4: Nivåknappar (Brons, Silver, Guld)
    const tierBtns = document.querySelectorAll('.btn-tier');
    tierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('btn-locked') || btn.disabled) return;
        const tier = btn.getAttribute('data-tier');
        this.selectedTier = tier;
        this.startGame();
      });
    });

    // Tillbaka till meny från spelet
    const btnMenu = document.getElementById('btn-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        this.showTierMenu();
        if (this.onReturnToMenu) this.onReturnToMenu();
      });
    }
  }

  setupGeometrySubcategories() {
    this.selectedOperation = 'shapes';
    this.selectedCategory = 'former';
    this.setupSubcategoryMenu('shapes', 'Vinklar och former', [
      { key: 'former', label: 'Former' },
      { key: 'vinklar', label: 'Vinklar (Kommer snart)', disabled: true },
      { key: 'omkrets_area', label: 'Omkrets & Area (Kommer snart)', disabled: true }
    ]);
  }

  setupSubcategoryMenu(opKey, titleText, subcatList) {
    this.selectedOperation = opKey;

    const titleElem = document.getElementById('subcat-menu-title');
    if (titleElem) titleElem.innerText = titleText;

    const container = this.stepSubcategories.querySelector('.menu-buttons');
    if (!container) return;

    container.innerHTML = '';

    subcatList.forEach(item => {
      const btn = document.createElement('button');
      btn.className = item.disabled ? 'btn-primary btn-locked' : 'btn-primary';
      btn.innerText = item.label;
      btn.disabled = !!item.disabled;

      if (!item.disabled) {
        btn.addEventListener('click', () => {
          this.selectedCategory = item.key;
          this.showTierMenu();
        });
      }

      container.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-secondary';
    backBtn.innerText = 'Tillbaka';
    backBtn.addEventListener('click', () => {
      if (opKey === 'shapes') {
        this.selectedOperation = 'addition';
        this.selectedCategory = 'ental';
        this.showStep(this.stepMain);
      } else {
        this.showStep(this.stepOperations);
      }
    });

    container.appendChild(backBtn);
    this.showStep(this.stepSubcategories);
  }

  showTierMenu() {
    this.updateTierButtons();
    this.showStep(this.stepTiers);
    if (this.screenStart) this.screenStart.classList.remove('hidden');
    if (this.screenGame) this.screenGame.classList.add('hidden');
  }

  showStartScreen() {
    this.selectedOperation = 'addition';
    this.selectedCategory = 'ental';
    this.showStep(this.stepMain);
    if (this.screenStart) this.screenStart.classList.remove('hidden');
    if (this.screenGame) this.screenGame.classList.add('hidden');
  }

  showGameScreen() {
    if (this.screenStart) this.screenStart.classList.add('hidden');
    if (this.screenGame) this.screenGame.classList.remove('hidden');
  }

  updateTierButtons() {
    const silverBtn = document.getElementById('btn-tier-silver');
    const goldBtn = document.getElementById('btn-tier-guld');
    const badgeSilver = document.getElementById('badge-silver');
    const badgeGold = document.getElementById('badge-guld');

    let bronsDone = false;
    let silverDone = false;

    try {
      bronsDone = localStorage.getItem(`completed_${this.selectedOperation}_${this.selectedCategory}_brons`) === 'true';
      silverDone = localStorage.getItem(`completed_${this.selectedOperation}_${this.selectedCategory}_silver`) === 'true';
    } catch (e) {}

    if (silverBtn) {
      if (bronsDone) {
        silverBtn.classList.remove('btn-locked');
        silverBtn.disabled = false;
        if (badgeSilver) badgeSilver.innerText = 'Öppen';
      } else {
        silverBtn.classList.add('btn-locked');
        silverBtn.disabled = true;
        if (badgeSilver) badgeSilver.innerText = 'Låst';
      }
    }

    if (goldBtn) {
      if (silverDone) {
        goldBtn.classList.remove('btn-locked');
        goldBtn.disabled = false;
        if (badgeGold) badgeGold.innerText = 'Öppen';
      } else {
        goldBtn.classList.add('btn-locked');
        goldBtn.disabled = true;
        if (badgeGold) badgeGold.innerText = 'Låst';
      }
    }
  }

  showStep(stepElement) {
    [this.stepMain, this.stepOperations, this.stepSubcategories, this.stepTiers].forEach(step => {
      if (step) step.classList.add('hidden');
    });
    if (stepElement) stepElement.classList.remove('hidden');
  }

  startGame() {
    this.showGameScreen();
    if (this.onStartGame) {
      this.onStartGame(this.selectedOperation, this.selectedCategory, this.selectedTier);
    }
  }
}