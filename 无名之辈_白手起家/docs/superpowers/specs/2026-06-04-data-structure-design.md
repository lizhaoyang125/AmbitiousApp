# 《无名之辈：白手起家》数据结构设计

> 最后更新：2026-06-04
> 状态：进行中

---

## 一、静态配置表

### 1. 面积档位配置 `STORE_AREA_CONFIG`

```typescript
const STORE_AREA_CONFIG = {
  small: {        // 小型 ~80㎡
    maxShelves: 4,
    maxEmployees: 2,
    warehouseCapacity: 100,
    baseRent: 100,
    trafficMultiplier: 0.8,   // 面积系数（×位置基础值）
  },
  medium: {       // 中型 ~150㎡
    maxShelves: 6,
    maxEmployees: 4,
    warehouseCapacity: 200,
    baseRent: 200,
    trafficMultiplier: 1.0,
  },
  large: {        // 大型 ~300㎡
    maxShelves: 10,
    maxEmployees: 6,
    warehouseCapacity: 400,
    baseRent: 400,
    trafficMultiplier: 1.3,
  },
  luxury: {      // 豪华 ~500㎡
    maxShelves: 15,
    maxEmployees: 10,
    warehouseCapacity: 700,
    baseRent: 800,
    trafficMultiplier: 1.6,
  },
} as const;

type StoreAreaType = keyof typeof STORE_AREA_CONFIG;
```

**面积规则：**
- 面积决定：货架上限、员工上限、仓库容量
- 面积与位置可自由组合（市中心可开小店，胡同里可开大店）
- 人流量 = `floor(位置基础值 × 面积系数)`

---

### 2. 位置档位配置 `STORE_LOCATION_CONFIG`

```typescript
const STORE_LOCATION_CONFIG = {
  alley: {            // 胡同/老小区
    baseFootTraffic: 30,
    baseRent: 50,
  },
  street: {           // 街道/社区店
    baseFootTraffic: 60,
    baseRent: 150,
  },
  avenue: {           // 大街/商业街
    baseFootTraffic: 100,
    baseRent: 300,
  },
  downtown: {         // 市中心
    baseFootTraffic: 180,
    baseRent: 600,
  },
  landmark: {         // 地标商圈
    baseFootTraffic: 300,
    baseRent: 1200,
  },
} as const;

type StoreLocationType = keyof typeof STORE_LOCATION_CONFIG;
```

**位置规则：**
- 位置决定：基础人流量、每日租金
- 位置与面积可自由组合

---

## 二、运行时数据结构

### 1. 玩家数据 `IPlayerData`

```typescript
interface IPlayerData {
  id: string;
  name: string;                  // 可自定义店名

  // 基础资源
  money: number;
  totalEarnings: number;         // 历史累计收入（不含支出）

  // 进度
  currentDay: number;            // 总天数（第1天=1）
  currentWeek: number;          // 总周数
  currentWeekDay: number;       // 1-7（周一到周日）

  // 贷款系统
  loanAmount: number;           // 当前贷款本金（未还）
  loanInterestRate: number;     // 利率（周利率，如 0.05 = 5%）
  loanDueDay: number;           // 贷款到期日（第N天需还）
  totalLoanTaken: number;       // 历史累计贷款总额

  // 解锁状态
  unlockedStoreTypes: Array<'convenience' | 'clothing' | 'electronics'>;
  ownedStoreIds: string[];
  currentStoreId: string;
  achievements: string[];
}
```

**贷款规则：**
- 每周末（周日 22:00）结算利息：欠款本金 × 周利率，利息累加到欠款
- 到期日前未还清：触发逾期惩罚（高额违约金或强制拍卖资产）

---

### 2. 员工数据 `IEmployeeData`

