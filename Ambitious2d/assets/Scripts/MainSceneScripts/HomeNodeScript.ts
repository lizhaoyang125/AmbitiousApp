import { _decorator, Component, Node, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HomeNodeScript')
export class HomeNodeScript extends Component {
    @property(RichText)
    public PlayerInfo:RichText = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


