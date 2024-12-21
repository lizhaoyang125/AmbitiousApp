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
        };
    }
}
