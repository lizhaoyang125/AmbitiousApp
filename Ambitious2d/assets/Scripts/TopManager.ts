import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopManager')
export class TopManager extends Component {
    private static _instance: TopManager;
    public MyStoreShelveDict: { [StoreName: string]: { StoreType: string; ShelveIndex: number[],CashRegisterLevel:number,StoreLevel:number } } = {};
    public ShelveGoodsDict: { [shelveIndex: number]: { GoodsType: string; number: number } } = {};
    public AllGoodsNumberDict: { [GoodsType: string]: number } = {};        //仓库存货
    @property(Array(SpriteFrame))
    public AvatarArray:SpriteFrame[] = [];  // 货架的图片
    private _ValueForTest:number=100;     //用于demo跨Scene通信的测试
    public ValueForTest2:number=200;      //用于demo跨Scene通信的测试

    public static get Instance() {
        if (!this._instance) {
            console.warn("TopManager instance is not initialized yet!");
        }
        return this._instance;
    }
    public static get ValueForTest(){ //用于demo跨Scene通信的测试
        return this._instance._ValueForTest;
    }
    public static set ValueForTest(value:number){ //用于demo跨Scene通信的测试
        this._instance._ValueForTest = value;
    }
    protected onLoad(): void {
        if (TopManager._instance === null || TopManager._instance === undefined) {
            TopManager._instance = this;
            this.initialData();
        } else {
            console.warn('TopManager is exist!');
            this.node.destroy();
            return;
        }
        console.log("TopManager is loaded!");
    }

    initialData() {
        this.MyStoreShelveDict = {
            "八一服装店": { StoreType: "服装店", ShelveIndex: [1, 2],CashRegisterLevel:0,StoreLevel:0 },
            "新华花店": { StoreType: "花店", ShelveIndex: [3],CashRegisterLevel:0,StoreLevel:0 },
        };
        this.ShelveGoodsDict = {
            1: { GoodsType: "便宜女装", number: 100 },
            2: { GoodsType: "便宜男装", number: 100 },
            3: { GoodsType: "便宜花束", number: 100 },
        };
        this.AllGoodsNumberDict = {     //仓库存货
            "便宜女装": 100,
            "便宜男装": 100,
            "一般男装": 100,
            "一般女装": 100,
            "昂贵男装": 100,
            "昂贵女装": 100,
            "便宜花束": 100,
            "一般花束": 100,
            "昂贵花束": 100,    
        };
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

    updateShelveData(id:number,GoodsType:string,number:number){
        this.ShelveGoodsDict[id] = { GoodsType: GoodsType, number: number };
        this.localStoreShelveGoodsDict();
        this.AllGoodsNumberDict[GoodsType] = number;
        this.localStoreAllGoodsNumberDict();
    }
    localStoreShelveGoodsDict(){    // 本地存储货架数据,货架以及货架上的商品数量
        localStorage.setItem("ShelveGoodsDict",JSON.stringify(this.ShelveGoodsDict));
    }
    localStoreMyStoreShelveDict(){    // 本地存储店铺数据,店铺名称以及货架编号
        localStorage.setItem("MyStoreShelveDict",JSON.stringify(this.MyStoreShelveDict));
    }
    localStoreAllGoodsNumberDict(){    // 本地存储所有商品数量,商品名称以及商品数量
        localStorage.setItem("AllGoodsNumberDict",JSON.stringify(this.AllGoodsNumberDict));
    }
    loadLocalData(){
        this.ShelveGoodsDict = JSON.parse(localStorage.getItem("ShelveGoodsDict"));
        this.MyStoreShelveDict = JSON.parse(localStorage.getItem("MyStoreShelveDict"));
        this.AllGoodsNumberDict = JSON.parse(localStorage.getItem("AllGoodsNumberDict"));
    }
}
