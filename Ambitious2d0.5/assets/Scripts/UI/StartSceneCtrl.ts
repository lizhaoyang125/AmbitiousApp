import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('StartSceneCtrl')
export class StartSceneCtrl extends Component {

    @property(Node)
    playerInitPanel: Node = null;

    start() {
        // 确保 PlayerInitPanel 默认隐藏
        if (this.playerInitPanel) {
            this.playerInitPanel.active = false;
        }
    }

    // ==================== 菜单按钮回调 ====================
    onBtnNewGameClick() {
        // 显示 PlayerInitPanel
        if (this.playerInitPanel) {
            this.playerInitPanel.active = true;
        }
    }

    onBtnContinueClick() {
        // 继续游戏（暂空）
    }

    onBtnAchievementClick() {
        // 成就界面（暂空）
    }

    onBtnSettingsClick() {
        // 设置界面（暂空）
    }

    onBtnQuitClick() {
        // 退出游戏（暂空）
    }

    // ==================== PlayerInitPanel 按钮回调 ====================
    onBtnRandomTraitClick() {
        // 随机选择特性（暂空）
    }

    onBtnStartGameClick() {
        // 切换到 MainScene
        // TODO: 实现场景切换
    }
}
