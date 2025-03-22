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
  Y: number = 260; // 货架Y轴位置
  public ShelveList: string[] = null; // 货架列表
  @property(Prefab)
  public ShelvePrefab: Prefab = null; // 货架预制体

  start() {}

  protected onLoad(): void {
    const goodsTypes = Object.keys(TopManager.Instance.AllWarehouseGoodsDict);
    let i = 0; // Assume goodsTypes is an array of keys, we need to get the actual goods data
    for (let goodKey of goodsTypes) {
      const goodsData = TopManager.Instance.AllWarehouseGoodsDict[goodKey];
      console.log(
        "goodsData" + "leftnumber" + goodsData.LeftNumber,
        "goodKey" + goodKey
      );
      if (goodsData) {
        i++;
        this.createShelvePrefab(
          100,
          -100 * (i + 1),
          goodsData.LeftNumber,
          goodKey
        );
      } else {
        console.error(`No goods data found for key: ${goodKey}`);
      }
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
      // Check if newShelve has 'shelveGood' and 'shelveNumberLabel' nodes
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
