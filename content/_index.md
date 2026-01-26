---
title: "天鹅座的博客"
date: 2026-01-26T19:10:00+09:00
draft: false
type: "home"
---

<!-- 顶部导航（可以配合 PaperMod 菜单显示） -->
<nav style="text-align:center; padding:20px 0; background-color: rgba(0,0,0,0.6); color:white;">
  <a href="/" style="margin:0 15px; color:white; font-weight:bold;">首页</a>
  <a href="/about/" style="margin:0 15px; color:white; font-weight:bold;">关于我</a>
  <a href="/posts/" style="margin:0 15px; color:white; font-weight:bold;">文章</a>
</nav>

<!-- Hero 区：星空背景 -->
<div style="text-align:center; padding:100px 20px; background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80') no-repeat center center; background-size: cover; color:white; text-shadow: 2px 2px 6px rgba(0,0,0,0.7);">
  <h1 style="font-size:5em; margin-bottom:0.2em;">天鹅座的博客</h1>
  <h2 style="font-size:2em; margin-top:0;">作者：天津四</h2>
  <p style="font-size:1.5em; margin-top:1em;">探索知识 · 分享技术 · 记录生活</p>
</div>

<!-- 最新文章卡片 -->
<section style="max-width:1000px; margin:50px auto; padding:0 20px;">
## 最新文章
<div style="display:flex; flex-wrap:wrap; justify-content:space-between; gap:20px;">
{{< recentPosts count="5" >}}
</div>
</section>

<!-- 关于我 -->
<section style="max-width:800px; margin:50px auto; padding:0 20px;">
## 关于我
我是 **天津四**，喜欢写博客、分享学习笔记和技术干货。

- 喜欢研究 网络安全
- 喜欢星空
- 喜欢折腾 Hugo 静态博客
</section>

<!-- 功能演示 -->
<section style="max-width:800px; margin:50px auto; padding:0 20px;">
## 功能演示

### 代码块

```go
package main
import "fmt"
func main() {
    fmt.Println("Hello Hugo + PaperMod!")
}
