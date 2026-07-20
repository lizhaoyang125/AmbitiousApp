import { _decorator, Component, Node, Label, Button, instantiate, Prefab, UITransform, Sprite, Color, Toggle, ToggleContainer } from 'cc';
import { GameState } from '../Game/GameState';
import {
    STORE_TYPE_CONFIG,
    STORE_AREA_CONFIG,
    STORE_LOCATION_CONFIG,
} from '../Data/StoreConfig';
import {
    StoreType,
    StoreAreaType,
    StoreLocationType,
    IStoreData,
} from '../Data/DataInterfaces';
import { OptionCard, IOptionCardData } from './OptionCard';

const { ccclass, property } = _decorator;

@ccclass('NewStorePanelCtrl')
export class NewStorePanelCtrl extends Component {

    // ==================== 属性绑定 ====================

    @property(Node)
    mask: Node = null;

    @property(Node)
    panel: Node = null;

    @property(Label)
    titleLabel: Label = null;

    @property(Label)
    stepIndicatorLabel: Label = null;

    @property(Node)
    contentArea: Node = null;

    @property(Node)
    step1Type: Node = null;

    @property(Node)
    step2Area: Node = null;

    @property(Node)
    step3Location: Node = null;

    @property(Node)
    step4Confirm: Node = null;

    @property(Label)
    confirmInfoLabel: Label = null;

    @property(Button)
    btnBack: Button = null;

    @property(Button)
    btnNext: Button = null;

    @property(Button)
    btnClose: Button = null;

    @property(Prefab)
    optionCardPrefab: Prefab = null;

    // ==================== 运行时状态 ====================

    private _currentStep: number = 1;
    private _selectedType: StoreType | null = null;
    private _selectedArea: StoreAreaType | null = null;
    private _selectedLocation: StoreLocationType | null = null;
    private _storeName: string = '';

    // ==================== 生命周期 ====================

    start() {
        this.showStep(1);
        this.updateActionButtons();
    }

    // ==================== 公开方法 ====================

    /**
     * 打开面板
     */
    public open() {
        this.node.active = true;
        this.resetWizard();
    }

    /**
     * 关闭面板
     */
    public close() {
        this.node.active = false;
    }

    // ==================== 按钮回调 ====================

    public onBtnCloseClick() {
        this.close();
    }

    public onBtnBackClick() {
        if (this._currentStep > 1) {
            this.showStep(this._currentStep - 1);
        }
    }

    public onBtnNextClick() {
        if (this._currentStep < 4) {
            this.showStep(this._currentStep + 1);
        } else {
            this.confirmNewStore();
        }
    }

    // ==================== 私有方法 ====================

    /**
     * 重置向导状态
     */
    private resetWizard() {
        this._currentStep = 1;
        this._selectedType = null;
        this._selectedArea = null;
        this._selectedLocation = null;
        this._storeName = `新店_${Date.now()}`;
        this.showStep(1);
    }

    /**
     * 显示指定步骤
     */
    private showStep(step: number) {
        this._currentStep = step;

        // 隐藏所有步骤和标题
        this.setStepVisible(this.step1Type, false);
        this.setStepVisible(this.step2Area, false);
        this.setStepVisible(this.step3Location, false);
        this.setStepVisible(this.step4Confirm, false);

        // 显示当前步骤
        switch (step) {
            case 1:
                this.setStepVisible(this.step1Type, true);
                this.renderTypeOptions();
                break;
            case 2:
                this.setStepVisible(this.step2Area, true);
                this.renderAreaOptions();
                break;
            case 3:
                this.setStepVisible(this.step3Location, true);
                this.renderLocationOptions();
                break;
            case 4:
                this.setStepVisible(this.step4Confirm, true);
                this.renderConfirmInfo();
                break;
        }

        this.updateStepIndicator();
        this.updateActionButtons();
    }

    /**
     * 设置步骤节点可见性
     */
    private setStepVisible(stepNode: Node | null, visible: boolean) {
        if (!stepNode) return;
        stepNode.active = visible;
    }

    /**
     * 更新步骤指示器
     */
    private updateStepIndicator() {
        if (this.stepIndicatorLabel) {
            this.stepIndicatorLabel.string = `步骤 ${this._currentStep}/4`;
        }
    }

