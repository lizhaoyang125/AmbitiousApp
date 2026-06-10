# DeepSeek API 连接问题解决方案

## 问题描述

连接 DeepSeek API 时失败，错误信息：
```
Connection failed: error sending request for url (https://api.deepseek.com/anthropic/v1/messages)
```

## 根本原因

系统配置了代理环境变量 `http://127.0.0.1:7890`，但本地代理服务未运行，导致所有通过代理的请求全部失败。

## 解决方案

### 步骤 1：清除代理环境变量

在 PowerShell 中依次执行以下命令：

```powershell
# 清除用户环境变量
[Environment]::SetEnvironmentVariable("HTTP_PROXY", $null, "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", $null, "User")

# 清除系统环境变量（需要管理员权限）
[Environment]::SetEnvironmentVariable("HTTP_PROXY", $null, "Machine")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", $null, "Machine")
```

### 步骤 2：重新加载环境变量

```powershell
# 重新加载环境变量到当前会话
$env:HTTP_PROXY = [Environment]::GetEnvironmentVariable("HTTP_PROXY", "User")
$env:HTTPS_PROXY = [Environment]::GetEnvironmentVariable("HTTPS_PROXY", "User")
```

### 步骤 3：验证代理已清除

```powershell
# 检查环境变量是否为空
$env:HTTP_PROXY
$env:HTTPS_PROXY
```

如果输出为空，说明代理已成功清除。

### 步骤 4：测试连接

```powershell
# 测试 DeepSeek API 连通性
curl.exe -I https://api.deepseek.com
```

正常返回 `HTTP/1.1 401 Authorization Required` 表示网络连接正常。

## 注意事项

1. **永久生效**：上述命令会永久清除环境变量，重启电脑后仍然有效
2. **代理软件冲突**：如果之后又运行了 Clash、V2Ray 等代理软件，它们可能会重新设置代理环境变量
3. **PowerShell 中 curl 是别名**：Windows PowerShell 中 `curl` 是 `Invoke-WebRequest` 的别名，应使用 `curl.exe` 调用真正的 curl 工具

## 相关命令

```powershell
# 查看当前代理设置
netsh winhttp show proxy

# 重置 WinHTTP 代理（需要管理员权限）
netsh winhttp reset proxy

# 测试端口连通性
Test-NetConnection api.deepseek.com -Port 443
```
