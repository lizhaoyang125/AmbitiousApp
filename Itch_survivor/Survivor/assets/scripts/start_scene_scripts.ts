import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('start_scene_scripts')
export class start_scene_scripts extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    // 加载游戏场景
    loadScene() {
        director.loadScene('game_scene');
    }

    // 退出游戏
    quitGame() {
        director.end(0);
    }
}

