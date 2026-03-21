import { _decorator, Component, Node, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hit_effect')
export class hit_effect extends Component {
    @property
    duration: number = 0.3; // 特效持续时间

    @property
    startScale: number = 1.0; // 初始大小

    private _timer: number = 0;

    update(deltaTime: number) {
        this._timer += deltaTime;

        // 缩放：从startScale缩小到0
        const t = this._timer / this.duration;
        if (t >= 1) {
            // 动画结束，销毁特效
            this.node.destroy();
            return;
        }

        // 线性缩小
        const scale = this.startScale * (1 - t);
        this.node.setScale(scale, scale, 1);
    }
}