    /**
     * 更新操作按钮状态
     */
    private updateActionButtons() {
        if (this.btnBack) {
            this.btnBack.interactable = this._currentStep > 1;
        }

        if (this.btnNext) {
            let canNext = false;
            switch (this._currentStep) {
                case 1: canNext = this._selectedType !== null; break;
                case 2: canNext = this._selectedArea !== null; break;
                case 3: canNext = this._selectedLocation !== null; break;
                case 4: canNext = true; break;
            }
            this.btnNext.interactable = canNext;

            const label = this.btnNext.getComponentInChildren(Label);
            if (label) {
                label.string = this._currentStep === 4 ? '确认开店' : '下一步';
            }
        }
    }

    /**
     * 渲染店铺类型选项
     */
    private renderTypeOptions() {
        const grid = this.step1Type?.getChildByName('OptionGrid');
        if (!grid) return;

        this.clearGrid(grid);

        const options: IOptionCardData[] = Object.entries(STORE_TYPE_CONFIG).map(([key, config]) => ({
            id: key,
            icon: config.icon,
            name: config.label,
            desc: config.desc,
            selected: this._selectedType === key,
        }));

        this.createOptionCards(grid, options, (id) => {
            this._selectedType = id as StoreType;
            this.showStep(2);
        });
    }

    /**
     * 渲染面积选项
     */
    private renderAreaOptions() {
        const grid = this.step2Area?.getChildByName('OptionGrid');
        if (!grid) return;

        this.clearGrid(grid);

        const options: IOptionCardData[] = Object.entries(STORE_AREA_CONFIG).map(([key, config]) => ({
            id: key,
            icon: '📐',
            name: config.label,
            desc: `货架:${config.maxShelves} 员工:${config.maxEmployees} 仓库:${config.warehouseCapacity}`,
            selected: this._selectedArea === key,
        }));

        this.createOptionCards(grid, options, (id) => {
            this._selectedArea = id as StoreAreaType;
            this.showStep(3);
        });
    }

    /**
     * 渲染位置选项
     */
    private renderLocationOptions() {
        const grid = this.step3Location?.getChildByName('OptionGrid');
        if (!grid) return;

        this.clearGrid(grid);

        const options: IOptionCardData[] = Object.entries(STORE_LOCATION_CONFIG).map(([key, config]) => ({
            id: key,
            icon: '📍',
            name: config.label,
            desc: `人流:${config.baseFootTraffic}/天 租金:$${config.baseRent}`,
            selected: this._selectedLocation === key,
        }));

        this.createOptionCards(grid, options, (id) => {
            this._selectedLocation = id as StoreLocationType;
            this.showStep(4);
        });
    }

    /**
     * 渲染确认信息
     */
    private renderConfirmInfo() {
        if (!this.confirmInfoLabel || !this._selectedType || !this._selectedArea || !this._selectedLocation) {
            return;
        }

        const typeConfig = STORE_TYPE_CONFIG[this._selectedType];
        const areaConfig = STORE_AREA_CONFIG[this._selectedArea];
        const locationConfig = STORE_LOCATION_CONFIG[this._selectedLocation];

        const totalRent = areaConfig.baseRent + locationConfig.baseRent;
        const footTraffic = Math.floor(locationConfig.baseFootTraffic * areaConfig.trafficMultiplier);
        const playerMoney = GameState.instance.player.money;

        const info = [
            `店铺名称: ${this._storeName}`,
            `店铺类型: ${typeConfig.icon} ${typeConfig.label}`,
            `店铺面积: ${areaConfig.label}`,
            `店铺位置: ${locationConfig.label}`,
            `预计日租金: $${totalRent}`,
            `预计日人流: ${footTraffic}`,
            `仓库容量: ${areaConfig.warehouseCapacity}`,
            `最大员工数: ${areaConfig.maxEmployees}`,
            ``,
            `当前资金: $${playerMoney.toLocaleString()}`,
            `开店后资金: $${(playerMoney - totalRent).toLocaleString()}`,
        ];

        this.confirmInfoLabel.string = info.join('\n');
    }

