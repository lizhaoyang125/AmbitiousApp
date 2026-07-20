import { _decorator, Component, Node, EditBox, Label, Button, director } from 'cc';
import { GameState } from '../Game/GameState';
import { SaveManager } from '../Game/SaveManager';
import { drawRandomTraits, getTraitTemplate, ITraitTemplate } from '../Data/TalentConfig';

const { ccclass, property } = _decorator;

@ccclass('StartSceneCtrl')
export class StartSceneCtrl extends Component {

    // ==================== 属性绑定 ====================

    @property(Node)
    menuPanel: Node = null;

    @property(Node)
    playerInitPanel: Node = null;

    @property(EditBox)
    nameEditBox: EditBox = null;

    @property(Label)
    traitLabel: Label = null;

    @property(Button)
    btnStartGame: Button = null;

    @property(Button)
    btnRandomTrait: Button = null;

    @property(Button)
    btnContinue: Button = null;

    // ==================== 运行时状态 ====================

    private _currentTraits: ITraitTemplate[] = [];
    private _selectedTrait: ITraitTemplate | null = null;

    // ==================== 生命周期 ====================

    start() {
        // 确保 PlayerInitPanel 默认隐藏
        if (this.playerInitPanel) {
            this.playerInitPanel.active = false;
        }

        // 检查是否有存档，决定"继续游戏"按钮状态
        this.updateContinueButton();

        // 绑定 EditBox 事件
        if (this.nameEditBox) {
            this.nameEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onNameChanged, this);
            this.nameEditBox.node.on(EditBox.EventType.EDITING_RETURN, this.onNameReturn, this);
        }

        // 初始生成特性
        this.generateRandomTraits();
    }

    onDestroy() {
        if (this.nameEditBox) {
            this.nameEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onNameChanged, this);
            this.nameEditBox.node.off(EditBox.EventType.EDITING_RETURN, this.onNameReturn, this);
        }
    }

    // ==================== 菜单按钮回调 ====================

    onBtnNewGameClick() {
        // 隐藏菜单，显示 PlayerInitPanel
        if (this.menuPanel) {
            this.menuPanel.active = false;
        }
        if (this.playerInitPanel) {
            this.playerInitPanel.active = true;
        }

        // 重置输入状态
        if (this.nameEditBox) {
            this.nameEditBox.string = '';
        }
        this._selectedTrait = null;
        this.updateStartButtonState();
        this.updateTraitDisplay();
    }

    onBtnContinueClick() {
        if (!SaveManager.hasSave()) {
            this.showToast('没有找到存档');
            return;
        }

        const loaded = SaveManager.load();
        if (loaded) {
            this.showToast(`继续游戏\n玩家: ${GameState.instance.player.name}\n第 ${GameState.instance.player.currentDay} 天`);
            this.scheduleOnce(() => {
                director.loadScene('MainScene');
            }, 0.8);
        } else {
            this.showToast('存档读取失败');
        }
    }

    onBtnAchievementClick() {
        // TODO: 成就界面（暂空）
        this.showToast('成就系统\n(暂未实现)');
    }

    onBtnSettingsClick() {
        // TODO: 设置界面（暂空）
        this.showToast('设置面板\n(暂未实现)');
    }

    onBtnQuitClick() {
        // TODO: 退出游戏（暂空）
        this.showToast('退出游戏\n(Web 构建下不可用)');
    }

    // ==================== PlayerInitPanel 按钮回调 ====================

    onBtnBackClick() {
        // 隐藏 PlayerInitPanel，显示菜单
        if (this.playerInitPanel) {
            this.playerInitPanel.active = false;
        }
        if (this.menuPanel) {
            this.menuPanel.active = true;
        }
    }

    onBtnRandomTraitClick() {
        this.generateRandomTraits();
        this.updateTraitDisplay();
        this.updateStartButtonState();
    }

    onBtnStartGameClick() {
        const playerName = this.nameEditBox ? this.nameEditBox.string.trim() : '';

        if (playerName.length === 0) {
            this.showToast('请输入你的名字');
            return;
        }

        if (!this._selectedTrait) {
            this.showToast('请选择一个特性');
            return;
        }

        // 初始化新游戏状态
        this.initNewGame(playerName, this._selectedTrait);

        // 保存并跳转
        SaveManager.save();
        this.showToast(`游戏开始！\n玩家: ${playerName}\n特性: ${this._selectedTrait.name}`);

        this.scheduleOnce(() => {
            director.loadScene('MainScene');
        }, 0.8);
    }

    // ==================== EditBox 事件 ====================

    private onNameChanged() {
        this.updateStartButtonState();
    }

    private onNameReturn() {
        if (this.btnStartGame && this.btnStartGame.interactable) {
            this.onBtnStartGameClick();
        }
    }

    // ==================== 私有方法 ====================

    /**
     * 更新"继续游戏"按钮状态
     */
    private updateContinueButton() {
        if (!this.btnContinue) return;

        const hasSave = SaveManager.hasSave();
        this.btnContinue.interactable = hasSave;

        // 可以在这里加视觉提示，比如半透明
        const sprite = this.btnContinue.getComponent('cc.Sprite') as any;
        if (sprite) {
            sprite.color = hasSave ? sprite.color.clone().setA(255) : sprite.color.clone().setA(128);
        }
    }

    /**
     * 更新"开始游戏"按钮状态
     */
    private updateStartButtonState() {
        if (!this.btnStartGame) return;

        const hasName = this.nameEditBox && this.nameEditBox.string.trim().length > 0;
        const hasTrait = this._selectedTrait !== null;
        this.btnStartGame.interactable = hasName && hasTrait;
    }

    /**
     * 随机生成 3 个特性供选择
     */
    private generateRandomTraits() {
        this._currentTraits = drawRandomTraits(3);
        // 默认选中第一个
        this._selectedTrait = this._currentTraits.length > 0 ? this._currentTraits[0] : null;
    }

    /**
     * 更新特性显示
     */
    private updateTraitDisplay() {
        if (!this.traitLabel) return;

        if (this._currentTraits.length === 0) {
            this.traitLabel.string = '特性生成失败';
            return;
        }

        const lines = this._currentTraits.map((trait, index) => {
            const marker = this._selectedTrait === trait ? '▶' : ' ';
            return `${marker} ${trait.name} (${this.getRarityLabel(trait.rarity)})\n   ${trait.description}`;
        });

        this.traitLabel.string = lines.join('\n\n');
    }

    /**
     * 获取稀有度中文标签
     */
    private getRarityLabel(rarity: string): string {
        const labels: Record<string, string> = {
            common: '普通',
            rare: '稀有',
            epic: '史诗',
            legendary: '传说',
        };
        return labels[rarity] || rarity;
    }

    /**
     * 初始化新游戏状态
     */
    private initNewGame(playerName: string, trait: ITraitTemplate) {
        const gameState = GameState.instance;
        const player = gameState.player;

        // 重置玩家数据
        player.name = playerName;
        player.traits = [trait.id];
        player.money = trait.effectType === 'money_add' ? trait.effectValue : 10000;
        player.currentDay = 1;
        player.currentWeek = 1;
        player.currentWeekDay = 1;
        player.totalEarnings = 0;

        // TODO: 应用特性效果（如初始资金、仓库容量等）
        console.log(`New game started: ${playerName}, trait: ${trait.name}`);
    }

    /**
     * 显示提示（简单实现，后续可替换为 UI 弹窗）
     */
    private showToast(message: string) {
        console.log(`[Toast] ${message}`);
        // TODO: 实现真正的 Toast UI
    }
}
