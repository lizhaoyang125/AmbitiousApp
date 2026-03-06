import { _decorator, Component, Label, Node } from 'cc';
import { TalentDict } from '../DataCollection';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('InitialNodeScripts')
export class InitialNodeScripts extends Component {
    @property(Node) public startNode: Node = null;
    @property([Label]) public talentLabels: Label[] = [];

    private selectedTalents: string[] = [];

    start() {
        this.chooseTalent(); // 选择天赋 返回首页
        const tm = TopManager.Instance;
        if (tm) {
            console.log(`当前游戏时间: ${tm.GameTime}`);
        } else {
            console.warn('TopManager 尚未初始化');
        }
    }

    update(deltaTime: number) {

    }
    chooseTalent() {
        // 从 TalentDict 中随机抽取3个不同的天赋
        const talentKeys = Object.keys(TalentDict);
        const shuffled = [...talentKeys].sort(() => Math.random() - 0.5);
        this.selectedTalents = shuffled.slice(0, 3);

        // 显示到 talentLabels 中
        for (let i = 0; i < 3; i++) {
            if (this.talentLabels[i]) {
                const talent = TalentDict[this.selectedTalents[i]];
                this.talentLabels[i].string = `${this.selectedTalents[i]}: ${talent.effect}`;
            }
        }
        console.log('选择天赋', this.selectedTalents);
    }

    enterGame() {
        // 进入游戏逻辑: 可在此进行场景切换、资源加载等
        console.log('进入游戏');
    }

    returnIndex() {
        // 返回首页逻辑: 可在此返回首页节点或初始场景
        this.node.active = false;
        if (this.startNode) {
            this.startNode.active = true;
        }
        console.log('返回首页');
    }
}


