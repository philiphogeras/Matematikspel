/**
 * MenuManager.js
 * Hanterar meny-navigering och upplåsning/status för nivåknappar.
 */
export class MenuManager {
  constructor(onStartGame, onReturnToMenu) {
    this.onStartGame = onStartGame;
    this.onReturnToMenu = onReturnToMenu;

    this.selectedOperation = 'addition';
    this.selectedCategory = 'ental';

    this.startScreen = document.getElementById('start-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.menuMain = document.getElementById('menu-main');
    this.menuSubcats = document.getElementById('menu-subcategories');
    this.menuTiers = document.getElementById('menu-tiers');

    this.subcatMenuTitle = document.getElementById('subcat-menu-title');
    this.tierMenuTitle = document.getElementById('tier-menu-title');

    this.initEventListeners();
  }

  initEventListeners() {
    const btnAdd = document.getElementById('btn-category-addition');
    if (btnAdd) {
      btnAdd.onclick = () => {
        this.setupSubcategoryMenu('addition', 'Addition (+)', [
          { label: 'Ental', key: 'ental' },
          { label: 'Tiotal', key: 'tiotal' },
          { label: 'Hundratal', key: 'hundratal' },
          { label: 'Problemlösning', key: 'problemlosning' }
        ]);
      };
    }

    const btnSub = document.getElementById('btn-category-subtraction');
    if (btnSub) {
      btnSub.onclick = () => {
        this.setupSubcategoryMenu('subtraction', 'Subtraktion (–)', [
          { label: 'Ental', key: 'ental' },
          { label: 'Tiotal', key: 'tiotal' },
          { label: 'Hundratal', key: 'hundratal' },
          { label: 'Problemlösning', key: 'problemlosning' }
        ]);
      };
    }

    const btnMult = document.getElementById('btn-category-multiplication');
    if (btnMult) {
      btnMult.onclick = () => {
        this.setupSubcategoryMenu('multiplication', 'Multiplikation (×)', [
          { label: '2, 5 & 10:an', key: 'tabell_2_5_10' },
          { label: '3, 4 & 6:an', key: 'tabell_3_4_6' },
          { label: '7, 8 & 9:an', key: 'tabell_7_8_9' },
          { label: 'Problemlösning', key: 'problemlosning' }
        ]);
      };
    }

    const btnBackSubcats = document.getElementById('btn-back-to-subcats');
    if (btnBackSubcats) {
      btnBackSubcats.onclick = () => {
        if (this.menuTiers) this.menuTiers.classList.add('hidden');
        if (this.menuSubcats) this.menuSubcats.classList.remove('hidden');
      };
    }

    const tierBtns = document.querySelectorAll('.btn-tier');
    tierBtns.forEach((btn) => {
      btn.onclick = () => {
        if (btn.disabled) return;
        const tier = btn.getAttribute('data-tier');
        this.showGameScreen();
        if (this.onStartGame) {
          this.onStartGame(this.selectedOperation, this.selectedCategory, tier);
        }
      };
    });

    const btnMenu = document.getElementById('btn-menu');
    if (btnMenu) {
      btnMenu.onclick = () => {
        this.showStartScreen();
        if (this.onReturnToMenu) {
          this.onReturnToMenu();
        }
      };
    }
  }

  setupSubcategoryMenu(operationKey, titleText, subcatList) {
    this.selectedOperation = operationKey;
    if (this.subcatMenuTitle) {
      this.subcatMenuTitle.innerText = titleText;
    }

    if (!this.menuSubcats) return;
    const container = this.menuSubcats.querySelector('.menu-buttons');
    if (!container) return;

    container.innerHTML = '';

    subcatList.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'btn-subcat';
      if (item.key === 'problemlosning') {
        btn.classList.add('btn-problem');
      }
      btn.innerText = item.label;
      btn.onclick = () => {
        this.selectedCategory = item.key;
        const catLabels = {
          ental: 'Ental', tiotal: 'Tiotal', hundratal: 'Hundratal',
          tabell_2_5_10: '2, 5 & 10:an', tabell_3_4_6: '3, 4 & 6:an', tabell_7_8_9: '7, 8 & 9:an',
          problemlosning: 'Problemlösning'
        };
        const opLabels = { addition: 'Addition', subtraction: 'Subtraktion', multiplication: 'Multiplikation' };
        
        if (this.tierMenuTitle) {
          this.tierMenuTitle.innerText = `${opLabels[this.selectedOperation]} – ${catLabels[this.selectedCategory]}`;
        }

        if (this.menuSubcats) this.menuSubcats.classList.add('hidden');
        if (this.menuTiers) this.menuTiers.classList.remove('hidden');
        this.updateTierButtons();
      };
      container.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.id = 'btn-back-to-main';
    backBtn.className = 'btn-secondary';
    backBtn.innerText = 'Tillbaka';
    backBtn.onclick = () => {
      if (this.menuSubcats) this.menuSubcats.classList.add('hidden');
      if (this.menuMain) this.menuMain.classList.remove('hidden');
    };
    container.appendChild(backBtn);

    if (this.menuMain) this.menuMain.classList.add('hidden');
    if (this.menuSubcats) this.menuSubcats.classList.remove('hidden');
  }

  updateTierButtons() {
    const op = this.selectedOperation;
    const cat = this.selectedCategory;

    const isBronsDone = localStorage.getItem(`completed_${op}_${cat}_brons`) === 'true';
    const isSilverDone = localStorage.getItem(`completed_${op}_${cat}_silver`) === 'true';
    const isGuldDone = localStorage.getItem(`completed_${op}_${cat}_guld`) === 'true';

    this.setBtnState('btn-tier-brons', 'badge-brons', true, isBronsDone);
    this.setBtnState('btn-tier-silver', 'badge-silver', isBronsDone, isSilverDone);
    this.setBtnState('btn-tier-guld', 'badge-guld', isSilverDone, isGuldDone);
  }

  setBtnState(btnId, badgeId, isUnlocked, isCompleted) {
    const btn = document.getElementById(btnId);
    const badge = document.getElementById(badgeId);

    if (!btn || !badge) return;

    if (isUnlocked) {
      btn.disabled = false;
      btn.classList.remove('btn-locked');
      if (isCompleted) {
        badge.innerText = 'Klarad';
        badge.className = 'tier-status status-completed';
      } else {
        badge.innerText = 'Öppen';
        badge.className = 'tier-status';
      }
    } else {
      btn.disabled = true;
      btn.classList.add('btn-locked');
      badge.innerText = 'Låst';
      badge.className = 'tier-status';
    }
  }

  showStartScreen() {
    if (this.startScreen) this.startScreen.classList.remove('hidden');
    if (this.gameScreen) this.gameScreen.classList.add('hidden');
    if (this.menuMain) this.menuMain.classList.remove('hidden');
    if (this.menuSubcats) this.menuSubcats.classList.add('hidden');
    if (this.menuTiers) this.menuTiers.classList.add('hidden');
  }

  showGameScreen() {
    if (this.startScreen) this.startScreen.classList.add('hidden');
    if (this.gameScreen) this.gameScreen.classList.remove('hidden');
  }
}