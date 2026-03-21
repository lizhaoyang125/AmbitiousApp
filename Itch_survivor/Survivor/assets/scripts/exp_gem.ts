import { _decorator, Component, Sprite, Color } from 'cc';
import { game_manager } from './game_manager';
import { player_sprite } from './player_sprite';
const { ccclass, property } = _decorator;

@ccclass('exp_gem')
export class exp_gem extends Component {
    @property
    expValue: number = 1; // 经验值

    @property
    moveSpeed: number = 200; // 被吸入时的移动速度

    // 是否正在被吸入
    private _isAttracted: boolean = false;

    start() {
        // 设置为黄色
        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            sprite.color = new Color(255, 255, 0, 255); // 黄色
        }
    }

    // 被玩家吸入
    attractToPlayer(playerPos: { x: number, y: number }) {
        this._isAttracted = true;
    }

    update(deltaTime: number) {
        // 如果暂停了，跳过
        if (game_manager.instance?.isPaused) return;

        if (!this._isAttracted) return;

        // 查找玩家位置
        const canvas = this.node.scene.getChildByName('Canvas');
        const gameNode = canvas?.getChildByName('GameNode');
        const player = gameNode?.getChildByName('PlayerSprite');

        if (!player) return;

        const playerPos = player.position;
        const currentPos = this.node.position;

        // 计算方向
        const dx = playerPos.x - currentPos.x;
        const dy = playerPos.y - currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 距离小于20被收集
        if (dist < 20) {
            // 通知玩家收集经验
            this.collect();
            return;
        }

        // 匀速向玩家移动
        if (dist > 0) {
            const moveX = (dx / dist) * this.moveSpeed * deltaTime;
            const moveY = (dy / dist) * this.moveSpeed * deltaTime;

            this.node.setPosition(
                currentPos.x + moveX,
                currentPos.y + moveY,
                currentPos.z
            );
        }
    }

    // 被玩家收集
    collect() {
        // 计算实际经验值（考虑经验倍率）
        let actualExp = this.expValue;
        if (player_sprite.instance) {
            actualExp = Math.floor(this.expValue * player_sprite.instance.expMultiplier);
        }

        // 通知game_manager增加经验
        const canvas = this.node.scene.getChildByName('Canvas');
        const gameNode = canvas?.getChildByName('GameNode');
        const gameManager = gameNode?.getComponent('game_manager');
        if (gameManager) {
            gameManager.addExp(actualExp);
        }

        // 销毁经验球
        this.node.destroy();
    }
}