    /**
     * 确认开店
     */
    private confirmNewStore() {
        if (!this._selectedType || !this._selectedArea || !this._selectedLocation) {
            console.error('Missing selection');
            return;
        }

        const areaConfig = STORE_AREA_CONFIG[this._selectedArea];
        const locationConfig = STORE_LOCATION_CONFIG[this._selectedLocation];
        const totalRent = areaConfig.baseRent + locationConfig.baseRent;

        // 检查资金
        if (!GameState.instance.spendMoney(totalRent)) {
            console.error('Not enough money');
            return;
        }

        // 创建店铺数据
        const storeId = `store_${Date.now()}`;
        const newStore: IStoreData = {
            id: storeId,
            name: this._storeName,
            type: this._selectedType,
            location: this._selectedLocation,
            dailyRent: totalRent,
            area: this._selectedArea,
            maxShelves: areaConfig.maxShelves,
            maxEmployees: areaConfig.maxEmployees,
            warehouseCapacity: areaConfig.warehouseCapacity,
            baseFootTraffic: Math.floor(locationConfig.baseFootTraffic * areaConfig.trafficMultiplier),
            footTrafficBonus: 0,
            satisfactionBonus: 0,
            rating: 0,
            ratingHistory: [],
            level: 1,
            upgradeCost: 2000,
            isUnlocked: true,
            isOwned: true,
            todayIncome: 0,
            todayExpense: totalRent,
            todayProfit: 0,
            dailyProfitHistory: [],
            shelves: new Array(areaConfig.maxShelves).fill(null),
        };

        // 添加到游戏状态
        GameState.instance.addStore(newStore);

        console.log(`New store created: ${newStore.name}`);
        this.close();
    }

    /**
     * 清空选项网格
     */
    private clearGrid(grid: Node) {
        grid.removeAllChildren();
    }

    /**
     * 创建选项卡片
     */
    private createOptionCards(grid: Node, options: IOptionCardData[], onSelect: (id: string) => void) {
        // 确保 grid 上有 ToggleContainer，用于单选管理
        let toggleContainer = grid.getComponent(ToggleContainer);
        if (!toggleContainer) {
            toggleContainer = grid.addComponent(ToggleContainer);
        }

        options.forEach(option => {
            const card = this.createOptionCard(option, onSelect);
            grid.addChild(card);
        });
    }

    /**
     * 创建单个选项卡片
     */
    private createOptionCard(data: IOptionCardData, onSelect: (id: string) => void): Node {
        // 创建卡片根节点
        const card = new Node(`OptionCard_${data.id}`);
        const transform = card.addComponent(UITransform);
        transform.setContentSize(240, 120);

        // 背景
        const bg = new Node('Background');
        bg.addComponent(UITransform).setContentSize(240, 120);
        const bgSprite = bg.addComponent(Sprite);
        bgSprite.color = data.selected ? new Color(100, 200, 100, 255) : new Color(240, 240, 240, 255);
        card.addChild(bg);

        // 图标
        const icon = new Node('Icon');
        icon.addComponent(UITransform).setContentSize(60, 60);
        icon.setPosition(-80, 0);
        const iconLabel = icon.addComponent(Label);
        iconLabel.string = data.icon;
        iconLabel.fontSize = 48;
        card.addChild(icon);

        // 名称
        const name = new Node('Name');
        name.addComponent(UITransform).setContentSize(140, 40);
        name.setPosition(40, 20);
        const nameLabel = name.addComponent(Label);
        nameLabel.string = data.name;
        nameLabel.fontSize = 24;
        nameLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
        card.addChild(name);

        // 描述
        const desc = new Node('Desc');
        desc.addComponent(UITransform).setContentSize(140, 40);
        desc.setPosition(40, -20);
        const descLabel = desc.addComponent(Label);
        descLabel.string = data.desc;
        descLabel.fontSize = 16;
        descLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
        card.addChild(desc);

        // 添加 Toggle 组件
        const toggle = card.addComponent(Toggle);
        toggle.target = card;

        // 添加 OptionCard 组件
        const optionCard = card.addComponent(OptionCard);
        optionCard.iconLabel = iconLabel;
        optionCard.nameLabel = nameLabel;
        optionCard.descLabel = descLabel;
        optionCard.background = bgSprite;
        optionCard.toggle = toggle;

        // 初始化
        optionCard.init(data, onSelect);

        return card;
    }
}
