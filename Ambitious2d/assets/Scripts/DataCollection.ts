import { SpriteFrame } from "cc";

export interface Store {        //商店
    ID:number;
    Name: string;
    Type: StoreType;
    Level: number;
    Employer: Employer[];
    Goods:Good[];
    Profit: number;
    Popularity: number; // 人气,决定顾客数量
    EvaluationLevel: Evaluation;
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
    Type: GoodType;
    InPrice: number; // 进价
    OutPrice: number; // 售价
    Popularity: number; // 人气，0-100
    LeftNumber: number; // 剩余数量
    Description: string;
 }
 export interface Contract {   //合同
    ID:number;
    Src: string;
    DstStoreID: number;
    GoodName: GoodType;
    Price: number;
 }

  export enum Evaluation {
    "乌烟瘴气",
    "乏善可陈",
    "干净整洁",
    "富丽堂皇",
    "五星商家",
  }
  export enum StoreType {
    "批发店",
    "服装店",
    "书店",
    "花店",
    "电器店",
  }
  export enum GoodType {
    "便宜女装",
    "便宜男装",
    "中等女装",
    "中等男装",
    "昂贵女装",
    "昂贵男装",
    "便宜花束",
    "中等花束",
    "昂贵花束",
    "励志书籍",
    "工具书籍",
    "言情书籍",
    "科幻书籍",
    "漫画书籍",
    "电视",
    "冰箱",
    "洗衣机",
    "空调",
    "电脑",
    "手机",
    "平板",
  
  }

  export const GoodsDict: { [key: string]: { [key: string]: number } } = {
    "服装店": {"便宜女装": 0,"便宜男装": 1,"中等女装": 2,"中等男装": 3,"昂贵女装": 4,"昂贵男装": 5},
    "书店": {"励志书籍": 0,"工具书籍": 1,"言情书籍": 2,"科幻书籍": 3,"漫画书籍": 4},
    "电器店": {"电视": 0,"冰箱": 1,"洗衣机": 2,"空调": 3,"电脑": 4,"手机": 5,"平板": 6},
    "花店": {"便宜花束": 0,"中等花束": 1,"昂贵花束": 2},
    "批发店": {"便宜女装": 0,"便宜男装": 1,"中等女装": 2,"中等男装": 3,"昂贵女装": 4,"昂贵男装": 5},
};