```typescript
interface IEmployeeData {
  id: string;
  name: string;

  // 角色技能（出师后固定，培训可提升）
  skills: {
    cashier: number;    // 1-100，招募时roll
    stocker: number;
    cleaner: number;
  };

  moveSpeed: number;  // 寻路速度

  // 每角色等级与经验（可培养循环）
  levels: {
    cashier: number;    // 初始1
    stocker: number;
    cleaner: number;
  };
  experience: {
    cashier: number;  // 当前经验
    stocker: number;
    cleaner: number;
  };
  expToNextLevel: number;   // 升级所需经验

  // 培训相关
  trainingFee: number;             // 下次培训费
  trainingRemainingDays: number;   // 培训倒计时（0=不培训）
  trainingRole: 'Cashier' | 'Stocker' | 'Cleaner' | null;  // 当前在培训哪个角色

  // 经济
  baseSalary: number;    // 基础日薪
  dailySalary: number;   // 当前实际日薪（含等级加成）

  // 状态
  currentRole: 'Cashier' | 'Stocker' | 'Cleaner' | 'Idle';
  status: 'training' | 'working' | 'resting' | 'on_break';
  storeId: string;
}
```

**员工招募规则：**
- 招募时 roll 初始技能值（1-100）
- 可直接上岗，也可选择培训

**培训规则：**
- 培训费固定 28 天
- 培训期间：状态 `training`，可指派其他岗位，但不能做被培训的那个岗位
- 培训期照常付全薪
- 培训完成后：该角色技能 + 提升值，`levels[role]++`，可再次培训

**培养循环：**
- 工作可获取经验（非常慢）
- 可选择让员工再次培训 → 付培训费，28 天后技能 + 提升值，等级 +1

**收益加成：**
- `revenueBonus` = 当前角色等级 × 系数（运行时计算，不存储）

---

### 3. 店铺数据 `IStoreData`

```typescript
interface IStoreData {
  id: string;
  name: string;
  type: 'convenience' | 'clothing' | 'electronics';

  // 位置（决定基础人流和租金）
  location: StoreLocationType;
  dailyRent: number;           // 从位置配置读取

  // 面积（决定规模上限和人流系数）
  area: StoreAreaType;
  maxShelves: number;           // 从面积配置读取
  maxEmployees: number;         // 从面积配置读取
  warehouseCapacity: number;   // 从面积配置读取

  // 人流量 = 位置基础 × 面积系数 × 等级加成
  baseFootTraffic: number;      // 从位置配置读取
  footTrafficBonus: number;     // 等级加成百分比
  satisfactionBonus: number;   // 满意度加成百分比

  // 等级
  level: number;
  upgradeCost: number;         // 升到下一级的费用

  // 解锁/拥有
  isUnlocked: boolean;          // 是否解锁（人才市场可见）
  isOwned: boolean;             // 是否已购买

  // 今日经营数据（每日结算时写入）
  todayIncome: number;
  todayExpense: number;
  todayProfit: number;
  dailyProfitHistory: number[];  // 近N天日利润
}
```

**人流量计算公式：**
```
日均人流量 = floor(baseFootTraffic(位置) × trafficMultiplier(面积)) × (1 + footTrafficBonus(等级))
```

**店铺升级规则：**
- 消费解锁：花固定金钱直接升级
- 升级效果：提升 `footTrafficBonus` 和 `satisfactionBonus`（对人流、满意度有加成）
- 升级不影响仓库容量、货架数、员工数（这些由面积决定）

---

### 4. 商品数据 `IItemData`

```typescript
interface IItemData {
  id: string;           // 商品唯一ID (e.g., 'item_cola')
  name: string;         // 名称

  // 定价
  buyPrice: number;     // 进货价
  sellPrice: number;    // 售价

  // 仓储
  volume: number;       // 体积（用于计算仓库占用）

  // 显示
  iconPath: string;     // 图标路径

  // 归属（可选，用于分类显示）
  category: string;     // 商品分类，如 'food' | 'drink' | 'daily' | 'electronics'
}
```

---

### 5. 仓库数据 `IWarehouseData`

