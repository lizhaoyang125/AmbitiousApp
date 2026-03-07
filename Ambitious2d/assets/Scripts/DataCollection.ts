
export const TalentDict: {
  [key: string]: {
    id: number;
    effect: string;
    description?: string;
  };
} = {
  销售专家: { id: 0, effect: "销量+10%", description: "精通销售策略，让店铺销量提升。" },
  管理专家: { id: 1, effect: "员工工资-5%", description: "通过高效管理降低人员成本。" },
  进货专家: { id: 2, effect: "进货价格-10%", description: "通过精明进货降低成本。" },
  财务专家: { id: 3, effect: "利润+10%", description: "通过财务管理增加利润。" },
  人事专家: { id: 4, effect: "员工忠诚度+10%", description: "通过人事管理增加员工忠诚度。" },
};

// 玩家
export interface Player {
  ID: number;
  Name: string;
  Level: number;
  Money: number;
  Character: string[];
  ShelveMaxGoodsNumber: number;
  Talent: (keyof typeof TalentDict)[];
}

// 单个店铺信息（对应 MyStoreDict 的值）
export interface StoreInfo {
  StoreType: string;
  CashRegisterLevel: number;
  StoreLevel: number;
  Area: number;
  RentCost: number;
  FootTraffic: number;
}

// 货架上的商品
export interface ShelveGoods {
  GoodsType: string;
  number: number;
}

// 商店货架字典：以商店名称为key，每个商店有自己的货架字典
export type StoreShelveGoods = { [shelveIndex: number]: ShelveGoods };

// 商店货架总字典
export type StoreShelveGoodsDict = { [StoreName: string]: StoreShelveGoods };

// 仓库中的商品（对应 AllWarehouseGoodsDict 的值）
export interface WarehouseGood {
  LeftNumber: number;
  Price: number;
  Popularity: number;
  Cost: number;
}

// 员工数据类型（用于员工字典 EmployeeDict）
// 存储结构：员工ID, 名称, 类型, 年龄, 性别, 技能, 技能等级, 头像, 工资, 忠诚度, 性格特征
export interface EmployeeData {
  ID: number;
  Name: string;
  Type: string;
  Age: number;
  Sex: string;
  Skill: string;
  SkillLevel: number;
  Avatar: number;
  Salary: number;
  Loyalty: number;
  Character: string[];
}

// 员工字典：键为员工名称，值为员工数据
export type EmployeeDict = { [Name: string]: EmployeeData };

// 员工（详细数据，用于员工管理系统）


// 合同
export interface Contract {
  ID: number;
  Src: string;
  DstStoreName: string;
  GoodName: string;
  Price: number;
}

export const EvaluationDict: { [key: number]: string } = {
  0: "乌烟瘴气",
  1: "乏善可陈",
  2: "干净整洁",
  3: "富丽堂皇",
  4: "五星商家",
};

export const StoreTypeList: string[] = ["服装店", "花店", "书店", "电器店"];

export const SimpleAllStoreGoodsDict: { [storeType: string]: string[] } = {
  服装店: ["便宜女装", "便宜男装", "一般女装", "一般男装", "昂贵女装", "昂贵男装"],
  花店: ["便宜花束", "一般花束", "昂贵花束"],
  书店: ["励志书籍", "工具书籍", "言情书籍", "科幻书籍", "漫画书籍"],
  电器店: ["电视", "冰箱", "洗衣机", "空调", "电脑", "手机", "平板"],
};

export const GoodsFrameDict: { [key: string]: number } = {
  空: 0,
  便宜女装: 1,
  便宜男装: 2,
  一般女装: 3,
  一般男装: 4,
  昂贵女装: 5,
  昂贵男装: 6,
  便宜花束: 7,
  一般花束: 8,
  昂贵花束: 9,
  励志书籍: 10,
  工具书籍: 11,
  言情书籍: 12,
};
