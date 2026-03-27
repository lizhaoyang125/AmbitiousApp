import { _decorator, Component, Node, Sprite, Color } from 'cc';
import { enemy_spawner } from './enemy_spawner';
import { game_manager } from './game_manager';
const { ccclass, property } = _decorator;

@ccclass('enemy_sprite')
export class enemy_sprite extends Component {
    @property(Node)
    target: Node = null; // 目标节点（拖入Player节点）

    @property
    speed: number = 100; // 移动速度

    @property
    hp: number = 2; // 生命值

    private _isHitFlash: boolean = false;

    start() {
        // 如果没有指定目标，自动查找Player
        if (!this.target) {
            this.findPlayer();
        }
    }

    findPlayer() {
        // 路径: Canvas.GameNode.PlayerSprite
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            const gameNode = canvas.getChildByName('GameNode');
            if (gameNode) {
                const player = gameNode.getChildByName('PlayerSprite');
                if (player) {
                    this.target = player;
                    return;
                }
            }
        }
    }

    // 受击处理
    takeDamage(damage: number) {
        this.hp -= damage;

        // 闪烁效果
        this.flashWhite();

        if (this.hp <= 0) {
            this.onDead();
        }
    }

    // 闪烁红色（受伤反馈）
    flashWhite() {
        if (this._isHitFlash) return;
        this._isHitFlash = true;

        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            // 保存原始颜色
            const originalColor = sprite.color.clone();

            // 设为红色
            sprite.color = new Color(255, 50, 50, 255);

            // 0.1秒后恢复原色
            setTimeout(() => {
                if (sprite) {
                    sprite.color = originalColor;
                }
                this._isHitFlash = false;
            }, 100);
        }
    }

    // 死亡处理
    onDead() {
        // 增加击杀数
        game_manager.instance?.addKillCount(1);

        // 掉落经验球
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            const gameNode = canvas.getChildByName('GameNode');
            if (gameNode) {
                const gameMgr = gameNode.getComponent(game_manager);
                if (gameMgr) {
                    // 在敌人当前位置生成经验球
                    const pos = this.node.position;
                    gameMgr.spawnExpGem({ x: pos.x, y: pos.y });
                }
            }
        }

        this.recycle();
    }

    // 回收敌人到对象池
    recycle() {
        // 重置血量
        this.hp = 2;

        // 隐藏节点并放回对象池
        this.node.active = false;

        // 查找spawner并回收
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            const spawner = canvas.getChildByName('GameNode')?.getComponent(enemy_spawner);
            if (spawner) {
                spawner.putEnemyToPool(this.node);
            }
        }
    }

    update(deltaTime: number) {
        // 如果暂停了，跳过
        if (game_manager.instance?.isPaused) return;

        // 如果还没找到Player，每帧尝试查找
        if (!this.target) {
            this.findPlayer();
            return;
        }

        const targetPos = this.target.position;
        const currentPos = this.node.position;

        // 计算方向
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            // 归一化并移动
            const moveX = (dx / dist) * this.speed * deltaTime;
            const moveY = (dy / dist) * this.speed * deltaTime;

            this.node.setPosition(
                currentPos.x + moveX,
                currentPos.y + moveY,
                currentPos.z
            );
        }
    }
}


