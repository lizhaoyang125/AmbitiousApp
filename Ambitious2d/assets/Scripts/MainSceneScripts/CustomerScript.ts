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


    onLoad(){
        this.ShelvePositions.push(new Vec3(-100,100,0));
        this.ShelvePositions.push(new Vec3(110,100,0));

    }
    onDestroy(){
        this.ShelvePositions.length=0;
    }
    start() {
        this.SelectShelve = Math.floor(Math.random() * this.ShelvePositions.length);
        console.log(this.SelectShelve);
        this.cdTimer = this.cdTime;
    }
    update(deltaTime:number){
        this.customerMove(deltaTime);
    }
    customerMove(deltaTime:number){
        this.moveX(this.node,this.MiddlePosition,deltaTime);
        this.moveY(this.node,this.ShelvePositions[this.SelectShelve],deltaTime);
        this.cdTimer-=deltaTime;
        this.pay(deltaTime);
    }
    pay(deltaTime:number){
        this.CustomerMask.fillRange=this.cdTimer / this.cdTime;
        this.moveX(this.node,this.MiddlePosition,deltaTime);
    }
    moveX(Self:Node,TargetPosition:Vec3,deltaTime:number){
        if(Self.position.x<=TargetPosition.x){
            Self.setPosition(Self.position.x+this.speed*deltaTime,Self.position.y);
            if(Self.position.x>=TargetPosition.x){
                return true;
            }
        }else{
            Self.setPosition(Self.position.x-this.speed*deltaTime,Self.position.y);
            if(Self.position.x<=TargetPosition.x){
                return true;
            }
        }
    }
    moveY(Self:Node,TargetPosition:Vec3,deltaTime:number){
        if(Self.position.y<=TargetPosition.y){
            Self.setPosition(Self.position.x,Self.position.y+this.speed*deltaTime);
            if(Self.position.y>=TargetPosition.y){
                return true;
            }
        }else{
            Self.setPosition(Self.position.x,Self.position.y-this.speed*deltaTime);
            if(Self.position.y<=TargetPosition.y){
                return true;
            }
        }
    }

}


