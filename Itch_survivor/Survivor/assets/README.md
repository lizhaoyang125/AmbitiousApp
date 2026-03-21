# Survivor Game 项目结构

## 场景层级结构

```
Canvas (根节点)
├── GameNode (游戏节点容器)
│   ├── PlayerSprite (玩家)
│   ├── Main Camera (相机)
│   └── EnemySpawner (敌人管理器)
├── ExpBar (经验条 - ProgressBar组件)
├── LevelUpPanel (升级面板 - 初始隐藏)
│   ├── Background (黑色半透明背景)
│   ├── Button1 (技能按钮1)
│   ├── Button2 (技能按钮2)
│   └── Button3 (技能按钮3)
└── (动态生成的敌人、子弹、经验球)
```

## 脚本功能说明

### 1. player_sprite.ts
**挂载节点:** PlayerSprite
**功能:** 玩家控制与碰撞检测
**属性:**
- `speed` - 移动速度，默认200
- `startAtCenter` - 是否在屏幕中央开始
- `collisionRadius` - 碰撞检测半径，默认30

**核心逻辑:**
- WASD键盘控制移动
- 每帧检测与敌人的碰撞
- 碰撞到敌人时输出"Game Over"

---

### 2. camera_follow.ts
**挂载节点:** Main Camera
**功能:** 相机跟随玩家
**属性:**
- `target` - 跟随目标节点（拖入PlayerSprite）
- `smoothSpeed` - 跟随平滑度

**核心逻辑:**
- 使用lateUpdate在所有更新后执行
- 直接吸附跟随player位置，无抖动

---

### 3. enemy_spawner.ts
**挂载节点:** GameNode (或Canvas)
**功能:** 敌人管理与生成
**属性:**
- `enemyPrefab` - 敌人预制体（必填）
- `spawnInterval` - 生成间隔，默认1秒
- `enemySpeed` - 敌人移动速度，默认100
- `maxEnemies` - 最大敌人数量，默认20

**公共属性:**
- `enemyList` - 活着的敌人节点数组

**核心逻辑:**
- 屏幕边缘随机位置生成敌人
- 使用对象池复用敌人节点
- 提供getNearestEnemy()寻找最近敌人

---

### 4. enemy_sprite.ts
**挂载节点:** 敌人预制体根节点
**功能:** 敌人AI - 追踪玩家与血量系统
**属性:**
- `target` - 目标节点（自动设置为PlayerSprite）
- `speed` - 移动速度，默认100
- `hp` - 生命值，默认2

**核心逻辑:**
- 每帧计算方向并向玩家移动
- 移动前重新查找player位置
- 受击时调用takeDamage()扣血
- 血量<=0时回收敌人到对象池
- 受击时闪烁白光反馈（0.1秒）

---

### 5. weapon.ts
**挂载节点:** PlayerSprite
**功能:** 武器系统 - 发射子弹
**属性:**
- `bulletPrefab` - 子弹预制体（必填）
- `fireInterval` - 发射间隔，默认0.5秒
- `bulletSpeed` - 子弹速度，默认400

**核心逻辑:**
- 每隔0.5秒寻找最近敌人
- 向敌人方向发射子弹（直线飞行）

---

### 6. bullet_sprite.ts
**挂载节点:** 子弹预制体根节点
**功能:** 子弹飞行与碰撞检测
**属性:**
- `damage` - 伤害值，默认1
- `collisionRadius` - 碰撞检测半径，默认20
- `hitEffectPrefab` - 击中特效预制体

**核心逻辑:**
- 直线匀速飞行
- 检测与敌人的碰撞
- 击中敌人后调用takeDamage()扣血
- 子弹命中后销毁自己

---

### 7. hit_effect.ts
**挂载节点:** 击中特效预制体根节点
**功能:** 击中特效动画
**属性:**
- `duration` - 特效持续时间，默认0.3秒
- `startScale` - 初始大小，默认1.0

