// 员工等级：S, A, B, C
export enum EmployeeLevel { S = "S", A = "A", B = "B", C = "C" }

// 员工属性
export interface IEmployee {
    id: string;
    name: string;
    avatar: string;      // 头像资源路径
    level: EmployeeLevel;
    ability: {
        design: number;  // 设计能力（影响外观评分）
        engine: number;  // 工程能力（影响性能评分）
        software: number; // 软件能力（影响智能评分）
    };
    salary: number;      // 月薪
    energy: number;      // 当前体力
    maxEnergy: number;   // 体力上限
}

// 汽车零件类别
export enum PartCategory {
    Engine = "Engine",
    Chassis = "Chassis",
    Body = "Body",
    Battery = "Battery",
    OS = "OS"
}

// 汽车零件属性
export interface IPart {
    id: string;
    name: string;
    category: PartCategory;
    cost: number;        // 制造成本
    stats: {
        perf: number;    // 性能加成
        lux: number;     // 豪华度加成
        tech: number;    // 科技感加成
    };
    unlockTechId: string; // 需要哪个科技解锁
    desc: string;
}

// 科技树节点
export interface ITechNode {
    id: string;
    name: string;
    preIds: string[];    // 前置科技 ID 列表
    rdCost: number;      // 消耗研发点
    moneyCost: number;   // 消耗金钱
    desc: string;
}