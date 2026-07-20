import {
  IGameState,
  IPlayerData,
  IHomeData,
  IStoreData,
  IWarehouseData,
  IShoppingCart,
  IDailyLedger,
  IOrder,
  IActiveEvent,
  ICustomerData,
  IEmployeeData,
  WeatherType,
} from '../Data/DataInterfaces';

/**
 * 游戏运行时状态
 * 单例模式，全局唯一
 */
export class GameState {
  private static _instance: GameState | null = null;

  public static get instance(): GameState {
    if (!GameState._instance) {
      GameState._instance = new GameState();
    }
    return GameState._instance;
  }

  // 当前游戏状态
  public state: IGameState;

  private constructor() {
    this.state = this.createInitialState();
  }

  /**
   * 创建初始游戏状态
   */
  private createInitialState(): IGameState {
    const player: IPlayerData = {
      id: 'player_001',
      name: '',
      money: 10000, // 初始资金
      totalEarnings: 0,
      currentDay: 1,
      currentWeek: 1,
      currentWeekDay: 1,
      traits: [],
      pendingTraitChoices: null,
      loanAmount: 0,
      loanInterestRate: 0.10,
      loanDueWeek: 0,
      totalLoanTaken: 0,
      unlockedStoreTypes: ['convenience'],
      ownedStoreIds: [],
      currentStoreId: '',
      achievements: [],
    };

    const home: IHomeData = {
      currentLevel: 1,
      currentHomeType: 'basement',
      unlockedBonuses: [],
      pendingBonusChoice: null,
      daysOwned: 0,
      totalUpgradeSpent: 0,
    };

    return {
      player,
      home,
      stores: {},
      employees: [],
      warehouses: {},
      shoppingCart: {
        items: [],
        totalVolume: 0,
        totalCost: 0,
      },
      pendingOrders: [],
      orderHistory: [],
      currentTime: 8, // 08:00
      weather: 'Sunny',
      tomorrowWeather: 'Sunny',
      activeEvents: [],
      ledgerHistory: [],
    };
  }

  // ==================== 玩家相关 ====================

  public get player(): IPlayerData {
    return this.state.player;
  }

  public addMoney(amount: number): void {
    this.state.player.money += amount;
    if (amount > 0) {
      this.state.player.totalEarnings += amount;
    }
  }

  public spendMoney(amount: number): boolean {
    if (this.state.player.money < amount) {
      return false;
    }
    this.state.player.money -= amount;
    return true;
  }

  // ==================== 店铺相关 ====================

  public get stores(): Record<string, IStoreData> {
    return this.state.stores;
  }

  public get currentStore(): IStoreData | null {
    if (!this.state.player.currentStoreId) return null;
    return this.state.stores[this.state.player.currentStoreId] || null;
  }

  public addStore(store: IStoreData): void {
    this.state.stores[store.id] = store;
    this.state.player.ownedStoreIds.push(store.id);
    if (!this.state.player.currentStoreId) {
      this.state.player.currentStoreId = store.id;
    }
  }

  // ==================== 仓库相关 ====================

  public getWarehouse(storeId: string): IWarehouseData | null {
    return this.state.warehouses[storeId] || null;
  }

  public createWarehouse(storeId: string, capacity: number): IWarehouseData {
    const warehouse: IWarehouseData = {
      storeId,
      capacity,
      used: 0,
      inventory: {},
      shelfContents: {},
    };
    this.state.warehouses[storeId] = warehouse;
    return warehouse;
  }

  // ==================== 购物车相关 ====================

  public get shoppingCart(): IShoppingCart {
    return this.state.shoppingCart;
  }

  public addToCart(itemId: string, quantity: number): void {
    const existing = this.state.shoppingCart.items.find(i => i.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.state.shoppingCart.items.push({ itemId, quantity });
    }
  }

  public clearCart(): void {
    this.state.shoppingCart.items = [];
    this.state.shoppingCart.totalVolume = 0;
    this.state.shoppingCart.totalCost = 0;
  }

  // ==================== 员工相关 ====================

  public get employees(): IEmployeeData[] {
    return this.state.employees;
  }

  public addEmployee(employee: IEmployeeData): void {
    this.state.employees.push(employee);
  }

  public removeEmployee(employeeId: string): void {
    this.state.employees = this.state.employees.filter(e => e.id !== employeeId);
  }

  // ==================== 顾客相关 ====================

  public customers: ICustomerData[] = [];

  public addCustomer(customer: ICustomerData): void {
    this.customers.push(customer);
  }

  public removeCustomer(instanceId: string): void {
    this.customers = this.customers.filter(c => c.instanceId !== instanceId);
  }

  // ==================== 时间相关 ====================

  public advanceTime(hours: number): void {
    this.state.currentTime += hours;
    if (this.state.currentTime >= 24) {
      this.state.currentTime -= 24;
      this.state.player.currentDay += 1;
      this.state.player.currentWeekDay += 1;
      if (this.state.player.currentWeekDay > 7) {
        this.state.player.currentWeekDay = 1;
        this.state.player.currentWeek += 1;
      }
    }
  }

  public setWeather(weather: WeatherType): void {
    this.state.weather = weather;
  }

  // ==================== 存档相关 ====================

  public serialize(): string {
    return JSON.stringify(this.state);
  }

  public deserialize(json: string): void {
    try {
      const data = JSON.parse(json);
      this.state = { ...this.createInitialState(), ...data };
    } catch (e) {
      console.error('Failed to deserialize game state:', e);
    }
  }
}
