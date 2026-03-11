import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UINodeScripts')
export class UINodeScripts extends Component {

    @property(Node)
    button1: Node = null!;

    @property(Node)
    button2: Node = null!;

    @property(Node)
    targetNode: Node = null!;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


