// Cygnus Cafe - 星空和交互效果
// 在页面加载时生成星星和添加交互效果

(function() {
    'use strict';

    // 生成星星
    function createStars() {
        // 检查是否已经有星星容器
        let starsContainer = document.querySelector('.stars-container');
        if (!starsContainer) {
            starsContainer = document.createElement('div');
            starsContainer.className = 'stars-container';
            document.body.insertBefore(starsContainer, document.body.firstChild);
        }

        const starCount = 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.opacity = Math.random() * 0.5 + 0.3;
            starsContainer.appendChild(star);
        }
    }

    // 创建星云效果
    function createNebulas() {
        if (document.querySelector('.nebula')) return;

        const nebula1 = document.createElement('div');
        nebula1.className = 'nebula nebula-1';
        document.body.insertBefore(nebula1, document.body.firstChild);

        const nebula2 = document.createElement('div');
        nebula2.className = 'nebula nebula-2';
        document.body.insertBefore(nebula2, document.body.firstChild);
    }

    // 添加咖啡图标到导航链接
    function enhanceNavigation() {
        const navLinks = document.querySelectorAll('nav a, .nav a, .menu a');
        navLinks.forEach(link => {
            // 避免重复添加
            if (!link.dataset.enhanced) {
                link.dataset.enhanced = 'true';
                
                // 悬停时添加咖啡emoji
                link.addEventListener('mouseenter', function() {
                    if (!this.querySelector('.coffee-icon')) {
                        const icon = document.createElement('span');
                        icon.className = 'coffee-icon';
                        icon.textContent = '☕ ';
                        icon.style.opacity = '0';
                        icon.style.transition = 'opacity 0.3s ease';
                        this.insertBefore(icon, this.firstChild);
                        
                        // 触发动画
                        setTimeout(() => {
                            icon.style.opacity = '1';
                        }, 10);
                    }
                });
                
                link.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.coffee-icon');
                    if (icon) {
                        icon.style.opacity = '0';
                        setTimeout(() => {
                            if (icon && icon.parentNode) {
                                icon.parentNode.removeChild(icon);
                            }
                        }, 300);
                    }
                });
            }
        });
    }

    // 为Logo添加天鹅emoji
    function enhanceLogo() {
        const logo = document.querySelector('.logo, .site-title, header h1 a, header a[href="/"]');
        if (logo && !logo.dataset.enhanced) {
            logo.dataset.enhanced = 'true';
            
            // 如果还没有emoji，添加一个
            if (!logo.textContent.includes('🦢') && !logo.textContent.includes('Cygnus')) {
                const swan = document.createElement('span');
                swan.textContent = '🦢 ';
                swan.style.display = 'inline-block';
                swan.style.animation = 'rotate 30s linear infinite';
                logo.insertBefore(swan, logo.firstChild);
            }
        }
    }

    // 平滑滚动
    function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 为文章卡片添加发光效果
    function enhanceCards() {
        const cards = document.querySelectorAll('.post, .post-item, article, .article');
        cards.forEach(card => {
            if (card.dataset.enhanced) return;
            card.dataset.enhanced = 'true';

            card.addEventListener('mouseenter', function(e) {
                // 创建光晕效果
                if (!this.querySelector('.card-glow')) {
                    const glow = document.createElement('div');
                    glow.className = 'card-glow';
                    glow.style.position = 'absolute';
                    glow.style.width = '100%';
                    glow.style.height = '100%';
                    glow.style.top = '0';
                    glow.style.left = '0';
                    glow.style.borderRadius = 'inherit';
                    glow.style.pointerEvents = 'none';
                    glow.style.zIndex = '-1';
                    glow.style.opacity = '0';
                    glow.style.background = 'radial-gradient(circle at center, rgba(212, 165, 116, 0.1) 0%, transparent 70%)';
                    glow.style.transition = 'opacity 0.6s ease';
                    this.appendChild(glow);
                    
                    setTimeout(() => {
                        glow.style.opacity = '1';
                    }, 10);
                }
            });
        });
    }

    // 为代码块添加复制按钮
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            if (pre.querySelector('.copy-button')) return;

            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = '复制';
            button.style.position = 'absolute';
            button.style.top = '0.5rem';
            button.style.right = '0.5rem';
            button.style.padding = '0.4rem 0.8rem';
            button.style.fontSize = '0.8rem';
            button.style.background = 'rgba(212, 165, 116, 0.2)';
            button.style.border = '1px solid rgba(212, 165, 116, 0.3)';
            button.style.borderRadius = '6px';
            button.style.color = 'var(--cafe-latte)';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.3s ease';

            button.addEventListener('click', () => {
                const code = block.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    button.textContent = '已复制!';
                    button.style.background = 'rgba(155, 126, 186, 0.3)';
                    setTimeout(() => {
                        button.textContent = '复制';
                        button.style.background = 'rgba(212, 165, 116, 0.2)';
                    }, 2000);
                });
            });

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(212, 165, 116, 0.3)';
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(212, 165, 116, 0.2)';
                button.style.transform = 'translateY(0)';
            });

            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }

    // 添加返回顶部按钮
    function addBackToTop() {
        if (document.querySelector('.back-to-top')) return;

        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '↑';
        button.style.position = 'fixed';
        button.style.bottom = '2rem';
        button.style.right = '2rem';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.borderRadius = '50%';
        button.style.background = 'var(--cafe-latte)';
        button.style.color = 'var(--space-dark)';
        button.style.border = 'none';
        button.style.fontSize = '1.5rem';
        button.style.cursor = 'pointer';
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.transition = 'all 0.3s ease';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)';

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-5px) scale(1.1)';
            button.style.boxShadow = '0 8px 20px rgba(212, 165, 116, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)';
        });

        document.body.appendChild(button);

        // 滚动时显示/隐藏
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });
    }

    // 初始化所有功能
    function init() {
        // 等待DOM完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        createStars();
        createNebulas();
        enhanceNavigation();
        enhanceLogo();
        smoothScroll();
        enhanceCards();
        addCopyButtons();
        addBackToTop();

        // 在页面内容动态加载后重新初始化某些功能
        const observer = new MutationObserver(() => {
            enhanceCards();
            addCopyButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动
    init();
})();
