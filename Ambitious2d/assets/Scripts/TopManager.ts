import { _decorator, Component, director, Node, SpriteFrame } from "cc";
import {
  Player,
  StoreInfo,
  WarehouseGood,
  EmployeeDict,
  StoreShelveGoodsDict,
  GoodsConfig,
} from "./DataCollection";
const { ccclass, property } = _decorator;

@ccclass("TopManager")
export class TopManager extends Component {
  private static _instance: TopManager;
  //商店数据结构：商店名称 -> 商店信息
  public MyStoreDict: { [StoreName: string]: StoreInfo } = {};
  //货架数据结构：以商店名称为key，每个商店有自己的货架字典（货架索引 -> 商品信息）
  public StoreShelveDicts: StoreShelveGoodsDict = {};
  //仓库存货：商品类型，数量
  public AllWarehouseGoodsDict: { [GoodsType: string]: WarehouseGood } = {};
  //玩家数据
  public Player: Player = { isNewPlayer: true, ID: 0, Name: "", Level: 1, Money: 0, Character: [], ShelveMaxGoodsNumber: 30, Talent: [], totalEarnings: 0, daysPassed: 0, monthExpenses: 0, rent: 200, livingStatus: "破旧的城中村", expPerDay: 10, currentStoreName: "" };
  //员工字典：员工名称 -> [员工类型, 工资, 性格特征, 技能等级]
  public EmployeeDicts: EmployeeDict = {};
  //游戏速度倍率：1为正常速度，2为2倍速，0.5为0.5倍速
  public GameSpeed: number = 1;

  @property(Array(SpriteFrame))
  public AvatarArray: SpriteFrame[] = []; // 货物的图片
  @property(Array(SpriteFrame))
  public CharacterArray: SpriteFrame[] = []; // 顾客的图片
  private _ValueForTest: string = "测试"; //用于demo跨Scene通信的测试
  public ValueForTest2: number = 200; //用于demo跨Scene通信的测试
  public ValueForTestString: string = "测试字符串";
  public GameTime: string = "2024/1/1 08:00"; //游戏内时间，格式：年/月/日 时:分
  private Timer1S: number = 0;
  private _deltaTime: number = 1 / 60;
  private _accumulator = 0;

  public marketGoodsConfigDict: { [goodsType: string]: GoodsConfig } = {};

  public static get Instance() {
    if (!this._instance) {
      console.warn("TopManager instance is not initialized yet!");
    }
    return this._instance;
  }
  public static get ValueForTest() {
    //用于demo跨Scene通信的测试
    return this._instance._ValueForTest;
  }
  public static set ValueForTest(value: string) {
    //用于demo跨Scene通信的测试
    this._instance._ValueForTest = value;
  }

  public Pause_all() {
    director.pause();
  }
  public Resume_all() {
    director.resume();
  }
  protected onLoad(): void {
    if (TopManager._instance) {
      console.warn("TopManager already exists!");
      this.node.destroy(); // 确保新创建的节点被销毁
      return;
    }
    TopManager._instance = this;
    // 加载本地数据
    this.loadLocalData();
    // 如果没有商品配置数据，则初始化
    if (!this.marketGoodsConfigDict || Object.keys(this.marketGoodsConfigDict).length === 0) {
      console.log("没有商品配置数据，调用 initialData");
      this.initialData();
    }
    // 如果没有数据，则初始化（仅用于测试，正式游戏应移除）
    if (!this.Player || !this.MyStoreDict || Object.keys(this.MyStoreDict).length === 0) {
      // 可以在这里调用初始数据方法，或者让玩家手动创建
      console.log("没有数据，需要手动初始化");
    }
    // 确保节点在场景切换时不被销毁
    if (!this.node.parent) {
      console.warn(
        "Node is not attached to the scene tree. Cannot persist it."
      );
      return;
    }
    if (!director.isPersistRootNode(this.node)) {
      director.addPersistRootNode(this.node);
    }
    for (const key in this.MyStoreDict) {
      if (this.MyStoreDict.hasOwnProperty(key)) {
        this.Player.currentStoreName = key;
        break; // 只获取第一个元素
      }
    }
    console.log("TopManager is loaded! current store:" + this.Player.currentStoreName);
  }
  loadScene() {
    director.loadScene("WarehouseScene");
  }

