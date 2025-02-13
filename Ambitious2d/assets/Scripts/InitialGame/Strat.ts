import { _decorator, Button, Component, director, Label, Node } from "cc";
import { GameManager } from "../Globla/GameManger";
const { ccclass, property } = _decorator;

@ccclass("Strat")
export class GameStrat extends Component {
  @property(Button)
  stratbut: Button = null;
  @property(Button)
  readbut: Button = null;
  @property(Node)
  Archiveui: Node = null;
  @property(Node)
  public ArchiveuiPanel: Node = null; //游戏结束界面
  onLoad(): void {
    this.stratbut.node.on("click", this.ButStrat, this);
    this.readbut.node.on("click", this.readdata, this);
  }
  //开始游戏
  ButStrat(): void {
    if (GameManager._PlayProentry === null) {
      director.loadScene("GetPropentyScebe(获取属性)");
    } else {
      director.loadScene("WarehouseScene(仓库页面)");
    }
  } //读取档案
  readdata() {
    this.Archiveui.active = true;

    if (GameManager.inst() === null) {
      console.log("未实例化成功");
      return;
    }

    let moneynum = GameManager.inst().getMoney();
    console.log(moneynum);
    let name = GameManager.inst().getName();
    console.log(name);
    let stroenum = GameManager.inst().getStore();

    this.Archiveui.getChildByName("MoneyLable").getComponent(
      Label
    ).string = `余额: ${moneynum}￥`;
    this.Archiveui.getChildByName("NameLable").getComponent(
      Label
    ).string = `名字: ${name}`;
    this.Archiveui.getChildByName("StoreLable").getComponent(
      Label
    ).string = `仓库: ${stroenum}个`;
    this.Archiveui.getChildByName("StoreLable").getComponent(
      Label
    ).string = `仓库: ${stroenum}个`;
  }
}
