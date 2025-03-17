import { _decorator, Component, Node,Vec3 ,Sprite} from 'cc';
import { TopManager } from '../TopManager';
const { ccclass, property } = _decorator;

@ccclass('CustomerScript')
export class CustomerScript extends Component {

    @property(Number)
    public speed:number=100;
    @property(Sprite)
    public CustomerMask: Sprite = null; // 卡牌正面
    public ShelveNumber:number=0;
    public DstShelve:number=0;

    private MiddlePosition: Vec3 = new Vec3(0, 280, 0);
    private ShelvePositions:Vec3[]=[];
    private SelectShelve:number=0;
    private IsNewCustomer:boolean=true;
    public cdTime: number = 2; // 卡牌冷却时间
    public cdTimer: number = 0; // 卡牌冷却计时器
    private MoveState:number=0;
    public BuyGood:string="";
    public BuyPrice:number=0;

    onLoad(){
        console.log("CustomerScript onLoad ");
    }
    onDestroy(){
        this.ShelvePositions.length=0;
    }
    start() {
        
        console.log("CustomerScript onLoad ShelveNumber:"+this.ShelveNumber+" DstShelve:"+this.DstShelve);
        for(let i=0;i<this.ShelveNumber;i++){
            this.ShelvePositions.push(new Vec3(-100*((-1)**i),150-100*(i >> 1),0));
        }
        this.SelectShelve = Math.floor(Math.random() * this.ShelvePositions.length);
        console.log("CustomerScript onLoad ShelveNumber:"+this.ShelveNumber+" DstShelve:"+this.DstShelve);

        console.log(this.SelectShelve);
        this.cdTimer = this.cdTime;
        this.MoveState=0;
    }
    update(deltaTime:number){
        this.customerMove(deltaTime);
    }
    customerMove(deltaTime:number){
        //console.log("customerMove MoveState:"+this.MoveState);
        switch(this.MoveState){
            case 0:this.moveX(this.node,this.MiddlePosition,deltaTime); break;
            case 1:this.moveY(this.node,this.ShelvePositions[this.SelectShelve].clone().add(new Vec3(0,50,0)),deltaTime); break;
            case 2:this.moveX(this.node,this.ShelvePositions[this.SelectShelve],deltaTime); break;
            case 3:this.takeGoods(deltaTime); break;
            case 4:this.moveX(this.node,this.MiddlePosition,deltaTime); break;
            case 5:this.moveY(this.node,this.MiddlePosition,deltaTime); break;
            case 6:this.payCash(deltaTime); break;
            case 7:this.moveX(this.node,this.MiddlePosition.clone().subtract(new Vec3(200,0,0)),deltaTime); break;
            case 8:this.node.destroy(); break;
            default:this.MoveState=100;break;
        }
    }
    takeGoods(deltaTime:number){
        this.CustomerMask.fillRange=this.cdTimer / this.cdTime;
        this.cdTimer-=deltaTime;
        if(this.cdTimer<=this.cdTime/2){
            this.MoveState=4;
        }
    }
    payCash(deltaTime:number){
        this.CustomerMask.fillRange=this.cdTimer / this.cdTime;
        this.cdTimer-=deltaTime;
        if(this.cdTimer<=0){
            this.MoveState=7;
            console.log("payCash BuyGood:"+this.BuyGood+" BuyPrice:"+this.BuyPrice);
            TopManager.Instance.Player.Money+=this.BuyPrice;
        }
        
    }
    moveX (Self:Node,TargetPosition:Vec3,deltaTime:number){
        //console.log("moveX MoveState:"+this.MoveState+"abs:"+Math.abs(Self.position.x - TargetPosition.x));
        if(Self.position.x<=TargetPosition.x){
            Self.setPosition(Self.position.x+this.speed*deltaTime,Self.position.y);
            if (Math.abs(Self.position.x - TargetPosition.x) <= 2) {
                switch(this.MoveState){
                    case 0:this.MoveState = 1;break;
                    case 2:this.MoveState = 3;break;
                    case 4:this.MoveState = 5;break;
                    case 7:this.MoveState = 8;break;
                }
            }
        }else{
            Self.setPosition(Self.position.x-this.speed*deltaTime,Self.position.y);
            if (Math.abs(Self.position.x - TargetPosition.x) <= 2) {
                switch(this.MoveState){
                    case 0:this.MoveState = 1;break;
                    case 2:this.MoveState = 3;break;
                    case 4:this.MoveState = 5;break;
                    case 7:this.MoveState = 8;break;
                }
            }
        }
    }
    moveY(Self:Node,TargetPosition:Vec3,deltaTime:number){
       // console.log("moveY TargetPosition:"+TargetPosition.y);
       // console.log("moveY MoveState:"+this.MoveState+"abs:"+Math.abs(Self.position.y - TargetPosition.y));
        if(Self.position.y<=TargetPosition.y){
            Self.setPosition(Self.position.x,Self.position.y+this.speed*deltaTime);
            if (Math.abs(Self.position.y - TargetPosition.y) <= 2) {
                switch(this.MoveState){
                    case 1:this.MoveState = 2;break;
                    case 3:this.MoveState = 0;break;
                    case 5:this.MoveState = 6;break;
                }
            }
        }else{
            Self.setPosition(Self.position.x,Self.position.y-this.speed*deltaTime);
            if (Math.abs(Self.position.y - TargetPosition.y) <= 2) {
                switch(this.MoveState){
                    case 1:this.MoveState = 2;break;
                    case 3:this.MoveState = 0;break;
                    case 5:this.MoveState = 6;break;
                }
            }
        }
    }

}


