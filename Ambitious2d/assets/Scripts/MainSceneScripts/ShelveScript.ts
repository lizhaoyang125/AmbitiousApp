import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, Label, log, Node, Sprite ,SpriteFrame, Toggle,ToggleContainer} from 'cc';
import { GoodsFrameDict, SimpleAllStoreGoodsDict } from '../DataCollection';
import { TopManager } from '../TopManager';
import { CustomerScript } from './CustomerScript';
const { ccclass, property } = _decorator;

@ccclass('ShelveScript')
export class ShelveScript extends Component {
    @property(Sprite)
    public ShelveButton: Sprite = null; // 货架正面
    @property(Sprite)
    public ShelveGood: Sprite = null; // 货架背面

    @property(Label)
    public GoodsNumberLabel:Label = null;
    @property(ToggleContainer)
    public GoodChooseToggle:ToggleContainer = null;
    @property(Node)
    public ToggleOptions:Node []= [];
    public CurrentStoreName:string = "八一服装店";   // 当前货架所属的商店
    public CurrentStoreType:string = "服装店";
    public StoreGoodList:string [] = [];
    public ShelveID:number = 1;
    public CurrentGood:string = "";
    public CurrentGoodsNumber:number = 30;

    start(){
        const topManager = TopManager.Instance;  
        console.log("ShelveScript start, ShelveID:"+this.ShelveID);
        let collider=this.node.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
        collider.on(Contact2DType.END_CONTACT,this.onEndContact,this);
        
        this.CurrentGood = TopManager.Instance.ShelveGoodsDict[this.ShelveID].GoodsType;
        this.CurrentGoodsNumber = TopManager.Instance.ShelveGoodsDict[this.ShelveID].number;
        this.ShelveGood.spriteFrame = TopManager.Instance.AvatarArray[GoodsFrameDict[this.CurrentGood]];
        this.GoodsNumberLabel.string = this.CurrentGoodsNumber.toString();

        this.registerToggleEvents();
        this.StoreGoodList = SimpleAllStoreGoodsDict[this.CurrentStoreType];
        
    }
    onBeginContact(self: Collider2D, other: Collider2D) {
        console.log("onBeginContact,开始买东西了！");
        this.CurrentGoodsNumber--;
        TopManager.Instance.ShelveGoodsDict[this.ShelveID].number--;
        this.GoodsNumberLabel.string = this.CurrentGoodsNumber.toString();
        TopManager.Instance.updateShelveData(this.ShelveID,this.CurrentGood,this.CurrentGoodsNumber);
        console.log(other.node.getComponent(CustomerScript)?.cdTime);
        other.node.getComponent(CustomerScript).BuyGood = this.CurrentGood;
        other.node.getComponent(CustomerScript).BuyPrice = 100;
    }
    onEndContact(self: Collider2D, other: Collider2D) {
        console.log("onEndContact");
    }

    public changeSpriteFrame() {        //上架货物选择
        //this.GoodChooseToggle.toggleItems[2].isChecked = true;
        console.log("changeSpriteFrame");
        this.GoodChooseToggle.node.active = true;
        for (let i = 0; i < this.StoreGoodList.length; i++) {
            this.GoodChooseToggle.toggleItems[i].node.active = true;
            let LeftNumber = TopManager.Instance.AllWarehouseGoodsDict[this.StoreGoodList[i]]["leftNumber"];
            this.GoodChooseToggle.toggleItems[i].node.getChildByName("Label").getComponent(Label).string = this.StoreGoodList[i]+"("+LeftNumber.toString()+")";
        }
    }

    registerToggleEvents() {
        if (this.GoodChooseToggle) {
            const toggles = this.GoodChooseToggle.getComponentsInChildren(Toggle);
            for (let toggle of toggles) {
                // 监听每个 Toggle 的状态变化
                toggle.node.on('toggle', () => this.onTalentToggleChange(toggle), this);
            }
        } else {
            console.error("GoodChooseToggle is not assigned or is null.");
        }
    }
    onTalentToggleChange(toggle: Toggle) {  
        if (toggle.isChecked) {  
            console.log("toggle is checked"+toggle.node.name);
            this.GoodChooseToggle.node.active = false;
            let index = this.getToggleIndex(toggle.node.name);
            console.log("index:"+index);
            this.CurrentGood = this.StoreGoodList[index];
            this.ShelveGood.spriteFrame = TopManager.Instance.AvatarArray[GoodsFrameDict[this.CurrentGood]];
        } else {  
            console.log("toggle is not checked"+toggle.node.name);
            this.GoodChooseToggle.node.active = false;
            let index = this.StoreGoodList.indexOf(toggle.node.name);
            console.log("index:"+index);
        }  
    }
    getToggleIndex(toggleName:string){
        switch(toggleName){
            case "Good0":return 0;
            case "Good1":return 1;
            case "Good2":return 2;
            case "Good3":return 3;
            case "Good4":return 4;
            case "Good5":return 5;
            case "Good6":return 6;
            case "Good7":return 7;
            case "Good8":return 8;
        }
    }
    switchScene(){
        director.loadScene("TestScene");
    }
}


