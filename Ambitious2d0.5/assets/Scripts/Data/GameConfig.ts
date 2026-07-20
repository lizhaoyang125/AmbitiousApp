import { IGameConfig } from './DataInterfaces';

/**
 * 全局游戏配置
 */
export const GAME_CONFIG: IGameConfig = {
  // 店铺升级费用
  storeUpgradeCosts: {
    '1': 0,
    '2': 2000,
    '3': 5000,
    '4': 15000,
    '5': 50000,
    '6': 150000,
  },

  // 培训系统
  trainingFeeBase: 200,
  trainingFeePerLevel: 50,
  trainingSkillGainMin: 5,
  trainingSkillGainMax: 15,

  // 经验曲线
  expBase: 100,
  expIncrement: 50,
  expPerWorkActionMin: 2,
  expPerWorkActionMax: 3,

  // 雇佣系统
  hiringCost: 100,
  hiringCooldownDays: 3,
  initialSalary: 50,
  salaryPerLevel: 10,

  // 员工离职系统
  baseQuitProbability: 0.01,
  quitProbabilityPerShortfall: 0.0005,
  quitProbabilityMin: 0.001,
  expectedSalaryCoefficient: 200,

  // 贷款系统
  loanInterestRate: 0.10,
  loanMinAmount: 1000,
  loanMaxAmountBase: 1000000,
  loanDueWeeksOptions: [4, 8, 12],

  homeLoanMultiplier: {
    basement: 0.01,
    sharedApartment: 0.05,
    wholeApartment: 0.10,
    ownedHouse: 1.0,
    villa: 5.0,
    mansion: 10.0,
  },

  // 天气系统
  weatherChanceRainy: 0.3,

  // 顾客系统
  customerSpawnInterval: 5,
  maxCustomersInStore: 20,
  baseCheckoutTime: 10,

  // 事件系统
  eventDirtInterval: [120, 180],
};

/**
 * 获取店铺升级费用
 */
export function getStoreUpgradeCost(level: number): number {
  return GAME_CONFIG.storeUpgradeCosts[String(level)] || 0;
}

/**
 * 计算培训费
 */
export function calculateTrainingFee(currentLevel: number): number {
  return GAME_CONFIG.trainingFeeBase + (currentLevel - 1) * GAME_CONFIG.trainingFeePerLevel;
}

/**
 * 计算升级所需经验
 */
export function calculateExpToNextLevel(targetLevel: number): number {
  return GAME_CONFIG.expBase + (targetLevel - 2) * GAME_CONFIG.expIncrement;
}

/**
 * 计算最大贷款额度
 */
export function calculateMaxLoanAmount(ownedStoreCount: number, homeType: string): number {
  const storeMultiplier = 1 + (ownedStoreCount - 1) * 0.5;
  const homeMultiplier = GAME_CONFIG.homeLoanMultiplier[homeType] || 1.0;
  return Math.floor(GAME_CONFIG.loanMaxAmountBase * storeMultiplier * homeMultiplier);
}
