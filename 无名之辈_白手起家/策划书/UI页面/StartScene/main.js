/**
 * StartScene - Game Logic & Interactions
 * 《无名之辈：白手起家》
 */

// ============================================
// Data
// ============================================

/** Trait candidate pool */
const TRAITS = [
  { id: 'fallen_aristocrat', name: '没落豪门', desc: '祖上阔过，如今只能靠自己', effect: '初始资金 +$50,000', rarity: 'rare', icon: '👑' },
  { id: 'top_scorer', name: '高考状元', desc: '十年寒窗，终于金榜题名', effect: '培训速度 +30%', rarity: 'rare', icon: '🎓' },
  { id: 'frugal', name: '节俭达人', desc: '省的就是赚的', effect: '员工薪资 -15%', rarity: 'common', icon: '💰' },
  { id: 'charismatic', name: '能说会道', desc: '天生招客体质', effect: '基础客流 +20%', rarity: 'rare', icon: '💬' },
  { id: 'pack_rat', name: '仓储达人', desc: '空间利用大师', effect: '仓库容量 +50', rarity: 'epic', icon: '📦' },
  { id: 'stable_employer', name: '稳定雇主', desc: '员工死心塌地', effect: '员工离职率 -30%', rarity: 'common', icon: '🤝' },
  { id: 'financial_optimizer', name: '金融头脑', desc: '算盘打得精', effect: '贷款利息 -20%', rarity: 'epic', icon: '🧮' },
  { id: 'quick_learner', name: '好学上进', desc: '一点就通', effect: '经验获取 +50%', rarity: 'rare', icon: '📚' },
  { id: 'bargain_hunter', name: '议价高手', desc: '谈判是艺术', effect: '进货价格 -10%', rarity: 'common', icon: '🤔' },
  { id: 'golden_spoon', name: '金汤匙', desc: '含玉而生，天选之人', effect: '全属性 +5%', rarity: 'legend', icon: '✨' }
];

/** Achievement definitions */
const ACHIEVEMENTS = [
  { id: 'xiaokang', name: '小康', desc: '累计赚取 $10,000', unlocked: true, icon: '⭐' },
  { id: 'yinshi', name: '殷实', desc: '累计赚取 $100,000', unlocked: false, icon: '🔒' },
  { id: 'fuguai', name: '富甲一方', desc: '累计赚取 $1,000,000', unlocked: false, icon: '🔒' },
  { id: 'diyi', name: '第一桶金', desc: '完成第一笔交易', unlocked: true, icon: '⭐' },
  { id: 'shangren', name: '精明商人', desc: '议价成功10次', unlocked: false, icon: '🔒' },
  { id: 'renmai', name: '人脉广布', desc: '雇佣10名员工', unlocked: false, icon: '🔒' }
];

// ============================================
// Save Manager
// ============================================

const SaveManager = {
  KEY: 'wmb_save_data',

  hasSave() {
    return localStorage.getItem(this.KEY) !== null;
  },

  load() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  formatDate(timestamp) {
    const d = new Date(timestamp);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
};

// ============================================
// DOM References
// ============================================

const $ = id => document.getElementById(id);

// Main elements
const logo        = document.querySelector('.logo');
const btnNewGame  = document.querySelector('[data-action="new-game"]');
const btnContinue = document.querySelector('[data-action="continue"]');
const btnAchieve  = document.querySelector('[data-action="achievement"]');
const btnExit    = document.querySelector('[data-action="exit"]');
const saveTimeEl = document.querySelector('.save-time');
const continueLi = document.querySelector('.menu__item--continue');

// Modals
const modalNewGame = $('modal-new-game');
const modalAchieve = $('modal-achievement');
const modalExit = $('modal-exit');

// New Game Modal
const stepTitle   = $('new-game-step-title');
const stepName    = $('step-name');
const stepTrait   = $('step-trait');
const inputName   = $('input-name');
const charCount   = $('char-count');
const btnNameNext  = $('btn-name-next');
const traitGrid   = $('trait-grid');
const btnTraitRandom  = $('btn-trait-random');
const btnTraitConfirm = $('btn-trait-confirm');

// Achievement Modal
const achievementList = $('achievement-list');
const btnAchieveClose = $('btn-achievement-close');

// Exit Modal
const btnExitCancel  = $('btn-exit-cancel');
const btnExitConfirm = $('btn-exit-confirm');

// Toast
const toast = $('toast');

// ============================================
// State
// ============================================

let selectedTrait = null;
let currentTraits = [];

// ============================================
// Initialize
// ============================================

function init() {
  checkSaveData();
  startIdleAnimation();
  bindEvents();
}

// ============================================
// Save Data Check
// ============================================

function checkSaveData() {
  if (SaveManager.hasSave()) {
    const save = SaveManager.load();
    saveTimeEl.textContent = SaveManager.formatDate(save.lastPlayedAt);
    continueLi.dataset.visible = 'true';
  }
}

// ============================================
// Idle Animation
// ============================================

function startIdleAnimation() {
  setTimeout(() => {
    logo.classList.add('logo--idle');
  }, 2000);
}

// ============================================
// Event Binding
// ============================================

function bindEvents() {
  btnNewGame.addEventListener('click', onNewGame);
  btnContinue.addEventListener('click', onContinue);
  btnAchieve.addEventListener('click', onAchievement);
  btnExit.addEventListener('click', () => openModal(modalExit));

  document.querySelector('[data-action="settings"]').addEventListener('click', onSettings);

  inputName.addEventListener('input', onNameInput);
  inputName.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !btnNameNext.disabled) {
      btnNameNext.click();
    }
  });
  btnNameNext.addEventListener('click', onNameNext);

  btnTraitRandom.addEventListener('click', generateRandomTraits);
  btnTraitConfirm.addEventListener('click', onTraitConfirm);

  btnAchieveClose.addEventListener('click', () => closeModal(modalAchieve));

  btnExitCancel.addEventListener('click', () => closeModal(modalExit));
  btnExitConfirm.addEventListener('click', onExitConfirm);

  [modalNewGame, modalAchieve, modalExit].forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      [modalNewGame, modalAchieve, modalExit].forEach(m => {
        if (m.getAttribute('aria-hidden') === 'false') {
          closeModal(m);
        }
      });
    }
  });
}

