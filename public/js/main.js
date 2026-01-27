/**
 * Cygnus Cafe Theme - Main JavaScript
 */

// 主题切换功能
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    // 应用保存的主题
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // 绑定切换事件
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
    
    // 添加切换动画
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }
}

// 移动端菜单
class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.navMenu = document.getElementById('navMenu');
    this.init();
  }

  init() {
    if (this.menuToggle && this.navMenu) {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
      
      // 点击菜单项时关闭菜单
      const menuLinks = this.navMenu.querySelectorAll('.nav-link');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      
      // 点击外部关闭菜单
      document.addEventListener('click', (e) => {
        if (!this.menuToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
          this.closeMenu();
        }
      });
    }
  }

  toggleMenu() {
    this.menuToggle.classList.toggle('active');
    this.navMenu.classList.toggle('active');
  }

  closeMenu() {
    this.menuToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
  }
}

// 回到顶部按钮
class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.init();
  }

  init() {
    if (this.button) {
      this.button.addEventListener('click', () => this.scrollToTop());
      window.addEventListener('scroll', () => this.toggleVisibility());
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  toggleVisibility() {
    if (window.scrollY > 300) {
      this.button.style.opacity = '1';
      this.button.style.pointerEvents = 'auto';
    } else {
      this.button.style.opacity = '0';
      this.button.style.pointerEvents = 'none';
    }
  }
}

// 星空背景动画
class StarryBackground {
  constructor() {
    this.container = document.getElementById('starryBg');
    this.shootingStarInterval = null;
    this.init();
  }

  init() {
    if (this.container) {
      this.createShootingStars();
    }
  }

  createShootingStars() {
    // 每隔一段时间创建一颗流星
    this.shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% 概率
        this.addShootingStar();
      }
    }, 3000);
  }

  addShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: linear-gradient(90deg, #fff, transparent);
      border-radius: 50%;
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
      top: ${Math.random() * 50}%;
      left: ${Math.random() * 100}%;
      opacity: 0;
      animation: shootingStar 1.5s ease-out;
    `;
    
    this.container.appendChild(star);
    
    // 动画结束后移除元素
    setTimeout(() => {
      star.remove();
    }, 1500);
  }
}

// 添加流星动画CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shootingStar {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0);
    }
    10% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(200px, 200px) scale(0.5);
    }
  }
`;
document.head.appendChild(style);

// 平滑滚动到锚点
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#' && href !== '') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }
}

// 懒加载图片
class LazyLoad {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      this.images.forEach(img => imageObserver.observe(img));
    } else {
      // 降级方案
      this.images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
}

// 阅读进度条
class ReadingProgress {
  constructor() {
    this.progressBar = this.createProgressBar();
    this.init();
  }

  createProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #D4A574, #8B7355);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(bar);
    return bar;
  }

  init() {
    // 只在文章页面显示
    if (document.querySelector('.article-container')) {
      window.addEventListener('scroll', () => this.updateProgress());
    } else {
      this.progressBar.style.display = 'none';
    }
  }

  updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    this.progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
}

// 代码复制按钮
class CodeCopy {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('pre code').forEach(block => {
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.textContent = '复制';
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 12px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s;
      `;

      const pre = block.parentElement;
      pre.style.position = 'relative';
      pre.appendChild(button);

      pre.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });

      pre.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });

      button.addEventListener('click', async () => {
        const code = block.textContent;
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = '已复制!';
          button.style.background = 'rgba(76, 175, 80, 0.3)';
          setTimeout(() => {
            button.textContent = '复制';
            button.style.background = 'rgba(255, 255, 255, 0.1)';
          }, 2000);
        } catch (err) {
          button.textContent = '失败';
          setTimeout(() => {
            button.textContent = '复制';
          }, 2000);
        }
      });
    });
  }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new MobileMenu();
  new BackToTop();
  new StarryBackground();
  new SmoothScroll();
  new LazyLoad();
  new ReadingProgress();
  new CodeCopy();
  
  // 添加淡入动画
  document.querySelectorAll('.post-card, .category-card, .post-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s forwards`;
  });
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K 切换主题
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.click();
  }
  
  // ESC 关闭移动端菜单
  if (e.key === 'Escape') {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      document.getElementById('menuToggle').classList.remove('active');
    }
  }
});
