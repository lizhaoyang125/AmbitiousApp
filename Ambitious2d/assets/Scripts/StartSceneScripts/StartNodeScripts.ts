import { _decorator, Component, director, Node } from 'cc';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('StartNodeScripts')
export class StartNodeScripts extends Component {

    @property(Node) public initialNode: Node = null;



    start() {

    }

    update(deltaTime: number) {
        
    }
    newGame() {
        // 新游戏逻辑: 可在此处重置数据、跳转场景等
        console.log('开始新游戏');
        // 插件指令：隐藏自己，显示initialNode
        this.node.active = false;
        if (this.initialNode) {
            this.initialNode.active = true;
        }
    }

    loadGame() {
        // 载入游戏逻辑: 读取存档、初始化场景等
        console.log('载入游戏');

        // 加载本地存储的数据
        TopManager.Instance.loadLocalData();

        // 设置为老玩家模式
        if (TopManager.Instance.Player) {
            TopManager.Instance.Player.isNewPlayer = false;
            TopManager.Instance.localSave("player");
        }

        // 加载场景 GameScene
        director.loadScene("GameScene");
    }

    quitGame() {
        // 退出游戏逻辑: 可在此处退出应用、返回主菜单等
        console.log('退出游戏');
    }
    
}