```typescript
interface IWarehouseData {
  storeId: string;                      // 所属店铺ID

  // 容量（从 IStoreData.warehouseCapacity 读取）
  capacity: number;                      // 总体积上限
  used: number;                          // 当前已用体积（运行时计算）

  // 库存（商品ID → 数量）
  inventory: Record<string, number>;

  // 货架（货架ID → 商品ID）
  // storeId + shelfId → itemId | null（空货架）
  shelfContents: Record<string, string | null>;
}
```

---

### 6. 购物车 `ICartItem`

```typescript
interface ICartItem {
  itemId: string;
  quantity: number;
}

// 购物车（每周一结算）
interface IShoppingCart {
  items: ICartItem[];

  // 统计（运行时计算）
  totalVolume: number;    // 总体积
  totalCost: number;     // 总价
}
```

---

### 7. 每日账单 `IDailyLedger`

```typescript
interface IDailyLedger {
  dayIndex: number;                  // 游戏内天数
  date: string;                      // 日期字符串（YYYY-MM-DD）

  income: number;                    // 总收入
  expense: number;                   // 总支出（进货成本 + 工资 + 租金 + 利息 + 违约金）

  // 销售明细
  itemsSold: Record<string, number>; // { 'item_cola': 50, ... }

  // 支出明细
  expenseBreakdown: {
    purchaseCost: number;   // 进货成本
    salaries: number;       // 员工工资
    rent: number;           // 店铺租金
    loanInterest: number;   // 贷款利息
    penalty: number;       // 违约金/罚款
  };

  profit: number;           // 利润 = income - expense
}
```

---

### 8. 顾客满意度 `ICustomerSatisfaction`

```typescript
interface ICustomerSatisfaction {
  // 各维度得分（0-100）
  productAvailability: number;   // 商品可得性（权重 50%）
  waitTime: number;              // 排队等待（权重 30%）
  cleanliness: number;           // 环境整洁（权重 20%）
  decoration: number;            // 装修加分（bonus，直接加在总分上）

  // 加权总分
  total: number;

  // 流失统计
  lostCustomers: number;        // 流失顾客数（因不满离店的顾客数）
}
```

---

### 9. 事件配置 `IEventConfig`

```typescript
interface IEventConfig {
  id: string;

  // 事件类型
  type: 'dirt' | 'empty_shelf' | 'vip_customer' | 'bulk_purchase';

  // 触发条件
  triggerInterval: [number, number];  // 触发间隔范围（秒）

  // 处理参数
  resolveTime: number;           // 员工处理耗时（秒）
  penaltyPerSec: number;          // 未处理时每秒惩罚值
  reward: number;                 // 处理完成的奖励（金币）

  // 场景表现
  prefabPath: string;             // 事件标记物 Prefab 路径
  iconPath: string;               // UI 图标路径
}
```

---

### 10. 全局游戏状态 `IGameState`

```typescript
interface IGameState {
  // 玩家
  player: IPlayerData;

  // 店铺（多店铺）
  stores: Record<string, IStoreData>;

  // 员工（全局池，按 storeId 归属）
  employees: IEmployeeData[];

  // 仓库（key = storeId）
  warehouses: Record<string, IWarehouseData>;

  // 购物车（当前准备下单的进货）
  shoppingCart: IShoppingCart;

  // 时间与天气
  currentTime: number;           // 小时 (8 - 22)
  weather: 'Sunny' | 'Rainy';
  tomorrowWeather: 'Sunny' | 'Rainy';  // 明天天气预报

  // 事件
  activeEvents: IActiveEvent[];

  // 账单历史
  ledgerHistory: IDailyLedger[];
}
```

---

## 三、待定义数据结构

以下数据结构尚未讨论，待续：

- [ ] **Home** 主界面/存档数据结构
- [ ] **Customer** 顾客行为数据结构
- [ ] **GameConfig** 全局游戏配置（升级费用表、经验曲线等）
- [ ] **Achievement** 成就系统数据结构
- [ ] **Notification** 通知/提示系统数据结构