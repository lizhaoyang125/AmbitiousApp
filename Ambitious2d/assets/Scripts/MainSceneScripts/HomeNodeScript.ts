import { _decorator, Component, Label, RichText, Node, director } from 'cc';
import { LivingStatusDict, TalentDict } from '../DataCollection';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('HomeNodeScript')
export class HomeNodeScript extends Component {
    @property(Label)
    public LivingStatusLabel: Label = null;     // 房屋状态（包含状态、房租、经验值）

    @property(RichText)
    public PlayerInfo: RichText = null;         // 玩家详细信息

    @property(Label)
    public CreateStoreBtnLabel: Label = null;   // 创建新店按钮文字

    @property({
        type: Node,
        displayName: "创建新店节点",
        tooltip: "拖拽层级管理器中的新店节点到这里"
    })
    public newStoreNode: Node = null; // 初始值可以设为 null，不影响拖拽

    @property({
        type: Node,
        displayName: "店铺节点",
        tooltip: "拖拽层级管理器中的店铺节点到这里"
    })
    public storeNode: Node = null; // 店铺节点

    private isNewStoreNodeShown: boolean = false; // 新店节点是否显示
    
    
    start() {
        this.updatePlayerInfo();
    }

    update(deltaTime: number) {

    }

    updatePlayerInfo() {
        const player = TopManager.Instance.Player;
        const storeCount = Object.keys(TopManager.Instance.MyStoreDict).length;

        // 更新标签显示（包含状态、房租、经验值）
        if (this.LivingStatusLabel) {
            this.LivingStatusLabel.string = `${player.livingStatus}  房租:${player.rent}/月  经验:+${player.expPerDay}/天`;
        }

        // 获取居住状态描述
        const livingDesc = LivingStatusDict[player.livingStatus]?.description || "";

        // 获取天赋信息
        const talents = player.Talent.length > 0
            ? player.Talent.map((t: string) => {
                const talent = TalentDict[t];
                return talent ? `<color=#FFD700>${t}</color>` : t;
              }).join(", ")
            : "<color=#888888>无</color>";

        // 格式化玩家详细信息（使用不同颜色）
        if (this.PlayerInfo) {
            this.PlayerInfo.string = `
<color=#FFFFFF>====================================</color>
<color=#00FF00>【玩家信息】</color>
<color=#FFFFFF>====================================</color>
<color=#FFFFFF>昵称: </color><color=#FFD700>${player.Name}</color>
<color=#FFFFFF>等级: </color><color=#00FFFF>${player.Level}</color>
<color=#FFFFFF>金币: </color><color=#FFD700>${player.Money}</color>
<color=#FFFFFF>经营天数: </color><color=#00FFFF>${player.daysPassed}</color>

<color=#FF69B4>【居住信息】</color>
<color=#FFFFFF>居住状态: </color><color=#87CEEB>${player.livingStatus}</color>
<color=#FFFFFF>房租: </color><color=#FF6B6B>${player.rent}/月</color>
<color=#FFFFFF>描述: </color><color=#AAAAAA>${livingDesc}</color>

<color=#DA70D6>【天赋】</color>
<color=#FFFFFF>${talents}</color>

<color=#32CD32>【店铺信息】</color>
<color=#FFFFFF>店铺数量: </color><color=#00FFFF>${storeCount}</color>
<color=#FFFFFF>====================================</color>
            `.trim();
        }

        console.log("更新玩家信息完成");
    }


    createNewStore() {
        if (this.newStoreNode) {
            this.isNewStoreNodeShown = !this.isNewStoreNodeShown;
            this.newStoreNode.active = this.isNewStoreNodeShown;

            // 更新按钮文字
            if (this.CreateStoreBtnLabel) {
                this.CreateStoreBtnLabel.string = this.isNewStoreNodeShown ? "回家" : "开新店";
            }
        } else {
            console.error("未分配新店节点");
        }
    }
    goToStore() {
        if (TopManager.Instance.Player.currentStoreName) {
            // 隐藏家园节点
            this.node.active = false;
            // 隐藏新店面板（如果显示的话）
            if (this.newStoreNode) {
                this.newStoreNode.active = false;
                this.isNewStoreNodeShown = false;
                if (this.CreateStoreBtnLabel) {
                    this.CreateStoreBtnLabel.string = "开新店";
                }
            }
            // 显示店铺节点
            if (this.storeNode) {
                this.storeNode.active = true;
            }
            console.log("前往店铺: " + TopManager.Instance.Player.currentStoreName);
        } else {
            console.error("玩家未分配店铺");
        }
    }

    // 返回家园（由店铺界面调用）
    goHome(homeNode: Node) {
        // 隐藏店铺
        if (this.storeNode) {
            this.storeNode.active = false;
        }
        // 显示家园
        if (homeNode) {
            homeNode.active = true;
        }
        console.log("返回家园");
    }

    // 关闭创建新店面板（由 CreateNewStore 脚本调用）
    closeNewStorePanel() {
        if (this.newStoreNode) {
            this.newStoreNode.active = false;
            this.isNewStoreNodeShown = false;
            // 更新按钮文字
            if (this.CreateStoreBtnLabel) {
                this.CreateStoreBtnLabel.string = "开新店";
            }
        }
    }
}
