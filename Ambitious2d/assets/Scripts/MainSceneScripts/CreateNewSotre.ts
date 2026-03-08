import { _decorator, Component, EditBox, Label, Node, ToggleContainer } from 'cc';
import { SimpleAllStoreGoodsDict, StoreLocationConfig, StoreLocationList, StoreTypeConfig, StoreTypeList } from '../DataCollection';
import { TopManager } from '../TopManager';
import { HomeNodeScript } from './HomeNodeScript';
const { ccclass, property } = _decorator;

@ccclass('CreateNewStore')
export class CreateNewStore extends Component {
    @property(EditBox)
    public storeNameInput: EditBox = null;      // 店铺名称输入框

    @property(ToggleContainer)
    public storeTypeToggle: ToggleContainer = null;  // 店铺类型选择

    @property(Label)
    public storeTypeLabel: Label = null;        // 店铺类型显示

    @property(ToggleContainer)
    public storeLocationToggle: ToggleContainer = null;  // 店面位置选择

    @property(Label)
    public storeLocationLabel: Label = null;    // 店面位置显示

    @property(Label)
    public tipLabel: Label = null;             // 提示信息

    @property(Node)
    public createBtn: Node = null;              // 创建按钮

    @property(Node)
    public homeNode: Node = null;              // 家园节点（用于关闭新店面板）

    private selectedStoreConfig: StoreTypeConfig = StoreTypeList[0];  // 当前选择的店铺类型配置
    private selectedLocationConfig: StoreLocationConfig = StoreLocationList[0];  // 当前选择的店面位置配置

    start() {
        this.initStoreTypeOptions();
        this.initStoreLocationOptions();

        // 绑定创建按钮点击事件
        if (this.createBtn) {
            this.createBtn.on('click', this.confirmCreate, this);
        }
    }

    update(deltaTime: number) {

    }

    // 初始化店铺类型选项
    initStoreTypeOptions() {
        if (this.storeTypeToggle && this.storeTypeToggle.toggleItems) {
            const toggles = this.storeTypeToggle.toggleItems;
            for (let i = 0; i < toggles.length && i < StoreTypeList.length; i++) {
                const toggle = toggles[i];
                const storeConfig = StoreTypeList[i];
                const labelNode = toggle.node.getChildByName("Label");
                if (labelNode) {
                    const label = labelNode.getComponent(Label);
                    if (label) {
                        label.string = `${storeConfig.name} (${storeConfig.cost}金币)`;
                    }
                }
                // 监听点击事件
                toggle.node.on('toggle', () => {
                    if (toggle.isChecked) {
                        this.selectedStoreConfig = StoreTypeList[i];
                        this.onStoreTypeChanged();
                    }
                }, this);
            }
        }
        // 默认选择第一个
        if (this.storeTypeToggle && this.storeTypeToggle.toggleItems && this.storeTypeToggle.toggleItems.length > 0) {
            this.storeTypeToggle.toggleItems[0].isChecked = true;
            this.selectedStoreConfig = StoreTypeList[0];
            this.onStoreTypeChanged();
        }
    }

    // 初始化店面位置选项
    initStoreLocationOptions() {
        if (this.storeLocationToggle && this.storeLocationToggle.toggleItems) {
            const toggles = this.storeLocationToggle.toggleItems;
            for (let i = 0; i < toggles.length && i < StoreLocationList.length; i++) {
                const toggle = toggles[i];
                const locationConfig = StoreLocationList[i];
                const labelNode = toggle.node.getChildByName("Label");
                if (labelNode) {
                    const label = labelNode.getComponent(Label);
                    if (label) {
                        label.string = `${locationConfig.name} (${locationConfig.rent}金币/月)`;
                    }
                }
                // 监听点击事件
                toggle.node.on('toggle', () => {
                    if (toggle.isChecked) {
                        this.selectedLocationConfig = StoreLocationList[i];
                        this.onStoreLocationChanged();
                    }
                }, this);
            }
        }
        // 默认选择第一个
        if (this.storeLocationToggle && this.storeLocationToggle.toggleItems && this.storeLocationToggle.toggleItems.length > 0) {
            this.storeLocationToggle.toggleItems[0].isChecked = true;
            this.selectedLocationConfig = StoreLocationList[0];
            this.onStoreLocationChanged();
        }
    }

