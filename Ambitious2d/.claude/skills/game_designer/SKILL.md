---
name: game_designer
description: 游戏设计辅助技能。当用户讨论游戏玩法、店铺经营、商品系统、顾客系统、员工系统、天赋系统，或请求设计新功能、平衡性调整、玩法优化时触发。专门服务于 Ambitious2d 这款 Cocos Creator 商业模拟经营游戏。
---

# Game Designer Skill

This skill helps design, improve, and extend the Ambitious2d business simulation game built with Cocos Creator 3.8.4.

## Project Context

Ambitious2d 是一款 2D 商业模拟经营游戏，玩家可以开设店铺、雇佣员工、进货摆货、接待顾客。

**Current Features:**
- 多店铺管理（服装店、花店、书店、电器店）
- 货架系统与商品显示
- 顾客自动生成系统
- 员工招聘与管理
- 天赋系统（销售专家、管理专家、进货专家、财务专家、人事专家）
- 本地数据持久化

**Tech Stack:** Cocos Creator 3.8.4, TypeScript

## Design Principles

1. **商业逻辑优先** - 店铺经营要有真实的盈亏计算
2. **渐进式解锁** - 新玩家从低成本、低风险业务开始
3. **反馈清晰** - 每笔交易、每日结算要有明确反馈
4. **数值平衡** - 商品成本、售价、热度、工资等要合理

## Core Game Loops

### 店铺经营循环
```
进货(仓库) → 摆货(货架) → 定价 → 顾客购买 → 收银 → 结算盈亏
```

### 员工工作循环
```
招聘 → 分配岗位 → 工作(提升效率) → 发工资(月底) → 忠诚度变化
```

## Key Data Structures

See `assets/Scripts/DataCollection.ts` for type definitions.

### Player
```typescript
{
  Name, Money, Level, daysPassed,
  livingStatus, rent, expPerDay,
  Talent[], Character[],
  ShelveMaxGoodsNumber, currentStoreName
}
```

### StoreInfo
```typescript
{
  storeName, storeType, location,
  level, shelfCount, popularity,
  todayEarn: number
}
```

### 商业链条
- 批发商(WholeSalerScene) → 经销商(DealerScene) → 店铺 → 顾客
- 仓库(WarehouseScene) → 货架(StoreShelveDicts)
- 招聘(EmployerScene/HRScene) → 员工

## Common Design Tasks

### 1. 新增商品类型
- 在 `DataCollection.ts` 的 `MarketGoodsConfigDict` 添加配置
- 设定 Price, Popularity, Cost
- 在 `TopManager.ts` 的 `initialData()` 初始化仓库数据

### 2. 新增店铺类型
- 在 `DataCollection.ts` 的 `StoreType` 添加枚举
- 在 `CreateNewSotre.ts` 添加店铺类型选项
- 设定租金、初始货架数

### 3. 调整数值平衡
- 商品热度影响顾客生成频率
- 天赋效果加成要合理（通常 5%-15%）
- 员工工资应低于其创造的价值

### 4. 设计新系统（如需要）
- 先画流程图
- 定义数据结构
- 设计 UI 交互
- 实现核心逻辑

## Workflow

When asked to design a feature:
1. Clarify the game loop it belongs to
2. Define data structures needed
3. Sketch the UI flow
4. Implement in TypeScript
5. Test in Cocos Creator

## References

- Main scripts: `assets/Scripts/TopManager.ts`, `assets/Scripts/DataCollection.ts`
- Scene scripts: `assets/Scripts/MainSceneScripts/`
- Scene files: `assets/Scenes/GameScene.scene`, etc.
