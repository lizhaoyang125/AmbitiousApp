import { _decorator, Component, JsonAsset, resources } from 'cc';
import { IEmployee, IPart, ITechNode } from '../Data/GameInterfaces';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager {
    private static _instance: DataManager;
    public static get instance() {
        if (!this._instance) this._instance = new DataManager();
        return this._instance;
    }

    public employees: IEmployee[] = [];
    public parts: IPart[] = [];
    public techTree: ITechNode[] = [];

    // 异步加载所有配置
    public async initData() {
        return new Promise<void>((resolve, reject) => {
            resources.loadDir('Data', JsonAsset, (err, assets) => {
                if (err) {
                    console.error("加载配置失败:", err);
                    reject();
                    return;
                }

                console.log("加载到的资源数量:", assets.length);
                for (let i = 0; i < assets.length; i++) {
                    console.log("资源名称:", assets[i].name);
                }

                const employeesAsset = assets.find(a => a.name === 'Employees');
                const partsAsset = assets.find(a => a.name === 'Parts');

                if (employeesAsset) {
                    this.employees = (employeesAsset as JsonAsset).json as IEmployee[];
                    console.log("员工配置加载完成:", this.employees.length);
                } else {
                    console.error("未找到 Employees 资源");
                }

                if (partsAsset) {
                    this.parts = (partsAsset as JsonAsset).json as IPart[];
                    console.log("零件配置加载完成:", this.parts.length);
                } else {
                    console.error("未找到 Parts 资源");
                }

                if (this.employees.length > 0 && this.parts.length > 0) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    // 根据ID查找零件的快捷方法
    public getPartById(id: string): IPart | undefined {
        return this.parts.find(p => p.id === id);
    }
}