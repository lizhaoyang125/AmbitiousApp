import {
  IStoreTypeConfig,
  IStoreAreaConfig,
  IStoreLocationConfig,
  IHomeLevelConfig,
  IHomeBonusEffect,
  StoreType,
  StoreAreaType,
  StoreLocationType,
  HomeLevelType,
} from './DataInterfaces';

/**
 * 店铺类型配置
 */
export const STORE_TYPE_CONFIG: Record<StoreType, IStoreTypeConfig> = {
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

/**
 * 面积档位配置
 */
export const STORE_AREA_CONFIG: Record<StoreAreaType, IStoreAreaConfig> = {
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

/**
 * 位置档位配置
 */
export const STORE_LOCATION_CONFIG: Record<StoreLocationType, IStoreLocationConfig> = {
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

/**
 * 住宅等级配置
 */
export const HOME_LEVEL_CONFIG: Record<HomeLevelType, IHomeLevelConfig> = {
  basement: {
    level: 1,
    name: '地下室',
    upgradeCost: 0,
    bonusOptions: [],
  },
  sharedApartment: {
    level: 2,
    name: '合租公寓',
    upgradeCost: 5000,
    bonusOptions: ['weather_forecast', 'remote_view_stock'],
  },
  wholeApartment: {
    level: 3,
    name: '整租公寓',
    upgradeCost: 15000,
    bonusOptions: ['loan_discount', 'staff_dorm', 'storage_bonus'],
  },
  ownedHouse: {
    level: 4,
    name: '自购房',
    upgradeCost: 50000,
    bonusOptions: ['multi_store', 'bulk_discount', 'ad_bonus'],
  },
  villa: {
    level: 5,
    name: '独栋别墅',
    upgradeCost: 150000,
    bonusOptions: ['all_bonus_1', 'all_bonus_2'],
  },
  mansion: {
    level: 6,
    name: '庄园',
    upgradeCost: 500000,
    bonusOptions: ['max_bonus'],
  },
};

/**
 * 住宅特性效果表
 */
export const HOME_BONUS_EFFECTS: Record<string, IHomeBonusEffect> = {
  weather_forecast: { type: 'toggle', value: true },
  remote_view_stock: { type: 'toggle', value: true },
  loan_discount: { type: 'multiply', value: 0.8 },
  bulk_discount: { type: 'multiply', value: 0.9 },
  staff_dorm: { type: 'add', value: 2 },
  storage_bonus: { type: 'multiply', value: 1.2 },
  ad_bonus: { type: 'multiply', value: 1.15 },
  max_bonus: { type: 'multiply', value: 1.5 },
};
