import { _decorator, Component, Node, Prefab, instantiate, ProgressBar, director, AudioSource, Label } from 'cc';
import { level_up_panel, SKILL_POOL, Skill } from './level_up_panel';
import { player_sprite } from './player_sprite';
import { exp_gem } from './exp_gem';
const { ccclass, property } = _decorator;

// 全局游戏管理器实例
let _gameManager: game_manager | null = null;

@ccclass('game_manager')
export class game_manager extends Component {
    @property
    expToLevelUp: number = 10; // 升级所需经验

    @property(Prefab)
    expGemPrefab: Prefab = null; // 经验球预制体

    // 经验条 - 可在编辑器中拖入，或自动查找
    @property(ProgressBar)
    expBar: ProgressBar = null;
    @property(Node)
    gameOverNode: Node = null; // 游戏结束界面

    @property(Label)
    gameTimeLabel: Label = null; // 游戏时间 Label

    @property(Label)
    killCountLabel: Label = null; // 击杀数 Label

    @property
    isGameOver: boolean = false; // 游戏是否结束

    // 游戏时间（秒）
    gameTime: number = 0;

    // 击杀数
    killCount: number = 0;

    // 升级面板
    @property(level_up_panel)
    levelUpPanel: level_up_panel = null;

    // 背景音乐
    @property(AudioSource)
    bgmAudio: AudioSource = null;

    // 当前经验值
    currentExp: number = 0;

    // 当前等级
    currentLevel: number = 1;

    // 静态实例（供其他脚本访问）
    static instance: game_manager | null = null;

    // 游戏是否暂停（公开属性）
    isPaused: boolean = false;

    // 活着的经验球列表
    expGemList: Node[] = [];

    // 是否正在升级中
    private _isLevelingUp: boolean = false;

    start() {
        // 保存静态实例
        _gameManager = game_manager.instance = this;

        // 如果没有手动设置expBar，自动查找
        if (!this.expBar) {
            this.findExpBar();
        }
        // 如果没有手动设置levelUpPanel，自动查找
        if (!this.levelUpPanel) {
            this.findLevelUpPanel();
        }

        // 初始化游戏结束界面（默认隐藏）
        if (this.gameOverNode) {
            this.gameOverNode.active = false;
        }

        this.updateExpBar();

        // 播放背景音乐
        this.playBGM();

        console.log(`游戏开始! 等级: ${this.currentLevel}, 经验: ${this.currentExp}/${this.expToLevelUp}`);
    }

