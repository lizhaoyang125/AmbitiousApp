import { _decorator, Component, Label, Node } from 'cc';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('StoreScript')
export class StoreScript extends Component {

    @property(Label)
    public TimeLabel:Label=null;

    public StoreName:string="";
    start() {

    }

    update(deltaTime: number) {
        this.TimeLabel.string=TopManager.Instance.GameTime;
    }
}


  