import { _decorator, Component, Node } from 'cc';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('GameSceneInit')
export class GameSceneInit extends Component {
    @property(Node)
    public storeNode: Node = null;

    @property(Node)
    public homeNode: Node = null;

    start() {
        const player = TopManager.Instance.Player;

        if (player.isNewPlayer) {
            // 新玩家：隐藏店铺，显示家园
            if (this.storeNode) this.storeNode.active = false;
            if (this.homeNode) this.homeNode.active = true;
            console.log("新玩家模式：显示家园");
        } else {
            // 老玩家：显示店铺，隐藏家园
            if (this.storeNode) this.storeNode.active = true;
            if (this.homeNode) this.homeNode.active = false;
            console.log("老玩家模式：显示店铺");
        }
    }
}
