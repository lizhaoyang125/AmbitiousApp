import { ICustomerTemplate, IEventConfig } from './DataInterfaces';

/**
 * 顾客颜色池
 */
export const CUSTOMER_COLORS = [
  '#4A90D9',
  '#E74C3C',
  '#27AE60',
  '#F39C12',
  '#9B59B6',
  '#1ABC9C',
  '#E67E22',
  '#3498DB',
];

/**
 * 顾客头像资源路径（assets/_1/Square (outline)/）
 * 使用方式：spritePath + '.png'
 */
export const CUSTOMER_SPRITE_PATHS = [
  '_1/Square (outline)/dog',
  '_1/Square (outline)/duck',
  '_1/Square (outline)/panda',
  '_1/Square (outline)/cat',
  '_1/Square (outline)/rabbit',
  '_1/Square (outline)/pig',
  '_1/Square (outline)/cow',
  '_1/Square (outline)/horse',
  '_1/Square (outline)/monkey',
  '_1/Square (outline)/penguin',
];

/**
 * 顾客模板配置
 *
 * 注意：模板只描述顾客"类型"的行为特征（买几件、预算多少、出现概率），
 * 不包含具体想买什么商品。购物清单在顾客生成时，根据当前店铺实际可售商品
 * 通过 generateShoppingList() 动态随机生成。
 */
export const CUSTOMER_TEMPLATES: ICustomerTemplate[] = [
  {
    id: 'customer_normal',
    minItems: 1,
    maxItems: 3,
    budgetRange: [20, 200],
    spawnWeight: 70,
    spritePath: '_1/Square (outline)/dog',
    colorTint: '#4A90D9',
  },
  {
    id: 'customer_careful',
    minItems: 1,
    maxItems: 2,
    budgetRange: [50, 500],
    spawnWeight: 20,
    spritePath: '_1/Square (outline)/duck',
    colorTint: '#27AE60',
  },
  {
    id: 'customer_rich',
    minItems: 2,
    maxItems: 4,
    budgetRange: [200, 2000],
    spawnWeight: 10,
    spritePath: '_1/Square (outline)/panda',
    colorTint: '#F39C12',
  },
];

/**
 * 根据权重随机选择一个顾客模板
 */
export function pickRandomCustomerTemplate(): ICustomerTemplate {
  const totalWeight = CUSTOMER_TEMPLATES.reduce((sum, t) => sum + t.spawnWeight, 0);
  let roll = Math.random() * totalWeight;
  for (const template of CUSTOMER_TEMPLATES) {
    roll -= template.spawnWeight;
    if (roll <= 0) return template;
  }
  return CUSTOMER_TEMPLATES[0];
}

/**
 * 随机生成购物清单
 *
 * @param template 顾客模板
 * @param availableItemIds 当前店铺可售商品ID列表
 * @returns 购物清单
 */
export function generateShoppingList(
  template: ICustomerTemplate,
  availableItemIds: string[]
): Array<{ itemId: string; quantity: number }> {
  if (availableItemIds.length === 0) return [];

  const itemCount = Math.floor(Math.random() * (template.maxItems - template.minItems + 1)) + template.minItems;
  const shuffled = [...availableItemIds].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(itemCount, shuffled.length));

  return selected.map(itemId => ({
    itemId,
    quantity: 1 + Math.floor(Math.random() * 2), // 1-2件
  }));
}

/**
 * 随机获取一个顾客头像路径
 */
export function pickRandomCustomerSprite(): string {
  const index = Math.floor(Math.random() * CUSTOMER_SPRITE_PATHS.length);
  return CUSTOMER_SPRITE_PATHS[index];
}

/**
 * 事件配置
 */
export const EVENT_CONFIGS: IEventConfig[] = [
  {
    id: 'event_dirt',
    type: 'dirt',
    triggerInterval: [120, 180],
    resolveTime: 3,
    penaltyPerSec: 2,
    reward: 0,
    prefabPath: 'Prefabs/Props/Trash',
    iconPath: 'textures/events/dirt',
  },
  {
    id: 'event_empty_shelf',
    type: 'empty_shelf',
    triggerInterval: [0, 0],
    resolveTime: 5,
    penaltyPerSec: 1,
    reward: 0,
    prefabPath: 'Prefabs/Props/Shelf',
    iconPath: 'textures/events/empty_shelf',
  },
];

/**
 * 根据事件ID获取事件配置
 */
export function getEventConfig(eventId: string): IEventConfig | undefined {
  return EVENT_CONFIGS.find(e => e.id === eventId);
}
