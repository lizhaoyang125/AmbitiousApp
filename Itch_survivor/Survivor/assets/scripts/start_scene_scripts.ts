import { _decorator, Component, Node, director, Sprite, Color, UIOpacity } from 'cc';
import { tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('start_scene_scripts')
export class start_scene_scripts extends Component {
    @property({
        type: Node,
        tooltip: '全屏黑色过渡节点，需要在场景中创建一个覆盖画布的黑色 Sprite'
    })
    fadeNode: Node | null = null;

    private _uiOpacity: UIOpacity | null = null;

    start() {
        // 初始化：确保过渡节点是黑色的且透明
        if (this.fadeNode) {
            // 需要添加 UIOpacity 组件来控制透明度
            this._uiOpacity = this.fadeNode.getComponent(UIOpacity);
            if (!this._uiOpacity) {
                this._uiOpacity = this.fadeNode.addComponent(UIOpacity);
            }

            const sprite = this.fadeNode.getComponent(Sprite);
            if (sprite) {
                sprite.color = new Color(0, 0, 0);
            }

            if (this._uiOpacity) {
                this._uiOpacity.opacity = 0;
            }

            // 确保节点在最上层
            this.fadeNode.setSiblingIndex(9999);
        }
    }

    update(deltaTime: number) {

    }

    // 加载游戏场景（带渐变过渡效果）
    loadScene() {
        if (!this.fadeNode || !this._uiOpacity) {
            // 没有过渡节点，直接加载
            director.loadScene('game_scene');
            return;
        }

        // 淡出到黑色，然后加载场景
        tween(this._uiOpacity)
            .to(0.4, { opacity: 255 })  // 0.4秒淡出到黑色
            .call(() => {
                director.loadScene('game_scene');
            })
            .start();
    }

    // 退出游戏
    quitGame() {
        director.end();
    }
}


