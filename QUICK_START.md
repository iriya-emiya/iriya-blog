# 🦢 Cygnus Cafe 博客优化指南 - 简化版

## 🚀 快速开始

### 本地开发
```bash
# 开发服务器（支持草稿）
hugo server -D

# 仅发布内容
hugo server

# 构建生产版本
hugo --minify
```

### 文件结构说明
```
├── content/posts/          # 所有博客文章在这里
├── static/                 # 静态资源（CSS、JS、images等）
├── themes/cygnus-cafe/     # 主题文件（不要修改）
├── layouts/                # 覆盖主题文件（需要时使用）
├── hugo.toml               # 主配置文件
└── .htaccess               # 服务器优化配置
```

## 📝 创建和管理文章

### 新建文章
```bash
hugo new posts/article-title.md
```

### Front Matter 字段说明
```markdown
+++
title = "文章标题"
date = 2026-01-27T00:00:00Z
lastmod = 2026-01-27T00:00:00Z
draft = false              # 改为false才能发布
tags = ["标签1", "标签2"]
categories = ["安全笔记"]  # 分类
description = "文章摘要，用于SEO"
author = "天鹅座"
+++

## 简介
文章开头...

## 正文
<!-- more -->
完整内容...

## 总结
总结...
```

### 发布前检查清单
- [ ] 修改 `draft = false`
- [ ] 检查 `description` 字段（SEO用）
- [ ] 本地测试：`hugo server -D`
- [ ] 检查格式和链接

## 🔍 SEO 优化

### 自动配置的部分
✅ Robots.txt - 自动生成  
✅ Sitemap.xml - 自动生成  
✅ Open Graph标签 - 自动添加  
✅ Twitter Card - 自动添加  

### 需要配置的部分
在 `hugo.toml` 中编辑：

```toml
[params]
  author = "你的名字"
  
[params.social]
  github = "your-username"
  email = "your-email@example.com"

[params.seo]
  twitterHandle = "@yourusername"
```

## ⚡ 性能优化

### 已配置
- ✅ GZIP 压缩
- ✅ 浏览器缓存
- ✅ 文件最小化（`hugo --minify`）
- ✅ HTTPS 重定向

### 建议
1. **优化图片**
   - 使用WebP格式
   - 压缩JPEG/PNG
   - 放在 `static/images/` 目录

2. **外部资源**
   - 避免在markdown中嵌入超大文件
   - 使用CDN或外部服务

## 🚀 部署

### GitHub Pages（自动）
```bash
# 只需推送到main分支
git push origin main

# GitHub Actions 会自动：
# 1. 运行 hugo --minify
# 2. 部署到 public/
# 3. 发布到 GitHub Pages
```

### 本地测试
```bash
# 构建
hugo --minify

# 预览
python -m http.server 8000 -d public/
# 访问 http://localhost:8000
```

## 🎨 自定义主题

### 修改颜色
编辑 `static/css/custom.css` 的 `:root` 部分：

```css
:root {
  --space-dark: #0a0e27;     /* 星空颜色 */
  --cafe-cream: #f4ead5;     /* 文字颜色 */
  --star-glow: #a4b8ff;      /* 星光颜色 */
  /* 其他颜色... */
}
```

### 覆盖主题文件
在 `layouts/` 中创建同名文件覆盖主题。例如：
- 主题: `themes/cygnus-cafe/layouts/_default/baseof.html`
- 覆盖: `layouts/_default/baseof.html`

## ⚠️ 常见问题

### 发布后看不到文章
- 检查 `draft = false`
- 运行 `hugo --minify` 重新构建
- 清理浏览器缓存

### 样式不显示
- 检查 `static/css/custom.css` 是否存在
- 确认 `hugo.toml` 中配置正确
- 运行 `hugo server -D` 查看实时更新

### 推送后没有自动部署
- 检查 `.github/workflows/deploy.yml` 是否存在
- 确认GitHub Actions已启用
- 查看Actions标签页的运行日志

## 📚 更多资源

- [Hugo官方文档](https://gohugo.io/)
- [Markdown语法](https://commonmark.org/)
- [GitHub Pages帮助](https://pages.github.com/)

## 💡 提示

1. **定期备份** - 定期提交到Git
2. **小步快走** - 每次改一个东西，测试后再改下一个
3. **保持简洁** - 不要过度优化，focus在内容上
4. **查看日志** - 遇到问题时查看Hugo的错误提示

---

需要帮助？查看 `.github/copilot-instructions.md` 了解项目架构。
