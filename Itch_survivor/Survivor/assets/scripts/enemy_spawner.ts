import { _decorator, Component, view, Prefab, instantiate, Node, NodePool } from 'cc';
import { enemy_sprite } from './enemy_sprite';
const { ccclass, property } = _decorator;

@ccclass('enemy_spawner')
export class enemy_spawner extends Component {
    @property(Prefab)
    enemyPrefab: Prefab = null; // 敌人预制体

    @property
    spawnInterval: number = 1; // 生成间隔（秒）

    @property
    enemySpeed: number = 100; // 敌人速度

    @property
    maxEnemies: number = 20; // 最大敌人数量

    // 活着的敌人列表
    enemyList: Node[] = [];

    // 对象池
    private _pool: NodePool = new NodePool();

    private _timer: number = 0;
    private _player: Node | null = null;

    start() {
        this._player = this.findPlayer();
        // 预先创建一些敌人到对象池
        this.preloadEnemies(5);
    }

    onDestroy() {
        // 清理对象池
        this._pool.clear();
    }

    preloadEnemies(count: number) {
        for (let i = 0; i < count; i++) {
            const enemy = instantiate(this.enemyPrefab);
            this._pool.put(enemy);
        }
    }

    findPlayer(): Node | null {
        // 路径: Canvas.GameNode.PlayerSprite
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            const gameNode = canvas.getChildByName('GameNode');
            if (gameNode) {
                const player = gameNode.getChildByName('PlayerSprite');
                if (player) return player;
            }
        }
        return null;
    }

    // 从enemyList中移除敌人
    removeEnemy(enemy: Node) {
        const index = this.enemyList.indexOf(enemy);
        if (index > -1) {
            this.enemyList.splice(index, 1);
        }
    }

    getEnemyCount(): number {
        return this.enemyList.length;
    }

    // 从对象池获取敌人，或创建新敌人
    getEnemyFromPool(): Node {
        let enemy: Node;

        if (this._pool.size() > 0) {
            enemy = this._pool.get()!;
        } else {
            enemy = instantiate(this.enemyPrefab);
        }

        return enemy;
    }

    // 回收敌人到对象池
    putEnemyToPool(enemy: Node) {
        // 从列表中移除
        this.removeEnemy(enemy);
        // 放回池中
        this._pool.put(enemy);
    }

    update(deltaTime: number) {
        this._timer += deltaTime;

        if (this._timer >= this.spawnInterval) {
            this._timer = 0;
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        if (!this.enemyPrefab) {
            console.warn('请在enemy_spawner中设置enemyPrefab');
            return;
        }

        // 检查当前敌人数量，超过上限不再生成
        if (this.getEnemyCount() >= this.maxEnemies) {
            return;
        }

        // 每次生成时重新查找Player
        this._player = this.findPlayer();

        // 获取屏幕尺寸
        const designSize = view.getDesignResolutionSize();
        const width = designSize.width;
        const height = designSize.height;

        // 在屏幕边缘随机生成位置
        const pos = this.getRandomEdgePosition(width, height);

        // 从对象池获取敌人
        const enemy = this.getEnemyFromPool();

        // 添加到场景
        const gameNode = this.node.scene.getChildByName('Canvas')?.getChildByName('GameNode');
        enemy.parent = gameNode || this.node.parent;
        enemy.setPosition(pos.x, pos.y, 0);
        enemy.active = true;

        // 添加到敌人列表
        this.enemyList.push(enemy);

        // 设置敌人目标为Player
        const enemyScript = enemy.getComponent(enemy_sprite);
        if (enemyScript) {
            enemyScript.speed = this.enemySpeed;
            enemyScript.target = this._player;
        }
    }

    // 寻找最近的敌人
    getNearestEnemy(): Node | null {
        if (this.enemyList.length === 0) return null;

        const playerNode = this.findPlayer();
        if (!playerNode) return null;

        const playerPos = playerNode.position;
        let nearestEnemy: Node | null = null;
        let minDistSq = Infinity;

        for (const enemy of this.enemyList) {
            if (!enemy || !enemy.active) continue;

            const enemyPos = enemy.position;
            const dx = playerPos.x - enemyPos.x;
            const dy = playerPos.y - enemyPos.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < minDistSq) {
                minDistSq = distSq;
                nearestEnemy = enemy;
            }
        }

        return nearestEnemy;
    }

    getRandomEdgePosition(width: number, height: number): { x: number, y: number } {
        const edge = Math.floor(Math.random() * 4);
        let x: number, y: number;

        switch (edge) {
            case 0: // 上边
                x = Math.random() * width;
                y = height;
                break;
            case 1: // 下边
                x = Math.random() * width;
                y = 0;
                break;
            case 2: // 左边
                x = 0;
                y = Math.random() * height;
                break;
            case 3: // 右边
                x = width;
                y = Math.random() * height;
                break;
        }

        return { x, y };
    }
}
