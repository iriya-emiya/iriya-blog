// 天鹅座X-1 · 深空探测站 · 交互引擎
(function() {
    'use strict';

    // ── Stars + Cygnus constellation ─────────────────────────
    function createStars() {
        let container = document.querySelector('.stars-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'stars-container';
            document.body.prepend(container);
        }
        if (container.children.length > 0) return;

        const count = 200;
        const cygnusNodes = [
            { x: 0.38, y: 0.22 }, // Deneb
            { x: 0.35, y: 0.32 }, { x: 0.30, y: 0.40 }, // gamma (Sadr)
            { x: 0.25, y: 0.52 }, { x: 0.22, y: 0.68 }, // zeta
            { x: 0.45, y: 0.30 }, // beta (Albireo)
            { x: 0.42, y: 0.38 }, { x: 0.50, y: 0.45 },
            { x: 0.15, y: 0.58 }, { x: 0.52, y: 0.60 },
            { x: 0.48, y: 0.72 }, { x: 0.55, y: 0.50 },
        ];
        const edges = [
            [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[2,6],[2,7],[7,8],[2,9],[9,10],[6,11],
        ];

        // SVG constellation lines
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.classList.add('constellation-svg');
        svg.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:-1;width:100%;height:100%;';
        svg.innerHTML = '<defs><filter id="glow"><feGaussianBlur stdDeviation="1.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
        const group = document.createElementNS(svgNS, 'g');
        group.setAttribute('filter', 'url(#glow)');
        group.style.opacity = '0.04';
        svg.appendChild(group);
        container.appendChild(svg);

        edges.forEach(([a, b]) => {
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', cygnusNodes[a].x * 100 + '%');
            line.setAttribute('y1', cygnusNodes[a].y * 100 + '%');
            line.setAttribute('x2', cygnusNodes[b].x * 100 + '%');
            line.setAttribute('y2', cygnusNodes[b].y * 100 + '%');
            line.setAttribute('stroke', '#c8d8ff');
            line.setAttribute('stroke-width', '0.7');
            line.classList.add('constellation-line');
            group.appendChild(line);
        });

        // Random stars
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const s = Math.random() < 0.05 ? (1.6 + Math.random() * 2) : (0.7 + Math.random() * 1.3);
            star.style.cssText = `
                left:${Math.random()*100}%;top:${Math.random()*100}%;
                width:${s}px;height:${s}px;
                --twinkle-dur:${2+Math.random()*5}s;
                --twinkle-delay:${Math.random()*3}s;
                opacity:${0.15+Math.random()*0.45};
            `;
            container.appendChild(star);
        }

        // Bright constellation nodes
        cygnusNodes.forEach((pos, i) => {
            const star = document.createElement('div');
            star.className = 'star constellation-star';
            const size = i === 0 ? 3.5 : i === 2 ? 3 : 1.8 + Math.random();
            star.style.cssText = `
                left:${pos.x*100}%;top:${pos.y*100}%;
                width:${size}px;height:${size}px;
                --twinkle-delay:${i*0.4}s;
            `;
            container.appendChild(star);
        });
    }

    // ── Nebulas + Watercolor blobs ───────────────────────────
    function createNebulas() {
        if (document.querySelector('.nebula')) return;
        ['nebula-1', 'nebula-2'].forEach(cls => {
            const n = document.createElement('div');
            n.className = 'nebula ' + cls;
            document.body.prepend(n);
        });
    }
    function createWatercolorBlobs() {
        if (document.querySelector('.watercolor-blob')) return;
        ['rgba(60,40,100,0.22)','rgba(40,60,120,0.18)','rgba(80,60,110,0.16)','rgba(50,80,130,0.14)']
        .forEach((c, i) => {
            const b = document.createElement('div');
            b.className = 'watercolor-blob';
            b.style.cssText = `
                width:${280+Math.random()*360}px;height:${280+Math.random()*360}px;
                background:radial-gradient(circle,${c} 0%,transparent 70%);
                top:${8+Math.random()*72}%;left:${8+Math.random()*72}%;
                --blob-dur:${20+Math.random()*30}s;--blob-delay:${i*3}s;
            `;
            document.body.prepend(b);
        });
    }

    // ── Card mouse tracking ──────────────────────────────────
    function enhanceCards() {
        document.querySelectorAll('.post-main, .home-post-item').forEach(el => {
            if (el.dataset.tracked) return;
            el.dataset.tracked = '1';
            el.addEventListener('mousemove', function(e) {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mouse-x', ((e.clientX - r.left) / r.width * 100) + '%');
                el.style.setProperty('--mouse-y', ((e.clientY - r.top) / r.height * 100) + '%');
            });
        });
    }

    // ── Back to top ──────────────────────────────────────────
    function addBackToTop() {
        if (document.querySelector('.back-to-top')) return;
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '&#x2191;';
        btn.setAttribute('aria-label', '返回顶部');
        document.body.appendChild(btn);
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
    }

    // ── Code copy ────────────────────────────────────────────
    function addCopyButtons() {
        document.querySelectorAll('pre').forEach(pre => {
            if (pre.querySelector('.copy-button')) return;
            const btn = document.createElement('button');
            btn.className = 'copy-button';
            btn.textContent = '复制';
            pre.style.position = 'relative';
            pre.appendChild(btn);
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText((pre.querySelector('code') || pre).textContent).then(() => {
                    btn.textContent = '已复制';
                    setTimeout(() => { btn.textContent = '复制'; }, 2000);
                });
            });
        });
    }

    // ── Smooth scroll ────────────────────────────────────────
    function smoothScroll() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link || link.getAttribute('href') === '#') return;
            const target = document.querySelector(link.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    }

    // ── TOC Scroll-spy with IntersectionObserver ─────────────
    function initTOC() {
        const tocLinks = document.querySelectorAll('.toc-content a');
        const tocNodes = document.querySelectorAll('.toc-node');
        const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4');
        if (!tocLinks.length || !headings.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    // Update TOC links
                    tocLinks.forEach(link => {
                        const isActive = link.getAttribute('href') === '#' + id;
                        link.classList.toggle('toc-active', isActive);
                        if (isActive) {
                            link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    });
                    // Update constellation nodes
                    const idx = Array.from(headings).indexOf(entry.target);
                    tocNodes.forEach((node, i) => {
                        node.classList.toggle('toc-active', i === Math.floor(idx / (headings.length / tocNodes.length)));
                    });
                }
            });
        }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

        headings.forEach(h => observer.observe(h));

        // Also handle scroll-based check for the initial view
        window.addEventListener('scroll', function() {
            if (window.scrollY < 100) {
                tocLinks.forEach(l => l.classList.remove('toc-active'));
                tocNodes.forEach(n => n.classList.remove('toc-active'));
            }
        }, { passive: true });
    }

    // ── Scroll-reveal ────────────────────────────────────────
    function initScrollReveal() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.home-post-item').forEach(item => {
            if (!item.style.opacity) item.style.opacity = '1';
            obs.observe(item);
        });
    }

    // ── Init ─────────────────────────────────────────────────
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        createStars();
        createNebulas();
        createWatercolorBlobs();
        enhanceCards();
        addBackToTop();
        addCopyButtons();
        smoothScroll();
        initTOC();
        initScrollReveal();

        new MutationObserver(() => { enhanceCards(); addCopyButtons(); })
            .observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
