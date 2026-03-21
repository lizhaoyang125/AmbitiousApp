import { _decorator, Component, Prefab, instantiate, Vec3 } from 'cc';
import { enemy_spawner } from './enemy_spawner';
import { bullet_sprite } from './bullet_sprite';
import { game_manager } from './game_manager';
import { player_sprite } from './player_sprite';
const { ccclass, property } = _decorator;

@ccclass('weapon')
export class weapon extends Component {
    @property(Prefab)
    bulletPrefab: Prefab = null; // 子弹预制体

    @property
    fireInterval: number = 0.5; // 发射间隔（秒）

    @property
    bulletSpeed: number = 400; // 子弹速度

    private _timer: number = 0;
    private _spawner: enemy_spawner | null = null;

    start() {
        // 查找enemy_spawner
        this.findSpawner();
    }

    findSpawner() {
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

        // 计算实际发射间隔（考虑射速加成）
        const actualFireInterval = this.getActualFireInterval();
        this._timer += deltaTime;

        if (this._timer >= actualFireInterval) {
            this._timer = 0;
            this.fire();
        }
    }

    // 获取实际发射间隔（考虑玩家射速加成）
    getActualFireInterval(): number {
        if (player_sprite.instance) {
            const fireRateMult = (player_sprite.instance as any).fireRateMultiplier || 1;
            return this.fireInterval * fireRateMult;
        }
        return this.fireInterval;
    }

    fire() {
        if (!this.bulletPrefab) {
            console.warn('请设置bulletPrefab');
            return;
        }

        // 重新查找spawner
        if (!this._spawner) {
            this.findSpawner();
        }

        if (!this._spawner) return;

        // 寻找最近敌人
        const nearestEnemy = this._spawner.getNearestEnemy();
        if (!nearestEnemy) return; // 没有敌人，不发射

        // 创建子弹
        const bullet = instantiate(this.bulletPrefab);

        // 设置子弹位置为玩家位置
        const playerPos = this.node.position;
        bullet.setPosition(playerPos.x, playerPos.y, 0);

        // 计算方向向量（指向敌人当前位置）
        const enemyPos = nearestEnemy.position;
        const dirX = enemyPos.x - playerPos.x;
        const dirY = enemyPos.y - playerPos.y;

        // 归一化方向
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length === 0) return;

        const normX = dirX / length;
        const normY = dirY / length;

        // 从玩家单例读取属性
        const player = player_sprite.instance;
        const damage = player ? player.damage : 1;
        const pierce = player ? player.pierce : 0;

        // 设置子弹属性
        const bulletScript = bullet.getComponent(bullet_sprite);
        if (bulletScript) {
            bulletScript.direction = new Vec3(normX, normY, 0);
            bulletScript.speed = this.bulletSpeed;
            bulletScript.damage = damage;
            bulletScript.pierce = pierce;
        }

        // 添加到场景
        const canvas = this.node.scene.getChildByName('Canvas');
        const gameNode = canvas?.getChildByName('GameNode');
        bullet.parent = gameNode || this.node.parent;
    }
}

