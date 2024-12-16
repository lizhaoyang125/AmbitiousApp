import { _decorator, Component, Node, Sprite ,SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;
import { GoodsDict } from '../DataCollection';

@ccclass('ShelveScript')
export class ShelveScript extends Component {
    @property(Sprite)
    public ShelveGood: Sprite = null; // 货架正面
    @property(Sprite)
    public ShelveGood2: Sprite = null; // 货架背面
    @property(Array(SpriteFrame))
    public AvatarArray:SpriteFrame[] = [];

    public CurrentStore:string = "服装店";

    start(){
        console.log(GoodsDict[this.CurrentStore]);
        let Good="便宜女装";
        let index=GoodsDict[this.CurrentStore][Good];
        console.log("index:"+index);
    }
    public changeSpriteFrame() {
        this.ShelveGood2.spriteFrame = this.AvatarArray[0];
    }
}
