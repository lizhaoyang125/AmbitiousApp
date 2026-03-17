import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { SimpleAllStoreGoodsDict } from '../DataCollection';
import { BuyItemNodeScripts } from '../../Prefabs/MapScenePrefabs/BuyItemNodeScripts';
const { ccclass, property } = _decorator;

@ccclass('LittleMarketScripts')
export class LittleMarketScripts extends Component {
    @property(Prefab)
    buyItemNodePrefab: Prefab = null;

    @property(Node)
    contentNode: Node = null; // 商品列表的容器节点

    public storeType: string = "";

    start() {
        this.storeType = "服装店";
        this.spawnBuyItems(this.storeType);
    }

    // 根据店铺类型生成商品列表
    spawnBuyItems(storeType: string) {
        if (!this.buyItemNodePrefab || !this.contentNode) {
            console.error("请设置 buyItemNodePrefab 和 contentNode");
            return;
        }

        // 获取该店铺类型的商品列表
        const goodsList = SimpleAllStoreGoodsDict[storeType];
        if (!goodsList || goodsList.length === 0) {
            console.error("没有找到商品列表:", storeType);
            return;
        }

        console.log("生成商品列表，店铺类型:", storeType, "商品数量:", goodsList.length);

        // 为每个商品类型实例化一个购买节点
        for (let i = 0; i < goodsList.length; i++) {
            const goodsType = goodsList[i];
            const itemNode = instantiate(this.buyItemNodePrefab);
            itemNode.parent = this.contentNode;

            // 设置位置，每个商品间隔50像素（Y轴负方向）
            const yOffset = -i * 50;
            itemNode.setPosition(new Vec3(-60, yOffset, 0));

            // 设置商品购买节点的商品类型
            const buyItemScript = itemNode.getComponent(BuyItemNodeScripts);
            if (buyItemScript) {
                buyItemScript.goodsType = goodsType;
                buyItemScript.initItemInfo();
            } else {
                console.error("BuyItemNodeScripts 组件未找到");
            }

            console.log("生成商品:", goodsType, "位置:", yOffset);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_deltaTime: number) {

    }
}