    // 播放背景音乐
    playBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.loop = true; // 循环播放
            this.bgmAudio.play();
            console.log('背景音乐开始播放');
        }
    }

    // 游戏结束
    onGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.pauseGame();

        // 更新结算面板显示
        this.updateGameOverUI();

        // 显示游戏结束界面
        if (this.gameOverNode) {
            this.gameOverNode.active = true;
        }

        console.log('游戏结束!');
    }

    // 更新游戏结束界面
    updateGameOverUI() {
        if (!this.gameOverNode) return;

        // 格式化时间（分:秒）
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        const secondsStr = seconds < 10 ? '0' + seconds : seconds.toString();
        const timeStr = `${minutes}:${secondsStr}`;

        // 更新 Label 显示
        if (this.gameTimeLabel) {
            this.gameTimeLabel.string = `存活时间: ${timeStr}`;
        }
        if (this.killCountLabel) {
            this.killCountLabel.string = `击杀数: ${this.killCount}`;
        }
    }

    // 增加击杀数
    addKillCount(count: number = 1) {
        this.killCount += count;
    }

    // 重新开始游戏
    restartGame() {
        // 隐藏游戏结束界面
        if (this.gameOverNode) {
            this.gameOverNode.active = false;
        }

        // 重置游戏状态
        this.isGameOver = false;
        this.currentExp = 0;
        this.currentLevel = 1;
        this.expToLevelUp = 10;
        this._isLevelingUp = false;
        this.gameTime = 0;
        this.killCount = 0;

        // 重置玩家状态
        if (player_sprite.instance) {
            player_sprite.instance.resetPlayer();
        }

        // 清空经验球
        for (const gem of this.expGemList) {
            if (gem && gem.isValid) {
                gem.destroy();
            }
        }
        this.expGemList = [];

        // 更新经验条
        this.updateExpBar();

        // 恢复游戏
        this.resumeGame();

        console.log('游戏重新开始!');
    }

    // 查找升级面板
    findLevelUpPanel() {
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            const panelNode = canvas.getChildByName('LevelUpPanel');
            if (panelNode) {
                this.levelUpPanel = panelNode.getComponent(level_up_panel);
            }
        }
    }

    // 暂停游戏
    pauseGame() {
        if (this.isPaused) return;
        this.isPaused = true;
        director.getScheduler().setTimeScale(0);
        console.log('游戏暂停');
    }

    // 恢复游戏
    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        director.getScheduler().setTimeScale(1);
        console.log('游戏恢复');
    }

    // 切换暂停状态
    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    // 查找经验条
    findExpBar() {
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            const expBarNode = canvas.getChildByName('ExpBar');
            if (expBarNode) {
                this.expBar = expBarNode.getComponent(ProgressBar);
            }
        }
    }

    // 更新经验条显示
    updateExpBar() {
        if (!this.expBar) return;

        const progress = this.currentExp / this.expToLevelUp;
        this.expBar.progress = Math.min(progress, 1);
    }

    // 增加经验
    addExp(amount: number) {
        // 如果正在升级中，不增加经验
        if (this._isLevelingUp) return;

        this.currentExp += amount;
        console.log(`获得经验: ${amount}, 当前: ${this.currentExp}/${this.expToLevelUp}`);

        // 更新经验条
        this.updateExpBar();

        // 检查升级
        if (this.currentExp >= this.expToLevelUp) {
            this.showLevelUpPanel();
        }
    }

    // 显示升级面板
    showLevelUpPanel() {
        // 先暂停游戏（立即暂停）
        this.pauseGame();

        // 标记正在升级
        this._isLevelingUp = true;

        // 随机抽取3个技能
        const skills = this.getRandomSkills(3);

        // 显示升级面板
        if (this.levelUpPanel) {
            this.levelUpPanel.showSkillsWithData(skills, () => {
                this.onLevelUpComplete();
            });
        } else {
            // 如果没有面板，直接升级
            this.levelUp();
            this.resumeGame();
            this._isLevelingUp = false;
        }
    }

    // 随机获取技能
    getRandomSkills(count: number): Skill[] {
        const shuffled = [...SKILL_POOL].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    // 升级完成
    onLevelUpComplete() {
        // 升级逻辑
        this.currentExp -= this.expToLevelUp;
        this.currentLevel++;
        this.expToLevelUp = Math.floor(this.expToLevelUp * 1.5);

        console.log(`Level Up! 当前等级: ${this.currentLevel}, 下一级需要: ${this.expToLevelUp}经验`);

        // 更新经验条
        this.updateExpBar();

        // 恢复游戏
        this.resumeGame();
        this._isLevelingUp = false;

        // 递归检查是否还能升级
        if (this.currentExp >= this.expToLevelUp) {
            this.showLevelUpPanel();
        }
    }

    // 升级（保留兼容）
    levelUp() {
        this.currentExp -= this.expToLevelUp;
        this.currentLevel++;
        this.expToLevelUp = Math.floor(this.expToLevelUp * 1.5);

        console.log(`Level Up! 当前等级: ${this.currentLevel}, 下一级需要: ${this.expToLevelUp}经验`);

        // 更新经验条
        this.updateExpBar();

        // 递归检查是否还能升级
        if (this.currentExp >= this.expToLevelUp) {
            this.levelUp();
        }
    }

    // 生成经验球
    spawnExpGem(position: { x: number, y: number }) {
        if (!this.expGemPrefab) return;

        const gem = instantiate(this.expGemPrefab);
        const canvas = this.node.scene.getChildByName('Canvas');
        const gameNode = canvas?.getChildByName('GameNode');
        gem.parent = gameNode || this.node.parent;
        gem.setPosition(position.x, position.y, 0);

        // 根据玩家经验倍率设置经验球的值
        const expGemComp = gem.getComponent(exp_gem);
        if (expGemComp && player_sprite.instance) {
            const baseExp = 1;
            expGemComp.expValue = Math.floor(baseExp * player_sprite.instance.expMultiplier);
        }

        this.expGemList.push(gem);
    }

    // 玩家收集经验球时被调用
    onGemCollected(gem: Node) {
        const index = this.expGemList.indexOf(gem);
        if (index > -1) {
            this.expGemList.splice(index, 1);
        }
    }

    update(_deltaTime: number) {
        // 如果游戏暂停或结束，不计时
        if (this.isPaused || this.isGameOver) return;

        // 计时
        this.gameTime += _deltaTime;

        // 清理已销毁的经验球
        for (let i = this.expGemList.length - 1; i >= 0; i--) {
            const gem = this.expGemList[i];
            if (!gem || !gem.isValid) {
                this.expGemList.splice(i, 1);
            }
        }
    }
}