  protected update(deltaTime: number): void {
    // 应用游戏速度倍率
    const speedDeltaTime = deltaTime * this.GameSpeed;
    this._accumulator += speedDeltaTime;
    // 根据游戏速度调整时间增加频率
    // GameSpeed=1时每帧增加1分钟，GameSpeed=2时每帧增加2分钟，以此类推
    if (this._accumulator >= this._deltaTime) {
      const times = Math.floor(this._accumulator / this._deltaTime);
      for (let i = 0; i < times; i++) {
        this.GameTimeAdd1S();
      }
      this.Timer1S += times;
      this._accumulator -= this._deltaTime * times; // 减去已处理的时间
    }
    // 其他逻辑，例如每 1 秒触发一次
    if (this.Timer1S >= 60) {
      this.Timer1S = 0;
      console.log("1分钟过去了");
    }
  }
  initialData() {
      // 初始化商店数据（如果不存在）
      this.MyStoreDict = {};
      this.StoreShelveDicts = {};
      this.AllWarehouseGoodsDict = {
        // 服装店商品
        便宜女装: { LeftNumber: 0, Price: 22, Popularity: 50, Cost: 10 },
        便宜男装: { LeftNumber: 0, Price: 11, Popularity: 50, Cost: 10 },
        一般男装: { LeftNumber: 0, Price: 69, Popularity: 50, Cost: 19 },
        一般女装: { LeftNumber: 0, Price: 119, Popularity: 50, Cost: 20 },
        昂贵男装: { LeftNumber: 0, Price: 188, Popularity: 50, Cost: 99 },
        昂贵女装: { LeftNumber: 0, Price: 399, Popularity: 50, Cost: 99 },
        // 花店商品
        便宜花束: { LeftNumber: 0, Price: 8, Popularity: 50, Cost: 10 },
        一般花束: { LeftNumber: 0, Price: 16, Popularity: 50, Cost: 10 },
        昂贵花束: { LeftNumber: 0, Price: 30, Popularity: 50, Cost: 10 },
        // 书店商品
        励志书籍: { LeftNumber: 0, Price: 25, Popularity: 50, Cost: 10 },
        工具书籍: { LeftNumber: 0, Price: 45, Popularity: 50, Cost: 20 },
        言情书籍: { LeftNumber: 0, Price: 30, Popularity: 50, Cost: 12 },
        科幻书籍: { LeftNumber: 0, Price: 35, Popularity: 50, Cost: 15 },
        漫画书籍: { LeftNumber: 0, Price: 20, Popularity: 50, Cost: 8 },
        // 电器店商品
        电视: { LeftNumber: 0, Price: 2000, Popularity: 50, Cost: 1000 },
        冰箱: { LeftNumber: 0, Price: 1500, Popularity: 50, Cost: 800 },
        洗衣机: { LeftNumber: 0, Price: 1200, Popularity: 50, Cost: 600 },
        空调: { LeftNumber: 0, Price: 1800, Popularity: 50, Cost: 900 },
        电脑: { LeftNumber: 0, Price: 3500, Popularity: 50, Cost: 1800 },
        手机: { LeftNumber: 0, Price: 2000, Popularity: 50, Cost: 1000 },
        平板: { LeftNumber: 0, Price: 2500, Popularity: 50, Cost: 1300 },
        // 餐厅商品
        快餐: { LeftNumber: 0, Price: 15, Popularity: 50, Cost: 8 },
        盖浇饭: { LeftNumber: 0, Price: 20, Popularity: 50, Cost: 10 },
        面条: { LeftNumber: 0, Price: 18, Popularity: 50, Cost: 9 },
        炒菜: { LeftNumber: 0, Price: 35, Popularity: 50, Cost: 18 },
        火锅: { LeftNumber: 0, Price: 80, Popularity: 50, Cost: 40 },
        烧烤: { LeftNumber: 0, Price: 50, Popularity: 50, Cost: 25 },
        // 便利店商品
        矿泉水: { LeftNumber: 0, Price: 2, Popularity: 50, Cost: 1 },
        方便面: { LeftNumber: 0, Price: 5, Popularity: 50, Cost: 2 },
        饼干: { LeftNumber: 0, Price: 10, Popularity: 50, Cost: 5 },
        饮料: { LeftNumber: 0, Price: 6, Popularity: 50, Cost: 3 },
        香烟: { LeftNumber: 0, Price: 25, Popularity: 50, Cost: 15 },
        电池: { LeftNumber: 0, Price: 8, Popularity: 50, Cost: 4 },
        // 药店商品
        感冒药: { LeftNumber: 0, Price: 15, Popularity: 50, Cost: 8 },
        退烧药: { LeftNumber: 0, Price: 20, Popularity: 50, Cost: 10 },
        创可贴: { LeftNumber: 0, Price: 5, Popularity: 50, Cost: 2 },
        维生素: { LeftNumber: 0, Price: 30, Popularity: 50, Cost: 15 },
        止咳药: { LeftNumber: 0, Price: 18, Popularity: 50, Cost: 9 },
        胃药: { LeftNumber: 0, Price: 22, Popularity: 50, Cost: 11 },
        // 文具店商品
        铅笔: { LeftNumber: 0, Price: 1, Popularity: 50, Cost: 0.5 },
        橡皮: { LeftNumber: 0, Price: 2, Popularity: 50, Cost: 1 },
        笔记本: { LeftNumber: 0, Price: 8, Popularity: 50, Cost: 4 },
        钢笔: { LeftNumber: 0, Price: 15, Popularity: 50, Cost: 8 },
        文件夹: { LeftNumber: 0, Price: 10, Popularity: 50, Cost: 5 },
        胶水: { LeftNumber: 0, Price: 5, Popularity: 50, Cost: 2 },
        // 玩具店商品
        积木: { LeftNumber: 0, Price: 50, Popularity: 50, Cost: 25 },
        玩具车: { LeftNumber: 0, Price: 40, Popularity: 50, Cost: 20 },
        毛绒玩具: { LeftNumber: 0, Price: 60, Popularity: 50, Cost: 30 },
        遥控飞机: { LeftNumber: 0, Price: 150, Popularity: 50, Cost: 80 },
        拼图: { LeftNumber: 0, Price: 35, Popularity: 50, Cost: 18 },
        娃娃: { LeftNumber: 0, Price: 45, Popularity: 50, Cost: 22 },
        // 宠物店商品
        狗粮: { LeftNumber: 0, Price: 30, Popularity: 50, Cost: 15 },
        猫粮: { LeftNumber: 0, Price: 28, Popularity: 50, Cost: 14 },
        宠物玩具: { LeftNumber: 0, Price: 20, Popularity: 50, Cost: 10 },
        宠物笼: { LeftNumber: 0, Price: 80, Popularity: 50, Cost: 40 },
        宠物零食: { LeftNumber: 0, Price: 15, Popularity: 50, Cost: 8 },
        水族箱: { LeftNumber: 0, Price: 200, Popularity: 50, Cost: 100 },
      }
      this.marketGoodsConfigDict = {
        // 服装店商品
        便宜女装: { storeType: "服装店", name: "便宜女装", FrameID: 1, price: 22, comment: "便宜实惠", leftNumber: 10000, Popularity: 50 },
        便宜男装: { storeType: "服装店", name: "便宜男装", FrameID: 2, price: 11, comment: "便宜实惠", leftNumber: 10000, Popularity: 50 },
        一般女装: { storeType: "服装店", name: "一般女装", FrameID: 3, price: 119, comment: "质量不错", leftNumber: 10000, Popularity: 50 },
        一般男装: { storeType: "服装店", name: "一般男装", FrameID: 4, price: 69, comment: "质量不错", leftNumber: 10000, Popularity: 50 },
        昂贵女装: { storeType: "服装店", name: "昂贵女装", FrameID: 5, price: 399, comment: "高端定制", leftNumber: 10000, Popularity: 50 },
        昂贵男装: { storeType: "服装店", name: "昂贵男装", FrameID: 6, price: 188, comment: "高端定制", leftNumber: 10000, Popularity: 50 },
        // 花店商品
        便宜花束: { storeType: "花店", name: "便宜花束", FrameID: 7, price: 8, comment: "简约款", leftNumber: 10000, Popularity: 50 },
        一般花束: { storeType: "花店", name: "一般花束", FrameID: 8, price: 16, comment: "精美款", leftNumber: 10000, Popularity: 50 },
        昂贵花束: { storeType: "花店", name: "昂贵花束", FrameID: 9, price: 30, comment: "奢华款", leftNumber: 10000, Popularity: 50 },
        // 书店商品
        励志书籍: { storeType: "书店", name: "励志书籍", FrameID: 10, price: 25, comment: "激励人心", leftNumber: 10000, Popularity: 50 },
        工具书籍: { storeType: "书店", name: "工具书籍", FrameID: 11, price: 45, comment: "实用工具", leftNumber: 10000, Popularity: 50 },
        言情书籍: { storeType: "书店", name: "言情书籍", FrameID: 12, price: 30, comment: "爱情故事", leftNumber: 10000, Popularity: 50 },
        科幻书籍: { storeType: "书店", name: "科幻书籍", FrameID: 13, price: 35, comment: "科幻世界", leftNumber: 10000, Popularity: 50 },
        漫画书籍: { storeType: "书店", name: "漫画书籍", FrameID: 14, price: 20, comment: "休闲读物", leftNumber: 10000, Popularity: 50 },
        // 电器店商品
        电视: { storeType: "电器店", name: "电视", FrameID: 15, price: 2000, comment: "智能电视", leftNumber: 10000, Popularity: 50 },
        冰箱: { storeType: "电器店", name: "冰箱", FrameID: 16, price: 1500, comment: "大容量", leftNumber: 10000, Popularity: 50 },
        洗衣机: { storeType: "电器店", name: "洗衣机", FrameID: 17, price: 1200, comment: "全自动", leftNumber: 10000, Popularity: 50 },
        空调: { storeType: "电器店", name: "空调", FrameID: 18, price: 1800, comment: "变频空调", leftNumber: 10000, Popularity: 50 },
        电脑: { storeType: "电器店", name: "电脑", FrameID: 19, price: 3500, comment: "高性能", leftNumber: 10000, Popularity: 50 },
        手机: { storeType: "电器店", name: "手机", FrameID: 20, price: 2000, comment: "智能手机", leftNumber: 10000, Popularity: 50 },
        平板: { storeType: "电器店", name: "平板", FrameID: 21, price: 2500, comment: "便携平板", leftNumber: 10000, Popularity: 50 },
        // 餐厅商品
        快餐: { storeType: "餐厅", name: "快餐", FrameID: 22, price: 15, comment: "快捷便利", leftNumber: 10000, Popularity: 50 },
        盖浇饭: { storeType: "餐厅", name: "盖浇饭", FrameID: 23, price: 20, comment: "经济实惠", leftNumber: 10000, Popularity: 50 },
        面条: { storeType: "餐厅", name: "面条", FrameID: 24, price: 18, comment: "家常口味", leftNumber: 10000, Popularity: 50 },
        炒菜: { storeType: "餐厅", name: "炒菜", FrameID: 25, price: 35, comment: "现炒美味", leftNumber: 10000, Popularity: 50 },
        火锅: { storeType: "餐厅", name: "火锅", FrameID: 26, price: 80, comment: "热气腾腾", leftNumber: 10000, Popularity: 50 },
        烧烤: { storeType: "餐厅", name: "烧烤", FrameID: 27, price: 50, comment: "香味扑鼻", leftNumber: 10000, Popularity: 50 },
        // 便利店商品
        矿泉水: { storeType: "便利店", name: "矿泉水", FrameID: 28, price: 2, comment: "清凉解渴", leftNumber: 10000, Popularity: 50 },
        方便面: { storeType: "便利店", name: "方便面", FrameID: 29, price: 5, comment: "速食佳品", leftNumber: 10000, Popularity: 50 },
        饼干: { storeType: "便利店", name: "饼干", FrameID: 30, price: 10, comment: "香脆可口", leftNumber: 10000, Popularity: 50 },
        饮料: { storeType: "便利店", name: "饮料", FrameID: 31, price: 6, comment: "清凉饮品", leftNumber: 10000, Popularity: 50 },
        香烟: { storeType: "便利店", name: "香烟", FrameID: 32, price: 25, comment: "提神醒脑", leftNumber: 10000, Popularity: 50 },
        电池: { storeType: "便利店", name: "电池", FrameID: 33, price: 8, comment: "经久耐用", leftNumber: 10000, Popularity: 50 },
        // 药店商品
        感冒药: { storeType: "药店", name: "感冒药", FrameID: 34, price: 15, comment: "治疗感冒", leftNumber: 10000, Popularity: 50 },
        退烧药: { storeType: "药店", name: "退烧药", FrameID: 35, price: 20, comment: "快速退烧", leftNumber: 10000, Popularity: 50 },
        创可贴: { storeType: "药店", name: "创可贴", FrameID: 36, price: 5, comment: "处理伤口", leftNumber: 10000, Popularity: 50 },
        维生素: { storeType: "药店", name: "维生素", FrameID: 37, price: 30, comment: "营养补充", leftNumber: 10000, Popularity: 50 },
        止咳药: { storeType: "药店", name: "止咳药", FrameID: 38, price: 18, comment: "止咳化痰", leftNumber: 10000, Popularity: 50 },
        胃药: { storeType: "药店", name: "胃药", FrameID: 39, price: 22, comment: "调理肠胃", leftNumber: 10000, Popularity: 50 },
        // 文具店商品
        铅笔: { storeType: "文具店", name: "铅笔", FrameID: 40, price: 1, comment: "书写工具", leftNumber: 10000, Popularity: 50 },
        橡皮: { storeType: "文具店", name: "橡皮", FrameID: 41, price: 2, comment: "擦除错误", leftNumber: 10000, Popularity: 50 },
        笔记本: { storeType: "文具店", name: "笔记本", FrameID: 42, price: 8, comment: "记录点滴", leftNumber: 10000, Popularity: 50 },
        钢笔: { storeType: "文具店", name: "钢笔", FrameID: 43, price: 15, comment: "高端书写", leftNumber: 10000, Popularity: 50 },
        文件夹: { storeType: "文具店", name: "文件夹", FrameID: 44, price: 10, comment: "整理资料", leftNumber: 10000, Popularity: 50 },
        胶水: { storeType: "文具店", name: "胶水", FrameID: 45, price: 5, comment: "粘合物品", leftNumber: 10000, Popularity: 50 },
        // 玩具店商品
        积木: { storeType: "玩具店", name: "积木", FrameID: 46, price: 50, comment: "益智玩具", leftNumber: 10000, Popularity: 50 },
        玩具车: { storeType: "玩具店", name: "玩具车", FrameID: 47, price: 40, comment: "男孩最爱", leftNumber: 10000, Popularity: 50 },
        毛绒玩具: { storeType: "玩具店", name: "毛绒玩具", FrameID: 48, price: 60, comment: "可爱柔软", leftNumber: 10000, Popularity: 50 },
        遥控飞机: { storeType: "玩具店", name: "遥控飞机", FrameID: 49, price: 150, comment: "高科技玩具", leftNumber: 10000, Popularity: 50 },
        拼图: { storeType: "玩具店", name: "拼图", FrameID: 50, price: 35, comment: "动脑益智", leftNumber: 10000, Popularity: 50 },
        娃娃: { storeType: "玩具店", name: "娃娃", FrameID: 51, price: 45, comment: "女孩最爱", leftNumber: 10000, Popularity: 50 },
        // 宠物店商品
        狗粮: { storeType: "宠物店", name: "狗粮", FrameID: 52, price: 30, comment: "营养狗粮", leftNumber: 10000, Popularity: 50 },
        猫粮: { storeType: "宠物店", name: "猫粮", FrameID: 53, price: 28, comment: "美味猫粮", leftNumber: 10000, Popularity: 50 },
        宠物玩具: { storeType: "宠物店", name: "宠物玩具", FrameID: 54, price: 20, comment: "宠物乐趣", leftNumber: 10000, Popularity: 50 },
        宠物笼: { storeType: "宠物店", name: "宠物笼", FrameID: 55, price: 80, comment: "舒适笼子", leftNumber: 10000, Popularity: 50 },
        宠物零食: { storeType: "宠物店", name: "宠物零食", FrameID: 56, price: 15, comment: "美味零食", leftNumber: 10000, Popularity: 50 },
        水族箱: { storeType: "宠物店", name: "水族箱", FrameID: 57, price: 200, comment: "观赏水族", leftNumber: 10000, Popularity: 50 },
      }

    this.saveLocalData();

  }
  initialDataForTest() {
    this.clearAllLocalData(); //清除本地数据
    this.loadLocalData(); //加载本地数据

    // 初始化玩家数据（如果不存在）
    if (!this.Player) {
      console.log("没有玩家数据，创建一个新玩家");
      this.Player = {
        isNewPlayer: true,
        ID: 1,
        Name: "Player1",
        Level: 1,
        Money: 1000,
        Character: ["Character1"],
        ShelveMaxGoodsNumber: 30,
        Talent: [],
        totalEarnings: 0,
        daysPassed: 0,
        monthExpenses: 0,
        rent: 200,
        livingStatus: "破旧的城中村",
        expPerDay: 10,
        currentStoreName: "",
      };
    }

    // 初始化商店数据（如果不存在）
    if (!this.MyStoreDict || Object.keys(this.MyStoreDict).length === 0) {
      console.log("没有商店数据，创建初始商店");
      this.MyStoreDict = {
        八一服装店: {
          StoreType: "服装店",
          CashRegisterLevel: 0,
          StoreLevel: 0,
          RentCost: 1000,
          Area: 100,
          FootTraffic: 100,
          Employees: {},
          location: "商业街",
          shelfCount: 4,
          maxShelves: 8,
          isOpen: true,
          dailyIncome: 0,
          dailyCustomer: 0,
          totalIncome: 0,
          popularity: 50,
          dailyExpenses: 0,
          employeeExpenses: 0,
          cleanliness: 80,
          serviceRating: 5,
          monthlyComplaintCount: 0,
        },
        新华花店: {
          StoreType: "花店",
          CashRegisterLevel: 0,
          StoreLevel: 0,
          RentCost: 1000,
          Area: 100,
          FootTraffic: 100,
          Employees: {},
          location: "社区店铺",
          shelfCount: 1,
          maxShelves: 6,
          isOpen: true,
          dailyIncome: 0,
          dailyCustomer: 0,
          totalIncome: 0,
          popularity: 50,
          dailyExpenses: 0,
          employeeExpenses: 0,
          cleanliness: 80,
          serviceRating: 5,
          monthlyComplaintCount: 0,
        },
      };
      this.StoreShelveDicts = {
        八一服装店: {
          1: { GoodsType: "便宜女装", number: 10 },
          2: { GoodsType: "便宜男装", number: 20 },
          3: { GoodsType: "一般男装", number: 30 },
          4: { GoodsType: "一般男装", number: 30 },
        },
        新华花店: {
          1: { GoodsType: "便宜花束", number: 50 },
        },
      };
      this.AllWarehouseGoodsDict = {
        // 服装店商品
        便宜女装: { LeftNumber: 10, Price: 22, Popularity: 50, Cost: 10 },
        便宜男装: { LeftNumber: 20, Price: 11, Popularity: 50, Cost: 10 },
        一般男装: { LeftNumber: 30, Price: 69, Popularity: 50, Cost: 19 },
        一般女装: { LeftNumber: 40, Price: 119, Popularity: 50, Cost: 20 },
        昂贵男装: { LeftNumber: 10, Price: 188, Popularity: 50, Cost: 99 },
        昂贵女装: { LeftNumber: 10, Price: 399, Popularity: 50, Cost: 99 },
        // 花店商品
        便宜花束: { LeftNumber: 70, Price: 8, Popularity: 50, Cost: 10 },
        一般花束: { LeftNumber: 80, Price: 16, Popularity: 50, Cost: 10 },
        昂贵花束: { LeftNumber: 90, Price: 30, Popularity: 50, Cost: 10 },
        // 书店商品
        励志书籍: { LeftNumber: 30, Price: 25, Popularity: 50, Cost: 10 },
        工具书籍: { LeftNumber: 20, Price: 45, Popularity: 50, Cost: 20 },
        言情书籍: { LeftNumber: 30, Price: 30, Popularity: 50, Cost: 12 },
        科幻书籍: { LeftNumber: 25, Price: 35, Popularity: 50, Cost: 15 },
        漫画书籍: { LeftNumber: 40, Price: 20, Popularity: 50, Cost: 8 },
        // 电器店商品
        电视: { LeftNumber: 5, Price: 2000, Popularity: 50, Cost: 1000 },
        冰箱: { LeftNumber: 5, Price: 1500, Popularity: 50, Cost: 800 },
        洗衣机: { LeftNumber: 5, Price: 1200, Popularity: 50, Cost: 600 },
        空调: { LeftNumber: 8, Price: 1800, Popularity: 50, Cost: 900 },
        电脑: { LeftNumber: 10, Price: 3500, Popularity: 50, Cost: 1800 },
        手机: { LeftNumber: 15, Price: 2000, Popularity: 50, Cost: 1000 },
        平板: { LeftNumber: 10, Price: 2500, Popularity: 50, Cost: 1300 },
        // 餐厅商品
        快餐: { LeftNumber: 50, Price: 15, Popularity: 50, Cost: 8 },
        盖浇饭: { LeftNumber: 40, Price: 20, Popularity: 50, Cost: 10 },
        面条: { LeftNumber: 40, Price: 18, Popularity: 50, Cost: 9 },
        炒菜: { LeftNumber: 30, Price: 35, Popularity: 50, Cost: 18 },
        火锅: { LeftNumber: 20, Price: 80, Popularity: 50, Cost: 40 },
        烧烤: { LeftNumber: 25, Price: 50, Popularity: 50, Cost: 25 },
        // 便利店商品
        矿泉水: { LeftNumber: 100, Price: 2, Popularity: 50, Cost: 1 },
        方便面: { LeftNumber: 80, Price: 5, Popularity: 50, Cost: 2 },
        饼干: { LeftNumber: 60, Price: 10, Popularity: 50, Cost: 5 },
        饮料: { LeftNumber: 70, Price: 6, Popularity: 50, Cost: 3 },
        香烟: { LeftNumber: 30, Price: 25, Popularity: 50, Cost: 15 },
        电池: { LeftNumber: 50, Price: 8, Popularity: 50, Cost: 4 },
        // 药店商品
        感冒药: { LeftNumber: 40, Price: 15, Popularity: 50, Cost: 8 },
        退烧药: { LeftNumber: 30, Price: 20, Popularity: 50, Cost: 10 },
        创可贴: { LeftNumber: 60, Price: 5, Popularity: 50, Cost: 2 },
        维生素: { LeftNumber: 40, Price: 30, Popularity: 50, Cost: 15 },
        止咳药: { LeftNumber: 35, Price: 18, Popularity: 50, Cost: 9 },
        胃药: { LeftNumber: 30, Price: 22, Popularity: 50, Cost: 11 },
        // 文具店商品
        铅笔: { LeftNumber: 100, Price: 1, Popularity: 50, Cost: 0.5 },
        橡皮: { LeftNumber: 80, Price: 2, Popularity: 50, Cost: 1 },
        笔记本: { LeftNumber: 50, Price: 8, Popularity: 50, Cost: 4 },
        钢笔: { LeftNumber: 30, Price: 15, Popularity: 50, Cost: 8 },
        文件夹: { LeftNumber: 40, Price: 10, Popularity: 50, Cost: 5 },
        胶水: { LeftNumber: 50, Price: 5, Popularity: 50, Cost: 2 },
        // 玩具店商品
        积木: { LeftNumber: 30, Price: 50, Popularity: 50, Cost: 25 },
        玩具车: { LeftNumber: 25, Price: 40, Popularity: 50, Cost: 20 },
        毛绒玩具: { LeftNumber: 20, Price: 60, Popularity: 50, Cost: 30 },
        遥控飞机: { LeftNumber: 15, Price: 150, Popularity: 50, Cost: 80 },
        拼图: { LeftNumber: 30, Price: 35, Popularity: 50, Cost: 18 },
        娃娃: { LeftNumber: 20, Price: 45, Popularity: 50, Cost: 22 },
        // 宠物店商品
        狗粮: { LeftNumber: 40, Price: 30, Popularity: 50, Cost: 15 },
        猫粮: { LeftNumber: 40, Price: 28, Popularity: 50, Cost: 14 },
        宠物玩具: { LeftNumber: 35, Price: 20, Popularity: 50, Cost: 10 },
        宠物笼: { LeftNumber: 15, Price: 80, Popularity: 50, Cost: 40 },
        宠物零食: { LeftNumber: 50, Price: 15, Popularity: 50, Cost: 8 },
        水族箱: { LeftNumber: 10, Price: 200, Popularity: 50, Cost: 100 },
      };
    }

    this.saveLocalData();
  }

