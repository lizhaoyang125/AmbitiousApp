import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, Node, Sprite ,SpriteFrame} from 'cc';
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
        let collider=this.node.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
        collider.on(Contact2DType.END_CONTACT,this.onEndContact,this);
    }
    onBeginContact(self: Collider2D, other: Collider2D) {
        console.log("onBeginContact");
    }
    onEndContact(self: Collider2D, other: Collider2D) {
        console.log("onEndContact");
    }
    public changeSpriteFrame() {
        this.ShelveGood2.spriteFrame = this.AvatarArray[0];
    }
}
