import { _decorator, Component, Vec3 } from 'cc';
import { enemy_spawner } from './enemy_spawner';
const { ccclass, property } = _decorator;

@ccclass('bullet_sprite')
export class bullet_sprite extends Component {
    direction: Vec3 = new Vec3(1, 0, 0); // 飞行方向

    speed: number = 400; // 飞行速度

    @property
    collisionRadius: number = 20; // 碰撞半径

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

    checkCollision() {
        if (!this._spawner) return;

        const bulletPos = this.node.position;

        // 遍历所有敌人检测碰撞
        for (const enemy of this._spawner.enemyList) {
            if (!enemy || !enemy.active) continue;

            const enemyPos = enemy.position;
            const dx = bulletPos.x - enemyPos.x;
            const dy = bulletPos.y - enemyPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.collisionRadius) {
                // 击中敌人
                // 从列表中移除
                this._spawner.removeEnemy(enemy);
                // 销毁敌人
                enemy.destroy();
                // 销毁子弹
                this.node.destroy();
                return;
            }
        }
    }
}

