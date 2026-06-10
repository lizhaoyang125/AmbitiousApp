# FlowUs MCP 配置教程

## 概述

MCP（Model Context Protocol）让 Claude Code 能直接读写 FlowUs 知识库。配置后，Claude 可以在 FlowUs 中创建页面、编辑 Block、查询数据库、搜索内容等。

---

## 第 1 步：创建 `.mcp.json`

在项目根目录创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "flowus": {
      "type": "http",
      "url": "https://mcp.allflow.cn/message?token=<你的token>"
    }
  }
}
```

Token 从 FlowUs 后台 **设置 → 集成** 获取。

> ⚠️ **务必**将 `.mcp.json` 加入 `.gitignore`，避免 token 泄露。

---

## 第 2 步：修改 `.claude/settings.local.json`

添加以下配置：

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["flowus"],
  "permissions": {
    "allow": [
      "mcp__flowus__*"
    ]
  }
}
```

| 字段 | 作用 |
|------|------|
| `enableAllProjectMcpServers` | 自动批准项目中的 MCP 服务器 |
| `enabledMcpjsonServers` | 批准 flowus 服务器 |
| `permissions.allow` | 无需每次手动确认工具调用 |

---

## 第 3 步：重启 Claude Code

配置完成后重启会话，`/mcp` 中即可看到 flowus。

---

## 第 4 步：验证

重启后测试：

```
搜索测试  →  验证读功能
在 xxx 页面写内容  →  验证写功能
```

---

## 可用功能

### 页面
| 工具 | 功能 |
|------|------|
| `API-createPage` | 创建页面 |
| `API-getPage` | 获取页面 |
| `API-updatePage` | 更新页面 |
| `API-deletePage` | 删除页面 |
| `API-getMarkdown` | 导出 Markdown |
| `API-putMarkdown` | Markdown 导入 |

### Block
| 工具 | 功能 |
|------|------|
| `API-getBlock` / `API-getBlockChildren` | 读取 Block |
| `API-appendBlockChildren` | 追加 Block |
| `API-updateBlock` | 更新 Block |
| `API-deleteBlock` | 删除 Block |

### 数据库
| 工具 | 功能 |
|------|------|
| `API-createDatabase` / `API-getDatabase` | 创建/查看 |
| `API-queryDatabase` | 查询数据 |
| `API-updateDatabase` / `API-deleteDatabase` | 更新/删除 |

### 其他
| 工具 | 功能 |
|------|------|
| `API-search` | 全文搜索 |
| `API-semanticSearch` | 语义搜索 |
| `API-getMe` | 验证身份 |
| `API-batch` | 批量操作 |
| `API-getUploadUrl` | 文件上传 |

---

## 常见问题

### `/mcp` 看不到 flowus？

检查配置后重启会话。

### 支持哪些 Block 类型？

`paragraph`, `heading_1~3`, `bulleted_list_item`, `numbered_list_item`, `to_do`, `quote`, `code`, `callout`, `divider`, `bookmark`, `embed`, `image`, `file`, `table`, `table_row`, `toggle`, `equation`, `link_to_page`

---

## 完整项目文件

```
项目根目录/
├── .mcp.json                 # MCP 服务器定义
├── .claude/
│   └── settings.local.json   # 启用 & 权限
└── .gitignore                # 忽略 .mcp.json
```

> **记录时间**：2026-05-31  
> **验证环境**：Windows 11 + VSCode Claude Code Extension
