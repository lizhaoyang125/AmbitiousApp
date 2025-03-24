import {
  _decorator,
  Button,
  Component,
  instantiate,
  Label,
  math,
  Node,
  Prefab,
  Sprite,
  v2,
  v3,
  Vec3,
} from "cc";
import { GoodsFrameDict, SimpleAllStoreGoodsDict } from "../DataCollection";
import { GameManager } from "../GloblaScripts/GameManger";
import { TopManager } from "../TopManager";
const { ccclass, property } = _decorator;

@ccclass("Createnew")
export class Createnew extends Component {
  @property(Button)
  button: Button = null;
  currentHouseCount = 0; // 当前货架数量
  Y: number = 140; // 货架Y轴位置
  public ShelveList: string[] = null; // 货架列表
  @property(Prefab)
  public ShelvePrefab: Prefab = null; // 货架预制体

  start() {}

  protected onLoad(): void {
    const goodsTypes = Object.keys(TopManager.Instance.AllWarehouseGoodsDict);
    let newx = 0;
    let newy = 0;
    for (let goodKey of goodsTypes) {
      const goodsData = TopManager.Instance.AllWarehouseGoodsDict[goodKey];
      if (goodsData) {
        const newx = this.currentHouseCount % 2 == 0 ? -100 : 100;
        const newy = this.Y - 100 * Math.floor(this.currentHouseCount / 2);
        this.createShelvePrefab(newx, newy, goodsData.LeftNumber, goodKey);
      } else {
        console.error(`No goods data found for key: ${goodKey}`);
      }
      this.currentHouseCount++;
    }
  }

  createShelvePrefab(
    x: number,
    y: number,
    leftNumber: number,
    GoodsType: string
  ) {
    if (this.ShelvePrefab) {
      const newShelve = instantiate(this.ShelvePrefab);
      newShelve.setPosition(new Vec3(x, y, 0));
      this.node.addChild(newShelve);
      const shelveGoodNode = newShelve.getChildByName("Good");
      shelveGoodNode.getComponent(Sprite).spriteFrame =
        TopManager.Instance.AvatarArray[GoodsFrameDict[GoodsType]];
      const shelveNumberLabelNode = newShelve.getChildByName("Label");
      shelveNumberLabelNode.getComponent(Label).string = leftNumber.toString();
    }
  }

  update(deltaTime: number) {}
  /**
   * 根据玩家本地货架数量创建已存在的货架
   */
}
