import { _decorator, Component, Node, Label } from 'cc';
import { SimpleAllStoreGoodsDict } from '../DataCollection';
const { ccclass, property } = _decorator;

@ccclass('UINodeScripts')
export class UINodeScripts extends Component {

    @property(Node)
    button1: Node = null!;

    @property(Node)
    button2: Node = null!;

    @property(Node)
    littleMarketNode: Node = null!;
    @property(Node)
    bigMarketNode: Node = null!;

    // 店铺类型按钮 (Button1-11)
    @property(Node)
    storeTypeButtons: Node[] = [];

    private isStoreTypeButtonsShown: boolean = false;

    start() {
        // 初始化时隐藏所有店铺类型按钮
        this.hideAllStoreTypeButtons();
    }

    update(deltaTime: number) {

    }

    enable_littleMarketNode() {
        this.littleMarketNode.active = true;
    }
    enable_bigMarketNode() {
        this.bigMarketNode.active = true;
    }
    disable_littleMarketNode() {
        this.littleMarketNode.active = false;
    }
    disable_bigMarketNode() {
        this.bigMarketNode.active = false;
    }

    // 隐藏所有店铺类型按钮
    hideAllStoreTypeButtons() {
        for (const button of this.storeTypeButtons) {
            if (button) {
                button.active = false;
            }
        }
        this.isStoreTypeButtonsShown = false;
    }

    // 显示店铺类型按钮
    showStoreTypeButtons() {
        const storeTypes = Object.keys(SimpleAllStoreGoodsDict);
        console.log("店铺类型数量:", storeTypes.length, storeTypes);

        for (let i = 0; i < this.storeTypeButtons.length; i++) {
            const button = this.storeTypeButtons[i];
            if (!button) continue;

            if (i < storeTypes.length) {
                // 设置按钮文字为店铺类型名称
                const label = button.getComponent(Label);
                if (label) {
                    label.string = storeTypes[i];
                }
                button.active = true;
            } else {
                button.active = false;
            }
        }
        this.isStoreTypeButtonsShown = true;
    }

    chooseGoodTypeButton() {
        if (this.isStoreTypeButtonsShown) {
            // 如果已显示，则隐藏
            this.hideAllStoreTypeButtons();
        } else {
            // 如果未显示，则显示
            this.showStoreTypeButtons();
        }
    }
}
