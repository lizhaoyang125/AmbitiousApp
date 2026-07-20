/**
 * 游戏数据接口定义
 * 《无名之辈：白手起家》
 *
 * 根据《数据接口策划1.0.md》整理
 */

// ==================== 基础类型 ====================

export type StoreType = 'convenience' | 'clothing' | 'flowers' | 'electronics';
export type StoreAreaType = 'small' | 'medium' | 'large' | 'luxury';
export type StoreLocationType = 'alley' | 'street' | 'avenue' | 'downtown' | 'landmark';
export type HomeLevelType = 'basement' | 'sharedApartment' | 'wholeApartment' | 'ownedHouse' | 'villa' | 'mansion';
export type WeatherType = 'Sunny' | 'Rainy';
export type OrderStatus = 'pending' | 'delivered' | 'overflow' | 'cancelled';
export type EmployeeRole = 'Cashier' | 'Stocker' | 'Cleaner' | 'Idle';
export type EmployeeStatus = 'training' | 'working' | 'resting' | 'on_break';
export type CustomerState = 'entering' | 'shopping' | 'queuing' | 'checking_out' | 'leaving' | 'angry_leaving';
export type EventType = 'dirt' | 'empty_shelf' | 'vip_customer' | 'bulk_purchase';
export type EventStatus = 'active' | 'resolving' | 'resolved';
export type TraitRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type NotificationCategory = 'event' | 'financial';
export type NotificationScope = 'store' | 'global';
export type NotificationPriority = 'info' | 'warning' | 'urgent';

// ==================== 静态配置接口 ====================

/** 店铺类型配置 */
export interface IStoreTypeConfig {
  label: string;
  icon: string;
  desc: string;
}

/** 面积档位配置 */
export interface IStoreAreaConfig {
  label: string;
  maxShelves: number;
  maxEmployees: number;
  warehouseCapacity: number;
  baseRent: number;
  trafficMultiplier: number;
}

/** 位置档位配置 */
export interface IStoreLocationConfig {
  label: string;
  baseFootTraffic: number;
  baseRent: number;
}

/** 住宅等级配置 */
export interface IHomeLevelConfig {
  level: number;
  name: string;
  upgradeCost: number;
  bonusOptions: string[];
}

/** 住宅特性效果 */
export interface IHomeBonusEffect {
  type: 'toggle' | 'multiply' | 'add';
  value: number | boolean;
}

/** 商品数据（静态配置） */
export interface IItemData {
  id: string;
  name: string;
  baseBuyPrice: number;
  baseSellPrice: number;
  volume: number;
  icon: string;
  category: string;
  iconPath?: string;
}

/** 员工类型配置 */
export interface IEmployeeTypeConfig {
  id: string;
  name: string;
  moveSpeed: number;
  workSpeed: number;
  dailySalary: number;
  baseCost: number;
}

/** 事件配置 */
export interface IEventConfig {
  id: string;
  type: EventType;
  triggerInterval: [number, number];
  resolveTime: number;
  penaltyPerSec: number;
  reward: number;
  prefabPath: string;
  iconPath: string;
}

/** 特性模板 */
export interface ITraitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  effectType: TraitEffectType;
  effectValue: number;
  rarity: TraitRarity;
  stackable: boolean;
}

export type TraitEffectType =
  | 'money_add'
  | 'training_speed'
  | 'salary_discount'
  | 'rent_discount'
  | 'traffic_boost'
  | 'warehouse_bonus'
  | 'quit_rate_down'
  | 'loan_interest_down'
  | 'exp_boost'
  | 'purchase_discount'
  | 'multiple';

/** 顾客模板 */
export interface ICustomerTemplate {
  id: string;
  minItems: number;
  maxItems: number;
  budgetRange: [number, number];
  spawnWeight: number;
  spritePath: string;
  colorTint: string;
}

/** 成就模板 */
export interface IAchievementTemplate {
  id: string;
  name: string;
  description: string;
  iconPath: string;
  conditionType: AchievementConditionType;
  conditionParams: Record<string, number>;
  reward: {
    type: 'money' | 'bonus';
    base: number;
    coefficient: number;
    formula: string;
  };
  category: 'economy' | 'operation' | 'social' | 'milestone';
}

export type AchievementConditionType =
  | 'money_reached'
  | 'store_rating'
  | 'streak_profitable'
  | 'employee_hired'
  | 'home_upgraded'
  | 'store_opened'
  | 'items_sold'
  | 'customers_served'
  | 'loan_paid_off';

// ==================== 运行时数据接口 ====================

/** 玩家数据 */
export interface IPlayerData {
  id: string;
  name: string;
  money: number;
  totalEarnings: number;
  currentDay: number;
  currentWeek: number;
  currentWeekDay: number;
  traits: string[];
  pendingTraitChoices: string[] | null;
  loanAmount: number;
  loanInterestRate: number;
  loanDueWeek: number;
  totalLoanTaken: number;
  unlockedStoreTypes: StoreType[];
  ownedStoreIds: string[];
  currentStoreId: string;
  achievements: string[];
}

/** 员工数据 */
export interface IEmployeeData {
  id: string;
  name: string;
  skills: {
    cashier: number;
    stocker: number;
    cleaner: number;
  };
  moveSpeed: number;
  levels: {
    cashier: number;
    stocker: number;
    cleaner: number;
  };
  experience: {
    cashier: number;
    stocker: number;
    cleaner: number;
  };
  expToNextLevel: number;
  trainingFee: number;
  trainingRemainingDays: number;
  trainingRole: 'Cashier' | 'Stocker' | 'Cleaner' | null;
  baseSalary: number;
  dailySalary: number;
  expectedSalary: number;
  quitProbability: number;
  daysEmployed: number;
  lastQuitCheckDay: number;
  currentRole: EmployeeRole;
  status: EmployeeStatus;
  storeId: string;
}

