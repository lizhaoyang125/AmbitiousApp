import { _decorator, Component, Label, Node } from 'cc';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('StoreScript')
export class StoreScript extends Component {

    @property(Label)
    public TimeLabel:Label=null;

    public StoreName:string="";
    start() {
        console.log("商店脚本开始运行start");
    }
    protected onLoad(): void {
        console.log("商店脚本开始运行onLoad");
    }

    update(deltaTime: number) {
        this.TimeLabel.string=TopManager.Instance.GameTime;
    }
}


  