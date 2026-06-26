/**
 * MainScene - HUD Logic
 * 《无名之辈：白手起家》
 */

(function() {
  'use strict';

  // ============================================
  // Game State
  // ============================================
  const GameState = {
    day: 1,
    weekday: '周一',
    money: 0,
    warehouse: { current: 0, max: 100 },
    rating: 0.0,
    time: '08:00',
    weather: 'sunny',
    speed: 1,
    currentHUD: 'home',
    currentTab: 'purchase',
    playerName: '',
    playerTrait: null,
    house: {
      type: 'rental',      // 'rental' | 'apartment' | 'villa'
      name: '出租屋',
      level: 1,
      maxLevel: 5
    },
    stores: [],           // 已开设的店铺列表
    currentStoreId: null, // 当前所在店铺ID
    employees: [],         // 员工列表
    counter: {
      cashier: null,
      isBusy: false,
      queueCount: 0,
    },
    customers: [],         // 当前在店内的顾客列表
    checkoutQueue: [],     // 收银台排队队列
  };

  // 顾客颜色池
  const CUSTOMER_COLORS = ['#4A90D9', '#E74C3C', '#27AE60', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#3498DB'];

  // ============================================
  // Talent Pool (人才库 — 每次打开随机生成)
  // ============================================
  const TALENT_POOL = [
    { id: 't1', name: '张三', icon: '🧑', skill: '销售高手', skillDesc: '接待效率+30%', wage: 80, trait: '健谈' },
    { id: 't2', name: '李四', icon: '👩', skill: '理货达人', skillDesc: '货架容量+20%', wage: 70, trait: '细心' },
    { id: 't3', name: '王五', icon: '🧔', skill: '库存专家', skillDesc: '仓库损耗-25%', wage: 90, trait: '稳重' },
    { id: 't4', name: '赵六', icon: '👨‍🦰', skill: '快手', skillDesc: '收银速度+40%', wage: 85, trait: '麻利' },
    { id: 't5', name: '小美', icon: '👩‍🦱', skill: '亲和力', skillDesc: '顾客满意度+20%', wage: 75, trait: '温柔' },
    { id: 't6', name: '阿强', icon: '🧑‍🦲', skill: '耐久', skillDesc: '无需休息，连续工作', wage: 100, trait: '勤劳' },
    { id: 't7', name: '老周', icon: '👴', skill: '经验丰富', skillDesc: '全局效率+15%', wage: 110, trait: '老练' },
    { id: 't8', name: '小刘', icon: '👱', skill: '新手', skillDesc: '学习成长中', wage: 50, trait: '勤奋' },
  ];

  // 当前人才市场列表
  let currentTalents = [];

  // ============================================
  // Store Configuration
  // ============================================
  const STORE_TYPE_CONFIG = {
    convenience: {
      label: '便利店',
      icon: '🏪',
      desc: '日常便利商品',
    },
    clothing: {
      label: '服装店',
      icon: '👕',
      desc: '服饰鞋帽零售',
    },
    flowers: {
      label: '花店',
      icon: '💐',
      desc: '鲜花礼品销售',
    },
    electronics: {
      label: '电子产品',
      icon: '📱',
      desc: '数码电器销售',
    },
  };

  const STORE_AREA_CONFIG = {
    small: {
      label: '小型 ~80㎡',
      maxShelves: 4,
      maxEmployees: 2,
      warehouseCapacity: 100,
      baseRent: 100,
      trafficMultiplier: 0.8,
    },
    medium: {
      label: '中型 ~150㎡',
      maxShelves: 6,
      maxEmployees: 4,
      warehouseCapacity: 200,
      baseRent: 200,
      trafficMultiplier: 1.0,
    },
    large: {
      label: '大型 ~300㎡',
      maxShelves: 10,
      maxEmployees: 6,
      warehouseCapacity: 400,
      baseRent: 400,
      trafficMultiplier: 1.3,
    },
    luxury: {
      label: '豪华 ~500㎡',
      maxShelves: 15,
      maxEmployees: 10,
      warehouseCapacity: 700,
      baseRent: 800,
      trafficMultiplier: 1.6,
    },
  };

  const STORE_LOCATION_CONFIG = {
    alley: {
      label: '胡同/老小区',
      baseFootTraffic: 30,
      baseRent: 50,
    },
    street: {
      label: '街道/社区店',
      baseFootTraffic: 60,
      baseRent: 150,
    },
    avenue: {
      label: '大街/商业街',
      baseFootTraffic: 100,
      baseRent: 300,
    },
    downtown: {
      label: '市中心',
      baseFootTraffic: 180,
      baseRent: 600,
    },
    landmark: {
      label: '地标商圈',
      baseFootTraffic: 300,
      baseRent: 1200,
    },
  };

  // ============================================
  // Store Type → Items Map
  // ============================================
  const STORE_TYPE_ITEMS = {
    convenience: [
      { id: 'cola', name: '可乐', baseBuyPrice: 3, baseSellPrice: 5, volume: 1, icon: '🥤' },
      { id: 'chips', name: '薯片', baseBuyPrice: 4, baseSellPrice: 7, volume: 1, icon: '🍟' },
      { id: 'milk', name: '牛奶', baseBuyPrice: 5, baseSellPrice: 8, volume: 1, icon: '🥛' },
      { id: 'bread', name: '面包', baseBuyPrice: 4, baseSellPrice: 6, volume: 1, icon: '🍞' },
      { id: 'instant_noodles', name: '方便面', baseBuyPrice: 5, baseSellPrice: 8, volume: 1, icon: '🍜' },
      { id: 'water', name: '矿泉水', baseBuyPrice: 1, baseSellPrice: 2, volume: 1, icon: '💧' },
      { id: 'juice', name: '果汁', baseBuyPrice: 4, baseSellPrice: 7, volume: 1, icon: '🧃' },
      { id: 'tissue', name: '纸巾', baseBuyPrice: 3, baseSellPrice: 5, volume: 1, icon: '🧻' },
      { id: 'shampoo', name: '洗发水', baseBuyPrice: 15, baseSellPrice: 25, volume: 2, icon: '🧴' },
      { id: 'toothpaste', name: '牙膏', baseBuyPrice: 8, baseSellPrice: 14, volume: 1, icon: '🪥' },
      { id: 'soap', name: '香皂', baseBuyPrice: 4, baseSellPrice: 7, volume: 1, icon: '🧼' },
    ],
    clothing: [
      { id: 'cheap_tshirt_m', name: '便宜T恤(男)', baseBuyPrice: 25, baseSellPrice: 45, volume: 2, icon: '👕' },
      { id: 'cheap_pants_m', name: '便宜裤子(男)', baseBuyPrice: 35, baseSellPrice: 60, volume: 2, icon: '👖' },
      { id: 'cheap_underwear_m', name: '便宜内衣(男)', baseBuyPrice: 15, baseSellPrice: 28, volume: 1, icon: '🩲' },
      { id: 'cheap_socks_m', name: '便宜袜子(男)', baseBuyPrice: 8, baseSellPrice: 15, volume: 1, icon: '🧦' },
      { id: 'normal_tshirt_m', name: '一般T恤(男)', baseBuyPrice: 50, baseSellPrice: 90, volume: 2, icon: '👕' },
      { id: 'normal_pants_m', name: '一般裤子(男)', baseBuyPrice: 70, baseSellPrice: 120, volume: 2, icon: '👖' },
      { id: 'normal_jacket_m', name: '一般外套(男)', baseBuyPrice: 100, baseSellPrice: 180, volume: 3, icon: '🧥' },
      { id: 'normal_underwear_m', name: '一般内衣(男)', baseBuyPrice: 30, baseSellPrice: 55, volume: 1, icon: '🩲' },
      { id: 'luxury_tshirt_m', name: '昂贵T恤(男)', baseBuyPrice: 150, baseSellPrice: 280, volume: 2, icon: '👕' },
      { id: 'luxury_suit_m', name: '昂贵西装(男)', baseBuyPrice: 500, baseSellPrice: 900, volume: 4, icon: '🤵' },
      { id: 'luxury_waistcoat', name: '昂贵马甲(男)', baseBuyPrice: 200, baseSellPrice: 360, volume: 3, icon: '🎽' },
      { id: 'luxury_leather_shoes', name: '昂贵皮鞋(男)', baseBuyPrice: 300, baseSellPrice: 550, volume: 3, icon: '👞' },
      { id: 'cheap_tshirt_f', name: '便宜T恤(女)', baseBuyPrice: 25, baseSellPrice: 45, volume: 2, icon: '👚' },
      { id: 'cheap_skirt', name: '便宜裙子', baseBuyPrice: 35, baseSellPrice: 60, volume: 2, icon: '👗' },
      { id: 'cheap_underwear_f', name: '便宜内衣(女)', baseBuyPrice: 15, baseSellPrice: 28, volume: 1, icon: '🩱' },
      { id: 'cheap_socks_f', name: '便宜袜子(女)', baseBuyPrice: 8, baseSellPrice: 15, volume: 1, icon: '🧦' },
      { id: 'normal_tshirt_f', name: '一般T恤(女)', baseBuyPrice: 55, baseSellPrice: 99, volume: 2, icon: '👚' },
      { id: 'normal_skirt', name: '一般裙子', baseBuyPrice: 75, baseSellPrice: 130, volume: 2, icon: '👗' },
      { id: 'normal_dress', name: '一般连衣裙', baseBuyPrice: 120, baseSellPrice: 210, volume: 3, icon: '👗' },
      { id: 'normal_underwear_f', name: '一般内衣(女)', baseBuyPrice: 35, baseSellPrice: 65, volume: 1, icon: '🩱' },
      { id: 'luxury_dress', name: '昂贵连衣裙', baseBuyPrice: 400, baseSellPrice: 720, volume: 3, icon: '👗' },
      { id: 'luxury_suit_f', name: '昂贵西装(女)', baseBuyPrice: 450, baseSellPrice: 810, volume: 3, icon: '🧥' },
      { id: 'luxury_high_heels', name: '昂贵高跟鞋', baseBuyPrice: 250, baseSellPrice: 450, volume: 2, icon: '👠' },
      { id: 'luxury_handbag', name: '昂贵手提包', baseBuyPrice: 300, baseSellPrice: 550, volume: 3, icon: '👜' },
    ],
    flowers: [
      { id: 'cheap_rose_bouquet', name: '便宜玫瑰花束', baseBuyPrice: 20, baseSellPrice: 38, volume: 2, icon: '💐' },
      { id: 'cheap_sunflower', name: '便宜向日葵', baseBuyPrice: 15, baseSellPrice: 28, volume: 2, icon: '🌻' },
      { id: 'cheap_tulip_bouquet', name: '便宜郁金香束', baseBuyPrice: 18, baseSellPrice: 35, volume: 2, icon: '🌷' },
      { id: 'normal_rose_bouquet', name: '一般玫瑰花束', baseBuyPrice: 50, baseSellPrice: 90, volume: 3, icon: '💐' },
      { id: 'normal_mixed_bouquet', name: '一般混搭花束', baseBuyPrice: 60, baseSellPrice: 108, volume: 3, icon: '💐' },
      { id: 'normal_lily_bouquet', name: '一般百合花束', baseBuyPrice: 55, baseSellPrice: 99, volume: 3, icon: '💐' },
      { id: 'normal_orchid', name: '一般兰花盆栽', baseBuyPrice: 45, baseSellPrice: 82, volume: 3, icon: '🪻' },
      { id: 'luxury_rose_99', name: '99朵玫瑰', baseBuyPrice: 200, baseSellPrice: 380, volume: 5, icon: '💐' },
      { id: 'luxury_preserved_rose', name: '永生玫瑰', baseBuyPrice: 180, baseSellPrice: 320, volume: 2, icon: '🌹' },
      { id: 'luxury_orchid_pot', name: '昂贵兰花盆栽', baseBuyPrice: 150, baseSellPrice: 270, volume: 4, icon: '🪻' },
      { id: 'luxury_wedding_bouquet', name: '婚庆花束', baseBuyPrice: 300, baseSellPrice: 550, volume: 5, icon: '💐' },
    ],
    electronics: [
      { id: 'budget_phone', name: '入门手机', baseBuyPrice: 300, baseSellPrice: 499, volume: 1, icon: '📱' },
      { id: 'normal_phone', name: '普通手机', baseBuyPrice: 800, baseSellPrice: 1299, volume: 1, icon: '📱' },
      { id: 'fold_phone', name: '折叠屏手机', baseBuyPrice: 2000, baseSellPrice: 3399, volume: 1, icon: '📱' },
      { id: 'tablet', name: '平板电脑', baseBuyPrice: 1500, baseSellPrice: 2499, volume: 2, icon: '📲' },
      { id: 'laptop', name: '笔记本电脑', baseBuyPrice: 3000, baseSellPrice: 4999, volume: 4, icon: '💻' },
      { id: 'desktop', name: '台式电脑', baseBuyPrice: 2500, baseSellPrice: 4199, volume: 6, icon: '🖥️' },
      { id: 'earbuds', name: '无线耳机', baseBuyPrice: 100, baseSellPrice: 179, volume: 1, icon: '🎧' },
      { id: 'headphones', name: '头戴式耳机', baseBuyPrice: 200, baseSellPrice: 349, volume: 2, icon: '🎧' },
      { id: 'charging_cable', name: '数据线', baseBuyPrice: 15, baseSellPrice: 29, volume: 1, icon: '🔌' },
      { id: 'power_bank', name: '充电宝', baseBuyPrice: 40, baseSellPrice: 75, volume: 1, icon: '🔋' },
      { id: 'phone_case', name: '手机壳', baseBuyPrice: 10, baseSellPrice: 20, volume: 1, icon: '📱' },
      { id: 'screen_protector', name: '钢化膜', baseBuyPrice: 8, baseSellPrice: 18, volume: 1, icon: '🛡️' },
    ],
  };

  // ============================================
  // Save Manager
  // ============================================
  const SaveManager = {
    KEY: 'wmb_save_data',

    save() {
      const saveData = {
        version: '1.0.0',
        savedAt: Date.now(),
        lastPlayedAt: Date.now(),
        dayReached: GameState.day,
        playerName: GameState.playerName,
        trait: GameState.playerTrait,
        money: GameState.money,
        rating: GameState.rating,
        warehouse: GameState.warehouse,
        house: GameState.house,
        stores: GameState.stores,
        currentStoreId: GameState.currentStoreId,
        employees: GameState.employees,
        counter: GameState.counter
      };
      localStorage.setItem(this.KEY, JSON.stringify(saveData));
    },

    load() {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    },

    clear() {
      localStorage.removeItem(this.KEY);
    }
  };

  // ============================================
  // DOM References
  // ============================================
  const $ = id => document.getElementById(id);

  const homeHUD = $('homeHUD');
  const storeHUD = $('storeHUD');
  const dayDisplay = $('dayDisplay');
  const homeMoneyDisplay = $('homeMoneyDisplay');
  const homeWeatherDisplay = $('homeWeatherDisplay');
  const homeWarehouseFill = $('homeWarehouseFill');
  const homeWarehouseText = $('homeWarehouseText');
  const storeMoneyDisplay = $('storeMoneyDisplay');
  const timeDisplay = $('timeDisplay');
  const weatherDisplay = $('weatherDisplay');
  const warehouseFill = $('warehouseFill');
  const warehouseText = $('warehouseText');
  const warehouseFillHome = $('warehouseFillHome');
  const warehouseTextHome = $('warehouseTextHome');
  const ratingDisplay = $('ratingDisplay');
  const moneyPopup = $('moneyPopup');
  const toast = $('toast');
  const playerNameDisplay = $('playerNameDisplay');
  const playerTraitDisplay = $('playerTraitDisplay');
  const btnGoToStore = $('btnGoToStore');
  const btnGoToHome = $('btnGoToHome');
  const btnBackToMenu = $('btnBackToMenu');
  const btnNewStore = $('btn-new-store');
  const btnEmployee = $('btn-employee');
  const btnHouse = $('btn-house');
  const houseTypeLabel = $('house-type');

  const tabs = document.querySelectorAll('.tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const speedBtns = document.querySelectorAll('.speed-btn');

  // New Store Modal
  const modalNewStore = $('modal-new-store');
  const stepType = $('step-type');
  const stepArea = $('step-area');
  const stepLocation = $('step-location');
  const stepConfirm = $('step-confirm');
  const typeGrid = $('type-grid');
  const areaGrid = $('area-grid');
  const locationGrid = $('location-grid');
  const storePreview = $('store-preview');
  const storeSummary = $('store-summary');
  const inputStoreName = $('input-store-name');
  const btnTypeNext = $('btn-type-next');
  const btnAreaNext = $('btn-area-next');
  const btnAreaBack = $('btn-area-back');
  const btnLocationBack = $('btn-location-back');
  const btnLocationNext = $('btn-location-next');
  const btnConfirmBack = $('btn-confirm-back');
  const btnStoreCancel = $('btn-store-cancel');
  const btnStoreConfirm = $('btn-store-confirm');

  // Shelf Item Modal
  const modalShelfItem = $('modal-shelf-item');
  const itemGrid = $('item-grid');
  const btnShelfItemCancel = $('btn-shelf-item-cancel');
  const storeNameDisplay = $('storeNameDisplay');
  const storeTypeDisplay = $('storeTypeDisplay');
  const storeShelves = $('storeShelves');
  const storeCounter = $('storeCounter');
  const counterStatus = $('counterStatus');
  const queueCount = $('queueCount');
  const counterCashierName = $('counterCashierName');
  const customerTrack = document.getElementById('customerTrack');

  // Talent & Employee panels
  const talentList = $('talent-list');
  const recruitTip = $('recruit-tip');
  const employeeList = $('employee-list');
  const employeeEmpty = $('employee-empty');
  const employeeCount = $('employee-count');

  // Counter cashier modal
  const modalCounter = $('modal-counter');
  const cashierList = $('cashier-list');
  const btnCounterCancel = $('btn-counter-cancel');

  // Selected shelf state
  let selectedShelfIndex = -1;

  // New Store Wizard State
  let newStoreState = {
    type: null,
    storeName: '',
    area: null,
    location: null,
  };

  // ============================================
  // Initialize
  // ============================================
  function init() {
    loadFromSave();
    renderAll();
    bindEvents();
    startDemo();
  }

  function loadFromSave() {
    try {
      const saveData = SaveManager.load();
      if (saveData) {
        GameState.day = saveData.dayReached || 1;
        GameState.money = saveData.money || 0;
        GameState.rating = saveData.rating || 0.0;
        GameState.playerName = saveData.playerName || '';
        GameState.playerTrait = saveData.trait || null;
        GameState.warehouse = saveData.warehouse || { current: 0, max: 100 };
        GameState.house = saveData.house || { type: 'rental', name: '出租屋', level: 1, maxLevel: 5 };
        GameState.stores = saveData.stores || [];
        GameState.currentStoreId = saveData.currentStoreId || null;
        GameState.employees = saveData.employees || [];
        GameState.counter = saveData.counter || { cashier: null, isBusy: false, queueCount: 0 };
      }
    } catch (e) {
      console.warn('读取存档失败:', e);
    }
  }

  // ============================================
  // Render
  // ============================================
  function renderAll() {
    updateDay(GameState.day, GameState.weekday);
    updateMoney(GameState.money, 0);
    updateWarehouse(GameState.warehouse.current, GameState.warehouse.max);
    updateTime(GameState.time);
    updateWeather(GameState.weather);
    updateRating(GameState.rating);
    updateHouse(GameState.house);
    updatePlayerInfo();
    updateStoreButton();
    switchTab(GameState.currentTab);
    updateSpeedButton(GameState.speed);
    refreshTalentList();
    renderEmployeeList();
  }

  function updateDay(day, weekday) {
    GameState.day = day;
    GameState.weekday = weekday;
    dayDisplay.textContent = `Day ${day} - ${weekday}`;
  }

  function updateMoney(amount, delta) {
    GameState.money = amount;
    const text = `$${amount.toLocaleString()}`;
    homeMoneyDisplay.textContent = text;
    storeMoneyDisplay.textContent = text;

    if (delta && delta !== 0) {
      showMoneyPopup(delta);
    }

    // 自动存档
    SaveManager.save();
  }

  function updateWarehouse(current, max) {
    GameState.warehouse.current = current;
    GameState.warehouse.max = max;

    const percent = Math.min(100, (current / max) * 100);
    const remaining = max - current;

    // 更新 storeHUD 顶部仓库条
    warehouseFill.style.width = `${percent}%`;
    warehouseText.textContent = `${current}/${max}`;
    warehouseFill.classList.remove('warehouse__fill--warn', 'warehouse__fill--danger');
    if (percent > 90) {
      warehouseFill.classList.add('warehouse__fill--danger');
    } else if (percent > 70) {
      warehouseFill.classList.add('warehouse__fill--warn');
    }

    // 更新 homeHUD 仓库条
    if (homeWarehouseFill && homeWarehouseText) {
      homeWarehouseFill.style.width = `${percent}%`;
      homeWarehouseText.textContent = `${current}/${max}`;
      homeWarehouseFill.classList.remove('warehouse__fill--warn', 'warehouse__fill--danger');
      if (percent > 90) {
        homeWarehouseFill.classList.add('warehouse__fill--danger');
      } else if (percent > 70) {
        homeWarehouseFill.classList.add('warehouse__fill--warn');
      }
    }

    // 更新回家按钮区域的仓库显示
    if (warehouseFillHome && warehouseTextHome) {
      warehouseFillHome.style.width = `${percent}%`;
      warehouseFillHome.classList.remove('warehouse__fill--warn', 'warehouse__fill--danger');
      if (percent > 90) {
        warehouseFillHome.classList.add('warehouse__fill--danger');
      } else if (percent > 70) {
        warehouseFillHome.classList.add('warehouse__fill--warn');
      }
      warehouseTextHome.textContent = `剩余 ${remaining}`;
    }
  }

  function updateTime(time) {
    GameState.time = time;
    timeDisplay.textContent = time;
  }

  function updateWeather(weather) {
    GameState.weather = weather;
    const icon = weather === 'sunny' ? '☀️' : '🌧️';
    weatherDisplay.textContent = icon;
    if (homeWeatherDisplay) {
      homeWeatherDisplay.textContent = icon;
    }
  }

  function updateRating(rating) {
    GameState.rating = rating;
    ratingDisplay.textContent = `⭐ ${rating.toFixed(1)}`;
  }

  function updateHouse(house) {
    GameState.house = { ...GameState.house, ...house };
    if (houseTypeLabel) {
      houseTypeLabel.textContent = GameState.house.name;
    }
  }

  function updatePlayerInfo() {
    if (playerNameDisplay) {
      playerNameDisplay.textContent = GameState.playerName || '';
    }
    if (playerTraitDisplay) {
      playerTraitDisplay.textContent = GameState.playerTrait ? GameState.playerTrait.name : '';
    }
  }

  function updateStoreButton() {
    if (GameState.stores.length === 0) {
      btnGoToStore.disabled = true;
      btnGoToStore.style.opacity = '0.5';
      btnGoToStore.style.cursor = 'not-allowed';
    } else {
      btnGoToStore.disabled = false;
      btnGoToStore.style.opacity = '1';
      btnGoToStore.style.cursor = 'pointer';
    }
  }

  function updateSpeedButton(speed) {
    GameState.speed = speed;
    speedBtns.forEach(btn => {
      const isActive = parseInt(btn.dataset.speed) === speed;
      btn.classList.toggle('speed-btn--active', isActive);
    });
  }

  // ============================================
  // Money Popup
  // ============================================
  function showMoneyPopup(delta) {
    const isPositive = delta > 0;
    const text = `${isPositive ? '+' : ''}$${delta.toLocaleString()}`;

    moneyPopup.textContent = text;
    moneyPopup.classList.remove('money-popup--positive', 'money-popup--negative', 'money-popup--visible');
    void moneyPopup.offsetWidth; // Force reflow
    moneyPopup.classList.add(isPositive ? 'money-popup--positive' : 'money-popup--negative');
    moneyPopup.classList.add('money-popup--visible');

    setTimeout(() => {
      moneyPopup.classList.remove('money-popup--visible');
    }, 1500);
  }

  // ============================================
  // HUD Switching
  // ============================================
  function switchToHomeHUD() {
    GameState.currentHUD = 'home';
    homeHUD.hidden = false;
    storeHUD.hidden = true;
    updatePlayerInfo();
    showToast('已回到家中');
  }

  function switchToStoreHUD() {
    GameState.currentHUD = 'store';
    homeHUD.hidden = true;
    storeHUD.hidden = false;
    renderCurrentStoreInfo();
    renderShelves();
    renderCounter();
    startCustomerSimulation();
    showToast('已进入店铺');
  }

  function switchToHomeHUD() {
    GameState.currentHUD = 'home';
    homeHUD.hidden = false;
    storeHUD.hidden = true;
    stopCustomerSimulation();
    updatePlayerInfo();
    showToast('已回到家中');
  }

  function renderCurrentStoreInfo() {
    const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
    if (!store) return;
    const typeConfig = STORE_TYPE_CONFIG[store.type];
    if (storeNameDisplay) storeNameDisplay.textContent = store.name;
    if (storeTypeDisplay) storeTypeDisplay.textContent = typeConfig ? `${typeConfig.icon} ${typeConfig.label}` : '';
  }

  function renderCounter() {
    if (!storeCounter) return;
    const { cashier, isBusy, queueCount: qCount } = GameState.counter;

    if (counterStatus) {
      counterStatus.textContent = isBusy ? '营业中' : '空闲';
      counterStatus.classList.toggle('store-counter__status--busy', isBusy);
    }
    if (queueCount) {
      queueCount.textContent = qCount;
    }
    if (counterCashierName) {
      if (cashier) {
        const icon = cashier.icon || '🧑';
        counterCashierName.textContent = `${icon} ${cashier.name}`;
      } else {
        counterCashierName.textContent = '未安排';
      }
    }
  }

  // ============================================
  // 人才市场
  // ============================================

  // ============================================
  // 顾客系统
  // ============================================
  const customerZone = document.getElementById('customerZone');
  const customerQueueEl = document.getElementById('customerQueue');
  let customerTimer = null;
  let customerTickTimer = null;
  let checkoutTimer = null;
  let customerIdCounter = 0;

  // 顾客轨道位置（百分比）
  const TRACK_ENTRANCE = 3;    // 入口
  const TRACK_COUNTER  = 75;  // 收银台排队起点

  // 持久化 DOM 元素映射：customerId → div
  const customerDomMap = new Map();

  function startCustomerSimulation() {
    stopCustomerSimulation();
    // 每 3-7 秒随机产生一个顾客
    scheduleNextCustomer();
    // 每 1.5 秒处理顾客行为 + 每 2 秒处理收银结算
    customerTickTimer = setInterval(processCustomerTick, 1500);
    checkoutTimer = setInterval(processCheckout, 2000);
  }

  function stopCustomerSimulation() {
    if (customerTimer) { clearTimeout(customerTimer); customerTimer = null; }
    if (customerTickTimer) { clearInterval(customerTickTimer); customerTickTimer = null; }
    if (checkoutTimer) { clearInterval(checkoutTimer); checkoutTimer = null; }
    GameState.customers = [];
    GameState.checkoutQueue = [];
  }

  function scheduleNextCustomer() {
    const delay = 3000 + Math.random() * 4000; // 3-7秒
    customerTimer = setTimeout(() => {
      spawnCustomer();
      scheduleNextCustomer();
    }, delay);
  }

  function spawnCustomer() {
    const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
    if (!store) return;

    const customer = {
      id: ++customerIdCounter,
      color: CUSTOMER_COLORS[Math.floor(Math.random() * CUSTOMER_COLORS.length)],
      icon: '🧑',
      state: 'entering',
      trackPos: TRACK_ENTRANCE,  // 轨道位置 0-100%
      targetShelf: null,
      holding: null,
    };

    GameState.customers.push(customer);
    renderCustomers();
  }

  // 根据货架索引计算轨道上的位置（20%-65%之间）
  function shelfToTrackPos(shelfIndex, shelfCount) {
    const min = 20, max = 65;
    return min + (shelfIndex / Math.max(shelfCount - 1, 1)) * (max - min);
  }

  function renderCustomers() {
    if (!customerTrack) return;

    const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
    const shelfCount = store ? store.shelves.length : 6;

    // 所有活跃顾客（含排队）
    const activeCustomers = GameState.customers.filter(c => c.state !== 'leaving');

    // === 复用已有 DOM，新增的创建 ===
    activeCustomers.forEach(c => {
      let el = customerDomMap.get(c.id);
      if (!el) {
        el = document.createElement('div');
        el.className = 'customer-block';
        customerTrack.appendChild(el);
        customerDomMap.set(c.id, el);
      }

      let pos, animCls;
      if (c.state === 'queued') {
        const qIndex = GameState.checkoutQueue.indexOf(c);
        pos = TRACK_COUNTER + qIndex * 5;
        animCls = 'customer-block--queuing';
      } else if (c.state === 'entering') {
        pos = TRACK_ENTRANCE;
        animCls = 'customer-block--entering';
      } else if (c.state === 'shopping') {
        pos = shelfToTrackPos(c.targetShelf || 0, shelfCount);
        animCls = 'customer-block--shopping';
      } else if (c.state === 'going_to_counter') {
        pos = TRACK_COUNTER - 8;
        animCls = 'customer-block--shopping';
      } else {
        pos = TRACK_COUNTER;
        animCls = 'customer-block--leaving';
      }

      pos = Math.min(95, Math.max(0, pos));
      el.style.left = pos + '%';
      el.style.background = c.color;
      el.className = `customer-block ${animCls}`;
      el.title = c.state === 'queued'
        ? `排队中 ${c.icon}顾客${c.id}${c.holding && c.holding.length ? ' 🛒' : ''}`
        : `购物中 ${c.icon}顾客${c.id}${c.holding && c.holding.length ? ' 🛒' : ''}`;
      el.textContent = c.icon;
    });

    // === 删除已离开顾客的 DOM ===
    const activeIds = new Set(activeCustomers.map(c => c.id));
    for (const [id, el] of customerDomMap) {
      if (!activeIds.has(id)) {
        el.remove();
        customerDomMap.delete(id);
      }
    }

    if (queueCount) {
      queueCount.textContent = GameState.checkoutQueue.length;
    }
  }

  function processCustomerTick() {
    const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
    if (!store) return;

    GameState.customers.forEach(c => {
      if (c.state === 'entering') {
        // 找有货的货架
        const stocked = store.shelves
          .map((s, i) => ({ s, i }))
          .filter(x => x.s && x.s.stock > 0);
        if (stocked.length > 0) {
          const pick = stocked[Math.floor(Math.random() * stocked.length)];
          c.targetShelf = pick.i;
        } else {
          // 无货：随机选一个货架格子去逛（不买）
          c.targetShelf = Math.floor(Math.random() * store.shelves.length);
        }
        c.state = 'shopping';
        c.shoppingTicks = 4; // 4 ticks ≈ 6秒购物时间
      } else if (c.state === 'shopping') {
        // 尝试拿商品（每个顾客买1-2件）
        if (!c.holding) c.holding = [];

        if (c.holding.length < 2) {
          const shelf = store.shelves[c.targetShelf];
          if (shelf && shelf.stock > 0) {
            shelf.stock--;
            c.holding.push({ ...shelf, stock: 1 });
            renderShelves();
          }
        }

        // 购物计时减1
        c.shoppingTicks--;

        // 计时结束
        if (c.shoppingTicks <= 0) {
          if (c.holding.length > 0) {
            // 买了好东西 → 去收银台
            c.state = 'going_to_counter';
            moveCustomerToCounter(c);
          } else {
            // 什么都没买 → 直接离开
            c.state = 'leaving';
          }
        }
      }
    });

    // 清理已离开顾客
    GameState.customers = GameState.customers.filter(c => c.state !== 'leaving');
    renderCustomers();
  }

  function moveCustomerToCounter(c) {
    // 直接入队，不再等setTimeout（确保不丢）
    c.state = 'queued';
    GameState.checkoutQueue.push(c);
    renderCustomers();
  }

  function processCheckout() {
    // 有收银员 + 排队 > 0 → 自动结算
    if (GameState.counter.cashier && GameState.checkoutQueue.length > 0) {
      const c = GameState.checkoutQueue.shift();
      // 计算收入
      const income = c.holding.reduce((sum, item) => sum + (item.baseSellPrice || 0), 0);
      if (income > 0) {
        GameState.money += income;
        updateMoney(GameState.money, income);
      }
      c.state = 'leaving';
      c.holding = null;
      renderCustomers();
      SaveManager.save();
    }
  }

  function refreshTalentList() {
    if (!talentList) return;

    // 每次随机选2-4个人才展示
    const shuffled = [...TALENT_POOL].sort(() => Math.random() - 0.5);
    currentTalents = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));

    talentList.innerHTML = currentTalents.map(t => `
      <div class="talent-card" data-talent-id="${t.id}">
        <div class="talent-card__avatar">${t.icon}</div>
        <div class="talent-card__info">
          <div class="talent-card__name">${t.name}</div>
          <div class="talent-card__skill">⭐ ${t.skill}</div>
          <div class="talent-card__desc">${t.skillDesc} · ${t.trait}</div>
        </div>
        <div class="talent-card__wage">
          <div class="talent-card__wage-label">日薪</div>
          <div class="talent-card__wage-value">$${t.wage}</div>
        </div>
      </div>
    `).join('');

    talentList.querySelectorAll('.talent-card').forEach(card => {
      card.addEventListener('click', () => hireTalent(card.dataset.talentId));
    });
  }

  function hireTalent(talentId) {
    const talent = currentTalents.find(t => t.id === talentId);
    if (!talent) return;

    // 检查是否已雇佣
    if (GameState.employees.find(e => e.talentId === talentId)) {
      showToast(`${talent.name} 已经在你的店铺工作了！`);
      return;
    }

    const employee = {
      id: `emp_${Date.now()}`,
      talentId: talent.id,
      name: talent.name,
      icon: talent.icon,
      skill: talent.skill,
      skillDesc: talent.skillDesc,
      wage: talent.wage,
      trait: talent.trait,
      assignedStoreId: null,
      role: null, // 'cashier' | null
    };

    GameState.employees.push(employee);
    SaveManager.save();

    renderTalentList();
    renderEmployeeList();
    showToast(`🎉 成功雇佣 ${talent.icon} ${talent.name}！\n日薪 $${talent.wage}`);
  }

  function renderTalentList() {
    if (!talentList) return;
    // 刷新人才列表
    refreshTalentList();
  }

  // ============================================
  // 员工管理
  // ============================================
  function renderEmployeeList() {
    if (!employeeList || !employeeEmpty || !employeeCount) return;

    employeeCount.textContent = `在职: ${GameState.employees.length}人`;

    if (GameState.employees.length === 0) {
      employeeList.innerHTML = '';
      employeeEmpty.style.display = 'flex';
      return;
    }

    employeeEmpty.style.display = 'none';

    employeeList.innerHTML = GameState.employees.map(emp => {
      const isCashier = GameState.counter.cashier && GameState.counter.cashier.id === emp.id;
      const store = emp.assignedStoreId ? GameState.stores.find(s => s.id === emp.assignedStoreId) : null;
      return `
        <div class="employee-card ${isCashier ? 'employee-card--on-duty' : ''}" data-emp-id="${emp.id}">
          <div class="employee-card__avatar">${emp.icon}</div>
          <div class="employee-card__info">
            <div class="employee-card__name">${emp.name}</div>
            <div class="employee-card__status ${isCashier ? 'employee-card__status--active' : ''}">
              ${isCashier ? '✅ 收银员' : '待命'}
            </div>
            <div class="employee-card__assignment">⭐ ${emp.skill} · ${emp.skillDesc}</div>
          </div>
          <div class="employee-card__actions">
            ${!isCashier ? `<button class="btn btn--small btn--primary btn-assign-cashier">安排收银</button>` : ''}
            <button class="btn btn--small btn--danger btn-fire">解雇</button>
          </div>
        </div>
      `;
    }).join('');

    employeeList.querySelectorAll('.btn-assign-cashier').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        assignCashier(btn.closest('.employee-card').dataset.empId);
      });
    });

    employeeList.querySelectorAll('.btn-fire').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        fireEmployee(btn.closest('.employee-card').dataset.empId);
      });
    });
  }

  function assignCashier(empId) {
    const emp = GameState.employees.find(e => e.id === empId);
    if (!emp) return;

    // 如果当前有员工收银员，先解除
    if (GameState.counter.cashier && GameState.counter.cashier.type === 'employee') {
      const prev = GameState.employees.find(e => e.id === GameState.counter.cashier.id);
      if (prev) {
        prev.role = null;
      }
    }

    GameState.counter.cashier = { type: 'employee', id: emp.id, name: emp.name, icon: emp.icon };
    GameState.counter.isBusy = true;
    emp.role = 'cashier';

    SaveManager.save();
    renderCounter();
    renderEmployeeList();
    showToast(`✅ ${emp.icon} ${emp.name} 已安排为收银员`);
  }

  function fireEmployee(empId) {
    const emp = GameState.employees.find(e => e.id === empId);
    if (!emp) return;

    // 如果是当前收银员，解除
    if (GameState.counter.cashier && GameState.counter.cashier.id === empId) {
      GameState.counter.cashier = { type: 'player' };
      GameState.counter.isBusy = false;
    }

    GameState.employees = GameState.employees.filter(e => e.id !== empId);
    SaveManager.save();

    renderEmployeeList();
    showToast(`${emp.icon} ${emp.name} 已解雇`);
  }

  // ============================================
  // 收银员选择弹窗
  // ============================================
  function openCounterModal() {
    if (!modalCounter || !cashierList) return;

    const cashier = GameState.counter.cashier;

    // 构建选项：玩家 + 已雇佣员工
    const options = [
      { type: 'player', id: 'player', name: GameState.playerName || '主角', icon: '🧑' }
    ];

    GameState.employees.forEach(emp => {
      options.push({ type: 'employee', id: emp.id, name: emp.name, icon: emp.icon, wage: emp.wage });
    });

    cashierList.innerHTML = options.map(opt => `
      <div class="cashier-option ${cashier && cashier.type === opt.type && cashier.id === opt.id ? 'cashier-option--selected' : ''}" data-type="${opt.type}" data-id="${opt.id}">
        <div class="cashier-option__avatar">${opt.icon}</div>
        <div class="cashier-option__info">
          <div class="cashier-option__name">${opt.name}</div>
          <div class="cashier-option__role">${opt.type === 'player' ? '👑 主角（玩家）' : `员工 · 日薪 $${opt.wage}`}</div>
        </div>
        <div class="cashier-option__check">✓</div>
      </div>
    `).join('');

    cashierList.querySelectorAll('.cashier-option').forEach(opt => {
      opt.addEventListener('click', () => selectCashier(opt.dataset.type, opt.dataset.id));
    });

    modalCounter.setAttribute('aria-hidden', 'false');
  }

  function closeCounterModal() {
    if (!modalCounter) return;
    modalCounter.setAttribute('aria-hidden', 'true');
  }

  function selectCashier(type, id) {
    if (type === 'player') {
      // 解除员工收银员角色
      if (GameState.counter.cashier && GameState.counter.cashier.type === 'employee') {
        const prev = GameState.employees.find(e => e.id === GameState.counter.cashier.id);
        if (prev) prev.role = null;
      }
      GameState.counter.cashier = { type: 'player', id: 'player', name: GameState.playerName || '主角' };
    } else {
      // 玩家取消收银
      GameState.counter.cashier = { type: 'player' };
      assignCashier(id);
      closeCounterModal();
      renderCounter();
      return;
    }

    GameState.counter.isBusy = !!GameState.counter.cashier;
    SaveManager.save();

    closeCounterModal();
    renderCounter();
    renderEmployeeList();
    showToast(`收银员已安排: ${GameState.counter.cashier.name}`);
  }

  function renderShelves() {
    const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
    if (!store || !storeShelves) return;

    storeShelves.innerHTML = store.shelves.map((item, idx) => {
      if (item) {
        const stockLow = !item.stock || item.stock === 0;
        return `
          <div class="shelf-cell shelf-cell--filled ${stockLow ? 'shelf-cell--empty-stock' : ''}" data-index="${idx}">
            <span class="shelf-cell__icon">${item.icon}</span>
            <span class="shelf-cell__name">${item.name}</span>
            <span class="shelf-cell__price">$${item.baseSellPrice}</span>
            <span class="shelf-cell__stock ${stockLow ? 'shelf-cell__stock--zero' : ''}">库存: ${item.stock ?? 0}</span>
          </div>
        `;
      } else {
        return `
          <div class="shelf-cell shelf-cell--empty" data-index="${idx}"></div>
        `;
      }
    }).join('');

    storeShelves.querySelectorAll('.shelf-cell').forEach(cell => {
      cell.addEventListener('click', () => onShelfClick(parseInt(cell.dataset.index)));
    });
  }

  function onShelfClick(index) {
    const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
    if (!store) return;

    selectedShelfIndex = index;
    const currentItem = store.shelves[index];

    renderItemGrid(store.type, currentItem);

    if (currentItem) {
      // 已有料，显示移除选项（暂时用取消代替）
      btnShelfItemCancel.textContent = '移除货物';
    } else {
      btnShelfItemCancel.textContent = '取消';
    }

    modalShelfItem.setAttribute('aria-hidden', 'false');
  }

  function renderItemGrid(storeType, currentItem) {
    const items = STORE_TYPE_ITEMS[storeType] || [];
    itemGrid.innerHTML = items.map(item => `
      <div class="item-card ${currentItem && currentItem.id === item.id ? 'item-card--selected' : ''}" data-item-id="${item.id}">
        <div class="item-card__icon">${item.icon}</div>
        <div class="item-card__name">${item.name}</div>
        <div class="item-card__price">$${item.baseSellPrice}</div>
      </div>
    `).join('');

    itemGrid.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => onItemSelect(card.dataset.itemId));
    });
  }

  function onItemSelect(itemId) {
    const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
    if (!store) return;

    const items = STORE_TYPE_ITEMS[store.type] || [];
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    store.shelves[selectedShelfIndex] = { ...item, stock: 3 + Math.floor(Math.random() * 6) }; // 3-8件库存
    closeShelfItemModal();
    renderShelves();
    SaveManager.save();
    showToast(`已放置 ${item.icon} ${item.name}（${store.shelves[selectedShelfIndex].stock}件）`);
  }

  function closeShelfItemModal() {
    modalShelfItem.setAttribute('aria-hidden', 'true');
    selectedShelfIndex = -1;
  }

  // ============================================
  // Tab Switching
  // ============================================
  function switchTab(tabName) {
    GameState.currentTab = tabName;

    tabs.forEach(tab => {
      tab.classList.toggle('tab--active', tab.dataset.tab === tabName);
    });

    tabPanels.forEach(panel => {
      const isActive = panel.id === `panel-${tabName}`;
      panel.classList.toggle('tab-panel--active', isActive);
    });
  }

  // ============================================
  // New Store Modal
  // ============================================
  function openNewStoreModal() {
    newStoreState = { type: null, storeName: '', area: null, location: null };
    inputStoreName.value = '';
    renderTypeGrid();
    switchStoreStep('type');
    modalNewStore.setAttribute('aria-hidden', 'false');
  }

  function closeNewStoreModal() {
    modalNewStore.setAttribute('aria-hidden', 'true');
  }

  function switchStoreStep(step) {
    stepType.hidden = step !== 'type';
    stepArea.hidden = step !== 'area';
    stepLocation.hidden = step !== 'location';
    stepConfirm.hidden = step !== 'confirm';
  }

  function renderTypeGrid() {
    typeGrid.innerHTML = Object.entries(STORE_TYPE_CONFIG).map(([key, config]) => `
      <div class="type-card" data-type="${key}">
        <div class="type-card__icon">${config.icon}</div>
        <div class="type-card__name">${config.label}</div>
        <div class="type-card__desc">${config.desc}</div>
      </div>
    `).join('');

    typeGrid.querySelectorAll('.type-card').forEach(card => {
      card.addEventListener('click', () => selectType(card.dataset.type));
    });
  }

  function selectType(typeKey) {
    newStoreState.type = typeKey;
    typeGrid.querySelectorAll('.type-card').forEach(c => c.classList.remove('type-card--selected'));
    typeGrid.querySelector(`[data-type="${typeKey}"]`).classList.add('type-card--selected');
    validateTypeStep();
  }

  function validateTypeStep() {
    const nameValid = inputStoreName.value.trim().length > 0;
    const typeValid = newStoreState.type !== null;
    btnTypeNext.disabled = !(nameValid && typeValid);
  }

  function renderAreaGrid() {
    areaGrid.innerHTML = Object.entries(STORE_AREA_CONFIG).map(([key, config]) => `
      <div class="area-card" data-area="${key}">
        <div class="area-card__name">${config.label}</div>
        <div class="area-card__stats">
          货架: ${config.maxShelves} | 员工: ${config.maxEmployees}<br>
          仓库: ${config.warehouseCapacity}
        </div>
        <div class="area-card__rent">日租 $${config.baseRent}</div>
      </div>
    `).join('');

    areaGrid.querySelectorAll('.area-card').forEach(card => {
      card.addEventListener('click', () => selectArea(card.dataset.area));
    });
  }

  function selectArea(areaKey) {
    newStoreState.area = areaKey;
    areaGrid.querySelectorAll('.area-card').forEach(c => c.classList.remove('area-card--selected'));
    areaGrid.querySelector(`[data-area="${areaKey}"]`).classList.add('area-card--selected');
    btnAreaNext.disabled = false;
  }

  function renderLocationGrid() {
    locationGrid.innerHTML = Object.entries(STORE_LOCATION_CONFIG).map(([key, config]) => `
      <div class="location-card" data-location="${key}">
        <div class="location-card__name">${config.label}</div>
        <div class="location-card__traffic">人流 ${config.baseFootTraffic}/天</div>
        <div class="location-card__rent">日租 $${config.baseRent}</div>
      </div>
    `).join('');

    locationGrid.querySelectorAll('.location-card').forEach(card => {
      card.addEventListener('click', () => selectLocation(card.dataset.location));
    });
  }

  function selectLocation(locationKey) {
    newStoreState.location = locationKey;
    locationGrid.querySelectorAll('.location-card').forEach(c => c.classList.remove('location-card--selected'));
    locationGrid.querySelector(`[data-location="${locationKey}"]`).classList.add('location-card--selected');
    btnLocationNext.disabled = false;
    updateStorePreview();
  }

  function updateStorePreview() {
    if (!newStoreState.area || !newStoreState.location) return;

    const area = STORE_AREA_CONFIG[newStoreState.area];
    const loc = STORE_LOCATION_CONFIG[newStoreState.location];
    const typeConfig = STORE_TYPE_CONFIG[newStoreState.type];
    const totalRent = area.baseRent + loc.baseRent;
    const footTraffic = Math.floor(loc.baseFootTraffic * area.trafficMultiplier);

    storePreview.innerHTML = `
      <div class="store-preview__title">📊 店铺预览</div>
      <div class="store-preview__row">
        <span>类型</span><span>${typeConfig.icon} ${typeConfig.label}</span>
      </div>
      <div class="store-preview__row">
        <span>面积</span><span>${area.label}</span>
      </div>
      <div class="store-preview__row">
        <span>位置</span><span>${loc.label}</span>
      </div>
      <div class="store-preview__row">
        <span>预计日租金</span><span class="store-preview__row--highlight">$${totalRent}</span>
      </div>
      <div class="store-preview__row">
        <span>预计日人流</span><span class="store-preview__row--highlight">${footTraffic}</span>
      </div>
      <div class="store-preview__row">
        <span>仓库容量</span><span>${area.warehouseCapacity}</span>
      </div>
      <div class="store-preview__row">
        <span>最大员工数</span><span>${area.maxEmployees}</span>
      </div>
    `;
  }

  function renderStoreSummary() {
    if (!newStoreState.type || !newStoreState.storeName || !newStoreState.area || !newStoreState.location) return;

    const area = STORE_AREA_CONFIG[newStoreState.area];
    const loc = STORE_LOCATION_CONFIG[newStoreState.location];
    const typeConfig = STORE_TYPE_CONFIG[newStoreState.type];
    const totalRent = area.baseRent + loc.baseRent;
    const footTraffic = Math.floor(loc.baseFootTraffic * area.trafficMultiplier);

    storeSummary.innerHTML = `
      <div class="store-summary__title">📋 开设确认</div>
      <div class="store-summary__row">
        <span>店铺名称</span><span>${newStoreState.storeName}</span>
      </div>
      <div class="store-summary__row">
        <span>店铺类型</span><span>${typeConfig.icon} ${typeConfig.label}</span>
      </div>
      <div class="store-summary__row">
        <span>店铺规模</span><span>${area.label}</span>
      </div>
      <div class="store-summary__row">
        <span>店铺位置</span><span>${loc.label}</span>
      </div>
      <div class="store-summary__row">
        <span>预计日人流</span><span>${footTraffic}</span>
      </div>
      <div class="store-summary__row store-summary__row--highlight">
        <span>首日租金</span><span>$${totalRent}</span>
      </div>
      <div class="store-summary__total">
        <span>当前资金</span><span>$${GameState.money.toLocaleString()}</span>
      </div>
      <div class="store-summary__total">
        <span>开设后资金</span><span class="${GameState.money < totalRent ? 'text-danger' : ''}">$${(GameState.money - totalRent).toLocaleString()}</span>
      </div>
    `;
  }

  function confirmNewStore() {
    if (!newStoreState.type || !newStoreState.storeName || !newStoreState.area || !newStoreState.location) {
      showToast('请完善店铺信息');
      return;
    }

    const area = STORE_AREA_CONFIG[newStoreState.area];
    const loc = STORE_LOCATION_CONFIG[newStoreState.location];
    const totalRent = area.baseRent + loc.baseRent;

    // 检查资金
    if (GameState.money < totalRent) {
      showToast(`资金不足！需要 $${totalRent} 作为首日租金`);
      return;
    }

    // 创建店铺
    const storeId = `store_${Date.now()}`;
    const footTraffic = Math.floor(loc.baseFootTraffic * area.trafficMultiplier);

    const newStore = {
      id: storeId,
      name: newStoreState.storeName,
      type: newStoreState.type,
      location: newStoreState.location,
      area: newStoreState.area,
      maxShelves: area.maxShelves,
      maxEmployees: area.maxEmployees,
      warehouseCapacity: area.warehouseCapacity,
      dailyRent: totalRent,
      baseFootTraffic: footTraffic,
      footTrafficBonus: 0,
      satisfactionBonus: 0,
      rating: 0,
      ratingHistory: [],
      level: 1,
      upgradeCost: 2000,
      isUnlocked: true,
      isOwned: true,
      todayIncome: 0,
      todayExpense: totalRent,
      todayProfit: 0,
      dailyProfitHistory: [],
      // 货架：数组长度=maxShelves，每项为null表示空，或为商品对象
      shelves: Array(area.maxShelves).fill(null),
    };

    // 添加店铺（先push，再扣钱保存）
    GameState.stores.push(newStore);

    // 如果是第一家店，自动设为当前店铺
    if (!GameState.currentStoreId) {
      GameState.currentStoreId = storeId;
    }

    // 扣除租金（此时 stores 已包含新店，save 会一并持久化）
    updateMoney(GameState.money - totalRent, -totalRent);

    // 更新按钮状态
    updateStoreButton();

    // 关闭弹窗
    closeNewStoreModal();

    // 提示
    showToast(`🎉 ${newStore.name}\n开设成功！日租金 $${totalRent}`);
  }

  // ============================================
  // Toast
  // ============================================
  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('toast--visible');
    void toast.offsetWidth;
    toast.classList.add('toast--visible');

    setTimeout(() => {
      toast.classList.remove('toast--visible');
    }, 2500);
  }

  // ============================================
  // Event Binding
  // ============================================
  function bindEvents() {
    btnBackToMenu.addEventListener('click', () => {
      window.location.href = '../StartScene/StartScene.html';
    });

    btnGoToStore.addEventListener('click', () => {
      if (GameState.stores.length === 0) {
        showToast('还没有开设店铺！\n请先开设新店');
        return;
      }
      // 默认 currentStoreId 为创建的第一家店
      if (!GameState.currentStoreId) {
        GameState.currentStoreId = GameState.stores[0].id;
      }
      switchToStoreHUD();
    });
    btnGoToHome.addEventListener('click', switchToHomeHUD);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        updateSpeedButton(parseInt(btn.dataset.speed));
        showToast(`游戏速度: ${btn.dataset.speed}x`);
      });
    });

    btnNewStore.addEventListener('click', () => {
      openNewStoreModal();
    });

    btnEmployee.addEventListener('click', () => {
      switchTab('employee');
    });

    btnHouse.addEventListener('click', () => {
      const h = GameState.house;
      showToast(`🏠 ${h.name}\n等级: ${h.level}/${h.maxLevel}\n(升级功能建设中...)`);
    });

    // New Store Modal events
    inputStoreName.addEventListener('input', () => {
      newStoreState.storeName = inputStoreName.value.trim();
      validateTypeStep();
    });

    btnStoreCancel.addEventListener('click', closeNewStoreModal);

    btnTypeNext.addEventListener('click', () => {
      renderAreaGrid();
      switchStoreStep('area');
    });

    btnAreaBack.addEventListener('click', () => {
      switchStoreStep('type');
    });

    btnAreaNext.addEventListener('click', () => {
      renderLocationGrid();
      switchStoreStep('location');
      updateStorePreview();
    });

    btnLocationBack.addEventListener('click', () => {
      switchStoreStep('area');
    });

    btnLocationNext.addEventListener('click', () => {
      renderStoreSummary();
      switchStoreStep('confirm');
    });

    btnConfirmBack.addEventListener('click', () => {
      switchStoreStep('location');
    });

    btnStoreConfirm.addEventListener('click', confirmNewStore);

    modalNewStore.addEventListener('click', e => {
      if (e.target === modalNewStore) closeNewStoreModal();
    });

    btnShelfItemCancel.addEventListener('click', () => {
      const store = GameState.stores.find(s => s.id === GameState.currentStoreId);
      if (store && store.shelves[selectedShelfIndex]) {
        store.shelves[selectedShelfIndex] = null;
        renderShelves();
        SaveManager.save();
        showToast('已移除货物');
      }
      closeShelfItemModal();
    });

    modalShelfItem.addEventListener('click', e => {
      if (e.target === modalShelfItem) closeShelfItemModal();
    });

    // Counter box click → open cashier modal
    const counterBox = $('counterBox');
    if (counterBox) {
      counterBox.addEventListener('click', () => {
        openCounterModal();
      });
    }

    // Counter modal
    btnCounterCancel.addEventListener('click', closeCounterModal);
    modalCounter.addEventListener('click', e => {
      if (e.target === modalCounter) closeCounterModal();
    });

    // Employee tab → refresh talent list each time
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.dataset.tab === 'talent') {
          refreshTalentList();
        }
        if (tab.dataset.tab === 'employee') {
          renderEmployeeList();
        }
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      switch (e.key.toLowerCase()) {
        case 'h': switchToHomeHUD(); break;
        case 's': switchToStoreHUD(); break;
        case '1': updateSpeedButton(1); break;
        case '2': updateSpeedButton(2); break;
        case '3': updateSpeedButton(3); break;
      }
    });
  }

  // ============================================
  // Demo Simulation
  // ============================================
  function startDemo() {
    // 3s - Weather changes
    setTimeout(() => updateWeather('rainy'), 3000);

    // 5s - Money increases
    setTimeout(() => {
      updateMoney(GameState.money + 500, 500);
    }, 5000);

    // 8s - Warehouse fills
    setTimeout(() => updateWarehouse(35, 100), 8000);

    // 12s - Rating updates
    setTimeout(() => updateRating(4.2), 12000);

    // 15s - Money decreases
    setTimeout(() => {
      updateMoney(GameState.money - 200, -200);
    }, 15000);

    // 18s - Warehouse nearly full
    setTimeout(() => updateWarehouse(92, 100), 18000);

    // 22s - Time advances
    setTimeout(() => updateTime('14:00'), 22000);

    // 25s - House upgrade demo
    setTimeout(() => {
      updateHouse({ type: 'apartment', name: '公寓' });
      showToast('房屋升级！\n出租屋 → 公寓');
    }, 25000);
  }

  // ============================================
  // Boot
  // ============================================
  document.addEventListener('DOMContentLoaded', init);

})();
