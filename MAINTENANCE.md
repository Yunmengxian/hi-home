# hi-home 导航页维护指南

## 项目信息

| 项 | 值 |
|---|-----|
| 仓库 | `Yunmengxian/hi-home` |
| 版本 | v1.3.2 |
| 类型 | 纯静态导航页 |
| 部署 | EdgeOne Pages / Vercel / CF Pages |
| 许可证 | MIT |

## 项目结构

```
hi-home/
├── index.html      # 主页面骨架（搜索框 + 卡片容器 + 页脚时间）
├── style.css       # 样式表（自然渐变背景、毛玻璃卡片、clamp 全自适应）
├── config.js       # 唯一需要编辑的配置文件
├── app.js          # 核心逻辑（卡片渲染、密钥解锁、必应搜索、关键词过滤）
├── fireworks.js    # 烟花特效（条件加载，enableFireworks 控制）
├── favicon.ico     # 网站图标
├── README.md       # 用户文档
├── MAINTAINCE.md   # 维护指南（本文件）
└── CHANGELOG.txt   # 更新日志
```

## 日常维护操作

### 一、添加新链接/分组

编辑 `config.js`，不需要动任何其他文件。

**新增卡片到已有分组**：在对应 `group.items` 数组里追加对象：

```javascript
{
  name: '服务名称',           // 卡片标题
  icon: 'fas fa-server',     // Font Awesome 图标类名，或图片 URL
  color: '#49b1f5',          // 图标颜色（十六进制）
  url: 'https://example.com',// 跳转链接
  desc: '简短描述'            // 卡片副标题
}
```

**新增分组**：在 `groups` 数组里追加：

```javascript
{
  name: '📦 新分组',        // 分组标题（支持 emoji）
  icon: 'fas fa-cube',      // 分组图标
  items: [ /* 卡片列表 */ ]
}
```

**隐藏分组**：把分组的 `name` 加入 `hiddenGroups` 数组，该分组默认不可见，输入密钥后显示。

**支持图片图标**：`icon` 字段可以填 Font Awesome 类名（如 `fas fa-user`），也可以直接填图片 URL（以 `http` 或 `//` 开头即可）。

### 二、修改密钥

```powershell
# PowerShell 生成 Base64 密钥
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("你的密钥"))
```

把生成的值填入 `config.js` 的 `secretKey` 字段。

解锁方式：在搜索框输入密钥明文 → 自动解锁 → 刷新后保持解锁（localStorage 持久化）。

### 三、开关烟花

```javascript
enableFireworks: true   // 开启
enableFireworks: false  // 关闭
```

### 四、修 bug 注意事项

1. **DOM 初始化**：app.js 末尾直接调用 `updateTime()` + `renderCards('')`，不依赖 `DOMContentLoaded` 事件。script 放 body 末尾同步加载，如果改为 `defer`/`async` 需要重新评估。
2. **烟花加载**：index.html 底部用动态创建 `<script>` 标签加载 fireworks.js，不要用 `document.write`。
3. **config 容错**：app.js 顶部有 CONFIG fallback，config.js 加载失败不会白屏。

## 部署流程

### EdgeOne Pages（推荐）

1. `git push` 到 GitHub
2. EdgeOne Pages 自动构建部署

### Vercel / Cloudflare Pages

纯静态部署，无需构建步骤。设置输出目录为仓库根目录。

### 本地预览

任何 HTTP 服务器即可：

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

⚠️ 不要直接双击 index.html 打开，file:// 协议下 Font Awesome CDN 可能加载异常。

## 技术要点

### 核心逻辑（app.js）

- **搜索防抖**：200ms
- **密钥解锁**：搜索框输入明文密钥 → `secretRevealed = true` → `localStorage` 持久化
- **关键词过滤**：匹配卡片 `name` 和 `desc`，隐藏组在未解锁时不参与过滤
- **URL 安全**：自动补全 `https://`，HTML 转义防 XSS
- **时间显示**：页脚实时日期时间，格式 `YYYY.MM.DD 周X HH:MM`

### 样式（style.css）

- **自适应**：`clamp()` + `min()` 双重约束，覆盖 320px ~ 4K
- **卡片网格**：`grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 30vw, 200px), 1fr))`
- **配色**：自然灰蓝渐变背景，毛玻璃白色卡片

### 安全措施

- URL 格式校验（拒绝 `javascript:`）
- HTML 转义（`<` `>` → `&lt;` `&gt;`）
- 密钥 Base64 编码
- 密钥状态 localStorage 持久化
- ⚠️ config.js 暴露在客户端，敏感服务不要直接暴露

## 常见问题

**Q: 改了 config.js 页面没变化？**
A: 清除浏览器缓存，或检查 config.js 语法（漏逗号最常见）。

**Q: 图标不显示？**
A: 检查 Font Awesome 类名是否正确，图片 URL 是否可访问（是否被跨域/CSP 拦截）。

**Q: 隐藏分组解锁后刷新又锁了？**
A: 检查 `localStorage` 是否被清除（隐私模式/手动清理）。

**Q: 手机端搜索框输入后缩放异常？**
A: app.js 内置了 iOS Safari zoom 修复，如果还有问题检查 viewport meta 标签是否被覆盖。

**Q: 部署后烟花不生效？**
A: 检查 `config.js` 中 `enableFireworks` 是否为 `true`，浏览器控制台是否有 fireworks.js 404 错误。
