import { _decorator, Component, Label, Node, Prefab, instantiate, Vec3 } from 'cc';
import { ShelveScript } from './ShelveScript';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('StoreScript')
export class StoreScript extends Component {

    @property(Label)
    public TimeLabel:Label=null;
    public StoreName:string="";
    @property(Prefab)
    public ShelvePrefab:Prefab=null;
    public CurrentStore:{ StoreType: string; ShelveIndex: number[],CashRegisterLevel:number,StoreLevel:number } = null;
    public ShelveList: number[] = null;

    protected onLoad(): void {
        this.StoreName=TopManager.Instance.CurrentStoreName;
        this.CurrentStore=TopManager.Instance.MyStoreShelveDict[this.StoreName];
        this.ShelveList=this.CurrentStore.ShelveIndex;
        console.log(this.StoreName+"商店脚本开始运行onLoad");
    }

    start() {
        console.log(this.StoreName + "商店脚本开始运行");
        for (let index = 0; index < this.ShelveList.length; index++) {
            this.createShelvePrefab(100 * index, 0, this.ShelveList[index]);
        }

    }

    update(deltaTime: number) {
        this.TimeLabel.string=TopManager.Instance.GameTime;
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

}
