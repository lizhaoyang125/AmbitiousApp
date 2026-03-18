import { _decorator, Component, Node } from 'cc';
import { enemy_spawner } from './enemy_spawner';
const { ccclass, property } = _decorator;

@ccclass('enemy_sprite')
export class enemy_sprite extends Component {
    @property(Node)
    target: Node = null; // 目标节点（拖入Player节点）

    @property
    speed: number = 100; // 移动速度

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

    // 回收敌人到对象池
    recycle() {
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


