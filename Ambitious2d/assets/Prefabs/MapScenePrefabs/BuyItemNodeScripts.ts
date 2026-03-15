import { _decorator, Button, Component, director, EditBox, Label, Node, Sprite } from 'cc';
import { GoodsFrameDict } from '../../Scripts/DataCollection';
import { TopManager } from '../../Scripts/TopManager';
const { ccclass, property } = _decorator;

@ccclass('BuyItemNodeScripts')
export class BuyItemNodeScripts extends Component {
    @property(Node)
    itemNode: Node = null;
    @property(Label)
    nameLabel: Label = null;
    @property(Label)
    priceLabel: Label = null;
    @property(Sprite)
    iconSprite: Sprite = null;
    @property(EditBox)
    numberEditBox: EditBox = null;
    @property(Button)
    buyBtn: Button = null;

    public goodsType: string = "";

    start() {
        this.goodsType = "便宜男装";
        this.initItemInfo();
    }

    // 初始化商品信息
    initItemInfo() {
        if (!this.goodsType || !TopManager.Instance) return;

        const goodsConfig = TopManager.Instance.marketGoodsConfigDict[this.goodsType];
        if (!goodsConfig) {
            console.error("商品配置不存在:", this.goodsType);
            return;
        }

        // 设置商品名称
        if (this.nameLabel) {
            this.nameLabel.string = goodsConfig.name;
        }

        // 设置商品价格
        if (this.priceLabel) {
            this.priceLabel.string = goodsConfig.price.toString();
        }

        // 设置商品图标
        if (this.iconSprite && TopManager.Instance.AvatarArray) {
            const frameIndex = GoodsFrameDict[this.goodsType];
            if (frameIndex !== undefined && TopManager.Instance.AvatarArray[frameIndex]) {
                this.iconSprite.spriteFrame = TopManager.Instance.AvatarArray[frameIndex];
            } else {
                console.error("商品图标不存在:", this.goodsType, frameIndex);
            }
        }
    }

    update(deltaTime: number) {

    }
    buyGoods() {
        if (!this.goodsType || !TopManager.Instance) return;

        const topManager = TopManager.Instance;
        const goodsConfig = topManager.marketGoodsConfigDict[this.goodsType];
        if (!goodsConfig) {
            console.error("商品配置不存在:", this.goodsType);
            return;
        }

        // 获取购买数量
        let buyNumber = 1;
        if (this.numberEditBox && this.numberEditBox.string) {
            const parsed = parseInt(this.numberEditBox.string);
            if (!isNaN(parsed) && parsed > 0) {
                buyNumber = parsed;
            }
        }

        // 计算总价
        const totalPrice = goodsConfig.price * buyNumber;
        const player = topManager.Player;

        // 检查玩家资金是否足够
        if (player.Money < totalPrice) {
            console.error("资金不足！需要:", totalPrice, "当前:", player.Money);
            return;
        }

        // 扣除玩家资金
        player.Money -= totalPrice;
        console.log("购买商品:", this.goodsType, "数量:", buyNumber, "总价:", totalPrice, "剩余资金:", player.Money);

        // 更新仓库库存
        const warehouseGood = topManager.AllWarehouseGoodsDict[this.goodsType];
        const purchaseCost = goodsConfig.price * 0.8; // 进货成本为售价的80%

        if (!warehouseGood) {
            // 如果仓库中不存在该商品，初始化
            topManager.AllWarehouseGoodsDict[this.goodsType] = {
                LeftNumber: buyNumber,
                Price: goodsConfig.price,
                Popularity: goodsConfig.Popularity,
                Cost: purchaseCost
            };
        } else {
            // 计算加权平均成本
            const oldNumber = warehouseGood.LeftNumber;
            const oldCost = warehouseGood.Cost;
            const newNumber = buyNumber;
            const newCost = purchaseCost;

            // 加权平均成本 = (旧库存×旧成本 + 新数量×新成本) / (旧库存 + 新数量)
            const avgCost = (oldNumber * oldCost + newNumber * newCost) / (oldNumber + newNumber);

            warehouseGood.LeftNumber += buyNumber;
            warehouseGood.Cost = avgCost;
        }

        // 保存数据
        topManager.saveLocalData();

        console.log("购买成功！仓库剩余:", topManager.AllWarehouseGoodsDict[this.goodsType].LeftNumber);
    }
}
