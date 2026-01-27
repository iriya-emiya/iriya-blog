# Cygnus Cafe 博客优化指南

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

## 📝 内容创建

### 新建文章
```bash
hugo new posts/my-new-post.md
```

新建的文章会自动使用改进的模板，包含以下字段：
- `title` - 文章标题
- `date` - 创建日期
- `lastmod` - 最后修改日期
- `draft` - 是否为草稿（发布前改为false）
- `tags` - 标签（数组）
- `categories` - 分类（数组）
- `description` - 文章描述（用于SEO）
- `author` - 作者

### 文章最佳实践
1. **使用More标签分隔摘要**：`<!-- more -->`
2. **添加描述**：帮助SEO和社交分享
3. **使用适当的标签和分类**：便于组织和导航
4. **包含图片**：在`description`字段中指定OG图片

## 🔍 SEO 优化

### 已配置的功能
- ✅ Robots.txt - 自动生成
- ✅ Sitemap - Hugo自动生成（`/sitemap.xml`）
- ✅ Open Graph标签 - 自动添加到每个页面
- ✅ Twitter Card - 自动添加
- ✅ 规范链接 - 防止重复内容
- ✅ 结构化数据准备

### 需要手动配置
在 `hugo.toml` 中更新：
```toml
[params.seo]
  image = "images/og-image.png"  # 默认OG图片路径
  twitterHandle = "@yourusername"  # 你的Twitter用户名
  
[params]
  author = "你的名字"
  description = "网站描述"
```

## ⚡ 性能优化

### 已实施
- ✅ CSS/JS 文件缩小（`hugo --minify`）
- ✅ Markdown高亮优化
- ✅ GZIP压缩配置（.htaccess）
- ✅ 浏览器缓存设置
- ✅ HTTPS重定向

### 建议
1. **图片优化**
   - 使用WebP格式
   - 压缩JPEG/PNG
   - 设置适当的宽高比

2. **代码分割**
   - 自定义JS分离非关键代码
   - CSS按需加载

3. **监控**
   - 使用Google Search Console
   - 检查Core Web Vitals
   - 使用PageSpeed Insights

## 🌍 域名和部署

### 当前配置
- 域名：`https://cygnus.cafe/`
- 语言：中文（`zh-CN`）
- 主题：Cygnus Cafe

### 部署选项

#### Netlify（推荐）
```bash
# 1. 连接GitHub仓库
# 2. 构建设置
#    - Build command: hugo --minify
#    - Publish directory: public

# 3. 环境变量
#    - HUGO_VERSION: 0.100.0+ (检查你的版本)
```

#### Vercel
```bash
# Build: hugo --minify
# Output Directory: public
```

#### GitHub Pages
```bash
# 创建 .github/workflows/hugo.yml
# 使用Hugo官方action自动部署
```

## 📊 分析和反馈

### 建议添加
1. **Google Analytics 4** - 网站流量分析
2. **Search Console** - SEO和索引监控
3. **Cloudflare Analytics** - DDoS保护和分析

## 🛠️ 常见任务

### 删除草稿并发布
```bash
# 编辑文章
code content/posts/my-post.md

# 修改 draft = false
# 保存并测试
hugo server -D

# 构建
hugo --minify
```

### 更新主题
```bash
# 如果使用Git子模块
git submodule update --remote themes/cygnus-cafe

# 或手动更新themes文件夹
```

### 检查链接和错误
```bash
# 生成站点
hugo --minify

# 检查public文件夹中的HTML文件
```

## 📌 提示

1. **定期发布**：保持更新频率有助于SEO
2. **内部链接**：链接到相关文章
3. **元描述**：每篇文章都应有描述字段
4. **图片属性**：添加alt属性便于访问性和SEO
5. **移动优化**：在移动设备上测试
6. **监控索引**：在Google Search Console中检查索引状态

## 🔗 有用资源

- [Hugo文档](https://gohugo.io/documentation/)
- [Google SEO指南](https://developers.google.com/search/docs)
- [Netlify Hugo部署](https://docs.netlify.com/configure-builds/common-configurations/hugo/)
- [Open Graph协议](https://ogp.me/)
