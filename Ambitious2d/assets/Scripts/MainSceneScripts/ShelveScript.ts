import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, Label, log, Node, Sprite ,SpriteFrame, Toggle,ToggleContainer} from 'cc';
import { AllStoreGoodsDict,SimpleAllStoreGoodsDict } from '../DataCollection';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('ShelveScript')
export class ShelveScript extends Component {
    @property(Sprite)
    public ShelveGood: Sprite = null; // 货架正面
    @property(Sprite)
    public ShelveGood2: Sprite = null; // 货架背面
    @property(Array(SpriteFrame))
    public AvatarArray:SpriteFrame[] = [];          // 货架的图片
    @property(Label)
    public GoodsNumberLabel:Label = null;
    @property(ToggleContainer)
    public GoodChooseToggle:ToggleContainer = null;

    public CurrentStoreName:string = "八一服装店";   // 当前货架所属的商店
    public ShelveID:number = 1;
    public CurrentGood:string = "";
    public CurrentGoodsNumber:number = 30;

    start(){
        this.ShelveID = 1;
        let collider=this.node.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
        collider.on(Contact2DType.END_CONTACT,this.onEndContact,this);
        
        console.log(TopManager.Instance.ShelveIndexDict);
        this.CurrentGood = TopManager.Instance.ShelveIndexDict[this.ShelveID].GoodsType;
        this.CurrentGoodsNumber = TopManager.Instance.ShelveIndexDict[this.ShelveID].number;
        
        this.GoodsNumberLabel.string = this.CurrentGoodsNumber.toString();
        this.registerToggleEvents();
    }
    onBeginContact(self: Collider2D, other: Collider2D) {
        console.log("onBeginContact");
        this.CurrentGoodsNumber--;
        this.GoodsNumberLabel.string = this.CurrentGoodsNumber.toString();
    }
    onEndContact(self: Collider2D, other: Collider2D) {
        console.log("onEndContact");
    }

    public changeSpriteFrame() {
        this.ShelveGood2.spriteFrame = this.AvatarArray[0];
    }

    registerToggleEvents() {
        if (this.GoodChooseToggle) {
            const toggles = this.GoodChooseToggle.getComponentsInChildren(Toggle);
            for (let toggle of toggles) {
                // 监听每个 Toggle 的状态变化
                toggle.node.on('toggle', () => this.onTalentToggleChange(toggle), this);
            }
        } else {
            console.error("SexToggle is not assigned or is null.");
        }
    }
    onTalentToggleChange(toggle: Toggle) {  
        if (toggle.isChecked) {  
            console.log("toggle is checked"+toggle.node.name);
        } else {  
            console.log("toggle is not checked"+toggle.node.name);
        }  
    }
}



