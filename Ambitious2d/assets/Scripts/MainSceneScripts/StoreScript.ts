import { _decorator, Component, Label, Node, Prefab, instantiate, Vec3 ,Sprite} from 'cc';
import { ShelveScript } from './ShelveScript';
import { TopManager } from '../TopManager';
import { CustomerScript } from './CustomerScript';
const { ccclass, property } = _decorator;

@ccclass('StoreScript')
export class StoreScript extends Component {

    @property(Label)
    public TimeLabel:Label=null;
    @property(Label)
    public TotalMoneyLabel:Label=null;
    @property(Label)
    public SpeedLabel:Label=null;

    public StoreName:string="";
    @property(Prefab)
    public ShelvePrefab:Prefab=null;
    @property(Prefab)
    public CustomerPrefab:Prefab=null;
    public CurrentStore:{ StoreType: string; ShelveIndex: number[],CashRegisterLevel:number,StoreLevel:number } = null;
    public ShelveList: number[] = null;

    public popularity: number = 10;
    private customerSpawnTimer: number = 0;
    private customerSpawnInterval: number = 5; // 默认每 5 秒生成一个顾客

    protected onLoad(): void {
        this.StoreName = TopManager.Instance.CurrentStoreName;
        this.CurrentStore = TopManager.Instance.MyStoreShelveDict[this.StoreName];
        this.ShelveList = this.CurrentStore.ShelveIndex;
        console.log(this.StoreName + "商店脚本开始运行onLoad");
    }

    start() {
        console.log(this.StoreName + "商店脚本开始运行");
        for (let index = 0; index < this.ShelveList.length; index++) {
            this.createShelvePrefab(100 * ((index % 2) * 2 - 1), 150 - 100 * (index >> 1), this.ShelveList[index]);
        }
        this.newCustomerCome(this.ShelveList.length, 1);
    }

    update(deltaTime: number) {
        this.TimeLabel.string = TopManager.Instance.GameTime;
        this.TotalMoneyLabel.string = "余额："+TopManager.Instance.Player.Money.toString();
        this.SpeedLabel.string = "速度：" + TopManager.Instance.GameSpeed + "x";

        // 根据 popularity 和 GameSpeed 更新顾客生成间隔
        this.customerSpawnInterval = 5 / (this.popularity / 10) / TopManager.Instance.GameSpeed;

        // 更新计时器
        this.customerSpawnTimer += deltaTime;

        // 检查是否到了生成新顾客的时间
        if (this.customerSpawnTimer >= this.customerSpawnInterval) {
            this.newCustomerCome(this.ShelveList.length, 1);
            this.customerSpawnTimer = 0;
        }
    }

    // 加速游戏
    public speedUp() {
        TopManager.Instance.speedUp();
    }

    // 减速游戏
    public slowDown() {
        TopManager.Instance.slowDown();
    }

    createShelvePrefab(x: number, y: number, id: number) {
        if (this.ShelvePrefab) {
            const newShelve = instantiate(this.ShelvePrefab);
            newShelve.setPosition(new Vec3(x, y, 0));
            this.node.addChild(newShelve);
            const shelveScript = newShelve.getComponent(ShelveScript);
            if (shelveScript) {
                shelveScript.ShelveID = id;
            } else {
                console.error("ShelveScript component not found on the prefab!");
            }
            console.log(`Created shelve at position (${x}, ${y}) with ID: ${id}`);
            return newShelve;
        } else {
            console.error("ShelvePrefab is not set!");
            return null;
        }
    }
    newCustomerCome(shelveNumber:number,dstShelve:number){
        console.log("有顾客来了");
        if(this.CustomerPrefab){
            const newCustomer=instantiate(this.CustomerPrefab);
            newCustomer.setPosition(-200, 280, 0);
            this.node.addChild(newCustomer);
            const spriteComponent = newCustomer.getComponent(Sprite);
            const randomIndex = Math.floor(Math.random() * TopManager.Instance.CharacterArray.length);
            spriteComponent.spriteFrame = TopManager.Instance.CharacterArray[randomIndex];
            const customerScript=newCustomer.getComponent(CustomerScript);
            if(customerScript){
                customerScript.ShelveNumber=shelveNumber;
                customerScript.DstShelve=dstShelve;
            }else{
                console.error("CustomerScript component not found on the prefab!");
            }
        }else{
            console.error("CustomerPrefab is not set!");
        }
    }


}
