import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 采购模式
 */
export type PurchaseMode = 'wholesale' | 'agent';

/**
 * 进货订单数据
 */
export interface PurchaseOrderData {
    id: string;              // 订单号
    time: number;            // 下单时间戳
    mode: PurchaseMode;      // 采购模式
    productName: string;     // 商品名称
    category: string;        // 品类
    quantity: number;        // 数量
    unitPrice: number;       // 单价
    totalPrice: number;      // 总金额
    warehouseUsage: number;  // 仓库容量占用
}

/**
 * 进货订单面板控制器
 * 展示进货订单列表，支持取消订单操作
 */
@ccclass('OrderPanelCtrl')
export class OrderPanelCtrl extends Component {
    @property(Node)
    closeBtn: Node = null;

    @property(Node)
    orderList: Node = null;  // 订单列表 ScrollView

    // 示例订单数据
    private _orders: PurchaseOrderData[] = [
        {
            id: '1001',
            time: Date.now() - 3600000,
            mode: 'wholesale',
            productName: '🍎 苹果',
            category: '生鲜',
            quantity: 100,
            unitPrice: 2.5,
            totalPrice: 250,
            warehouseUsage: 10,
        },
        {
            id: '1002',
            time: Date.now() - 7200000,
            mode: 'agent',
            productName: '👕 T恤',
            category: '服装',
            quantity: 500,
            unitPrice: 1.2,
            totalPrice: 600,
            warehouseUsage: 25,
        },
    ];

    start() {
        this.refreshOrderList();
    }

    /**
     * 刷新订单列表
     */
    refreshOrderList() {
        console.log('刷新订单列表，当前订单数量:', this._orders.length);
        // TODO: 根据数据动态生成订单卡片
    }

    /**
     * 取消订单
     * @param orderId 订单ID
     */
    cancelOrder(orderId: string) {
        const index = this._orders.findIndex(o => o.id === orderId);
        if (index === -1) {
            console.warn('订单不存在:', orderId);
            return;
        }

        const order = this._orders[index];
        // TODO: 确认取消，退还金币
        this._orders.splice(index, 1);
        console.log(`取消订单 ${order.id}`);
        this.refreshOrderList();
    }

    // ==================== 按钮回调 ====================
    onCloseClick() {
        this.node.active = false;
    }

    /**
     * 取消订单按钮回调
     * @param orderId 订单ID（通过 customEventData 传入）
     */
    onCancelOrderClick(orderId: string) {
        this.cancelOrder(orderId);
    }
}