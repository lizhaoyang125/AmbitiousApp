import { _decorator, Component, Node, Label, Button, Sprite, Color } from 'cc';
import { GameState } from '../Game/GameState';
import { getItemById } from '../Data/ProductConfig';
import { IStoreData, IShelfSlot } from '../Data/DataInterfaces';

const { ccclass, property } = _decorator;

@ccclass('ShelfSlotCtrl')
export class ShelfSlotCtrl extends Component {

    @property(Label)
    iconLabel: Label = null;

    @property(Label)
    nameLabel: Label = null;

    @property(Label)
    priceLabel: Label = null;

    @property(Label)
    stockLabel: Label = null;

    @property(Sprite)
    background: Sprite = null;

    @property(Button)
    button: Button = null;

    private _shelfIndex: number = -1;
    private _storeId: string = '';

    /**
     * 初始化货架
     */
    public init(shelfIndex: number, storeId: string) {
        this._shelfIndex = shelfIndex;
        this._storeId = storeId;
        this.refresh();
    }

    /**
     * 刷新显示
     */
    public refresh() {
        const store = GameState.instance.stores[this._storeId];
        if (!store) return;

        const slot = store.shelves[this._shelfIndex];

        if (slot) {
            // 有商品
            if (this.iconLabel) this.iconLabel.string = slot.icon;
            if (this.nameLabel) this.nameLabel.string = slot.itemName;
            if (this.priceLabel) this.priceLabel.string = `¥${slot.baseSellPrice}`;
            if (this.stockLabel) this.stockLabel.string = `库存:${slot.stock}`;

            if (this.background) {
                this.background.color = slot.stock > 0
                    ? new Color(61, 43, 30, 255)
                    : new Color(100, 50, 50, 255);
            }
        } else {
            // 空货架
            if (this.iconLabel) this.iconLabel.string = '📦';
            if (this.nameLabel) this.nameLabel.string = '空货架';
            if (this.priceLabel) this.priceLabel.string = '';
            if (this.stockLabel) this.stockLabel.string = '';

            if (this.background) {
                this.background.color = new Color(61, 43, 30, 255);
            }
        }
    }

    /**
     * 点击回调
     */
    public onClick() {
        const store = GameState.instance.stores[this._storeId];
        if (!store) return;

        const slot = store.shelves[this._shelfIndex];

        if (slot) {
            // TODO: 打开商品详情/移除面板
            console.log(`Shelf ${this._shelfIndex} clicked: ${slot.itemName}`);
        } else {
            // TODO: 打开商品选择面板
            console.log(`Shelf ${this._shelfIndex} clicked: empty`);
        }
    }
}
