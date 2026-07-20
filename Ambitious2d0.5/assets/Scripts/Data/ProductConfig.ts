import { IItemData, StoreType } from './DataInterfaces';

/**
 * 店铺类型可售商品配置
 */
export const STORE_TYPE_ITEMS: Record<StoreType, IItemData[]> = {
  // ============================================
  // 便利店 (convenience)
  // ============================================
  convenience: [
    { id: 'cola', name: '可乐', baseBuyPrice: 3, baseSellPrice: 5, volume: 1, icon: '🥤', category: 'food' },
    { id: 'chips', name: '薯片', baseBuyPrice: 4, baseSellPrice: 7, volume: 1, icon: '🍟', category: 'food' },
    { id: 'milk', name: '牛奶', baseBuyPrice: 5, baseSellPrice: 8, volume: 1, icon: '🥛', category: 'food' },
    { id: 'bread', name: '面包', baseBuyPrice: 4, baseSellPrice: 6, volume: 1, icon: '🍞', category: 'food' },
    { id: 'instant_noodles', name: '方便面', baseBuyPrice: 5, baseSellPrice: 8, volume: 1, icon: '🍜', category: 'food' },
    { id: 'water', name: '矿泉水', baseBuyPrice: 1, baseSellPrice: 2, volume: 1, icon: '💧', category: 'drink' },
    { id: 'juice', name: '果汁', baseBuyPrice: 4, baseSellPrice: 7, volume: 1, icon: '🧃', category: 'drink' },
    { id: 'tissue', name: '纸巾', baseBuyPrice: 3, baseSellPrice: 5, volume: 1, icon: '🧻', category: 'daily' },
    { id: 'shampoo', name: '洗发水', baseBuyPrice: 15, baseSellPrice: 25, volume: 2, icon: '🧴', category: 'daily' },
    { id: 'toothpaste', name: '牙膏', baseBuyPrice: 8, baseSellPrice: 14, volume: 1, icon: '🪥', category: 'daily' },
    { id: 'soap', name: '香皂', baseBuyPrice: 4, baseSellPrice: 7, volume: 1, icon: '🧼', category: 'daily' },
  ],

  // ============================================
  // 服装店 (clothing)
  // ============================================
  clothing: [
    { id: 'cheap_tshirt_m', name: '便宜T恤(男)', baseBuyPrice: 25, baseSellPrice: 45, volume: 2, icon: '👕', category: 'cheap_male' },
    { id: 'cheap_pants_m', name: '便宜裤子(男)', baseBuyPrice: 35, baseSellPrice: 60, volume: 2, icon: '👖', category: 'cheap_male' },
    { id: 'cheap_underwear_m', name: '便宜内衣(男)', baseBuyPrice: 15, baseSellPrice: 28, volume: 1, icon: '🩲', category: 'cheap_male' },
    { id: 'cheap_socks_m', name: '便宜袜子(男)', baseBuyPrice: 8, baseSellPrice: 15, volume: 1, icon: '🧦', category: 'cheap_male' },
    { id: 'normal_tshirt_m', name: '一般T恤(男)', baseBuyPrice: 50, baseSellPrice: 90, volume: 2, icon: '👕', category: 'normal_male' },
    { id: 'normal_pants_m', name: '一般裤子(男)', baseBuyPrice: 70, baseSellPrice: 120, volume: 2, icon: '👖', category: 'normal_male' },
    { id: 'normal_jacket_m', name: '一般外套(男)', baseBuyPrice: 100, baseSellPrice: 180, volume: 3, icon: '🧥', category: 'normal_male' },
    { id: 'normal_underwear_m', name: '一般内衣(男)', baseBuyPrice: 30, baseSellPrice: 55, volume: 1, icon: '🩲', category: 'normal_male' },
    { id: 'luxury_tshirt_m', name: '昂贵T恤(男)', baseBuyPrice: 150, baseSellPrice: 280, volume: 2, icon: '👕', category: 'luxury_male' },
    { id: 'luxury_suit_m', name: '昂贵西装(男)', baseBuyPrice: 500, baseSellPrice: 900, volume: 4, icon: '🤵', category: 'luxury_male' },
    { id: 'luxury_waistcoat', name: '昂贵马甲(男)', baseBuyPrice: 200, baseSellPrice: 360, volume: 3, icon: '🎽', category: 'luxury_male' },
    { id: 'luxury_leather_shoes', name: '昂贵皮鞋(男)', baseBuyPrice: 300, baseSellPrice: 550, volume: 3, icon: '👞', category: 'luxury_male' },
    { id: 'cheap_tshirt_f', name: '便宜T恤(女)', baseBuyPrice: 25, baseSellPrice: 45, volume: 2, icon: '👚', category: 'cheap_female' },
    { id: 'cheap_skirt', name: '便宜裙子', baseBuyPrice: 35, baseSellPrice: 60, volume: 2, icon: '👗', category: 'cheap_female' },
    { id: 'cheap_underwear_f', name: '便宜内衣(女)', baseBuyPrice: 15, baseSellPrice: 28, volume: 1, icon: '🩱', category: 'cheap_female' },
    { id: 'cheap_socks_f', name: '便宜袜子(女)', baseBuyPrice: 8, baseSellPrice: 15, volume: 1, icon: '🧦', category: 'cheap_female' },
    { id: 'normal_tshirt_f', name: '一般T恤(女)', baseBuyPrice: 55, baseSellPrice: 99, volume: 2, icon: '👚', category: 'normal_female' },
    { id: 'normal_skirt', name: '一般裙子', baseBuyPrice: 75, baseSellPrice: 130, volume: 2, icon: '👗', category: 'normal_female' },
    { id: 'normal_dress', name: '一般连衣裙', baseBuyPrice: 120, baseSellPrice: 210, volume: 3, icon: '👗', category: 'normal_female' },
    { id: 'normal_underwear_f', name: '一般内衣(女)', baseBuyPrice: 35, baseSellPrice: 65, volume: 1, icon: '🩱', category: 'normal_female' },
    { id: 'luxury_dress', name: '昂贵连衣裙', baseBuyPrice: 400, baseSellPrice: 720, volume: 3, icon: '👗', category: 'luxury_female' },
    { id: 'luxury_suit_f', name: '昂贵西装(女)', baseBuyPrice: 450, baseSellPrice: 810, volume: 3, icon: '🧥', category: 'luxury_female' },
    { id: 'luxury_high_heels', name: '昂贵高跟鞋', baseBuyPrice: 250, baseSellPrice: 450, volume: 2, icon: '👠', category: 'luxury_female' },
    { id: 'luxury_handbag', name: '昂贵手提包', baseBuyPrice: 300, baseSellPrice: 550, volume: 3, icon: '👜', category: 'luxury_female' },
  ],

  // ============================================
  // 花店 (flowers)
  // ============================================
  flowers: [
    { id: 'cheap_rose_bouquet', name: '便宜玫瑰花束', baseBuyPrice: 20, baseSellPrice: 38, volume: 2, icon: '💐', category: 'cheap' },
    { id: 'cheap_sunflower', name: '便宜向日葵', baseBuyPrice: 15, baseSellPrice: 28, volume: 2, icon: '🌻', category: 'cheap' },
    { id: 'cheap_tulip_bouquet', name: '便宜郁金香束', baseBuyPrice: 18, baseSellPrice: 35, volume: 2, icon: '🌷', category: 'cheap' },
    { id: 'normal_rose_bouquet', name: '一般玫瑰花束', baseBuyPrice: 50, baseSellPrice: 90, volume: 3, icon: '💐', category: 'normal' },
    { id: 'normal_mixed_bouquet', name: '一般混搭花束', baseBuyPrice: 60, baseSellPrice: 108, volume: 3, icon: '💐', category: 'normal' },
    { id: 'normal_lily_bouquet', name: '一般百合花束', baseBuyPrice: 55, baseSellPrice: 99, volume: 3, icon: '💐', category: 'normal' },
    { id: 'normal_orchid', name: '一般兰花盆栽', baseBuyPrice: 45, baseSellPrice: 82, volume: 3, icon: '🪻', category: 'normal' },
    { id: 'luxury_rose_99', name: '99朵玫瑰', baseBuyPrice: 200, baseSellPrice: 380, volume: 5, icon: '💐', category: 'luxury' },
    { id: 'luxury_preserved_rose', name: '永生玫瑰', baseBuyPrice: 180, baseSellPrice: 320, volume: 2, icon: '🌹', category: 'luxury' },
    { id: 'luxury_orchid_pot', name: '昂贵兰花盆栽', baseBuyPrice: 150, baseSellPrice: 270, volume: 4, icon: '🪻', category: 'luxury' },
    { id: 'luxury_wedding_bouquet', name: '婚庆花束', baseBuyPrice: 300, baseSellPrice: 550, volume: 5, icon: '💐', category: 'luxury' },
  ],

  // ============================================
  // 电子产品店 (electronics)
  // ============================================
  electronics: [
    { id: 'budget_phone', name: '入门手机', baseBuyPrice: 300, baseSellPrice: 499, volume: 1, icon: '📱', category: 'phone' },
    { id: 'normal_phone', name: '普通手机', baseBuyPrice: 800, baseSellPrice: 1299, volume: 1, icon: '📱', category: 'phone' },
    { id: 'fold_phone', name: '折叠屏手机', baseBuyPrice: 2000, baseSellPrice: 3399, volume: 1, icon: '📱', category: 'phone' },
    { id: 'tablet', name: '平板电脑', baseBuyPrice: 1500, baseSellPrice: 2499, volume: 2, icon: '📲', category: 'tablet' },
    { id: 'laptop', name: '笔记本电脑', baseBuyPrice: 3000, baseSellPrice: 4999, volume: 4, icon: '💻', category: 'computer' },
    { id: 'desktop', name: '台式电脑', baseBuyPrice: 2500, baseSellPrice: 4199, volume: 6, icon: '🖥️', category: 'computer' },
    { id: 'earbuds', name: '无线耳机', baseBuyPrice: 100, baseSellPrice: 179, volume: 1, icon: '🎧', category: 'accessory' },
    { id: 'headphones', name: '头戴式耳机', baseBuyPrice: 200, baseSellPrice: 349, volume: 2, icon: '🎧', category: 'accessory' },
    { id: 'charging_cable', name: '数据线', baseBuyPrice: 15, baseSellPrice: 29, volume: 1, icon: '🔌', category: 'accessory' },
    { id: 'power_bank', name: '充电宝', baseBuyPrice: 40, baseSellPrice: 75, volume: 1, icon: '🔋', category: 'accessory' },
    { id: 'phone_case', name: '手机壳', baseBuyPrice: 10, baseSellPrice: 20, volume: 1, icon: '📱', category: 'accessory' },
    { id: 'screen_protector', name: '钢化膜', baseBuyPrice: 8, baseSellPrice: 18, volume: 1, icon: '🛡️', category: 'accessory' },
  ],
};

/**
 * 根据商品ID获取商品数据
 */
export function getItemById(storeType: StoreType, itemId: string): IItemData | undefined {
  return STORE_TYPE_ITEMS[storeType].find(item => item.id === itemId);
}

/**
 * 获取店铺类型的所有商品
 */
export function getItemsByStoreType(storeType: StoreType): IItemData[] {
  return STORE_TYPE_ITEMS[storeType] || [];
}

/**
 * 获取所有商品（跨店铺）
 */
export function getAllItems(): IItemData[] {
  return Object.values(STORE_TYPE_ITEMS).flat();
}
