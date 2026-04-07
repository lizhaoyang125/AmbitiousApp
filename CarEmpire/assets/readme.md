
## 目录结构
在 assets 目录下，请手动创建以下文件夹。这套结构能保证你 3 个月后依然能一眼找到代码在哪。

📂 assets
    📂 Scenes (存放 4 个核心场景文件)
    📂 Scripts (所有 TypeScript 脚本)
        📂 Managers (全局管理类：DataManager, GameMgr, AudioMgr)
        📂 UI (各界面的控制脚本)
        📂 Data (定义数据结构/接口 Interface)
        📂 Utils (工具类：时间格式化、数值转换)
    📂 resources (核心：必须叫这个名字，存放需要动态加载的资源)
        📂 Data (存放所有的 .json 配置文件)
        📂 Prefabs (所有的 UI 弹窗、员工卡片、车辆零件预制体)
    📂 Texture (存放美术图片)
        📂 UI (通用 UI 图标)
        📂 Avatars (员工头像)
        📂 Cars (车辆/零件图)
    📂 Audio (音效与 BGM)

