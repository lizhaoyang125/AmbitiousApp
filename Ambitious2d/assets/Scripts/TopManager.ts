import { _decorator, Component, director, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopManager')
export class TopManager extends Component {
    private static _instance: TopManager;
    public CurrentStoreName:string="";    //当前商店名称
    //商店数据结构：商店名称，商店类型，货架索引数组，收银台等级，商店等级（主要是商店名称，类型，货架ID）
    public MyStoreShelveDict: { [StoreName: string]: { StoreType: string; ShelveIndex: number[],CashRegisterLevel:number,StoreLevel:number } } = {};
    //货架数据结构：货架索引，商品类型，数量
    public ShelveGoodsDict: { [shelveIndex: number]: { GoodsType: string; number: number } } = {};
    //仓库存货：商品类型，数量
    public AllWarehouseGoodsDict: { [GoodsType: string]: { LeftNumber: number, Price: number, Popularity: number } } = {};
    //玩家数据结构：玩家名称，金币数量，拥有的角色数组，金币数量（主要是玩家名称，拥有的角色数组）
    public Player:{Name:string,Money:number,Character:string[],ShelveMaxGoodsNumber:number} = {Name:"",Money:0,Character:[],ShelveMaxGoodsNumber:30};

    @property(Array(SpriteFrame))
    public AvatarArray:SpriteFrame[] = [];  // 货物的图片
    @property(Array(SpriteFrame))
    public CharacterArray:SpriteFrame[] = [];  // 顾客的图片
    private _ValueForTest:string="测试";     //用于demo跨Scene通信的测试
    public ValueForTest2:number=200;      //用于demo跨Scene通信的测试
    public ValueForTestString:string="测试字符串";
    public GameTime: string = "2024/1/1 08:00";    //游戏内时间，格式：年/月/日 时:分
    private Timer1S:number=0;
    private _deltaTime: number = 1/60;
    private _accumulator = 0;

    public static get Instance() {
        if (!this._instance) {
            console.warn("TopManager instance is not initialized yet!");
        }
        return this._instance;
    }
    public static get ValueForTest(){ //用于demo跨Scene通信的测试
        return this._instance._ValueForTest;
    }
    public static set ValueForTest(value:string){ //用于demo跨Scene通信的测试
        this._instance._ValueForTest = value;
    }

    public Pause_all(){
        director.pause(); 
    }
    public Resume_all(){
        director.resume(); 
    }
    protected onLoad(): void {
        if (TopManager._instance) {
            console.warn('TopManager already exists!');
            this.node.destroy(); // 确保新创建的节点被销毁
            return;
        }
        TopManager._instance = this;
        // 初始化数据
        this.initialData();
        // 确保节点在场景切换时不被销毁
        if (!this.node.parent) {
            console.warn("Node is not attached to the scene tree. Cannot persist it.");
            return;
        }
        if (!director.isPersistRootNode(this.node)) {
            director.addPersistRootNode(this.node);
        }
        for (const key in this.MyStoreShelveDict) {
            if (this.MyStoreShelveDict.hasOwnProperty(key)) {
                this.CurrentStoreName = key;
                break; // 只获取第一个元素
            }
          }
        console.log("TopManager is loaded! current store:"+this.CurrentStoreName);
    }
    
    
    protected update(deltaTime: number): void {
        this._accumulator += deltaTime;
        this.GameTimeAdd1S();
        if (this._accumulator >= this._deltaTime) {
            this.Timer1S++;
            this._accumulator -= this._deltaTime; // 减去已处理的时间
        }
        // 其他逻辑，例如每 1 秒触发一次
        if (this.Timer1S >= 60) {
            this.Timer1S = 0;
            console.log("1分钟过去了");
            
        }
    }
    initialData() {
        this.clearAllLocalData();     //清除本地数据
        this.loadLocalData();    //加载本地数据
        
        if(this.Player==null){   
            console.log("没有玩家数据，创建一个新玩家");
            this.Player = { Name: "Player1", Money: 1000, Character: ["Character1"],ShelveMaxGoodsNumber:30 };
            
        } else {
            console.log("玩家数据加载成功");
            return;
        }

        this.MyStoreShelveDict = {
            "八一服装店": { StoreType: "服装店", ShelveIndex: [1, 2,3],CashRegisterLevel:0,StoreLevel:0 },
            "新华花店": { StoreType: "花店", ShelveIndex: [3],CashRegisterLevel:0,StoreLevel:0 },
        };
        this.ShelveGoodsDict = {
            1: { GoodsType: "便宜女装", number: 10 },
            2: { GoodsType: "便宜男装", number: 20 },
            3: { GoodsType: "一般男装", number: 30 },
        };
        this.AllWarehouseGoodsDict = {
            "便宜女装": { LeftNumber: 10, Price: 22, Popularity: 50 },
            "便宜男装": { LeftNumber: 20, Price: 11, Popularity: 50 },
            "一般男装": { LeftNumber: 30, Price: 22, Popularity: 50 },
            "一般女装": { LeftNumber: 40, Price: 33, Popularity: 50 },
            "昂贵男装": { LeftNumber: 50, Price: 33, Popularity: 50 },
            "昂贵女装": { LeftNumber: 60, Price: 44, Popularity: 50 },
            "便宜花束": { LeftNumber: 70, Price: 8,  Popularity: 50 },
            "一般花束": { LeftNumber: 80, Price: 16, Popularity: 50 },
            "昂贵花束": { LeftNumber: 90, Price: 30, Popularity: 50 },
        };
        this.saveLocalData();
    }
    

    public GameTimeAdd1S(): void {
        // 将字符串转换为 Date 对象
        const currentDate = new Date(this.GameTime);
        // 增加 1 分钟（60000 毫秒）
        currentDate.setMinutes(currentDate.getMinutes() + 1);
        // 格式化新的时间为字符串
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1 < 10) ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
        const day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
        const hours = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours();
        const minutes = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
        // 更新 GameTime
        this.GameTime = `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    addNewStore(StoreName:string,StoreType:string){
        let shelveIndex = Object.keys(this.MyStoreShelveDict).length + 1;
        this.MyStoreShelveDict[StoreName] = { StoreType: StoreType, ShelveIndex: [shelveIndex],CashRegisterLevel:0,StoreLevel:0 };
        this.ShelveGoodsDict[shelveIndex] = { GoodsType: "空", number: 0 }
        this.localStoreMyStoreShelveDict();
        this.localStoreShelveGoodsDict();
    }
    addNewShelve(StoreName:string){
        let shelveIndex = Object.keys(this.MyStoreShelveDict[StoreName].ShelveIndex).length + 1;
        this.MyStoreShelveDict[StoreName].ShelveIndex.push(shelveIndex);
        this.ShelveGoodsDict[shelveIndex] = { GoodsType: "空", number: 0 }
        this.localStoreMyStoreShelveDict();
        this.localStoreShelveGoodsDict();
    }

    updateShelveData(id:number,GoodsType:string,leftNumber:number){
        this.ShelveGoodsDict[id] = { GoodsType: GoodsType, number: leftNumber };
        this.localStoreShelveGoodsDict();
    }
    updateWarehouseData(id:number,GoodsType:string,leftNumber:number,Popularity:number){
        this.AllWarehouseGoodsDict[GoodsType][0] = leftNumber;
        this.AllWarehouseGoodsDict[GoodsType][1] = Popularity;
        this.localStoreAllWarehouseGoodsDict();
    }

    localStoreShelveGoodsDict(){    // 本地存储 货架数据,货架以及货架上的商品数量
        localStorage.setItem("ShelveGoodsDict",JSON.stringify(this.ShelveGoodsDict));
    }
    localStoreMyStoreShelveDict(){    // 本地存储 店铺数据,店铺名称以及货架编号
        localStorage.setItem("MyStoreShelveDict",JSON.stringify(this.MyStoreShelveDict));
    }
    localStorePlayer(){    // 本地存储玩家数据
        localStorage.setItem("Player",JSON.stringify(this.Player));
    }
    localStoreAllWarehouseGoodsDict(){    // 本地存储，仓库所有商品数量,商品名称以及商品数量
        localStorage.setItem("AllWarehouseGoodsDict",JSON.stringify(this.AllWarehouseGoodsDict));
    }
    loadLocalData(){
        this.ShelveGoodsDict = JSON.parse(localStorage.getItem("ShelveGoodsDict"));
        this.MyStoreShelveDict = JSON.parse(localStorage.getItem("MyStoreShelveDict"));
        this.AllWarehouseGoodsDict = JSON.parse(localStorage.getItem("AllWarehouseGoodsDict"));
        
        this.Player = JSON.parse(localStorage.getItem("Player"));
        if(this.Player==null){   
            console.log("没有玩家数据，创建一个新玩家,进入GameInitialScene");
        } 
    }
    clearAllLocalData(){
        localStorage.clear(); 
    }
    saveLocalData(){
        this.localStoreShelveGoodsDict();
        this.localStoreMyStoreShelveDict();
        this.localStorePlayer(); 
        this.localStoreAllWarehouseGoodsDict();
        console.log(localStorage.getItem("AllWarehouseGoodsDict"));
    }
}
