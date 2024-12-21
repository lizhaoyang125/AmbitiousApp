import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopManager')
export class TopManager extends Component {
    private static _instance: TopManager;
    public MyStoresDict: { [StoreName: string]: { StoreType: string; ShelveIndex: number[] } } = {};
    public ShelveIndexDict: { [shelveIndex: number]: { GoodsType: string; number: number } } = {};

    public static get Instance() {
        if (!this._instance) {
            console.warn("TopManager instance is not initialized yet!");
        }
        return this._instance;
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
        this.MyStoresDict = {
            "八一服装店": { StoreType: "服装店", ShelveIndex: [1, 2] },
            "新华花店": { StoreType: "花店", ShelveIndex: [3] },
        };
        this.ShelveIndexDict = {
            1: { GoodsType: "便宜女装", number: 100 },
            2: { GoodsType: "便宜男装", number: 100 },
            3: { GoodsType: "便宜花束", number: 100 },
            10000: { GoodsType: "便宜女装", number: 100 },      //仓库货架
            10001: { GoodsType: "便宜男装", number: 100 },
            10002: { GoodsType: "便宜花束", number: 100 },
        };
    }
    updateGoodsData(id:number,GoodsType:string,number:number){
        this.ShelveIndexDict[id] = { GoodsType: GoodsType, number: number };
        this.localStoreShelveIndexDict(id,GoodsType,number);
    }
    localStoreShelveIndexDict(id:number,GoodsType:string,number:number){
        localStorage.setItem("ShelveIndexDict",JSON.stringify(this.ShelveIndexDict));
    }
    localMyStoresDict(id:number,GoodsType:string,number:number){
        localStorage.setItem("MyStoresDict",JSON.stringify(this.MyStoresDict));
    }
    loadLocalData(){
        this.ShelveIndexDict = JSON.parse(localStorage.getItem("ShelveIndexDict"));
        this.MyStoresDict = JSON.parse(localStorage.getItem("MyStoresDict"));
    }
}