// ============================================
// Menu Actions
// ============================================

function onNewGame() {
  inputName.value = '';
  charCount.textContent = '0';
  inputName.classList.remove('input--valid', 'input--error');
  btnNameNext.disabled = true;
  stepTitle.textContent = '创建新角色';
  stepName.hidden = false;
  stepTrait.hidden = true;
  selectedTrait = null;
  btnTraitConfirm.disabled = true;

  openModal(modalNewGame);
  setTimeout(() => inputName.focus(), 300);
}

function onContinue() {
  const save = SaveManager.load();
  if (save) {
    showToast(`继续游戏\n玩家: ${save.playerName}\n第 ${save.dayReached} 天`);
  }
}

function onAchievement() {
  renderAchievements();
  openModal(modalAchieve);
}

function onSettings() {
  showToast('设置面板\n(暂未实现)');
}

function onExitConfirm() {
  window.close();
}

// ============================================
// Name Input Flow
// ============================================

function onNameInput() {
  const len = inputName.value.length;
  charCount.textContent = len;

  if (len === 0) {
    inputName.classList.remove('input--valid', 'input--error');
    btnNameNext.disabled = true;
  } else {
    inputName.classList.remove('input--error');
    inputName.classList.add('input--valid');
    btnNameNext.disabled = false;
  }
}

function onNameNext() {
  const name = inputName.value.trim();

  if (name.length === 0) {
    inputName.classList.add('input--error');
    inputName.focus();
    return;
  }

  stepTitle.textContent = '选择你的特性';
  stepName.hidden = true;
  stepTrait.hidden = false;

  generateRandomTraits();
}

// ============================================
// Trait Selection
// ============================================

function generateRandomTraits() {
  let selected = [];
  const pool = [...TRAITS];

  for (let i = 0; i < 3; i++) {
    if (pool.length === 0) break;
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  if (selected.length < 3) {
    const remaining = TRAITS.filter(t => !selected.includes(t));
    while (selected.length < 3 && remaining.length > 0) {
      const idx = Math.floor(Math.random() * remaining.length);
      selected.push(remaining.splice(idx, 1)[0]);
    }
  }

  currentTraits = selected.slice(0, 3);
  selectedTrait = null;
  btnTraitConfirm.disabled = true;

  renderTraits();
}

function renderTraits() {
  const rarityLabel = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legend: '传说'
  };

  traitGrid.innerHTML = currentTraits.map(trait => `
    <div class="trait-card trait-card--${trait.rarity}" data-trait-id="${trait.id}">
      <span class="trait-card__icon">${trait.icon}</span>
      <span class="trait-card__name">${trait.name}</span>
      <span class="trait-card__desc">${trait.desc}</span>
      <span class="trait-card__effect">${trait.effect}</span>
      <span class="trait-card__rarity">${rarityLabel[trait.rarity]}</span>
    </div>
  `).join('');

  traitGrid.querySelectorAll('.trait-card').forEach(card => {
    card.addEventListener('click', () => selectTrait(card));
  });
}

function selectTrait(card) {
  traitGrid.querySelectorAll('.trait-card').forEach(c => {
    c.classList.remove('trait-card--selected');
  });

  card.classList.add('trait-card--selected');

  const traitId = card.dataset.traitId;
  selectedTrait = currentTraits.find(t => t.id === traitId);
  btnTraitConfirm.disabled = false;
}

function onTraitConfirm() {
  if (!selectedTrait) return;

  const playerName = inputName.value.trim();
  const saveData = {
    version: '1.0.0',
    savedAt: Date.now(),
    lastPlayedAt: Date.now(),
    playTime: 0,
    dayReached: 1,
    playerName,
    trait: selectedTrait,
    money: selectedTrait.id === 'fallen_aristocrat' ? 50000 : 0
  };

  SaveManager.save(saveData);
  closeModal(modalNewGame);

  showToast(`游戏开始！\n玩家: ${playerName}\n特性: ${selectedTrait.name}`);
}

// ============================================
// Achievement Rendering
// ============================================

function renderAchievements() {
  achievementList.innerHTML = ACHIEVEMENTS.map(ach => `
    <div class="achievement-item ${ach.unlocked ? 'achievement-item--unlocked' : 'achievement-item--locked'}">
      <div class="achievement-item__icon">${ach.icon}</div>
      <div class="achievement-item__info">
        <div class="achievement-item__name">${ach.name}</div>
        <div class="achievement-item__desc">${ach.desc}</div>
      </div>
      <span class="achievement-item__status ${ach.unlocked ? 'achievement-item__status--done' : 'achievement-item__status--pending'}">
        ${ach.unlocked ? '已完成 ✓' : '未解锁'}
      </span>
    </div>
  `).join('');
}

// ============================================
// Modal Management
// ============================================

function openModal(modal) {
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
}

// ============================================
// Toast Notification
// ============================================

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('toast--visible');

  setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 3000);
}

// ============================================
// Boot
// ============================================

document.addEventListener('DOMContentLoaded', init);
