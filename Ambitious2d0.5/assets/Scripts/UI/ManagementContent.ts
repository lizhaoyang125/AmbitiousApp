import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 员工状态
 */
export enum EmployeeStatus {
    WORKING = 'working',      // 工作中
    TRAINING = 'training',    // 培训中
    OFF_DUTY = 'off_duty',    // 休息中
}

/**
 * 员工数据结构
 */
export interface EmployeeData {
    id: string;
    name: string;              // 姓名
    position: string;          // 岗位
    cleanLv: number;           // 清洁技能等级
    serviceLv: number;         // 服务技能等级
    stockLv: number;           // 理货技能等级
    status: EmployeeStatus;    // 当前状态
    salary: number;            // 日薪
    trainingEndTime?: number;  // 培训结束时间（时间戳）
}

/**
 * 员工管理界面
 * 显示员工列表，支持培训、解雇操作
 */
@ccclass('ManagementContent')
export class ManagementContent extends Component {
    @property(Node)
    employeeList: Node = null;  // 员工列表容器

    // 员工数据
    private _employees: EmployeeData[] = [];

    start() {
        this.refreshEmployeeList();
    }

    /**
     * 刷新员工列表
     */
    refreshEmployeeList() {
        // TODO: 根据数据动态生成员工卡片
        console.log('刷新员工列表，当前员工数量:', this._employees.length);
    }

    /**
     * 添加员工
     * @param employee 员工数据
     */
    addEmployee(employee: EmployeeData) {
        this._employees.push(employee);
        this.refreshEmployeeList();
    }

    /**
     * 培训员工
     * @param employeeId 员工ID
     * @param skillType 技能类型：clean, service, stock
     * @param cost 培训费用（金币）
     * @param duration 培训时长（秒）
     */
    trainEmployee(employeeId: string, skillType: 'clean' | 'service' | 'stock', cost: number, duration: number) {
        const employee = this._employees.find(e => e.id === employeeId);
        if (!employee) {
            console.warn('员工不存在:', employeeId);
            return;
        }

        if (employee.status === EmployeeStatus.TRAINING) {
            console.warn('员工正在培训中');
            return;
        }

        // TODO: 检查金币是否足够，扣除费用，设置培训状态
        employee.status = EmployeeStatus.TRAINING;
        employee.trainingEndTime = Date.now() + duration * 1000;
        console.log(`培训 ${employee.name} 的 ${skillType} 技能，费用 ${cost} 金币，时长 ${duration} 秒`);

        this.refreshEmployeeList();
    }

    /**
     * 解雇员工
     * @param employeeId 员工ID
     */
    fireEmployee(employeeId: string) {
        const index = this._employees.findIndex(e => e.id === employeeId);
        if (index === -1) {
            console.warn('员工不存在:', employeeId);
            return;
        }

        const employee = this._employees[index];
        // TODO: 确认解雇，移除员工
        this._employees.splice(index, 1);
        console.log(`解雇 ${employee.name}`);
        this.refreshEmployeeList();
    }
}