import { _decorator, Component, Node } from 'cc';
import { DataManager } from './Managers/DataManager';
const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends Component {

    async onLoad() {
        // 1. 第一步：加载所有的 JSON 配置数据
        console.log("--- 游戏启动：正在加载配置数据 ---");
        
        try {
            // 因为 initData 是异步的 (async)，所以我们用 await 等待它完成
            await DataManager.instance.initData();
            
            console.log("--- 配置数据加载成功 ---");
            console.log("当前初始员工数量:", DataManager.instance.employees.length);
            
            // 2. 第二步：初始化完成后，可以执行后续逻辑
            this.onGameInited();
            
        } catch (error) {
            console.error("游戏初始化失败:", error);
        }
    }

    onGameInited() {
        // 这里可以通知 UI 更新，或者切换到人才市场界面
        console.log("所有数据就绪，欢迎来到造车帝国！");
        
        // 测试：尝试获取第一个员工的名字
        if (DataManager.instance.employees.length > 0) {
            console.log("测试读取数据 - 第一个员工:", DataManager.instance.employees[0].name);
        }
    }
}