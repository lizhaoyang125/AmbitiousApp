import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 商店类型
 */
export type ShopType = 'convenience' | 'supermarket' | 'restaurant' | 'cafe' | 'clothing' | 'electronics' | 'pharmacy';

/**
 * 商店数据
 */
export interface ShopData {
    id: string;              // 商店ID
    name: string;            // 商店名称
    type: ShopType;         // 商店类型
    location: string;        // 位置描述
    size: number;            // 面积（m²）
    rent: number;            // 周租金
    staffCost: number;       // 人力成本/周
    shelveCount: number;     // 货架数量
    profit: number;          // 周利润
    isClosed: boolean;      // 是否关店
}

/**
 * 商店类型名称映射
 */
const SHOP_TYPE_NAMES: Record<ShopType, string> = {
    convenience: '便利店',
    supermarket: '超市',
    restaurant: '餐厅',
    cafe: '咖啡店',
    clothing: '服装店',
    electronics: '电器店',
    pharmacy: '药店',
};

/**
 * 产业管理面板控制器
 * 展示商店列表，支持关店/开店操作
 */
@ccclass('IndustryPanelCtrl')
export class IndustryPanelCtrl extends Component {
    @property(Node)
    closeBtn: Node = null;

    @property(Node)
    shopList: Node = null;  // 商店列表 ScrollView

    // 示例商店数据
    private _shops: ShopData[] = [
        {
            id: 'shop-001',
            name: '中心便利店',
            type: 'convenience',
            location: '商业中心A区',
            size: 120,
            rent: 500,
            staffCost: 200,
            shelveCount: 10,
            profit: 800,
            isClosed: false,
        },
        {
            id: 'shop-002',
            name: '美食餐厅',
            type: 'restaurant',
            location: '美食街B段',
            size: 200,
            rent: 800,
            staffCost: 400,
            shelveCount: 5,
            profit: 1200,
            isClosed: false,
        },
        {
            id: 'shop-003',
            name: '时尚服装店',
            type: 'clothing',
            location: '购物广场C层',
            size: 150,
            rent: 600,
            staffCost: 300,
            shelveCount: 8,
            profit: 950,
            isClosed: true,
        },
    ];

    start() {
        this.refreshShopList();
    }

    /**
     * 刷新商店列表
     */
    refreshShopList() {
        console.log('刷新商店列表，当前商店数量:', this._shops.length);
        // TODO: 根据数据动态生成商店卡片
    }

    /**
     * 获取商店类型名称
     * @param type 商店类型
     */
    getShopTypeName(type: ShopType): string {
        return SHOP_TYPE_NAMES[type] || type;
    }

    /**
     * 关店
     * @param shopId 商店ID
     */
    closeShop(shopId: string) {
        const shop = this._shops.find(s => s.id === shopId);
        if (!shop) {
            console.warn('商店不存在:', shopId);
            return;
        }

        shop.isClosed = true;
        console.log(`关店 ${shop.name}`);
        this.refreshShopList();
    }

    /**
     * 开店
     * @param shopId 商店ID
     */
    openShop(shopId: string) {
        const shop = this._shops.find(s => s.id === shopId);
        if (!shop) {
            console.warn('商店不存在:', shopId);
            return;
        }

        shop.isClosed = false;
        console.log(`开店 ${shop.name}`);
        this.refreshShopList();
    }

    /**
     * 获取净利润（利润 - 租金 - 人力成本）
     * @param shop 商店数据
     */
    getNetProfit(shop: ShopData): number {
        return shop.profit - shop.rent - shop.staffCost;
    }

    // ==================== 按钮回调 ====================
    onCloseClick() {
        this.node.active = false;
    }

    /**
     * 关店/开店按钮回调
     * @param shopId 商店ID（通过 customEventData 传入）
     */
    onToggleShopClick(shopId: string) {
        const shop = this._shops.find(s => s.id === shopId);
        if (!shop) return;

        if (shop.isClosed) {
            this.openShop(shopId);
        } else {
            this.closeShop(shopId);
        }
    }
}
