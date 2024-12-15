import { _decorator, Component, Node,Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {

    @property(Number)
    public speed:number=100;
    private MiddlePosition: Vec3 = new Vec3(0, 280, 0);
    private ShelvePositions:Vec3[]=[];
    private SelectShelve:number=0;
    private IsNewCustomer:boolean=true;


    onLoad(){
        this.ShelvePositions.push(new Vec3(-100,150,0));
    }
    onDestroy(){
        this.ShelvePositions.length=0;
    }
    start() {
        this.SelectShelve = Math.floor(Math.random() * this.ShelvePositions.length);
        console.log(this.SelectShelve);
    }
    update(deltaTime:number){
        if(this.node.position.x<=this.MiddlePosition.x && this.IsNewCustomer){
            this.node.setPosition(this.node.position.x+this.speed*deltaTime,this.node.position.y);
        }else{
            this.IsNewCustomer=false;
            if(this.node.position.y>=this.ShelvePositions[this.SelectShelve].y+50){    
                this.node.setPosition(this.node.position.x,this.node.position.y-100*deltaTime);
            }else{
                if(this.node.position.x>=this.ShelvePositions[this.SelectShelve].x){
                    this.node.setPosition(this.node.position.x-this.speed*deltaTime,this.node.position.y);
                    console.log("left"+this.node.position.x+"right"+this.ShelvePositions[this.SelectShelve].x);

                }else{

                }
            }
        }
    }


}


