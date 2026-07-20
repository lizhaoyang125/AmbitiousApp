import { ITraitTemplate, TraitRarity } from './DataInterfaces';

/**
 * 特性稀有度权重
 */
export const TRAIT_RARITY_WEIGHTS: Record<TraitRarity, number> = {
  common: 60,
  rare: 30,
  epic: 8,
  legendary: 2,
};

/**
 * 特性候选池
 */
export const TRAIT_POOL: ITraitTemplate[] = [
  {
    id: 'fallen_aristocrat',
    name: '没落豪门',
    description: '祖上阔过，如今只能靠自己。初始资金 +$50,000',
    icon: 'textures/traits/fallen_aristocrat',
    effectType: 'money_add',
    effectValue: 50000,
    rarity: 'rare',
    stackable: false,
  },
  {
    id: 'top_scorer',
    name: '高考状元',
    description: '十年寒窗，终于金榜题名。员工培训速度 +30%',
    icon: 'textures/traits/top_scorer',
    effectType: 'training_speed',
    effectValue: 0.30,
    rarity: 'rare',
    stackable: false,
  },
  {
    id: 'frugal',
    name: '节俭达人',
    description: '省的就是赚的。员工薪资 -15%',
    icon: 'textures/traits/frugal',
    effectType: 'salary_discount',
    effectValue: 0.15,
    rarity: 'common',
    stackable: false,
  },
  {
    id: 'charismatic',
    name: '能说会道',
    description: '天生招客体质。基础客流 +20%',
    icon: 'textures/traits/charismatic',
    effectType: 'traffic_boost',
    effectValue: 0.20,
    rarity: 'rare',
    stackable: false,
  },
  {
    id: 'pack_rat',
    name: '仓储达人',
    description: '空间利用大师。仓库容量 +50',
    icon: 'textures/traits/pack_rat',
    effectType: 'warehouse_bonus',
    effectValue: 50,
    rarity: 'epic',
    stackable: false,
  },
  {
    id: 'stable_employer',
    name: '稳定雇主',
    description: '员工死心塌地。员工离职率 -30%',
    icon: 'textures/traits/stable_employer',
    effectType: 'quit_rate_down',
    effectValue: 0.30,
    rarity: 'common',
    stackable: false,
  },
  {
    id: 'financial_optimizer',
    name: '金融头脑',
    description: '算盘打得精。贷款利息 -20%',
    icon: 'textures/traits/financial_optimizer',
    effectType: 'loan_interest_down',
    effectValue: 0.20,
    rarity: 'epic',
    stackable: false,
  },
  {
    id: 'quick_learner',
    name: '好学上进',
    description: '一点就通。员工经验获取 +50%',
    icon: 'textures/traits/quick_learner',
    effectType: 'exp_boost',
    effectValue: 0.50,
    rarity: 'rare',
    stackable: false,
  },
  {
    id: 'bargain_hunter',
    name: '议价高手',
    description: '谈判是艺术。进货价格 -10%',
    icon: 'textures/traits/bargain_hunter',
    effectType: 'purchase_discount',
    effectValue: 0.10,
    rarity: 'common',
    stackable: false,
  },
  {
    id: 'golden_spoon',
    name: '金汤匙',
    description: '含玉而生，天选之人。全属性 +5%',
    icon: 'textures/traits/golden_spoon',
    effectType: 'traffic_boost',
    effectValue: 0.05,
    rarity: 'legendary',
    stackable: false,
  },
];

/**
 * 根据稀有度权重随机抽取指定数量的特性
 */
export function drawRandomTraits(count: number, excludeIds: string[] = []): ITraitTemplate[] {
  const pool = TRAIT_POOL.filter(t => !excludeIds.includes(t.id));
  const result: ITraitTemplate[] = [];
  const usedIds: string[] = [...excludeIds];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const rolled = rollTraitByRarity(pool, usedIds);
    if (rolled) {
      result.push(rolled);
      usedIds.push(rolled.id);
    }
  }
  return result;
}

/**
 * 按稀有度权重随机抽取一个特性
 */
function rollTraitByRarity(pool: ITraitTemplate[], excludeIds: string[]): ITraitTemplate | null {
  const available = pool.filter(t => !excludeIds.includes(t.id));
  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, t) => sum + TRAIT_RARITY_WEIGHTS[t.rarity], 0);

  let roll = Math.random() * totalWeight;
  for (const trait of available) {
    roll -= TRAIT_RARITY_WEIGHTS[trait.rarity];
    if (roll <= 0) return trait;
  }
  return available[available.length - 1];
}

/**
 * 根据特性ID获取特性模板
 */
export function getTraitTemplate(id: string): ITraitTemplate | undefined {
  return TRAIT_POOL.find(t => t.id === id);
}

/**
 * 计算特性效果对数值的影响
 */
export function applyTraitEffect(baseValue: number, traits: string[], effectType: string): number {
  let result = baseValue;
  for (const traitId of traits) {
    const trait = getTraitTemplate(traitId);
    if (!trait || trait.effectType !== effectType) continue;
    if (trait.effectType === 'money_add' || trait.effectType === 'warehouse_bonus') {
      result += trait.effectValue;
    } else {
      result *= (1 + trait.effectValue);
    }
  }
  return result;
}

// ==================== 人才池（招募用） ====================

export interface ITalentData {
  id: string;
  name: string;
  icon: string;
  skill: string;
  skillDesc: string;
  wage: number;
  trait: string;
}

/**
 * 人才池（每次打开随机生成）
 */
export const TALENT_POOL: ITalentData[] = [
  { id: 't1', name: '张三', icon: '🧑', skill: '销售高手', skillDesc: '接待效率+30%', wage: 80, trait: '健谈' },
  { id: 't2', name: '李四', icon: '👩', skill: '理货达人', skillDesc: '货架容量+20%', wage: 70, trait: '细心' },
  { id: 't3', name: '王五', icon: '🧔', skill: '库存专家', skillDesc: '仓库损耗-25%', wage: 90, trait: '稳重' },
  { id: 't4', name: '赵六', icon: '👨‍🦰', skill: '快手', skillDesc: '收银速度+40%', wage: 85, trait: '麻利' },
  { id: 't5', name: '小美', icon: '👩‍🦱', skill: '亲和力', skillDesc: '顾客满意度+20%', wage: 75, trait: '温柔' },
  { id: 't6', name: '阿强', icon: '🧑‍🦲', skill: '耐久', skillDesc: '无需休息，连续工作', wage: 100, trait: '勤劳' },
  { id: 't7', name: '老周', icon: '👴', skill: '经验丰富', skillDesc: '全局效率+15%', wage: 110, trait: '老练' },
  { id: 't8', name: '小刘', icon: '👱', skill: '新手', skillDesc: '学习成长中', wage: 50, trait: '勤奋' },
];

/**
 * 从人才池随机抽取人才
 */
export function drawRandomTalents(count: number): ITalentData[] {
  const shuffled = [...TALENT_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
