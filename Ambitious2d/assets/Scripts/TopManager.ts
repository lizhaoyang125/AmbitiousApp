import { _decorator, Component, director, Node, SpriteFrame } from "cc";
import {
  Player,
  StoreInfo,
  WarehouseGood,
  EmployeeDict,
  StoreShelveGoodsDict,
} from "./DataCollection";
const { ccclass, property } = _decorator;

@ccclass("TopManager")
export class TopManager extends Component {
  private static _instance: TopManager;
  public CurrentStoreName: string = ""; //当前商店名称
  //商店数据结构：商店名称 -> 商店信息
  public MyStoreDict: { [StoreName: string]: StoreInfo } = {};
  //货架数据结构：以商店名称为key，每个商店有自己的货架字典（货架索引 -> 商品信息）
  public StoreShelveDicts: StoreShelveGoodsDict = {};
  //仓库存货：商品类型，数量
  public AllWarehouseGoodsDict: { [GoodsType: string]: WarehouseGood } = {};
  //玩家数据
  public Player: Player = { ID: 0, Name: "", Level: 1, Money: 0, Character: [], ShelveMaxGoodsNumber: 30, Talent: [], totalEarnings: 0, daysPassed: 0, monthExpenses: 0 };
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
    // 初始化数据
    this.initialData();
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
        this.CurrentStoreName = key;
        break; // 只获取第一个元素
      }
    }
    console.log("TopManager is loaded! current store:" + this.CurrentStoreName);
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
    this.clearAllLocalData(); //清除本地数据
    this.loadLocalData(); //加载本地数据

    // 初始化玩家数据（如果不存在）
    if (!this.Player) {
      console.log("没有玩家数据，创建一个新玩家");
      this.Player = {
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
        便宜女装: { LeftNumber: 10, Price: 22, Popularity: 50, Cost: 10 },
        便宜男装: { LeftNumber: 20, Price: 11, Popularity: 50, Cost: 10 },
        一般男装: { LeftNumber: 30, Price: 69, Popularity: 50, Cost: 19 },
        一般女装: { LeftNumber: 40, Price: 119, Popularity: 50, Cost: 20 },
        昂贵男装: { LeftNumber: 10, Price: 188, Popularity: 50, Cost: 99 },
        昂贵女装: { LeftNumber: 10, Price: 399, Popularity: 50, Cost: 99 },
        便宜花束: { LeftNumber: 70, Price: 8, Popularity: 50, Cost: 10 },
        一般花束: { LeftNumber: 80, Price: 16, Popularity: 50, Cost: 10 },
        昂贵花束: { LeftNumber: 90, Price: 30, Popularity: 50, Cost: 10 },
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
  ) {
    let shelveIndex = 1;
    this.MyStoreDict[StoreName] = {
      StoreType: StoreType,
      CashRegisterLevel: CashRegisterLevel,
      StoreLevel: StoreLevel,
      RentCost: RentCost,
      Area: Area,
      FootTraffic: FootTraffic,
      Employees: {},
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
    // 初始化该商店的货架数据
    this.StoreShelveDicts[StoreName] = {
      [shelveIndex]: { GoodsType: "空", number: 0 }
    };
    this.localSave("store");
    this.localSave("shelve");
  }
  addNewShelve(StoreName: string) {
    // 确保该商店的货架字典存在
    if (!this.StoreShelveDicts[StoreName]) {
      this.StoreShelveDicts[StoreName] = {};
    }
    // 获取该商店的货架数量作为新索引
    const shelveIndex = Object.keys(this.StoreShelveDicts[StoreName]).length + 1;
    this.StoreShelveDicts[StoreName][shelveIndex] = { GoodsType: "空", number: 0 };
    this.localSave("shelve");
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