  public GameTimeAdd1S(): void {
    // 将字符串转换为 Date 对象
    const currentDate = new Date(this.GameTime);
    // 增加 1 分钟（60000 毫秒）
    currentDate.setMinutes(currentDate.getMinutes() + 1);
    // 格式化新的时间为字符串
    const year = currentDate.getFullYear();
    const month =
      currentDate.getMonth() + 1 < 10
        ? "0" + (currentDate.getMonth() + 1)
        : currentDate.getMonth() + 1;
    const day =
      currentDate.getDate() < 10
        ? "0" + currentDate.getDate()
        : currentDate.getDate();
    const hours =
      currentDate.getHours() < 10
        ? "0" + currentDate.getHours()
        : currentDate.getHours();
    const minutes =
      currentDate.getMinutes() < 10
        ? "0" + currentDate.getMinutes()
        : currentDate.getMinutes();
    // 更新 GameTime
    this.GameTime = `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  addNewStore(
    StoreName: string,
    StoreType: string,
    StoreLevel: number,
    CashRegisterLevel: number,
    RentCost: number,
    Area: number,
    FootTraffic: number,
    location: string,
    maxShelves: number,
  ) {
    this.MyStoreDict[StoreName] = {
      StoreType: StoreType,
      CashRegisterLevel: CashRegisterLevel,
      StoreLevel: StoreLevel,
      RentCost: RentCost,
      Area: Area,
      FootTraffic: FootTraffic,
      Employees: {},
      location: location,
      shelfCount: 2,
      maxShelves: maxShelves,
      isOpen: true,
      dailyIncome: 0,
      dailyCustomer: 0,
      totalIncome: 0,
      popularity: 50,
      dailyExpenses: 0,
      employeeExpenses: 0,
      cleanliness: 80,
      serviceRating: 5,
      monthlyComplaintCount: 0,
    };
    // 初始化该商店的货架数据（2个货架）
    this.StoreShelveDicts[StoreName] = {
      1: { GoodsType: "空", number: 0 },
      2: { GoodsType: "空", number: 0 }
    };
    this.localSave("store");
    this.localSave("shelve");
  }
  addNewShelve(StoreName: string) {
    const store = this.MyStoreDict[StoreName];
    if (!store) return;

    // 检查是否达到最大货架数
    if (store.shelfCount >= store.maxShelves) {
      console.log("已达到最大货架数量！");
      return;
    }

    // 确保该商店的货架字典存在
    if (!this.StoreShelveDicts[StoreName]) {
      this.StoreShelveDicts[StoreName] = {};
    }
    // 获取该商店的货架数量作为新索引
    const shelveIndex = Object.keys(this.StoreShelveDicts[StoreName]).length + 1;
    this.StoreShelveDicts[StoreName][shelveIndex] = { GoodsType: "空", number: 0 };
    // 更新货架数量
    store.shelfCount = shelveIndex;
    this.localSave("shelve");
    this.localSave("store");
  }

  updateShelveData(storeName: string, shelveIndex: number, GoodsType: string, leftNumber: number) {
    if (this.StoreShelveDicts[storeName]) {
      this.StoreShelveDicts[storeName][shelveIndex] = { GoodsType: GoodsType, number: leftNumber };
    }
    this.localSave("shelve");
  }
  updateWarehouseData(
    GoodsType: string,
    leftNumber: number,
    Popularity: number,
    cost: number
  ) {
    if (this.AllWarehouseGoodsDict[GoodsType]) {
      this.AllWarehouseGoodsDict[GoodsType].LeftNumber = leftNumber;
      this.AllWarehouseGoodsDict[GoodsType].Popularity = Popularity;
      this.AllWarehouseGoodsDict[GoodsType].Cost = cost;
    }
    this.localSave("warehouse");
  }

  // 统一本地存储方法
  // type: "shelve" | "store" | "player" | "warehouse" | "all"
  localSave(type: "shelve" | "store" | "player" | "warehouse" | "all") {
    if (type === "shelve" || type === "all") {
      localStorage.setItem("StoreShelveDicts", JSON.stringify(this.StoreShelveDicts));
    }
    if (type === "store" || type === "all") {
      localStorage.setItem("MyStoreDict", JSON.stringify(this.MyStoreDict));
    }
    if (type === "player" || type === "all") {
      localStorage.setItem("Player", JSON.stringify(this.Player));
    }
    if (type === "warehouse" || type === "all") {
      localStorage.setItem("AllWarehouseGoodsDict", JSON.stringify(this.AllWarehouseGoodsDict));
    }
  }

  loadLocalData() {
    this.StoreShelveDicts = JSON.parse(localStorage.getItem("StoreShelveDicts")) || {};
    this.MyStoreDict = JSON.parse(localStorage.getItem("MyStoreDict")) || {};
    this.AllWarehouseGoodsDict = JSON.parse(localStorage.getItem("AllWarehouseGoodsDict")) || {};
    this.Player = JSON.parse(localStorage.getItem("Player"));
  }
  clearAllLocalData() {
    localStorage.clear();
    
  }
  saveLocalData() {
    this.localSave("all");
  }


  //加速游戏，最大4倍速
  speedUp(){
    if (this.GameSpeed < 4) {
      this.GameSpeed *= 2;
      console.log("游戏加速，当前速度: " + this.GameSpeed + "x");
    }
  }
  //减速游戏，最小0.25倍速
  slowDown() {
    if (this.GameSpeed > 0.25) {
      this.GameSpeed /= 2;
      console.log("游戏减速，当前速度: " + this.GameSpeed + "x");
    }
  }
}
