# Contributing Guide - 贡献指南

这个项目是个人博客，但欢迎改进建议！

## 🐛 报告问题

如果发现问题：
1. 检查是否已存在类似issue
2. 提供详细描述和复现步骤
3. 包含截图或错误日志

## 💡 功能建议

好的建议应包含：
- 清晰的用例说明
- 预期行为描述
- 可能的实现思路

## 🎨 主题定制

### 自定义颜色
编辑 `static/css/custom.css`：

```css
:root {
  --space-dark: #0a0e27;  /* 星空深色 */
  --cafe-cream: #f4ead5;  /* 咖啡馆奶油色 */
  --star-glow: #a4b8ff;   /* 星光蓝 */
  /* 更多颜色... */
}
```

### 自定义布局
主题文件在 `themes/cygnus-cafe/layouts/`

通过在 `layouts/` 中创建同名文件来覆盖主题文件。

## 📱 响应式设计

在 `static/css/custom.css` 中添加媒体查询：

```css
@media (max-width: 768px) {
  /* 平板和手机样式 */
}

@media (max-width: 480px) {
  /* 手机样式 */
}
```

## 🧪 测试

### 本地测试
```bash
# 开发模式
hugo server -D

# 访问 http://localhost:1313
# 检查所有页面和功能
```

### 生产构建测试
```bash
# 构建
hugo --minify

# 预览 public/ 文件夹
# 检查所有链接和图片

# 也可以本地预览
python -m http.server 8000 -d public/
# 访问 http://localhost:8000
```

## 📝 提交变更

1. 创建特性分支
2. 做出改动
3. 测试改动
4. 提交清晰的commit信息
5. 推送并创建Pull Request

### Commit信息规范

```
类型: 简短描述

详细说明（可选）

- 列表项1
- 列表项2
```

类型包括：
- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 格式调整（不影响代码）
- `refactor`: 代码重构
- `perf`: 性能优化
- `chore`: 其他更改

## 🚀 性能优化建议

### 图片优化
- 使用WebP格式的图片
- 在Hugo中使用图片处理功能
- 添加响应式图片支持

### 代码优化
- 缩小CSS/JS
- 移除未使用的代码
- 延迟加载非关键资源

### SEO优化
- 改进元描述
- 添加结构化数据
- 优化关键词策略

## 📚 资源

- [Hugo文档](https://gohugo.io)
- [CSS最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Tips)
- [Web性能](https://developer.mozilla.org/zh-CN/docs/Web/Performance)

---

感谢对本博客的关注和贡献！🙏