**核心逻辑:**
- 创建时设置初始缩放
- 随时间线性缩小直到消失
- 动画结束后自动销毁

---

### 8. game_manager.ts
**挂载节点:** GameNode
**功能:** 游戏管理器 - 经验与等级系统
**属性:**
- `expToLevelUp` - 升级所需经验，默认10
- `expGemPrefab` - 经验球预制体
- `expBar` - 经验条组件
- `levelUpPanel` - 升级面板组件

**公共属性:**
- `currentExp` - 当前经验值
- `currentLevel` - 当前等级
- `expGemList` - 经验球列表
- `isPaused` - 游戏是否暂停

**核心逻辑:**
- 管理玩家经验和等级
- 升级时所需经验增加50%
- 提供spawnExpGem()生成经验球
- 自动查找并更新Canvas下的ExpBar进度条
- 升级时自动弹出LevelUpPanel选择技能
- 提供pauseGame()/resumeGame()暂停恢复游戏

---

### 9. exp_gem.ts
**挂载节点:** 经验球预制体根节点
**功能:** 经验球 - 玩家升级道具
**属性:**
- `expValue` - 经验值，默认1
- `moveSpeed` - 被吸入时的移动速度，默认200

**核心逻辑:**
- 初始显示黄色
- 被玩家靠近（100像素内）时开始被吸入
- 距离小于20时被收集
- 收集时通知game_manager增加经验

---

### 10. level_up_panel.ts
**挂载节点:** LevelUpPanel (升级面板节点)
**功能:** 升级面板与技能选择
**属性:**
- `panelBg` - 面板背景节点
- `button1/2/3` - 技能选择按钮
- `label1/2/3` - 技能描述文本

**核心逻辑:**
- 定义SKILL_POOL技能池
- 随机抽取3个不重复技能显示在按钮上
- 点击按钮执行技能效果
- 执行后隐藏面板并恢复游戏

**技能池 (SKILL_POOL):**
- 攻击力+1
- 射速提升
- 移速+50
- 子弹穿透+1
- 经验获取+1
- 最大生命+1

---

## 预制体需求

1. **敌人预制体 (EnemyPrefab)**
   - 根节点挂载 `enemy_sprite`
   - 包含Sprite组件显示敌人图形

2. **子弹预制体 (BulletPrefab)**
   - 根节点挂载 `bullet_sprite`
   - 包含Sprite组件显示子弹图形

3. **击中特效预制体 (HitEffectPrefab)**
   - 根节点挂载 `hit_effect`
   - 包含Sprite组件（白色圆形）
   - 预设大小为需要显示的最大尺寸

4. **经验球预制体 (ExpGemPrefab)**
   - 根节点挂载 `exp_gem`
   - 包含Sprite组件（黄色小圆形）
   - 建议尺寸比敌人小

---

## 使用流程

1. 创建场景，设置设计分辨率为1280x720
2. 创建节点结构：Canvas > GameNode > PlayerSprite
3. 给PlayerSprite挂载: player_sprite, camera_follow, weapon
4. 给GameNode挂载: enemy_spawner, game_manager
5. 创建预制体：敌人、子弹、击中特效、经验球
6. 创建升级面板：Canvas > LevelUpPanel > Background, Button1, Button2, Button3
7. 给LevelUpPanel挂载: level_up_panel
8. 在enemy_spawner中设置enemyPrefab
9. 在weapon中设置bulletPrefab
10. 在game_manager中设置expGemPrefab和levelUpPanel
11. 运行游戏

## 经验系统流程

1. 敌人死亡时调用game_manager.spawnExpGem()在当前位置生成经验球
2. 玩家靠近经验球（<100像素）时触发吸入效果
3. 经验球被收集时调用game_manager.addExp()增加经验
4. 经验满足升级条件时自动升级

---

## 优化说明

- **对象池**: enemy_spawner使用NodePool复用敌人
- **距离计算**: 使用距离平方(magSqr)比较避免开方运算
- **跟随优化**: 相机使用lateUpdate避免抖动
