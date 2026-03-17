import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('camera_follow')
export class camera_follow extends Component {
    @property(Node)
    target: Node = null; // 跟随的目标节点

    @property
    smoothSpeed: number = 1; // 立即跟随

    private _initialized: boolean = false;

    start() {
        // 直接让相机位置 = player位置
        if (this.target) {
            const pos = this.target.position;
            this.node.setPosition(pos.x, pos.y, this.node.position.z);
            this._initialized = true;
        }
    }

    update(deltaTime: number) {
        if (!this.target || !this._initialized) return;

        const targetPos = this.target.position;
        const currentPos = this.node.position;

        // 相机直接跟随player位置
        const newX = currentPos.x + (targetPos.x - currentPos.x) * this.smoothSpeed;
        const newY = currentPos.y + (targetPos.y - currentPos.y) * this.smoothSpeed;

        this.node.setPosition(newX, newY, currentPos.z);
    }
}