/** 店铺数据 */
export interface IStoreData {
  id: string;
  name: string;
  type: StoreType;
  location: StoreLocationType;
  dailyRent: number;
  area: StoreAreaType;
  maxShelves: number;
  maxEmployees: number;
  warehouseCapacity: number;
  baseFootTraffic: number;
  footTrafficBonus: number;
  satisfactionBonus: number;
  rating: number;
  ratingHistory: number[];
  level: number;
  upgradeCost: number;
  isUnlocked: boolean;
  isOwned: boolean;
  todayIncome: number;
  todayExpense: number;
  todayProfit: number;
  dailyProfitHistory: number[];
  shelves: Array<IShelfSlot | null>;
}

/** 货架槽位 */
export interface IShelfSlot {
  itemId: string;
  itemName: string;
  icon: string;
  baseSellPrice: number;
  stock: number;
  maxStock: number;
}

/** 仓库数据 */
export interface IWarehouseData {
  storeId: string;
  capacity: number;
  used: number;
  inventory: Record<string, number>;
  shelfContents: Record<string, string | null>;
}

/** 购物车 */
export interface ICartItem {
  itemId: string;
  quantity: number;
}

export interface IShoppingCart {
  items: ICartItem[];
  totalVolume: number;
  totalCost: number;
}

/** 订单 */
export interface IOrder {
  id: string;
  items: ICartItem[];
  totalCost: number;
  totalVolume: number;
  orderDay: number;
  deliveryDay: number;
  status: OrderStatus;
  deliveredItems: ICartItem[];
  lostItems: ICartItem[];
  actualCost: number;
}

/** 每日账单 */
export interface IDailyLedger {
  dayIndex: number;
  date: string;
  income: number;
  expense: number;
  itemsSold: Record<string, number>;
  expenseBreakdown: {
    purchaseCost: number;
    salaries: number;
    rent: number;
    loanInterest: number;
    penalty: number;
  };
  profit: number;
}

/** 顾客满意度 */
export interface ICustomerSatisfaction {
  productAvailability: number;
  waitTime: number;
  cleanliness: number;
  decoration: number;
  total: number;
  lostCustomers: number;
}

/** 住宅数据 */
export interface IHomeData {
  currentLevel: number;
  currentHomeType: string;
  unlockedBonuses: string[];
  pendingBonusChoice: string[] | null;
  daysOwned: number;
  totalUpgradeSpent: number;
}

/** 顾客数据（运行时） */
export interface ICustomerData {
  instanceId: string;
  templateId: string;
  spritePath: string;
  colorTint: string;
  state: CustomerState;
  shoppingList: Array<{
    itemId: string;
    quantity: number;
    fulfilled: boolean;
  }>;
  currentPosition: { x: number; y: number };
  targetShelfId: string | null;
  targetCheckoutId: string | null;
  checkoutTime: number;
  shoppingSatisfaction: number;
  carriedItems: Array<{ itemId: string; quantity: number }>;
}

/** 事件运行时实例 */
export interface IActiveEvent {
  id: string;
  configId: string;
  storeId: string;
  position: { x: number; y: number };
  status: EventStatus;
  spawnedAt: number;
  assignedEmployeeId: string | null;
  resolveStartedAt: number | null;
  accumulatedPenalty: number;
}

/** 通知 */
export interface INotification {
  id: string;
  category: NotificationCategory;
  scope: NotificationScope;
  priority: NotificationPriority;
  title: string;
  message: string;
  relatedStoreId?: string;
  relatedEmployeeId?: string;
  createdAt: number;
  isRead: boolean;
  isDismissed: boolean;
  autoDismissMs: number;
}

/** 全局游戏状态 */
export interface IGameState {
  player: IPlayerData;
  home: IHomeData;
  stores: Record<string, IStoreData>;
  employees: IEmployeeData[];
  warehouses: Record<string, IWarehouseData>;
  shoppingCart: IShoppingCart;
  pendingOrders: IOrder[];
  orderHistory: IOrder[];
  currentTime: number;
  weather: WeatherType;
  tomorrowWeather: WeatherType;
  activeEvents: IActiveEvent[];
  ledgerHistory: IDailyLedger[];
}

/** 全局游戏配置 */
export interface IGameConfig {
  storeUpgradeCosts: Record<string, number>;
  trainingFeeBase: number;
  trainingFeePerLevel: number;
  trainingSkillGainMin: number;
  trainingSkillGainMax: number;
  expBase: number;
  expIncrement: number;
  expPerWorkActionMin: number;
  expPerWorkActionMax: number;
  hiringCost: number;
  hiringCooldownDays: number;
  initialSalary: number;
  salaryPerLevel: number;
  baseQuitProbability: number;
  quitProbabilityPerShortfall: number;
  quitProbabilityMin: number;
  expectedSalaryCoefficient: number;
  loanInterestRate: number;
  loanMinAmount: number;
  loanMaxAmountBase: number;
  loanDueWeeksOptions: number[];
  homeLoanMultiplier: Record<string, number>;
  weatherChanceRainy: number;
  customerSpawnInterval: number;
  maxCustomersInStore: number;
  baseCheckoutTime: number;
  eventDirtInterval: [number, number];
}
