import { _decorator, Component, director, EditBox, Label, Node } from 'cc';
import { TalentDict, LivingStatusDict } from '../DataCollection';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('InitialNodeScripts')
export class InitialNodeScripts extends Component {
    @property(Node) public startNode: Node = null;
    @property([Label]) public talentLabels: Label[] = [];
    @property(EditBox) public nameEditBox: EditBox = null;

    private selectedTalents: string[] = [];

    start() {
        this.chooseTalent();
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
        // 同步到玩家数据
        const tm = TopManager.Instance;
        if (tm && tm.Player) {
            tm.Player.Talent = [...this.selectedTalents];
        }

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
        // 保存玩家名称和设置新玩家标记
        const name = this.nameEditBox.string.trim() || "玩家";
        TopManager.Instance.Player.Name = name;
        TopManager.Instance.Player.isNewPlayer = true;
        // 设置新玩家的居住状态和经验值
        TopManager.Instance.Player.livingStatus = "破旧的城中村";
        TopManager.Instance.Player.rent = LivingStatusDict["破旧的城中村"].rent;
        TopManager.Instance.Player.expPerDay = LivingStatusDict["破旧的城中村"].exp;
        // 设置新玩家初始资金
        TopManager.Instance.Player.Money = 2000;
        //新玩家，没有任何店铺
        TopManager.Instance.Player.currentStoreName = "";
        TopManager.Instance.saveLocalData();

        console.log(`玩家名称: ${name}, isNewPlayer: true, 居住状态: 破旧的城中村, 经验值: 10/天, 初始资金: 2000`);
        director.loadScene("GameScene");
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


