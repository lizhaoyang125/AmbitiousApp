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
    }
    update(deltaTime:number){
        if(this.ShelvePositions[this.SelectShelve].x>0){
            this.customerMove(deltaTime,1);
        }else{
            this.customerMove(deltaTime,-1);
        }
    }
    customerMove(deltaTime:number,direction:number){
        if(this.node.position.x<=this.MiddlePosition.x && this.IsNewCustomer){
            this.node.setPosition(this.node.position.x+this.speed*deltaTime,this.node.position.y);
        }else{
            this.IsNewCustomer=false;
            if(this.node.position.y>=this.ShelvePositions[this.SelectShelve].y+50){    
                this.node.setPosition(this.node.position.x,this.node.position.y-100*deltaTime);
            }else{
                if(this.node.position.x*direction<=this.ShelvePositions[this.SelectShelve].x*direction){
                    this.node.setPosition(this.node.position.x+direction*this.speed*deltaTime,this.node.position.y);
                    //console.log("left"+this.node.position.x+"right"+this.ShelvePositions[this.SelectShelve].x);
                }else{
                    if(this.cdTimer>0){
                        this.cdTimer-=deltaTime;
                    }
                    this.pay();
                }
            }
        }
    }
    pay(){
        this.CustomerMask.fillRange=this.cdTimer / this.cdTime;
    }


}


