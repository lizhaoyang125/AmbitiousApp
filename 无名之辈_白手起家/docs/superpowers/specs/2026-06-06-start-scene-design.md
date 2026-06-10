# StartScene 设计规范

> 最后更新：2026-06-06
> 场景：StartScene（启动场景）

---

## 1. 设计方向与美学

**游戏类型**：2D 像素风店铺模拟经营
**参考氛围**：开罗游戏 + 温馨小店的怀旧感

**美学关键词**：暖调、像素复古、简洁不简陋、慢节奏的成就感

**配色方案**：
- 主色：`#2D1B0E`（深木棕，背景）
- 次色：`#F5E6D3`（米黄，主文字/按钮）
- 点缀：`#D4A84B`（金币黄，强调/图标）
- 辅助：`#8B6914`（深金，边框）
- 警告：`#C75D5D`（淡红，警示）
- 成功：`#5D9B5D`（淡绿，确认）

**字体**：
- 标题：`"Press Start 2P"`（Google Fonts，像素风）
- 正文：`"Noto Sans SC"`（中文支持）

**动画哲学**：
- 缓慢而有力的入场动画（logo 淡入 + 轻微上浮）
- 按钮 hover 有像素感的缩放（scale 1.05，150ms）
- 点击有按压反馈（scale 0.95，100ms）
- 场景元素有微妙的呼吸感（subtle idle float）

---

## 2. 场景结构

```
StartScene
├── Canvas (根节点，适配各种分辨率)
│   ├── BackgroundLayer (背景层)
│   │   ├── LogoSprite (游戏 Logo，居中偏上)
│   │   └── DecorativeLine (装饰线条，Logo 下方)
│   │
│   ├── TitleLabel (游戏标题 "无名之辈")
│   │   └── SubtitleLabel ("白手起家")
│   │
│   ├── MenuPanel (主菜单面板，居中)
│   │   ├── NewGameBtn (新游戏按钮)
│   │   ├── ContinueBtn (继续游戏，条件显示)
│   │   └── SettingsBtn (设置按钮)
│   │
│   ├── VersionLabel (版本号，左下角)
│   │
│   └── ParticleLayer (装饰粒子层，可选)
```

---

## 3. 布局与间距

```
屏幕比例：16:9 优先，16:10 兼容

垂直布局（从上到下）:
  - 顶部安全区: 10%
  - Logo 区域: 25% 高度，居中
  - 标题区域: 10% 高度
  - 菜单面板: 40% 高度，垂直居中
  - 底部信息: 15%

Logo 尺寸：
  - 最大宽度: 屏幕宽 × 40%
  - 保持比例

菜单按钮：
  - 按钮宽度: 240px
  - 按钮高度: 56px
  - 按钮间距: 16px
  - 字体大小: 16px (Press Start 2P)
```

---

## 4. 组件设计

### 4.1 背景 (BackgroundLayer)

- 纯色背景 `#2D1B0E`
- 可选：轻微的瓦片纹理叠加（tiled, 5% opacity）
- 全屏覆盖

### 4.2 Logo (LogoSprite)

- 像素风店铺 icon（可以用简单像素图形表示一个小店轮廓）
- 尺寸：128×128 或 256×256
- 动画：场景加载时从 opacity 0 → 1（1200ms ease-out），同时 Y 轴轻微上浮 20px → 0
- 微呼吸动画：loop，Y 轴 ±3px，周期 3s

### 4.3 标题文字 (TitleLabel + SubtitleLabel)

**主标题 "无名之辈"**：
- 字体：Press Start 2P，32px
- 颜色：#F5E6D3
- 字间距：4px
- 位置：Logo 下方 24px

**副标题 "白手起家"**：
- 字体：Noto Sans SC，24px，font-weight: 300
- 颜色：#D4A84B（金色）
- 位置：主标题下方 8px

### 4.4 菜单按钮 (MenuButton)

**通用样式**：
- 背景：9-patch 或 solid color `#3D2B1E`
- 边框：2px solid `#8B6914`
- 圆角：4px（轻微，保持像素感）
- 内边距：水平 24px，垂直 12px
- 字体：Press Start 2P，14px
- 颜色：#F5E6D3

