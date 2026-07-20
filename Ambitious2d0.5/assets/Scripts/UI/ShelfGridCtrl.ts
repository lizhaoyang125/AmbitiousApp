import { _decorator, Component, Node, Prefab, instantiate, Layout } from 'cc';
import { GameState } from '../Game/GameState';
import { ShelfSlotCtrl } from './ShelfSlotCtrl';

const { ccclass, property } = _decorator;

@ccclass('ShelfGridCtrl')
export class ShelfGridCtrl extends Component {

    @property(Prefab)
    shelfSlotPrefab: Prefab = null;

    @property(Layout)
    layout: Layout = null;

    private _slots: ShelfSlotCtrl[] = [];

    start() {
        this.refreshShelves();
    }

    /**
     * 根据当前店铺刷新货架
     */
    public refreshShelves() {
        const store = GameState.instance.currentStore;
        if (!store) {
            console.warn('No current store');
            return;
        }

        // 清空现有货架
        this.clearShelves();

        // 根据店铺货架数量创建
        const shelfCount = store.maxShelves;
        for (let i = 0; i < shelfCount; i++) {
            this.createShelfSlot(i, store.id);
        }
    }

    /**
     * 清空货架
     */
    private clearShelves() {
        this._slots.forEach(slot => {
            if (slot && slot.node) {
                slot.node.destroy();
            }
        });
        this._slots = [];
        this.node.removeAllChildren();
    }

    /**
     * 创建单个货架
     */
    private createShelfSlot(index: number, storeId: string) {
        if (!this.shelfSlotPrefab) {
            console.error('ShelfSlot prefab not assigned');
            return;
        }

        const slotNode = instantiate(this.shelfSlotPrefab);
        this.node.addChild(slotNode);

        const slotCtrl = slotNode.getComponent(ShelfSlotCtrl);
        if (slotCtrl) {
            slotCtrl.init(index, storeId);
            this._slots.push(slotCtrl);
        }
    }

    /**
     * 刷新所有货架显示
     */
    public refreshAllSlots() {
        this._slots.forEach(slot => {
            if (slot) {
                slot.refresh();
            }
        });
    }
}
