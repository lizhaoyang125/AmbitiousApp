import { _decorator, Component, Vec3, Prefab, instantiate } from 'cc';
import { enemy_spawner } from './enemy_spawner';
import { enemy_sprite } from './enemy_sprite';
import { game_manager } from './game_manager';
const { ccclass, property } = _decorator;

@ccclass('bullet_sprite')
export class bullet_sprite extends Component {
    direction: Vec3 = new Vec3(1, 0, 0); // 飞行方向

    speed: number = 400; // 飞行速度

    @property
    damage: number = 1; // 伤害值

    @property
    pierce: number = 0; // 穿透数量（0=不穿透，1=穿透1个敌人）

    @property
    collisionRadius: number = 20; // 碰撞半径

    @property(Prefab)
    hitEffectPrefab: Prefab = null; // 击中特效预制体

    // 已击中的敌人列表（用于穿透）
    private _hitEnemies: Set<string> = new Set();

    private _spawner: enemy_spawner | null = null;

    start() {
        // 查找enemy_spawner
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            const gameNode = canvas.getChildByName('GameNode');
            if (gameNode) {
                this._spawner = gameNode.getComponent(enemy_spawner);
            }
        }
    }

    update(deltaTime: number) {
        // 如果暂停了，跳过
        if (game_manager.instance?.isPaused) return;

        // 直线飞行
        const currentPos = this.node.position;
        const moveX = this.direction.x * this.speed * deltaTime;
        const moveY = this.direction.y * this.speed * deltaTime;

        this.node.setPosition(
            currentPos.x + moveX,
            currentPos.y + moveY,
            currentPos.z
        );

        // 检测碰撞
        this.checkCollision();
    }

    // 生成击中特效
    spawnHitEffect(position: Vec3) {
        if (!this.hitEffectPrefab) return;

        const effect = instantiate(this.hitEffectPrefab);
        const canvas = this.node.scene.getChildByName('Canvas');
        const gameNode = canvas?.getChildByName('GameNode');
        effect.parent = gameNode || this.node.parent;
        effect.setPosition(position.x, position.y, 0);
    }

    checkCollision() {
        if (!this._spawner) return;

        const bulletPos = this.node.position;
        let hitCount = 0;

        // 遍历所有敌人检测碰撞
        for (const enemy of this._spawner.enemyList) {
            if (!enemy || !enemy.active) continue;

            // 跳过已击中的敌人（用于穿透）
            if (this._hitEnemies.has(enemy.uuid)) continue;

            const enemyPos = enemy.position;
            const dx = bulletPos.x - enemyPos.x;
            const dy = bulletPos.y - enemyPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.collisionRadius) {
                // 获取敌人脚本并扣血
                const enemyComp = enemy.getComponent(enemy_sprite);
                if (enemyComp) {
                    enemyComp.takeDamage(this.damage);
                }

                // 生成特效
                this.spawnHitEffect(enemyPos);

                // 记录已击中的敌人
                this._hitEnemies.add(enemy.uuid);
                hitCount++;

                // 如果穿透次数用完，销毁子弹
                if (this.pierce > 0 && this._hitEnemies.size >= this.pierce) {
                    this.node.destroy();
                    return;
                }
            }
        }

        // 如果没有穿透但击中了敌人，销毁子弹
        if (hitCount > 0 && this.pierce === 0) {
            this.node.destroy();
        }
    }
}

