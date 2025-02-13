import { _decorator, Component, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static _inst: GameManager = null; // 游戏管理器的单例实例
  /**玩家名称*/
  public _playerName: string = ""; // 玩家名称
  private PLAYERNAME: string = "playername"; // 本地存储中玩家名称的键
  /**玩家金钱数量*/
  public _Money: number = 0; // 玩家金钱数量
  private MONEY: string = "money"; // 本地存储中玩家金钱的键
  /**玩家本地仓库数量*/
  public _StoreCount: number = 0;
  private STORE: string = "store"; // 本地存储中玩家商店数据的键
  /**玩家游戏加成属性*/
  private _PlayProentry: string = ""; // 玩家商店加成
  private PLAYPROENTRY: string = "playproentry"; // 本地存储中玩家商店数据的键
  public SheifData: string[] = [];

  public static inst() {
    return this._inst;
  }
  /**玩家加成属性*/
  static _PlayProentry: string = null;

  static set PlayProentry(value: string) {
    if (this._PlayProentry !== value) {
      GameManager.inst()._PlayProentry = value;
      GameManager.inst().savePlayerPropenty();
    }
  }

  static get PlayProentry() {
    return this._PlayProentry;
  }

  onLoad() {
    GameManager._inst = this;
    director.addPersistRootNode(this.node); // 设置 GameManager 节点为持久化，跨场景不销毁
    this.init(); // 初始化游戏数据
  }

  // 初始化游戏数据
  private init() {
    this._playerName = this.readData(this.PLAYERNAME, "鹏");
    this._Money = this.readData(this.MONEY, 100);
    this._StoreCount = this.readData(this.STORE, 1);
    this._PlayProentry = this.readData(this.PLAYPROENTRY, "");
    console.log(this._PlayProentry);
  }

  /**
   * 获取玩家游戏名字
   * @returns 返回玩家游戏名
   */
  getName() {
    return this._playerName;
  }

  /**
   * 获取玩家游戏金额余额
   * @returns 返回玩家游戏金钱
   */
  getMoney() {
    return this._Money;
  }

  /**
   * 获取玩家商店的值
   * @returns 返回玩家商店存储值
   */
  getStore() {
    return this._StoreCount;
  }

  getPlayProentry() {
    return this._PlayProentry;
  }

  /***
   * 读取本地玩家游戏数据
   * @param key localStorage 键
   * @param defaultValue 默认值
   * @returns 返回从 localStorage 读取的数据
   */
  private readData(key: string, defaultValue: any): any {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      if (typeof defaultValue === "number") {
        return isNaN(Number(value)) ? defaultValue : parseInt(value);
      }
      return value;
    } catch (e) {
      console.error(`读取 ${key} 数据失败`, e);
      return defaultValue;
    }
  }

  /**
   * 保存玩家名称
   */
  savePlayerName() {
    this.saveData(this.PLAYERNAME, this._playerName);
  }

  /**
   * 保存玩家金钱
   */
  savePlayerMoney() {
    this.saveData(this.MONEY, this._Money);
  }

  /**
   * 保存玩家商店数据
   */
  savePlayerStore() {
    this.saveData(this.STORE, this._StoreCount);
  }

  /**
   * 保存玩家加成属性数据
   */
  savePlayerPropenty() {
    this.saveData(this.PLAYPROENTRY, this._PlayProentry);
    console.log("保存完成");
  }

  /**
   * 保存玩家数据到 localStorage
   * @param key localStorage 键
   * @param value 存储值
   */
  private saveData(key: string, value: any) {
    try {
      const data = typeof value === "number" ? value.toString() : value;
      localStorage.setItem(key, data);
    } catch (e) {
      console.error(`保存 ${key} 数据失败`, e);
    }
  }

  /**
   * 修改玩家名称
   * @param name 新的玩家名称
   */
  public changePlayerName(name: string) {
    this._playerName = name;
    this.savePlayerName(); // 保存更新的玩家名称
  }
}
