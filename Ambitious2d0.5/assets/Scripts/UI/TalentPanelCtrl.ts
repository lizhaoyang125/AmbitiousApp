import { _decorator, Component, Node, ToggleContainer, Toggle } from 'cc';
import { RecruitmentContent } from './RecruitmentContent';
import { ManagementContent } from './ManagementContent';

const { ccclass, property } = _decorator;

@ccclass('TalentPanelCtrl')
export class TalentPanelCtrl extends Component {
    @property(Node)
    closeBtn: Node = null;

    @property(Node)
    modeTabs: Node = null;       // ToggleContainer

    @property(Node)
    recruitmentContent: Node = null;
    @property(Node)
    managementContent: Node = null;

    private _modeToggleContainer: ToggleContainer = null;

    start() {
        // 初始化 ToggleContainer
        if (this.modeTabs) {
            this._modeToggleContainer = this.modeTabs.getComponent(ToggleContainer);
        }

        // 默认显示招募界面
        this.switchMode(0);
    }

    /**
     * 切换员工招募/管理模式
     * @param index 0=员工招募, 1=员工管理
     */
    switchMode(index: number) {
        if (index === 0) {
            // 员工招募
            if (this.recruitmentContent) {
                this.recruitmentContent.active = true;
            }
            if (this.managementContent) {
                this.managementContent.active = false;
            }
        } else {
            // 员工管理
            if (this.recruitmentContent) {
                this.recruitmentContent.active = false;
            }
            if (this.managementContent) {
                this.managementContent.active = true;
            }
        }
    }

    // ==================== 按钮回调 ====================
    onCloseClick() {
        this.node.active = false;
    }

    /**
     * 模式 Tab 点击事件
     * @param toggle 触发事件的 Toggle
     */
    onModeTabClick(toggle: Toggle) {
        if (!toggle.isChecked) return;

        // 根据选中的 toggle 确定模式
        const siblings = toggle.node.parent.children;
        let index = siblings.indexOf(toggle.node);
        this.switchMode(index);
    }

    // ==================== 招募界面回调 ====================
    onHireCandidate(candidateId: string) {
        // TODO: 实现雇佣候选人逻辑
        console.log('雇佣候选人:', candidateId);
    }

    // ==================== 管理界面回调 ====================
    onTrainEmployee(employeeId: string) {
        // TODO: 实现培训员工逻辑
        // 培训需要消耗金币和时间，员工临时离岗
        console.log('培训员工:', employeeId);
    }

    onFireEmployee(employeeId: string) {
        // TODO: 实现解雇员工逻辑
        console.log('解雇员工:', employeeId);
    }
}