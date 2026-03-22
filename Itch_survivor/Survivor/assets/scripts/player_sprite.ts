import { _decorator, Component, input, Input, Vec2, AudioSource } from 'cc';
import { enemy_sprite } from './enemy_sprite';
import { exp_gem } from './exp_gem';
import { game_manager } from './game_manager';
const { ccclass, property } = _decorator;

// 玩家单例（供其他脚本访问）
let _playerSprite: player_sprite | null = null;

@ccclass('player_sprite')
export class player_sprite extends Component {
    @property
    speed: number = 200; // 移动速度，可自定义

    @property
    startAtCenter: boolean = true; // 是否在屏幕中央开始

    @property
    collisionRadius: number = 30; // 碰撞半径

    @property
    magnetRadius: number = 100; // 吸铁石半径

    // ============ 玩家属性（供技能修改） ============
    @property
    damage: number = 1; // 攻击力

    @property
    pierce: number = 0; // 穿透数量

    @property
    expMultiplier: number = 1; // 经验获取倍率

    @property(AudioSource)
    gameOverAudio: AudioSource = null; // Game Over 音效

    // 静态实例（供其他脚本访问）
    static instance: player_sprite | null = null;

    private _keys: Set<string> = new Set();
    private _isGameOver: boolean = false;

    start() {
        // 保存静态实例
        _playerSprite = player_sprite.instance = this;
        // 如果设置了在屏幕中央开始 (1280x720)
        if (this.startAtCenter) {
            this.node.setPosition(640, 360, 0); // 屏幕中央
        } else {
            this.node.setPosition(0, 0, 0); // 屏幕左下角
        }

        // 监听键盘按下事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // 监听键盘释放事件
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // 移除事件监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: any) {
        this._keys.add(event.keyCode.toString());
    }

    onKeyUp(event: any) {
        this._keys.delete(event.keyCode.toString());
    }

    update(deltaTime: number) {
        // 如果暂停了，跳过
        if (game_manager.instance?.isPaused) return;

        // 如果已经Game Over，不再检测碰撞
        if (this._isGameOver) return;

        const moveDir = new Vec2(0, 0);

        // W键 - 向上
        if (this._keys.has('87')) {
            moveDir.y += 1;
        }
        // S键 - 向下
        if (this._keys.has('83')) {
            moveDir.y -= 1;
        }
        // A键 - 向左
        if (this._keys.has('65')) {
            moveDir.x -= 1;
        }
        // D键 - 向右
        if (this._keys.has('68')) {
            moveDir.x += 1;
        }

        // 归一化向量，避免斜向移动过快
        if (moveDir.length() > 0) {
            moveDir.normalize();

            // 计算新位置
            const currentPos = this.node.position;
            const newX = currentPos.x + moveDir.x * this.speed * deltaTime;
            const newY = currentPos.y + moveDir.y * this.speed * deltaTime;

            this.node.setPosition(newX, newY, currentPos.z);
        }

        // 检测碰撞
        this.checkCollision();

        // 检测经验球（吸铁石效果）
        this.checkExpGems();
    }

    // 吸铁石效果：检测经验球
    checkExpGems() {
        const canvas = this.node.scene.getChildByName('Canvas');
        const gameNode = canvas?.getChildByName('GameNode');
        if (!gameNode) return;

        const playerPos = this.node.position;

        for (const child of gameNode.children) {
            // 检查是否是经验球
            const gemComp = child.getComponent(exp_gem);
            if (!gemComp) continue;

            const gemPos = child.position;
            const dx = playerPos.x - gemPos.x;
            const dy = playerPos.y - gemPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 距离小于100，触发吸入
            if (dist < this.magnetRadius) {
                gemComp.attractToPlayer({ x: playerPos.x, y: playerPos.y });
            }
        }
    }

    checkCollision() {
        // 从GameNode下查找所有敌人
        const canvas = this.node.scene.getChildByName('Canvas');
        const gameNode = canvas?.getChildByName('GameNode');
        if (!gameNode) return;

        const playerPos = this.node.position;

        for (let i = gameNode.children.length - 1; i >= 0; i--) {
            const child = gameNode.children[i];
            // 跳过PlayerSprite自身
            if (child.name === 'PlayerSprite') continue;

            // 检查是否有enemy_sprite组件
            const enemyComp = child.getComponent(enemy_sprite);
            if (!enemyComp) continue;

            const enemyPos = child.position;
            const dx = playerPos.x - enemyPos.x;
            const dy = playerPos.y - enemyPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 碰撞检测
            if (dist < this.collisionRadius) {
                console.log('Game Over');
                // 播放 Game Over 音效
                if (this.gameOverAudio) {
                    this.gameOverAudio.play();
                }
                this._isGameOver = true;
                // 回收敌人到对象池，而不是销毁
                enemyComp.recycle();
                return;
            }
        }
    }
}


