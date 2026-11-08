(function() {
    // 主题切换
    const themeBtn = document.getElementById('themeToggleBtn');
    const bodyEl = document.body;
    const themeLabel = document.getElementById('themeLabel');
    const themeIcon = document.getElementById('themeIcon');
    function setTheme(theme) {
        if (theme === 'dark') {
            bodyEl.classList.add('dark');
            localStorage.setItem('neoxe_theme', 'dark');
            themeLabel.innerText = '深色';
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        } else {
            bodyEl.classList.remove('dark');
            localStorage.setItem('neoxe_theme', 'light');
            themeLabel.innerText = '浅色';
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
    }
    const saved = localStorage.getItem('neoxe_theme');
    if (saved === 'dark') setTheme('dark');
    else setTheme('light');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = bodyEl.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // 页面切换
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page-content');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-page');
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pages.forEach(p => p.classList.remove('active-page'));
            const activePage = document.getElementById(target);
            if (activePage) activePage.classList.add('active-page');
        });
    });

    // 图片加载（带点击放大功能，确保事件绑定）
    function loadImages(seriesName, container) {
        if (!container) return;
        container.innerHTML = '';
        const base = `/img/${seriesName}/`;
        const exts = ['1.webp', '2.webp', '1.png', '2.png', '1.jpg', '2.jpg'];
        let loadedCount = 0;
        const totalFiles = exts.length;
        function createImageElement(file) {
            const img = document.createElement('img');
            img.style.maxWidth = '200px';
            img.style.height = 'auto';
            img.style.borderRadius = '12px';
            img.alt = `${seriesName} preview`;
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!this.src || this.src === window.location.href) return;
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.75);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    cursor: pointer;
                    backdrop-filter: blur(6px);
                `;
                overlay.addEventListener('click', function() {
                    this.remove();
                });
                const bigImg = document.createElement('img');
                bigImg.src = this.src;
                bigImg.style.cssText = `
                    max-width: 92%;
                    max-height: 92%;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                    object-fit: contain;
                    background: white;
                    padding: 4px;
                `;
                overlay.appendChild(bigImg);
                document.body.appendChild(overlay);
            });
            const onLoadOrError = () => {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    container.appendChild(img);
                    loadedCount++;
                    if (container.style.display === 'none') container.style.display = '';
                }
                if (loadedCount === totalFiles) {
                    if (container.children.length === 0) {
                        container.style.display = 'none';
                    } else {
                        container.style.display = '';
                    }
                }
            };
            img.onload = onLoadOrError;
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalFiles && container.children.length === 0) {
                    container.style.display = 'none';
                }
            };
            img.src = base + file;
            if (img.complete) {
                if (img.naturalWidth > 0) {
                    container.appendChild(img);
                    loadedCount++;
                    if (container.style.display === 'none') container.style.display = '';
                } else {
                    loadedCount++;
                }
                if (loadedCount === totalFiles) {
                    if (container.children.length === 0) {
                        container.style.display = 'none';
                    } else {
                        container.style.display = '';
                    }
                }
            }
        }
        exts.forEach(file => createImageElement(file));
        setTimeout(() => {
            if (container.children.length === 0) {
                container.style.display = 'none';
            } else {
                container.style.display = '';
            }
        }, 500);
    }

    const groups = { Ultra:'Ultra', Elite:'Elite', Max:'Max', Slim:'Slim', SuperLite:'SuperLite', Arm:'Arm' };
    for (const [id, name] of Object.entries(groups)) {
        const el = document.getElementById(`imgGroup-${id}`);
        if (el) loadImages(name, el);
    }

    // 版本展开折叠
    document.querySelectorAll('.version-item').forEach(item => {
        const sum = item.querySelector('.version-summary');
        const wrap = item.querySelector('.version-detail-wrapper');
        const icon = sum?.querySelector('.expand-icon');
        if (sum && wrap) {
            sum.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShow = wrap.classList.contains('show');
                if (isShow) {
                    wrap.classList.remove('show');
                    if (icon) icon.classList.remove('fa-chevron-up');
                    if (icon) icon.classList.add('fa-chevron-down');
                } else {
                    wrap.classList.add('show');
                    if (icon) icon.classList.remove('fa-chevron-down');
                    if (icon) icon.classList.add('fa-chevron-up');
                }
            });
        }
    });

    // 问答展开折叠
    document.querySelectorAll('.qa-item').forEach(item => {
        const q = item.querySelector('.qa-question');
        const wrap = item.querySelector('.qa-answer-wrapper');
        const icon = q?.querySelector('.expand-icon');
        if (q && wrap) {
            q.addEventListener('click', () => {
                const isShow = wrap.classList.contains('show');
                if (isShow) {
                    wrap.classList.remove('show');
                    if (icon) icon.classList.remove('fa-chevron-up');
                    if (icon) icon.classList.add('fa-chevron-down');
                } else {
                    wrap.classList.add('show');
                    if (icon) icon.classList.remove('fa-chevron-down');
                    if (icon) icon.classList.add('fa-chevron-up');
                }
            });
        }
    });

    // ===== 背景色块动画（30fps，小屏/减少动效静态化） =====
    (function initBlobAnimation() {
        const blobs = document.querySelectorAll('.bg-blobs .blob');
        if (!blobs.length) return;

        const configs = [
            { el: blobs[0], ampX: 6,  ampY: 8,  scaleAmp: 0.15, period: 24000 },
            { el: blobs[1], ampX: -5, ampY: 6,  scaleAmp: 0.18, period: 28000 },
            { el: blobs[2], ampX: 7,  ampY: -5, scaleAmp: 0.10, period: 22000 },
        ].filter(c => c.el);

        if (!configs.length) return;

        const mobileQuery = window.matchMedia('(max-width: 640px)');
        const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const FRAME_INTERVAL = 1000 / 30;
        let last = 0;
        let rafId = null;
        let running = false;

        function tick(now) {
            if (!running) return;
            rafId = requestAnimationFrame(tick);
            if (now - last < FRAME_INTERVAL) return;
            last = now;
            for (const c of configs) {
                const phase = Math.sin((now / c.period) * Math.PI * 2);
                const x = c.ampX * phase;
                const y = c.ampY * phase;
                const s = 1 + c.scaleAmp * Math.abs(phase);
                c.el.style.transform = `translate(${x}%, ${y}%) scale(${s})`;
            }
        }

        function start() {
            if (running) return;
            running = true;
            last = 0;
            rafId = requestAnimationFrame(tick);
        }

        function stop() {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
            for (const c of configs) {
                c.el.style.transform = '';
            }
        }

        function sync() {
            const shouldStop = mobileQuery.matches || reducedQuery.matches || document.hidden;
            if (shouldStop) {
                stop();
            } else {
                start();
            }
        }

        document.addEventListener('visibilitychange', sync);
        if (mobileQuery.addEventListener) {
            mobileQuery.addEventListener('change', sync);
        } else if (mobileQuery.addListener) {
            mobileQuery.addListener(sync);
        }
        if (reducedQuery.addEventListener) {
            reducedQuery.addEventListener('change', sync);
        } else if (reducedQuery.addListener) {
            reducedQuery.addListener(sync);
        }

        if (mobileQuery.matches || reducedQuery.matches) {
            stop();
        } else {
            sync();
        }
    })();
})();
