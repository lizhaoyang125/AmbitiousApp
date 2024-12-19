import { _decorator, Component, Node,Vec3 ,Sprite} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {

    @property(Number)
    public speed:number=100;
    @property(Sprite)
    public CustomerMask: Sprite = null; // 卡牌正面

    private MiddlePosition: Vec3 = new Vec3(0, 280, 0);
    private ShelvePositions:Vec3[]=[];
    private SelectShelve:number=0;
    private IsNewCustomer:boolean=true;
    public cdTime: number = 2; // 卡牌冷却时间
    public cdTimer: number = 0; // 卡牌冷却计时器
    private MoveState:number=0;


    onLoad(){
        this.ShelvePositions.push(new Vec3(-100,150,0));
        this.ShelvePositions.push(new Vec3(110,150,0));


    }
    onDestroy(){
        this.ShelvePositions.length=0;
    }
    start() {
        this.SelectShelve = Math.floor(Math.random() * this.ShelvePositions.length);
        console.log(this.SelectShelve);
        this.cdTimer = this.cdTime;
        this.MoveState=0;
    }
    update(deltaTime:number){
        this.customerMove(deltaTime);
    }
    customerMove(deltaTime:number){
        console.log("customerMove MoveState:"+this.MoveState);
        switch(this.MoveState){
            case 0:this.moveX(this.node,this.MiddlePosition,deltaTime); break;
            case 1:this.moveY(this.node,this.ShelvePositions[this.SelectShelve].clone().add(new Vec3(0,50,0)),deltaTime); break;
            case 2:this.pay(deltaTime); break;
            default:this.MoveState=100;break;
        }
    }
    pay(deltaTime:number){
        this.CustomerMask.fillRange=this.cdTimer / this.cdTime;
        this.cdTimer-=deltaTime;
        this.MoveState=3;
    }
    moveX (Self:Node,TargetPosition:Vec3,deltaTime:number){
        console.log("moveX MoveState:"+this.MoveState+"abs:"+Math.abs(Self.position.x - TargetPosition.x));
        if(Self.position.x<=TargetPosition.x){
            Self.setPosition(Self.position.x+this.speed*deltaTime,Self.position.y);
            if (Math.abs(Self.position.x - TargetPosition.x) <= 2) {
                this.MoveState = 1;
            }
        }else{
            Self.setPosition(Self.position.x-this.speed*deltaTime,Self.position.y);
            if (Math.abs(Self.position.x - TargetPosition.x) <= 2) {
                this.MoveState = 1;
            }
        }
    }
    moveY(Self:Node,TargetPosition:Vec3,deltaTime:number){
        console.log("moveY TargetPosition:"+TargetPosition.y);
        console.log("moveY MoveState:"+this.MoveState+"abs:"+Math.abs(Self.position.y - TargetPosition.y));
        if(Self.position.y<=TargetPosition.y){
            Self.setPosition(Self.position.x,Self.position.y+this.speed*deltaTime);
            if (Math.abs(Self.position.y - TargetPosition.y) <= 2) {
                this.MoveState = 2;
            }
        }else{
            Self.setPosition(Self.position.x,Self.position.y-this.speed*deltaTime);
            if (Math.abs(Self.position.y - TargetPosition.y) <= 2) {
                this.MoveState = 2;
            }
        }
    }

}