    // 店铺类型改变时更新显示
    onStoreTypeChanged() {
        if (this.storeTypeLabel && this.selectedStoreConfig) {
            this.storeTypeLabel.string = `已选择: ${this.selectedStoreConfig.name}\n开店费用: ${this.selectedStoreConfig.cost}金币`;
        }
    }

    // 店面位置改变时更新显示
    onStoreLocationChanged() {
        if (this.storeLocationLabel && this.selectedLocationConfig) {
            this.storeLocationLabel.string = `已选择: ${this.selectedLocationConfig.name}\n月租: ${this.selectedLocationConfig.rent}金币\n面积: ${this.selectedLocationConfig.area}\n客流量: ${this.selectedLocationConfig.footTraffic}\n描述: ${this.selectedLocationConfig.description}`;
        }
    }

    // 创建店铺
    confirmCreate() {
        // 获取店铺名称
        const storeName = this.storeNameInput.string.trim();
        console.log("创建的店铺:", storeName);

        // 验证店铺名称
        if (!storeName) {
            this.showTip("请输入店铺名称！");
            return;
        }

        // 检查是否已存在同名店铺
        if (TopManager.Instance.MyStoreDict[storeName]) {
            this.showTip("该店铺名称已存在！");
            return;
        }

        // 使用选中店铺的开店费用
        const cost = this.selectedStoreConfig.cost;
        if (TopManager.Instance.Player.Money < cost) {
            this.showTip("金币不足，需要 " + cost + " 金币！");
            return;
        }

        // 扣除金币
        TopManager.Instance.Player.Money -= cost;

        // 根据店铺配置设置属性
        const defaultProps = this.getStoreDefaultProps();

        // 创建新店铺，使用店面位置的rent, area, footTraffic, maxShelves
        TopManager.Instance.addNewStore(
            storeName,
            this.selectedStoreConfig.name,
            defaultProps.storeLevel,
            defaultProps.cashRegisterLevel,
            this.selectedLocationConfig.rent,
            this.selectedLocationConfig.area,
            this.selectedLocationConfig.footTraffic,
            this.selectedLocationConfig.name,
            this.selectedLocationConfig.maxShelves
        );

        // 更新当前店铺名称
        TopManager.Instance.Player.currentStoreName = storeName;
        TopManager.Instance.CurrentStoreName = storeName;

        // 保存数据
        TopManager.Instance.localSave("player");

        this.showTip(`创建成功！\n店铺: ${storeName}\n类型: ${this.selectedStoreConfig.name}\n位置: ${this.selectedLocationConfig.name}\n最大货架: ${this.selectedLocationConfig.maxShelves}\n花费: ${cost}金币`);

        // 清空输入
        this.storeNameInput.string = "";

        // 关闭新店面板
        if (this.homeNode) {
            const homeScript = this.homeNode.getComponent(HomeNodeScript);
            if (homeScript) {
                homeScript.closeNewStorePanel();
            }
        }

        console.log(`创建新店铺: ${storeName}, 类型: ${this.selectedStoreConfig.name}, 位置: ${this.selectedLocationConfig.name}, 最大货架: ${this.selectedLocationConfig.maxShelves}, 费用: ${cost}`);
    }

    // 获取店铺默认属性（从 StoreTypeList 动态获取）
    private getStoreDefaultProps(): {
        storeLevel: number;
        cashRegisterLevel: number;
    } {
        return {
            storeLevel: 0,
            cashRegisterLevel: 0
        };
    }

    // 显示提示信息
    showTip(message: string) {
        if (this.tipLabel) {
            this.tipLabel.string = message;
            // 3秒后清空提示
            setTimeout(() => {
                if (this.tipLabel) {
                    this.tipLabel.string = "";
                }
            }, 3000);
        }
    }
}
