# 🦢 Cygnus Cafe 个人博客

> **基于Hugo的星空咖啡馆主题个人网络安全博客**

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Hugo](https://img.shields.io/badge/hugo-0.100%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Language](https://img.shields.io/badge/language-zh--CN-brightgreen)

## ✨ 特性

- 🌌 **星空设计** - 150颗闪烁的星星动画背景
- ☕ **咖啡馆主题** - 温暖舒适的设计美学
- 📱 **完全响应式** - 完美适配所有设备
- 🔍 **SEO优化** - 自动Sitemap、Robots.txt、Open Graph标签
- ⚡ **性能优化** - 文件最小化、GZIP压缩、浏览器缓存
- 🚀 **自动部署** - GitHub Actions CI/CD流程
- 🏷️ **分类和标签** - 灵活的内容组织
- 💡 **代码高亮** - Monokai样式的代码块

## 🚀 快速开始

### 前置要求
- [Hugo](https://gohugo.io/installation/) 0.100.0 或更高版本
- Git
- 代码编辑器（VS Code推荐）

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/yourusername/cygnus-cafe-blog.git
cd cygnus-cafe-blog

# 启动开发服务器
hugo server -D

# 访问 http://localhost:1313
```

### 创建新文章

```bash
# 使用模板创建文章
hugo new posts/my-article.md

# 编辑文章
code content/posts/my-article.md

# 修改 draft = false 后自动显示
```

## 📁 项目结构

```
.
├── archetypes/           # 文章模板
├── content/
│   └── posts/           # 博客文章
├── layouts/             # Hugo布局（覆盖主题）
├── static/
│   ├── css/            # 自定义样式
│   ├── js/             # 自定义脚本
│   └── robots.txt      # SEO配置
├── themes/
│   └── cygnus-cafe/    # 主题（包含星空和咖啡馆设计）
├── hugo.toml           # 主配置文件
└── .github/
    └── workflows/      # CI/CD流程
```

## ⚙️ 配置

### 主要设置 (`hugo.toml`)

```toml
baseURL = "https://cygnus.cafe/"
title = "Cygnus Cafe - 天鹅座咖啡馆"
theme = "cygnus-cafe"

[params]
  author = "你的名字"
  description = "网络安全学习笔记 · 技术探索 · 生活感悟"
```

### 菜单配置

在`hugo.toml`中编辑`[menu.main]`以自定义导航菜单。

### 自定义样式

所有样式覆盖都在`static/css/custom.css`中，使用CSS变量系统：

```css
:root {
  --space-dark: #0a0e27;      /* 星空颜色 */
  --cafe-cream: #f4ead5;      /* 咖啡馆文字色 */
  --star-glow: #a4b8ff;       /* 星光蓝 */
  /* 更多颜色... */
}
```

## 🔍 SEO 和部署

### 本地测试

```bash
# 构建生产版本
hugo --minify

# 预览输出
python -m http.server 8000 -d public/
```

### 部署

#### GitHub Pages（推荐）
配置已在`.github/workflows/deploy.yml`中设置。只需推送到main分支即可自动部署。

```bash
git push origin main
```

#### Netlify
```bash
# 连接GitHub仓库到Netlify
# 构建命令: hugo --minify
# 发布目录: public
```

#### Vercel
```bash
# 连接GitHub仓库到Vercel
# 相同的构建设置
```

## 📝 文章Front Matter

所有新文章应包含以下元数据：

```markdown
+++
title = "文章标题"
date = 2026-01-27T00:00:00Z
lastmod = 2026-01-27T00:00:00Z
draft = false
tags = ["标签1", "标签2"]
categories = ["安全笔记"]
description = "用于SEO的文章描述"
author = "天鹅座"
+++
```

## 🎨 定制指南

### 修改颜色方案
1. 编辑`static/css/custom.css`中的`:root`变量
2. 在`hugo server -D`中实时查看变化

### 添加新菜单项
```toml
[[menu.main]]
  name = "菜单名称"
  url = "/path/"
  weight = 5
```

### 创建自定义布局
在`layouts/`中创建文件以覆盖主题的对应文件。

## 🤖 AI 编码指南

详见 [.github/copilot-instructions.md](.github/copilot-instructions.md) 了解架构、约定和最佳实践。

## 📚 完整文档

- [优化指南](OPTIMIZATION_GUIDE.md) - 部署、性能和SEO指南
- [贡献指南](CONTRIBUTING.md) - 定制和改进指南
- [主题README](themes/cygnus-cafe/README.md) - 主题特定文档

## 🔗 有用链接

- [Hugo官方文档](https://gohugo.io/documentation/)
- [Google SEO指南](https://developers.google.com/search/docs)
- [Open Graph协议](https://ogp.me/)
- [GitHub Pages帮助](https://pages.github.com/)

## 🐛 问题反馈

发现问题？请在GitHub上提Issue或提交Pull Request。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🙏 致谢

感谢Hugo社区和所有贡献者！

---

**活跃维护中** 🚀

最后更新: 2026-01-27  
作者: 天鹅座 (Cygnus)  
网站: https://cygnus.cafe/
