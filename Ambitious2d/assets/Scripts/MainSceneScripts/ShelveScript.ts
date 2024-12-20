import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, Node, Sprite ,SpriteFrame} from 'cc';
import { AllStoreGoodsDict,SimpleAllStoreGoodsDict } from '../DataCollection';
const { ccclass, property } = _decorator;

@ccclass('ShelveScript')
export class ShelveScript extends Component {
    @property(Sprite)
    public ShelveGood: Sprite = null; // 货架正面
    @property(Sprite)
    public ShelveGood2: Sprite = null; // 货架背面
    @property(Array(SpriteFrame))
    public AvatarArray:SpriteFrame[] = [];
    public CurrentStoreName:string = "服装店";
    private CurrentGoodsNumberDict: { [key: string]: number } = {};

    start(){
        let collider=this.node.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
        collider.on(Contact2DType.END_CONTACT,this.onEndContact,this);

        const CurrentGoodsDict = SimpleAllStoreGoodsDict[this.CurrentStoreName];
        console.log(CurrentGoodsDict);
        this.CurrentGoodsNumberDict = {
            '便宜女装':0,
            '便宜男装':0,
            '中等女装':0,
            '中等男装':0,
            '昂贵女装':0,
            '昂贵男装':0,
        };


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
