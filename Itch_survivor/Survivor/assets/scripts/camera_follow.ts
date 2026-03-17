import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('camera_follow')
export class camera_follow extends Component {
    @property(Node)
    target: Node = null; // 跟随的目标节点

    private _initialized: boolean = false;

    start() {
        if (this.target) {
            const pos = this.target.position;
            this.node.setPosition(pos.x, pos.y, this.node.position.z);
            this._initialized = true;
        }
    }

    // 使用 lateUpdate 避免抖动
    lateUpdate(_deltaTime: number) {
        if (!this.target || !this._initialized) return;

        // 直接吸附跟随，无抖动
        const targetPos = this.target.position;
        this.node.setPosition(targetPos.x, targetPos.y, this.node.position.z);
    }
}