**Hover 状态**：
- 背景色：`#4D3B2E`
- 边框色：`#D4A84B`
- Scale: 1.05
- 过渡：150ms ease-out
- 光标：pointer

**按下状态**：
- Scale: 0.95
- 边框色：`#D4A84B`
- 过渡：100ms

**禁用状态**：
- Opacity: 0.5
- 光标：not-allowed

### 4.5 继续游戏按钮 (ContinueBtn)

- 初始状态：hide（`active = false`）
- 显示条件：本地存储有存档时
- 样式：同 MenuButton，但文案颜色稍暗（#B8A080）

### 4.6 设置按钮 (SettingsBtn)

- 位置：菜单面板最下方
- 样式：同 MenuButton，尺寸略小（宽 200px，高 44px）

### 4.7 版本号 (VersionLabel)

- 字体：Noto Sans SC，12px
- 颜色：#6B5B4B（暗棕色）
- 位置：左下角，距边缘 16px
- 文案："v1.0.0" 或 "Ver 1.0"

---

## 5. 动画时序

### 场景入场（0ms 开始）

```
0ms     - 背景 fade in (300ms)
300ms   - Logo 出现 (fade in + float up, 1200ms)
600ms   - 标题文字淡入 (800ms)
900ms   - 菜单面板淡入 (600ms)
1100ms  - 按钮依次淡入（间隔 150ms）：
          - NewGameBtn (1100ms)
          - ContinueBtn (1250ms, 如果显示)
          - SettingsBtn (1400ms)
1500ms  - 版本号淡入 (400ms)

全完成 - 静待用户操作
```

### Logo 呼吸动画（循环）

```
0%   - translateY(0)
50%  - translateY(-3px)
100% - translateY(0)
周期: 3000ms
缓动: ease-in-out
```

### 按钮 Hover

```
Scale: 1 → 1.05
Border Color: #8B6914 → #D4A84B
过渡: 150ms ease-out
```

---

## 6. 交互逻辑

### 新游戏按钮

1. 点击 → 按钮缩放反馈
2. 延迟 150ms → 切换到 MainScene
3. 传递参数：newGame = true

### 继续游戏按钮

1. 点击 → 按钮缩放反馈
2. 延迟 150ms → 加载存档数据
3. 切换到 MainScene
4. 传递参数：newGame = false

### 设置按钮

1. 点击 → 按钮缩放反馈
2. 延迟 150ms → 弹出设置面板（可先预留，后续实现）

### 存档检测

- 场景加载时检查 `localStorage` 中是否存在存档
- 存在：显示 ContinueBtn
- 不存在：隐藏 ContinueBtn

---

## 7. 技术实现

**引擎**：Cocos Creator 3.x
**语言**：TypeScript
**构建目标**：Web Desktop

**项目结构**：
```
assets/
├── Scenes/
│   └── StartScene.scene
├── Scripts/
│   ├── Scenes/
│   │   └── StartScene/
│   │       ├── StartSceneCtrl.ts      (主控制器)
│   │       ├── StartSceneUI.ts        (UI 逻辑)
│   │       └── StartConfig.ts         (配置数据)
│   └── Utils/
│       └── SaveManager.ts              (存档管理)
├── Prefabs/
│   └── UI/
│       └── MenuButton.prefab
├── Textures/
│   ├── UI/
│   │   └── start_scene/
│   │       ├── logo.png
│   │       └── btn_bg.png
│   └── Fonts/
│       ├── PressStart2P.ttf
│       └── NotoSansSC.ttf
```

**关键实现点**：
1. 使用 Cocos Creator 的 `tween` 系统实现动画
2. 使用 `sys.localStorage` 检测存档
3. 场景切换使用 `director.loadScene()`
4. 分辨率适配使用 Canvas 的 `fitWidth/fitHeight`

---

## 8. 待后续扩展

- [ ] 设置面板 UI（音效/音乐开关）
- [ ] Logo 动画加入粒子特效
- [ ] 背景加入动态云/天气效果
- [ ] 像素风光晕效果
- [ ] 首次进入 vs 重新进入的差异化文案
