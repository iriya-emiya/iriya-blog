# 🦢 Cygnus Cafe - 原始惊艳版本

**基于你最满意的原始设计重新打造的完整 Hugo 主题！**

这是真正惊艳的那个版本 - 完美的星空、旋转的天鹅、咖啡馆的温暖。

---

## ✨ 特性

- 🌌 **150颗闪烁的星星** - 原汁原味的星空效果
- 🦢 **旋转天鹅图标** - 30秒慢慢旋转
- ☕ **咖啡馆氛围** - 温暖的配色和设计
- 🎨 **原始CSS** - 你最满意的那个版本
- 📱 **响应式设计** - 完美适配各种设备
- 🚀 **JavaScript增强** - 所有原始交互效果
- 💫 **平滑动画** - 悬停、过渡、发光效果

---

## 📦 安装

### 方法1：解压安装（推荐）

```bash
# 解压主题到 themes 目录
tar -xzf cygnus-cafe-original.tar.gz -C themes/

# 或直接复制文件夹
cp -r cygnus-cafe-original themes/cygnus-cafe
```

### 方法2：Git子模块

```bash
cd your-hugo-site
git submodule add https://github.com/yourusername/cygnus-cafe.git themes/cygnus-cafe
```

---

## 🚀 快速开始

### 1. 配置主题

编辑 `config.toml`：

```toml
theme = "cygnus-cafe"
```

或复制示例配置：

```bash
cp themes/cygnus-cafe/exampleSite/config.toml ./config.toml
```

### 2. 创建第一篇文章

```bash
hugo new posts/my-first-post.md
```

编辑文章：

```yaml
---
title: "我的第一篇文章"
date: 2026-01-26
draft: false
categories: ["security"]
tags: ["渗透测试", "学习笔记"]
description: "这是我的第一篇文章"
---

## 内容

开始写作...
```

### 3. 启动开发服务器

```bash
hugo server -D
```

访问 `http://localhost:1313`

---

## 🎨 核心文件说明

### CSS 文件
- `static/css/custom.css` - **原始惊艳版本的完整CSS**
  - 包含所有星空、咖啡馆样式
  - 覆盖任何主题的默认样式
  - 完整的响应式设计

### JavaScript 文件
- `static/js/cygnus-cafe.js` - **原始完整交互效果**
  - 生成150颗星星
  - 创建星云效果
  - 旋转天鹅动画
  - 导航增强
  - 卡片发光效果
  - 代码复制按钮
  - 返回顶部按钮
  - 平滑滚动

---

## 📝 配置说明

### 基础配置

```toml
baseURL = "https://your-site.com/"
languageCode = "zh-CN"
title = "Cygnus Cafe - 天鹅座咖啡馆"
theme = "cygnus-cafe"
```

### 参数配置

```toml
[params]
  description = "网络安全学习笔记 · 技术探索 · 生活感悟"
  author = "Your Name"
  
  # 社交链接
  github = "https://github.com/yourusername"
  email = "your@email.com"
```

### 菜单配置

```toml
[menu]
  [[menu.main]]
    name = "首页"
    url = "/"
    weight = 1
  
  [[menu.main]]
    name = "安全笔记"
    url = "/categories/security/"
    weight = 2
```

---

## 🎯 Front Matter 示例

```yaml
---
title: "SQL注入漏洞分析"
date: 2026-01-26
draft: false
categories: ["security"]
tags: ["SQL注入", "Web安全", "渗透测试"]
description: "深入分析SQL注入的原理和防御方法"
---

## 简介

本文将详细分析...
```

---

## 📁 目录结构

```
cygnus-cafe/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html      # 基础模板
│   │   ├── list.html        # 列表页
│   │   └── single.html      # 文章页
│   ├── partials/
│   │   ├── header.html      # 头部（带旋转天鹅）
│   │   ├── footer.html      # 底部
│   │   └── post-card.html   # 文章卡片
│   └── index.html           # 首页（双栏布局）
├── static/
│   ├── css/
│   │   └── custom.css       # 原始惊艳CSS
│   └── js/
│       └── cygnus-cafe.js   # 原始完整JS
├── archetypes/
│   └── default.md           # 文章模板
├── exampleSite/
│   └── config.toml          # 示例配置
├── theme.toml
└── README.md
```

---

## 🌟 核心特性详解

### 星空背景
- 150颗星星，随机位置和大小
- 闪烁动画（3秒周期）
- 两个星云效果
- 天鹅座星图（SVG）

### 旋转天鹅
- Logo中的🦢emoji
- 30秒慢速旋转
- CSS动画实现
- 完美居中

### 咖啡馆配色
```css
--cafe-cream: #f4ead5;   /* 奶油色 */
--cafe-latte: #d4a574;   /* 拿铁色 */
--cafe-mocha: #8b6f47;   /* 摩卡色 */
```

### 卡片效果
- 悬停上浮（translateY -8px）
- 发光效果（box-shadow）
- 顶部渐变条
- 平滑过渡

---

## 🎨 自定义

### 修改颜色

编辑 `static/css/custom.css` 的CSS变量：

```css
:root {
    --space-dark: #0a0e27;      /* 深空背景 */
    --cafe-latte: #d4a574;      /* 强调色 */
    --cafe-cream: #f4ead5;      /* 文字颜色 */
}
```

### 调整星星数量

编辑 `static/js/cygnus-cafe.js`：

```javascript
const starCount = 150; // 改成你想要的数量
```

### 修改旋转速度

编辑 `layouts/partials/header.html`：

```css
animation: rotate 30s linear infinite; /* 改成你想要的秒数 */
```

---

## 📱 响应式断点

- **桌面**: > 1024px - 完整体验
- **平板**: 768px - 1024px - 优化布局
- **手机**: < 768px - 单栏布局

---

## 🔧 故障排除

### Q: 星星没显示？

**检查：**
1. 浏览器控制台（F12）有没有错误
2. JS文件是否加载（Network标签）
3. 清除缓存（Ctrl+Shift+R）

---

### Q: 天鹅不旋转？

**检查：**
1. CSS动画是否被覆盖
2. 浏览器是否支持CSS动画
3. 强制刷新页面

---

### Q: 样式不对？

**解决：**
```bash
# 清除Hugo缓存
rm -rf public resources

# 重启服务器
hugo server -D

# 浏览器强制刷新
Ctrl + Shift + R
```

---

## 🎯 最佳实践

### 文章组织
```
content/
├── posts/
│   ├── security/      # 安全笔记
│   ├── learning/      # 学习记录
│   └── life/          # 生活分享
└── about.md           # 关于页面
```

### 分类建议
- 🔐 **security** - 网络安全、渗透测试
- 💻 **learning** - 学习笔记、技术文章
- 🌟 **life** - 生活分享、随笔

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- 基于最初的惊艳设计
- Hugo静态网站生成器
- Google Fonts字体服务

---

## 📞 支持

- 提Issue: GitHub Issues
- 邮件: your@email.com

---

**这就是你最满意的那个版本！** 🎉🦢☕✨

用 ❤️ 制作，在星空下品咖啡
