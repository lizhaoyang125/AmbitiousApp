import { _decorator, Component, input, Input, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('player_sprite')
export class player_sprite extends Component {
    @property
    speed: number = 200; // 移动速度，可自定义

    @property
    startAtCenter: boolean = true; // 是否在屏幕中央开始

    private _keys: Set<string> = new Set();

    start() {
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
    }
}


