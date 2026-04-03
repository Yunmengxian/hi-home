# 导航页 (Nav Page)

简洁的个人导航页，支持密钥保护、搜索、烟花特效。

## 在线预览

部署到 EdgeOne Pages 后访问你的域名即可。

## 功能特性

- 🔍 **必应搜索** - 顶部搜索栏，支持关键词过滤卡片
- 🔐 **密钥保护** - Base64 编码存储，搜索框输入密钥显示隐藏分组
- 🎆 **烟花特效** - 自动发射 + 点击发射，可配置开关
- 🖼️ **图片图标** - 支持 Font Awesome 图标和自定义图片 URL
- 📱 **全自适应** - clamp + min() 双重约束，适配所有屏幕
- 🚀 **纯静态** - 无需后端，部署简单

## 快速开始

### 1. 修改配置

编辑 `config.js`：

```javascript
var CONFIG = {
  // 网站标题
  siteName: '我的导航',

  // 密钥（Base64 编码）
  secretKey: 'bmFz',  // 解码后是 "nas"

  // 是否启用烟花特效
  enableFireworks: true,

  // 需要隐藏的分组名称
  hiddenGroups: ['💾 NAS & 存储'],

  // 分组配置
  groups: [
    {
      name: '🏠 主页',
      icon: 'fas fa-home',
      items: [
        {
          name: '个人主页',
          icon: 'fas fa-user',         // Font Awesome 图标
          color: '#49b1f5',
          url: 'https://www.yeann.cn/',
          desc: '个人主页'
        },
        {
          name: 'EdgeOne',
          icon: 'https://cloudcache.tencent-cloud.com/qcloud/app/resource/ac/favicon.ico',  // 或图片 URL
          color: '#0052d9',
          url: 'https://console.cloud.tencent.com/edgeone/zones',
          desc: 'EdgeOne 管理'
        },
      ]
    },
  ],
};
```

### 2. 配置说明

| 字段 | 说明 | 示例 |
|-----|------|------|
| `secretKey` | 解锁密钥（Base64 编码） | `bmFz` = `nas` |
| `enableFireworks` | 是否启用烟花 | `true` / `false` |
| `hiddenGroups` | 需要隐藏的分组名称数组 | `['💾 NAS & 存储']` |
| `groups[].name` | 分组标题 | `🏠 主页` |
| `groups[].icon` | Font Awesome 图标类名 | `fas fa-home` |
| `groups[].items[].name` | 卡片名称 | `个人主页` |
| `groups[].items[].icon` | 图标类名或图片 URL | `fas fa-user` |
| `groups[].items[].color` | 图标颜色（十六进制） | `#49b1f5` |
| `groups[].items[].url` | 跳转链接 | `https://example.com` |
| `groups[].items[].desc` | 描述文字 | `我的网站` |

### 3. 修改密钥

将密钥转为 Base64 编码：

```powershell
# PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("你的密钥"))
```

然后替换 `config.js` 中的 `secretKey` 值。

### 4. 部署

推送到 GitHub，连接到 EdgeOne Pages 即可自动部署。

## 项目结构

```
nav-page/
├── index.html    # 主页面
├── style.css     # 样式表
├── config.js     # 配置文件
├── app.js        # 核心逻辑
├── fireworks.js  # 烟花特效
├── favicon.ico   # 网站图标
├── README.md     # 使用文档
└── CHANGELOG.txt # 更新日志
```

## 安全说明

- URL 格式验证：防止 javascript: 伪协议
- HTML 转义：防止 XSS 攻击
- 密钥 Base64 编码：避免明文暴露
- 密钥状态持久化：localStorage 存储，刷新后无需重新输入
- config.js 暴露在客户端，如有更高安全需求，建议使用后端验证

## 更新日志

详见 [CHANGELOG.txt](./CHANGELOG.txt)

## 版本历史

- **v1.3.1** - 新增多个链接、修复 iOS 搜索框缩放
- **v1.3.0** - 代码压缩优化、烟花开关
- **v1.2.1** - 安全修复、密钥持久化
- **v1.2.0** - 移除内外网模式
- **v1.1.0** - 主题优化
- **v1.0.0** - 初始版本

## 许可证

MIT