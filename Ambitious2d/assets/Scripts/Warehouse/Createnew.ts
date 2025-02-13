import {
  _decorator,
  Button,
  Component,
  instantiate,
  Label,
  math,
  Node,
  Prefab,
  v2,
  v3,
} from "cc";
import { GameManager } from "../Globla/GameManger";
const { ccclass, property } = _decorator;

@ccclass("Createnew")
export class Createnew extends Component {
  @property(Button)
  button: Button = null;
  @property(Prefab)
  House: Prefab = null;
  Loacthousecount: number = 0;
  MaxhouseCount = 8;
  currentHouseCount = 0;
  Y: number = 300;
  start() {
    console.log("start");
  }
  protected onLoad(): void {
    let strlabel = this.node.getChildByName("Tip").getComponent(Label);
    const str = GameManager.inst()._playerName;

    strlabel.string = str + "的仓库";
    this.Loacthousecount = GameManager.inst()._StoreCount;

    let cpint2 = GameManager.inst()._Money;

    for (let i = 1; i <= this.Loacthousecount; i++) {
      this.CreateShelf();
    }
  }
  update(deltaTime: number) {}
  /**
   * 根据玩家本地货架数量创建已存在的货架
   */
  CreateShelf() {
    if (this.currentHouseCount === this.MaxhouseCount) {
      let panel = this.node.getChildByName("MessagePanel");
      panel.active = true;
      return false;
    }
    let bool = this.AddWareHouse(this.currentHouseCount + 1);
    this.currentHouseCount = bool
      ? this.currentHouseCount + 1
      : this.currentHouseCount;
  }
  AddWareHouse(num: number): boolean {
    try {
      let newx = 0;
      let newy = 0;
      // 计算商和余数
      let quotient = Math.floor(num / 2); // 商
      let remainder = num % 2; // 余数
      // 根据余数设置 newx
      newx = remainder === 0 ? 180 : -180;
      // 根据 quotient 计算 newy 的位置
      newy = this.Y - (quotient + remainder) * 200;
      const house = instantiate(this.House);
      house.setPosition(v3(newx, newy, 0)); // 设置房屋位置
      let LAB = house.getChildByName("Title").getComponent(Label);
      LAB.string = "鲜花";
      house.setParent(this.node); // 将房屋添加到当前节点
      return true;
    } catch (error) {
      return false;
    }
  }
}
