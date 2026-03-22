import { _decorator, Component, Node, Button, Label, Sprite } from 'cc';
import { player_sprite } from './player_sprite';
const { ccclass, property } = _decorator;

export interface Skill {
    id: number;
    desc: string;
    action: () => void;
}

// 技能池 - 使用玩家单例模式
export const SKILL_POOL: Skill[] = [
    {
        id: 1,
        desc: "攻击力 +1",
        action: () => {
            if (player_sprite.instance) {
                player_sprite.instance.damage += 1;
                console.log('攻击力提升! 当前:', player_sprite.instance.damage);
            }
        }
    },
    {
        id: 2,
        desc: "射速提升",
        action: () => {
            // 射速需要在武器发射时读取玩家属性
            if (player_sprite.instance) {
                // 暂时用乘数方式存储，之后weapon读取
                (player_sprite.instance as any).fireRateMultiplier =
                    ((player_sprite.instance as any).fireRateMultiplier || 1) * 0.8;
                console.log('射速提升! 当前倍率:', (player_sprite.instance as any).fireRateMultiplier);
            }
        }
    },
    {
        id: 3,
        desc: "移速 +50",
        action: () => {
            if (player_sprite.instance) {
                player_sprite.instance.speed += 50;
                console.log('移速提升! 当前速度:', player_sprite.instance.speed);
            }
        }
    },
    {
        id: 4,
        desc: "子弹穿透+1",
        action: () => {
            if (player_sprite.instance) {
                player_sprite.instance.pierce += 1;
                console.log('子弹穿透+1! 当前穿透:', player_sprite.instance.pierce);
            }
        }
    },
    {
        id: 5,
        desc: "经验获取+1",
        action: () => {
            if (player_sprite.instance) {
                player_sprite.instance.expMultiplier += 1;
                console.log('经验获取+1! 当前倍率:', player_sprite.instance.expMultiplier);
            }
        }
    },
    {
        id: 6,
        desc: "最大生命+1",
        action: () => {
            console.log('最大生命+1 (待实现)');
        }
    },
];

@ccclass('level_up_panel')
export class level_up_panel extends Component {
    @property(Node)
    Player: Node = null; // 玩家节点
    @property(Node)
    panelBg: Node = null; // 面板背景

    @property(Button)
    button1: Button = null; // 按钮1

    @property(Button)
    button2: Button = null; // 按钮2

    @property(Button)
    button3: Button = null; // 按钮3

    @property(Label)
    label1: Label = null; // 技能描述1

    @property(Label)
    label2: Label = null; // 技能描述2

    @property(Label)
    label3: Label = null; // 技能描述3

    // 当前选择的技能
    private _selectedSkill: Skill | null = null;

    // 升级面板显示的回调
    private _onLevelUpCallback: (() => void) | null = null;

    start() {
        // 隐藏面板
        this.node.active = false;

        // 绑定按钮点击事件
        if (this.button1) {
            this.button1.node.on('click', this.onButton1Click, this);
        }
        if (this.button2) {
            this.button2.node.on('click', this.onButton2Click, this);
        }
        if (this.button3) {
            this.button3.node.on('click', this.onButton3Click, this);
        }
    }

    // 显示升级面板
    showSkills(onLevelUp: () => void) {
        this._onLevelUpCallback = onLevelUp;

        // 随机抽取3个不重复的技能
        const skills = this.getRandomSkills(3);

        // 更新按钮文本
        if (this.label1 && skills[0]) {
            this.label1.string = skills[0].desc;
        }
        if (this.label2 && skills[1]) {
            this.label2.string = skills[1].desc;
        }
        if (this.label3 && skills[2]) {
            this.label3.string = skills[2].desc;
        }

        // 保存选中的技能
        this._selectedSkill = skills[0];

        // 显示面板
        this.node.active = true;

        // 将面板层级移到最前面，避免被Player挡住
        const parent = this.node.parent;
        if (parent) {
            this.node.setSiblingIndex(parent.children.length - 1);
        }
    }

    // 随机获取技能
    getRandomSkills(count: number): Skill[] {
        const shuffled = [...SKILL_POOL].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    // 按钮1点击
    onButton1Click() {
        this.selectSkill(0);
    }

    // 按钮2点击
    onButton2Click() {
        this.selectSkill(1);
    }

    // 按钮3点击
    onButton3Click() {
        this.selectSkill(2);
    }

    // 选择技能
    selectSkill(index: number) {
        // 获取当前显示的技能
        const skills = this.getCurrentSkills();
        if (!skills[index]) return;

        const skill = skills[index];

        // 执行技能效果（使用玩家单例）
        if (skill.action) {
            skill.action();
        }

        // 隐藏面板
        this.node.active = false;

        // 触发升级回调
        if (this._onLevelUpCallback) {
            this._onLevelUpCallback();
            this._onLevelUpCallback = null;
        }
    }

    // 获取当前显示的技能（临时存储）
    private _currentSkills: Skill[] = [];

    // 修改showSkills中保存技能的方式
    showSkillsWithData(skills: Skill[], onLevelUp: () => void) {
        this._currentSkills = skills;
        this._onLevelUpCallback = onLevelUp;

        // 更新按钮文本
        if (this.label1 && skills[0]) {
            this.label1.string = skills[0].desc;
        }
        if (this.label2 && skills[1]) {
            this.label2.string = skills[1].desc;
        }
        if (this.label3 && skills[2]) {
            this.label3.string = skills[2].desc;
        }

        // 显示面板
        this.node.active = true;

        // 将面板层级移到最前面，避免被Player挡住
        const parent = this.node.parent;
        if (parent) {
            this.node.setSiblingIndex(parent.children.length - 1);
        }
    }

    // 获取当前显示的技能
    getCurrentSkills(): Skill[] {
        return this._currentSkills;
    }

    // 隐藏面板
    hide() {
        this.node.active = false;
    }
}
