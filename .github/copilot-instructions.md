# Copilot Instructions - AI 编码指南

## 🎯 项目概览

这是一个基于Hugo的个人安全博客，使用自定义的"Cygnus Cafe"主题（星空咖啡馆设计）。

- **域名**: https://cygnus.cafe/
- **语言**: 中文（zh-CN）
- **主要用途**: 网络安全笔记、学习记录、生活分享
- **框架**: Hugo静态网站生成器
- **主题**: Cygnus Cafe（自定义主题，位于`themes/cygnus-cafe/`）

## 🏗️ 架构和项目结构

### 核心目录
- `content/posts/` - 博客文章（Markdown格式）
- `layouts/` - Hugo布局覆盖文件
- `static/` - 静态资源（CSS、JS、robots.txt）
- `themes/cygnus-cafe/` - 自定义主题
- `archetypes/` - 新文章的模板

### 关键配置
- `hugo.toml` - Hugo主配置文件（TOML格式）
- `.htaccess` - Apache服务器配置（缓存、压缩、HTTPS重定向）

### 输出
- `public/` - 生成的静态网站（构建输出）

## 🎨 主题和样式系统

### 设计特色
- **星空背景**: 150颗闪烁的星星（CSS动画）
- **配色方案**: 基于变量系统（`static/css/custom.css`中的:root）
  - 星空色: `#0a0e27`（深蓝黑）
  - 咖啡馆色: `#f4ead5`（奶油色）、`#d4a574`（拿铁色）
  - 中性色: 各种灰色阴影
- **响应式设计**: 支持所有设备尺寸

### CSS覆盖机制
主题CSS存储在`themes/cygnus-cafe/`中。自定义样式在`static/css/custom.css`中使用CSS变量覆盖。

## 📝 内容工作流

### 创建文章
```bash
hugo new posts/article-name.md
```

生成的文章使用`archetypes/default.md`中的模板，包含：
- 元数据（title、date、lastmod、draft、tags、categories、description）
- 结构化内容布局（简介→正文→总结）
- 自动日期和作者字段

### Front Matter 字段
- `draft`: 是否为草稿（`true`在`hugo server -D`时显示）
- `tags`: 标签数组
- `categories`: 分类（安全笔记、学习记录、生活分享）
- `description`: 用于SEO的文章摘要
- `lastmod`: 最后修改时间（自动管理）

### More 标签
使用`<!-- more -->`分隔文章摘要和完整内容。Hugo会在列表页显示摘要。

## 🔍 SEO 和元数据

### 自动生成
- `sitemap.xml` - 自动生成的站点地图
- `robots.txt` - 来自`layouts/robots.txt`（动态）或`static/robots.txt`（静态）
- Open Graph/Twitter Card标签 - 由`layouts/partials/meta-tags.html`生成

### 配置点
编辑`hugo.toml`中的这些部分以自定义SEO：
```toml
[params.seo]
  image = "images/og-image.png"
  twitterHandle = "@username"

[params]
  author = "作者名称"
  description = "网站描述"
```

## 🚀 开发工作流

### 本地开发
```bash
# 启动开发服务器（包括草稿）
hugo server -D

# 仅生产内容
hugo server

# 生成最小化版本
hugo --minify
```

### 构建和部署
- CI/CD通过`.github/workflows/deploy.yml`自动执行
- 推送到main分支触发构建和部署
- 输出部署到`public/`目录

### 部署目标
- 已配置GitHub Pages（cname: cygnus.cafe）
- 支持Netlify、Vercel等其他平台

## 🎯 关键文件和模式

### 必须编辑
- `hugo.toml` - 主配置（域名、标题、菜单等）
- `static/css/custom.css` - 主题定制（颜色、动画）
- `content/posts/*.md` - 博客内容

### 不应修改
- `themes/cygnus-cafe/` - 第三方主题（用`layouts/`覆盖代替）
- `public/` - 生成的输出（构建时自动替换）

### 条件覆盖
要自定义主题文件，在`layouts/`中创建相同路径的文件。Hugo会优先使用`layouts/`中的版本。

## 📊 性能考虑

### 已优化
- HTML/CSS/JS最小化（使用`hugo --minify`）
- GZIP压缩配置
- 浏览器缓存头
- HTTPS重定向

### 可改进
- 图片优化和lazy-loading
- 关键CSS内联
- DNS预连接配置

## 🔐 安全和最佳实践

### 推荐
1. **不要在Git中存储敏感信息** - 使用环境变量
2. **定期更新主题** - 检查`themes/cygnus-cafe/`的更新
3. **验证部署** - 在GitHub Pages或预览环境中测试
4. **内容审核** - 发布前检查拼写和链接

### 已实施
- 安全头设置（X-Frame-Options、X-Content-Type-Options等）
- HTTPS强制（.htaccess）
- CSRF防护准备（Hugo/静态默认安全）

## 💡 常见任务

### 添加菜单项
编辑`hugo.toml`中的`[menu.main]`部分：
```toml
[[menu.main]]
  name = "新菜单"
  url = "/path/"
  weight = 3
```

### 修改主题颜色
编辑`static/css/custom.css`中的`:root`变量：
```css
:root {
  --space-dark: #0a0e27;
  --cafe-cream: #f4ead5;
  /* ... */
}
```

### 添加自定义分析
在`layouts/partials/`中创建`analytics.html`，然后在主题中包含它。

## 📚 关键依赖和版本

- **Hugo**: 0.100.0+ （支持TOML配置）
- **主题**: Cygnus Cafe（本地）
- **部署**: GitHub Pages + Actions

## 🔗 相关文档

- [OPTIMIZATION_GUIDE.md](OPTIMIZATION_GUIDE.md) - 部署和性能指南
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献和定制指南
- [Hugo文档](https://gohugo.io/documentation/)
- [主题README](themes/cygnus-cafe/README.md)

---

**最后更新**: 2026-01-27
**维护者**: 天鹅座（Cygnus）
