import { SpriteFrame } from "cc";

export interface Player {        //商店
    ID:number;
    Name: string;
    Talent: typeof TalentDict[];
    Money: number;
    Level: number;
    Store: number[];

 }
export interface Store {        //商店
    ID:number;
    Name: string;
    Type: string;
    Level: number;
    Employer: Employer[];
    Goods:Good[];
    Profit: number;
    Popularity: number; // 人气,决定顾客数量
    EvaluationLevel: number;
 }
 
 export interface Employer {    //员工
    ID: number;             
    Name: string;           //名字  
    Age: number;            //年龄
    Sex: string;            //性别
    Skill:string;           //技能  
    SkillLevel:number;      //技能等级
    Avatar: number;         //头像
    Salary: number;         //工资
    loyalty: number;        //忠诚度
 }
 export interface Good {   //商品
    ID:number;
    Name: string;
    Type: number;
    InPrice: number; // 进价
    OutPrice: number; // 售价
    Popularity: number; // 人气，0-100
    LeftNumber: number; // 剩余数量
    Description: string;
    Frame: number;
 }
 export interface Contract {   //合同
    ID:number;
    Src: string;
    DstStoreID: number;
    GoodName: string;
    Price: number;
 }

 export const EvaluationDict: { [key: number]: string} = {
    0:"乌烟瘴气",
    1:"乏善可陈",
    2:"干净整洁",
    3:"富丽堂皇",
    4:"五星商家",
  }

  export const StoreTypeList:string[] = ["服装店","花店","书店","电器店"];
  export const SimpleAllStoreGoodsDict: { [storeType: string]: string[] } = {
    "服装店": ["便宜女装","便宜男装","一般女装","一般男装","昂贵女装","昂贵男装"],
    "花店": ["便宜花束","一般花束","昂贵花束"],
    "书店": ["励志书籍","工具书籍","言情书籍","科幻书籍","漫画书籍"],
    "电器店": ["电视","冰箱","洗衣机","空调","电脑","手机","平板"],

  }

//存储货物图片frame
  export const GoodsFrameDict: { [key: string]: number} = {
    "便宜女装": 0,
    "便宜男装": 1,
    "一般女装": 2,
    "一般男装": 3,
    "昂贵女装": 4,
    "昂贵男装": 5,
    "便宜花束": 6,
    "一般花束": 7,
    "昂贵花束": 8,
    "励志书籍": 9,
    "工具书籍": 10,
    "言情书籍": 11,
  }

  //存储员工技能
 export const TalentDict: {
    [key: string]: {
      id: number;
      effect: string;
      description?: string; // 详细描述（可选）      // 图标路径（可选）
    };
  } = {
    "销售专家": {
      id: 0,
      effect: "销量+10%",
      description: "精通销售策略，让店铺销量提升。",
    },
    "管理专家": {
      id: 1,
      effect: "员工工资-5%",
      description: "通过高效管理降低人员成本。",
    },
    "进货专家": {
      id: 2,
      effect: "进货价格-10%",
      description: "通过精明进货降低成本。",
    },
    "财务专家": {
      id: 3,
      effect: "利润+10%",
      description: "通过财务管理增加利润。",
    },
    "人事专家": {
      id: 4,
      effect: "员工忠诚度+10%",
      description: "通过人事管理增加员工忠诚度。",
    },
    
  }


  