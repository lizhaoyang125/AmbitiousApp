//用于demo跨Scene通信的测试
import { _decorator, Component, director } from 'cc';
import { TopManager } from './TopManager';

const { ccclass, property } = _decorator;

@ccclass('TestScripts')
export class TestScripts extends Component {
    start() {
        console.log("testValue:"+TopManager.ValueForTest);
        console.log("testValue2:"+TopManager.Instance.ValueForTest2);
        console.log("testValueString:"+TopManager.Instance.ValueForTestString);
    }

    update(deltaTime: number) {
        
    }
    switchScene(){
        director.loadScene("GameScene");
    }
}