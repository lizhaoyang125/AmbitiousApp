import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopManager')
export class TopManager extends Component {
    private static _instance:TopManager;
    public static get Instance(){
        if(!this._instance){
            this._instance=new TopManager();
        }
        return this._instance;
    }

    protected onLoad(){
        if(TopManager._instance===null){
            TopManager._instance=this;
        }else{
            console.warn('TopManager is exist!');
            this.node.destroy();
            return;
        }
    }
}


