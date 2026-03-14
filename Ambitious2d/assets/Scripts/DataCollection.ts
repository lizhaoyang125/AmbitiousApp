
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

// 居住状态枚举
export const LivingStatusDict: { [key: string]: { rent: number; exp: number; description: string } } = {
  破旧的城中村: { rent: 200, exp: 10, description: "环境较差，但租金便宜" },
  合租单间: { rent: 500, exp: 15, description: "与人合租，空间有限" },
  出租屋: { rent: 800, exp: 20, description: "独立的出租屋，基本设施齐全" },
  一室户: { rent: 1500, exp: 30, description: "独立一室户，私密性好" },
  两室一厅: { rent: 2500, exp: 50, description: "两室一厅，空间舒适" },
  豪华公寓: { rent: 5000, exp: 100, description: "豪华装修，设施完善" },
};

// 玩家
export interface Player {
  isNewPlayer: boolean;
  ID: number;
  Name: string;
  Level: number;
  Money: number;
  Character: string[];
  ShelveMaxGoodsNumber: number;
  Talent: (keyof typeof TalentDict)[];
  totalEarnings: number;  // 累计盈利
  daysPassed: number;     // 经营天数
  monthExpenses: number;  // 月度花费
  // 居住信息
  rent: number;           // 房租
  livingStatus: string;   // 居住状态
  expPerDay: number;      // 每日获得经验值
  // 当前所在商店
  currentStoreName: string;  // 当前所在商店名称
}

// 单个店铺信息（对应 MyStoreDict 的值）
export interface StoreInfo {
  StoreType: string;
  CashRegisterLevel: number;
  StoreLevel: number;
  Area: number;
  RentCost: number;
  FootTraffic: number;
  Employees: EmployeeDict;  // 雇员信息
  // 位置信息
  location: string;         // 店面位置名称
  // 货架信息
  shelfCount: number;       // 当前货架数量
  maxShelves: number;       // 最大货架数量
  // 经营状态
  isOpen: boolean;         // 是否营业中
  // 店铺统计数据
  dailyIncome: number;    // 今日收入
  dailyCustomer: number;   // 今日客流量
  totalIncome: number;    // 累计收入
  popularity: number;      // 声望/满意度 0-100
  // 财务支出
  dailyExpenses: number;    // 每日支出
  employeeExpenses: number;  // 员工支出
  // 评价
  cleanliness: number;      // 整洁度 0-100
  serviceRating: number;     // 服务评分 0-5
  monthlyComplaintCount: number;  // 投诉次数
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

// 店铺类型配置
export interface StoreTypeConfig {
  name: string;        // 店铺类型名称
  cost: number;        // 开店费用
}

export const StoreTypeList: StoreTypeConfig[] = [
  { name: "服装店", cost: 1000 },
  { name: "花店", cost: 800 },
  { name: "书店", cost: 1200 },
  { name: "电器店", cost: 2000 },
  { name: "餐厅", cost: 1500 },
  { name: "便利店", cost: 600 },
  { name: "药店", cost: 1800 },
  { name: "文具店", cost: 500 },
  { name: "玩具店", cost: 900 },
  { name: "宠物店", cost: 1100 },
];

// 店面位置配置
export interface StoreLocationConfig {
  name: string;        // 店面名称
  rent: number;        // 每月租金
  area: number;        // 面积
  footTraffic: number; // 客流量基数
  maxShelves: number;  // 最大货架数量（与面积相关）
  description: string;  // 描述
}

// 店面位置字典
export const StoreLocationList: StoreLocationConfig[] = [
  { name: "街边小铺", rent: 500, area: 50, footTraffic: 30, maxShelves: 4, description: "偏僻的小店面，租金便宜但客流量低" },
  { name: "社区店铺", rent: 1000, area: 80, footTraffic: 60, maxShelves: 6, description: "社区内店铺，客流量稳定" },
  { name: "商业街", rent: 2000, area: 120, footTraffic: 100, maxShelves: 8, description: "繁华商业街，客流量大但租金高" },
  { name: "购物中心", rent: 5000, area: 200, footTraffic: 200, maxShelves: 12, description: "高端购物中心，客流量极大" },
];

export const SimpleAllStoreGoodsDict: { [storeType: string]: string[] } = {
  服装店: ["便宜女装", "便宜男装", "一般女装", "一般男装", "昂贵女装", "昂贵男装"],
  花店: ["便宜花束", "一般花束", "昂贵花束"],
  书店: ["励志书籍", "工具书籍", "言情书籍", "科幻书籍", "漫画书籍"],
  电器店: ["电视", "冰箱", "洗衣机", "空调", "电脑", "手机", "平板"],
  餐厅: ["快餐", "盖浇饭", "面条", "炒菜", "火锅", "烧烤"],
  便利店: ["矿泉水", "方便面", "饼干", "饮料", "香烟", "电池"],
  药店: ["感冒药", "退烧药", "创可贴", "维生素", "止咳药", "胃药"],
  文具店: ["铅笔", "橡皮", "笔记本", "钢笔", "文件夹", "胶水"],
  玩具店: ["积木", "玩具车", "毛绒玩具", "遥控飞机", "拼图", "娃娃"],
  宠物店: ["狗粮", "猫粮", "宠物玩具", "宠物笼", "宠物零食", "水族箱"],
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
  科幻书籍: 13,
  漫画书籍: 14,
  电视: 15,
  冰箱: 16,
  洗衣机: 17,
  空调: 18,
  电脑: 19,
  手机: 20,
  平板: 21,
  快餐: 22,
  盖浇饭: 23,
  面条: 24,
  炒菜: 25,
  火锅: 26,
  烧烤: 27,
  矿泉水: 28,
  方便面: 29,
  饼干: 30,
  饮料: 31,
  香烟: 32,
  电池: 33,
  感冒药: 34,
  退烧药: 35,
  创可贴: 36,
  维生素: 37,
  止咳药: 38,
  胃药: 39,
  铅笔: 40,
  橡皮: 41,
  笔记本: 42,
  钢笔: 43,
  文件夹: 44,
  胶水: 45,
  积木: 46,
  玩具车: 47,
  毛绒玩具: 48,
  遥控飞机: 49,
  拼图: 50,
  娃娃: 51,
  狗粮: 52,
  猫粮: 53,
  宠物玩具: 54,
  宠物笼: 55,
  宠物零食: 56,
  水族箱: 57,
};
export interface Component {
  name: string;        // 店铺类型名称
  comment: string;        // 开店费用
}
export const CustomerCommentList: Component[] = [
  { name: "满意", comment: "这家店真好！" },
  { name: "满意", comment: "这家店不错" },
  { name: "不满意", comment: "一件东西都没有，开什么店" },
  { name: "不满意", comment: "服务态度差" },
  { name: "一般", comment: "一般般" },
  { name: "非常满意", comment: "非常满意" },
];
