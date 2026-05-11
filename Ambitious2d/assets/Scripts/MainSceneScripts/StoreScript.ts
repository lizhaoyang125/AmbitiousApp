import { _decorator, Component, Label, Node, Prefab, instantiate, Vec3 ,Sprite} from 'cc';
import { ShelveScript } from './ShelveScript';
import { TopManager } from '../TopManager';
import { CustomerScript } from './CustomerScript';
import { HomeNodeScript } from './HomeNodeScript';
const { ccclass, property } = _decorator;

@ccclass('StoreScript')
export class StoreScript extends Component {

    @property(Label)
    public TimeLabel:Label=null;
    @property(Label)
    public TotalMoneyLabel:Label=null;
    @property(Label)
    public SpeedLabel:Label=null;

    public StoreName:string="八一服装店";
    @property(Prefab)
    public ShelvePrefab:Prefab=null;
    @property(Prefab)
    public CustomerPrefab:Prefab=null;

    public popularity: number = 10;
    private customerSpawnTimer: number = 0;
    private customerSpawnInterval: number = 5; // 默认每 5 秒生成一个顾客

    protected onLoad(): void {
        this.StoreName = TopManager.Instance.Player.currentStoreName;
        // 如果没有商店名称，隐藏整个店铺节点
        if (!this.StoreName) {
            this.node.active = false;
            return;
        }
        console.log("商店名称:", this.StoreName);
    }

    // 当节点被激活时调用
    protected onEnable(): void {
        // 重新获取商店名称并初始化
        this.StoreName = TopManager.Instance.Player.currentStoreName;
        if (this.StoreName) {
            this.initStore();
        }
    }

    start() {
        // 如果没有商店名称，直接返回
        if (!this.StoreName) {
            return;
        }

        this.initStore();
    }

    // 初始化商店
    initStore() {
        console.log(this.StoreName + "商店脚本开始运行");
        this.StoreName = TopManager.Instance.Player.currentStoreName;

        // 从 StoreShelveDicts 直接获取货架数据
        const shelveData = TopManager.Instance.StoreShelveDicts[this.StoreName];
        console.log("货架数据:", shelveData);

        // 如果没有货架数据，创建一个默认的两个空货架
        if (!shelveData || Object.keys(shelveData).length === 0) {
            console.warn("没有找到货架数据，为商店创建默认货架:", this.StoreName);
            TopManager.Instance.StoreShelveDicts[this.StoreName] = {
                1: { GoodsType: "空", number: 0 },
                2: { GoodsType: "空", number: 0 }
            };
            TopManager.Instance.localSave("shelve");
            // 重新获取数据
            const newShelveData = TopManager.Instance.StoreShelveDicts[this.StoreName];
            this.createShelvesFromData(newShelveData);
            return;
        }

        this.createShelvesFromData(shelveData);
    }

    createShelvesFromData(shelveData: any) {
        const shelveKeys = Object.keys(shelveData);
        console.log("货架数量:", shelveKeys.length);

        for (let index = 0; index < shelveKeys.length; index++) {
            const shelveId = parseInt(shelveKeys[index]);
            this.createShelvePrefab(100 * ((index % 2) * 2 - 1), 150 - 100 * (index >> 1), shelveId);
        }

        if (shelveKeys.length > 0) {
            this.newCustomerCome(shelveKeys.length, 1);
        }
    }

    update(deltaTime: number) {
        // 如果没有商店名称，直接返回
        if (!this.StoreName) {
            return;
        }

        this.TimeLabel.string = TopManager.Instance.GameTime;
        this.TotalMoneyLabel.string = "余额："+TopManager.Instance.Player.Money.toString();
        this.SpeedLabel.string = "速度：" + TopManager.Instance.GameSpeed + "x";

        // 根据 popularity 和 GameSpeed 更新顾客生成间隔
        this.customerSpawnInterval = 5 / (this.popularity / 10) / TopManager.Instance.GameSpeed;

        // 更新计时器
        this.customerSpawnTimer += deltaTime;

        // 检查是否到了生成新顾客的时间
        if (this.customerSpawnTimer >= this.customerSpawnInterval) {
            // 从 StoreShelveDicts 获取货架数量
            const shelveData = TopManager.Instance.StoreShelveDicts[this.StoreName];
            const shelveCount = shelveData ? Object.keys(shelveData).length : 0;
            if (shelveCount > 0) {
                this.newCustomerCome(shelveCount, 1);
            }
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

    // 返回家园（回家按钮）
    public backHome() {
        // 隐藏店铺节点
        this.node.active = false;

        // 查找并显示 HomeNode
        const canvas = this.node.parent;
        if (canvas) {
            const homeNode = canvas.getChildByName("HomeNode");
            if (homeNode) {
                homeNode.active = true;
                // 调用 HomeNodeScript 的更新方法刷新界面
                const homeScript = homeNode.getComponent(HomeNodeScript);
                if (homeScript) {
                    homeScript.updatePlayerInfo();
                }
                console.log("返回家园成功");
            } else {
                console.error("没有找到 HomeNode");
            }
        }
    }

    createShelvePrefab(x: number, y: number, id: number) {
        if (this.ShelvePrefab) {
            const newShelve = instantiate(this.ShelvePrefab);
            newShelve.setPosition(new Vec3(x, y, 0));
            this.node.addChild(newShelve);
            const shelveScript = newShelve.getComponent(ShelveScript);
            if (shelveScript) {
                shelveScript.ShelveID = id;
                shelveScript.CurrentStoreName = this.StoreName;
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
