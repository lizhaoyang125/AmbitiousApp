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
    house: {
      type: 'rental',      // 'rental' | 'apartment' | 'villa'
      name: '出租屋',
      level: 1,
      maxLevel: 5
    },
    stores: [],           // 已开设的店铺列表
    employees: []         // 员工列表
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
  const btnGoToStore = $('btnGoToStore');
  const btnGoToHome = $('btnGoToHome');
  const btnNewStore = $('btn-new-store');
  const btnEmployee = $('btn-employee');
  const btnHouse = $('btn-house');
  const houseTypeLabel = $('house-type');

  const tabs = document.querySelectorAll('.tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const speedBtns = document.querySelectorAll('.speed-btn');

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
      const saveData = localStorage.getItem('wmb_save_data');
      if (saveData) {
        const data = JSON.parse(saveData);
        GameState.day = data.dayReached || 1;
        GameState.money = data.money || 0;
        GameState.rating = data.rating || 0.0;
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
    switchTab(GameState.currentTab);
    updateSpeedButton(GameState.speed);
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
    showToast('已回到家中');
  }

  function switchToStoreHUD() {
    GameState.currentHUD = 'store';
    homeHUD.hidden = true;
    storeHUD.hidden = false;
    showToast('已进入店铺');
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
    btnGoToStore.addEventListener('click', switchToStoreHUD);
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
      showToast('开设新店\n(功能建设中...)');
    });

    btnEmployee.addEventListener('click', () => {
      showToast(`员工管理\n员工数: ${GameState.employees.length}人`);
    });

    btnHouse.addEventListener('click', () => {
      const h = GameState.house;
      showToast(`🏠 ${h.name}\n等级: ${h.level}/${h.maxLevel}\n(升级功能建设中...)`);
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
