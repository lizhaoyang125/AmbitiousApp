import {
  _decorator,
  BoxCollider,
  BoxCollider2D,
  Component,
  director,
  find,
  instantiate,
  Label,
  Node,
  Prefab,
  randomRange,
  randomRangeInt,
} from "cc";
import { GameManager } from "../Globla/GameManger";
const { ccclass, property } = _decorator;

@ccclass("Manager")
export class Manager extends Component {
  private static _instance: Manager = new Manager();

  @property([String])
  workNameArray: string[] = [];
  @property(Prefab)
  WorkLabelPrefab: Prefab;
  @property(Node)
  TimerLabel: Node;
  @property(Number)
  public totalTime: number = 0;
  private currenTime: number = this.totalTime;

  //使用过的索引
  private usedIndexes: Set<number> = new Set();
  // 获取实例
  public static get Instance(): Manager {
    return this._instance;
  }
  protected onLoad(): void {
    //确保全局只有一个实例
    if (Manager._instance == null) {
      Manager._instance = new Manager();
    } else {
      Manager._instance = this;

      return;
    }
  }
  protected start(): void {
    this.currenTime = this.totalTime;
    this.schedule(this.replaceLabelContent, 0.5);
  }
  protected update(dt: number): void {
    if (this.currenTime > 0) {
      this.currenTime -= dt;
      this.TimerLabel.getComponent(Label).string = this.currenTime.toFixed(2);
    } else {
      this.currenTime = 0;
      this.TimerLabel.getComponent(Label).string = this.currenTime.toFixed(2);
    }
  }

  private replaceLabelContent(): void {
    if (this.usedIndexes.size === this.workNameArray.length) {
    }
    let randomIndex: number;
    do {
      randomIndex = randomRangeInt(0, this.workNameArray.length);
    } while (this.usedIndexes.has(randomIndex));
    // 标记此索引为已使用
    this.usedIndexes.add(randomIndex);
    // 更新 prefabLabel 的内容
    let WorkLabelNode = instantiate(this.WorkLabelPrefab);

    WorkLabelNode.getComponent(Label).string = this.workNameArray[randomIndex];
    WorkLabelNode.parent = find("Canvas/WorkList");
    WorkLabelNode.setPosition(randomRange(-320, 320), 670);
  }
  /**返回按钮 */
  BreakBut() {
    director.loadScene("GameInitialScene(初始界面)");
  }
  /**重新获取属性 */
  AgainGetBut() {}
}
