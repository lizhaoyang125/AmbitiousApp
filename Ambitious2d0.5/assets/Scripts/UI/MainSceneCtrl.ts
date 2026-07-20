import { _decorator, Component, Node, Label, Button } from 'cc';
import { GameState } from '../Game/GameState';
import { SaveManager } from '../Game/SaveManager';
import { NewStorePanelCtrl } from './NewStorePanelCtrl';

const { ccclass, property } = _decorator;

@ccclass('MainSceneCtrl')
export class MainSceneCtrl extends Component {

    // ==================== HUD 层级 ====================

    @property(Node)
    homeHUDLayer: Node = null;

    @property(Node)
    storeHUDLayer: Node = null;

    @property(Node)
    popupLayer: Node = null;

    // ==================== 顶部状态栏 ====================

    @property(Label)
    dayLabel: Label = null;

    @property(Label)
    timeLabel: Label = null;

    @property(Label)
    weatherLabel: Label = null;

    @property(Label)
    moneyLabel: Label = null;

    @property(Label)
    ratingLabel: Label = null;

    @property(Label)
    warehouseLabel: Label = null;

    // ==================== 按钮 ====================

    @property(Button)
    btnGoShop: Button = null;

    @property(Button)
    btnNewStore: Button = null;

    @property(Button)
    btnHome: Button = null;

    @property(Button)
    btnSpeed1: Button = null;

    @property(Button)
    btnSpeed2: Button = null;

    @property(Button)
    btnSpeed3: Button = null;

    // ==================== 面板 ====================

    @property(NewStorePanelCtrl)
    newStorePanel: NewStorePanelCtrl = null;

    // ==================== 运行时状态 ====================

    private _currentHUD: 'home' | 'store' = 'store';
    private _gameSpeed: number = 1;

    // ==================== 生命周期 ====================

    start() {
        // 加载存档
        SaveManager.load();

        // 确保弹窗层激活，否则所有弹窗都无法显示
        if (this.popupLayer) {
            this.popupLayer.active = true;
        }

        // 初始化 HUD：默认显示主界面（homeHUDLayer）
        this.updateTopBar();
        this.switchToHomeHUD();

        // 定时更新（模拟时间流逝）
        this.schedule(this.tickTime, 1.0);
    }

    // ==================== HUD 切换 ====================

    /**
     * 切换到店铺 HUD
     */
    public switchToStoreHUD() {
        this._currentHUD = 'store';
        if (this.homeHUDLayer) this.homeHUDLayer.active = false;
        if (this.storeHUDLayer) this.storeHUDLayer.active = true;
    }

    /**
     * 切换到 home HUD
     */
    public switchToHomeHUD() {
        this._currentHUD = 'home';
        if (this.storeHUDLayer) this.storeHUDLayer.active = false;
        if (this.homeHUDLayer) this.homeHUDLayer.active = true;
    }

    // ==================== 按钮回调 ====================

    public onBtnGoShopClick() {
        this.switchToStoreHUD();
    }

    public onBtnHomeClick() {
        this.switchToHomeHUD();
    }

    public onBtnNewStoreClick() {
        if (this.newStorePanel) {
            this.newStorePanel.open();
        }
    }

    public onBtnSpeed1Click() {
        this.setGameSpeed(1);
    }

    public onBtnSpeed2Click() {
        this.setGameSpeed(2);
    }

    public onBtnSpeed3Click() {
        this.setGameSpeed(3);
    }

    // ==================== 游戏速度 ====================

    private setGameSpeed(speed: number) {
        this._gameSpeed = speed;
        // TODO: 通知 TimeManager 调整速度
        console.log(`Game speed: ${speed}x`);
    }

    // ==================== 顶部状态栏更新 ====================

    /**
     * 更新所有顶部状态
     */
    public updateTopBar() {
        this.updateDay();
        this.updateTime();
        this.updateWeather();
        this.updateMoney();
        this.updateRating();
        this.updateWarehouse();
    }

    private updateDay() {
        if (!this.dayLabel) return;
        const day = GameState.instance.player.currentDay;
        const weekDay = GameState.instance.player.currentWeekDay;
        const weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const weekDayName = weekDayNames[weekDay - 1] || '周一';
        this.dayLabel.string = `Day ${day} - ${weekDayName}`;
    }

    private updateTime() {
        if (!this.timeLabel) return;
        const hour = Math.floor(GameState.instance.state.currentTime);
        const minute = Math.floor((GameState.instance.state.currentTime - hour) * 60);
        this.timeLabel.string = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    private updateWeather() {
        if (!this.weatherLabel) return;
        const weather = GameState.instance.state.weather;
        this.weatherLabel.string = weather === 'Sunny' ? '☀️' : '🌧️';
    }

    private updateMoney() {
        if (!this.moneyLabel) return;
        const money = GameState.instance.player.money;
        this.moneyLabel.string = `$${money.toLocaleString()}`;
    }

    private updateRating() {
        if (!this.ratingLabel) return;
        const currentStore = GameState.instance.currentStore;
        const rating = currentStore ? currentStore.rating : 0;
        this.ratingLabel.string = `⭐ ${(rating / 20).toFixed(1)}`;
    }

    private updateWarehouse() {
        if (!this.warehouseLabel) return;
        const currentStore = GameState.instance.currentStore;
        if (!currentStore) {
            this.warehouseLabel.string = '仓库: 0/0';
            return;
        }

        const warehouse = GameState.instance.getWarehouse(currentStore.id);
        if (warehouse) {
            this.warehouseLabel.string = `仓库: ${warehouse.used}/${warehouse.capacity}`;
        } else {
            this.warehouseLabel.string = `仓库: 0/${currentStore.warehouseCapacity}`;
        }
    }

    // ==================== 时间流逝 ====================

    private tickTime() {
        // 每 1 秒 = 游戏内 1 分钟
        const deltaHours = (this._gameSpeed * 1) / 60;
        GameState.instance.advanceTime(deltaHours);

        // 更新 UI
        this.updateTimeLabel();
    }

    private updateTimeLabel() {
        if (!this.timeLabel) return;
        const hour = Math.floor(GameState.instance.state.currentTime);
        const minute = Math.floor((GameState.instance.state.currentTime - hour) * 60);
        this.timeLabel.string = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
}
