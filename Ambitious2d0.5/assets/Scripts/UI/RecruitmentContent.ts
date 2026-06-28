import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 候选人数据结构
 */
export interface CandidateData {
    id: string;
    name: string;          // 姓名
    position: string;      // 岗位：收银员、理货员、服务员、店长
    cleanLv: number;       // 清洁技能等级
    serviceLv: number;     // 服务技能等级
    stockLv: number;       // 理货技能等级
    salary: number;        // 日薪
    cost: number;          // 雇佣费用
}

/**
 * 员工招募界面
 * 显示候选人列表，支持雇佣操作
 */
@ccclass('RecruitmentContent')
export class RecruitmentContent extends Component {
    @property(Node)
    candidateList: Node = null;  // 候选人列表容器

    // 示例候选人数据
    private _candidates: CandidateData[] = [
        { id: 'c1', name: '张三', position: '收银员', cleanLv: 2, serviceLv: 3, stockLv: 1, salary: 50, cost: 200 },
        { id: 'c2', name: '李四', position: '理货员', cleanLv: 3, serviceLv: 1, stockLv: 4, salary: 45, cost: 180 },
        { id: 'c3', name: '王五', position: '服务员', cleanLv: 1, serviceLv: 4, stockLv: 2, salary: 55, cost: 220 },
        { id: 'c4', name: '赵六', position: '店长', cleanLv: 3, serviceLv: 3, stockLv: 3, salary: 100, cost: 500 },
    ];

    start() {
        this.refreshCandidateList();
    }

    /**
     * 刷新候选人列表
     */
    refreshCandidateList() {
        // TODO: 根据数据动态生成候选人卡片
        console.log('刷新候选人列表，当前候选人数量:', this._candidates.length);
    }

    /**
     * 雇佣候选人
     * @param candidateId 候选人ID
     */
    hireCandidate(candidateId: string) {
        const candidate = this._candidates.find(c => c.id === candidateId);
        if (!candidate) {
            console.warn('候选人不存在:', candidateId);
            return;
        }

        // TODO: 检查金币是否足够，扣除费用，添加员工
        console.log(`雇佣 ${candidate.name}，费用 ${candidate.cost} 金币，日薪 ${candidate.salary} 金币/天`);
    }
}