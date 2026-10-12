/* ============================================================
   1. 主题初始化（同步执行，防止深色模式闪烁）
   ============================================================ */
(function () {
    var root = document.documentElement;
    try {
        var saved = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
    } catch (e) {
        root.dataset.theme = 'light';
    }
    root.classList.add('js');
})();

/* ============================================================
   2. 主题切换
   ============================================================ */
function toggleTheme() {
    var root = document.documentElement;
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateThemeButton();
}

function updateThemeButton() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';
}

/* ============================================================
   3. 打字机副标题
   ============================================================ */
var typewriterPhrases = [
    '把想法，做成能用的东西。',
    '想法太多，只好一个个做出来。',
    '想到，然后做出来。中间不隔夜。',
    '用代码搭世界，顺便把自己也装进去。',
    '写的是代码，造的是宇宙。',
    '把复杂的问题，做成简单的产品。',
    '少说一点，多做一点。'
];

var typewriterTimer = null;
var typewriterPi = 0;
var typewriterCi = 0;
var typewriterDeleting = false;

var TYPE_SPEED   = 110;
var DELETE_SPEED = 55;
var HOLD_TIME    = 1800;
var GAP_TIME     = 400;

function startTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;

    // 尊重系统的「减少动效」设置
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = typewriterPhrases[0];
        return;
    }

    el.textContent = '';
    setTimeout(typewriterTick, 600);
}

function typewriterTick() {
    var el = document.getElementById('typewriter');
    if (!el) return;

    var phrase = typewriterPhrases[typewriterPi];

    if (!typewriterDeleting) {
        typewriterCi++;
        el.textContent = phrase.slice(0, typewriterCi);
        if (typewriterCi >= phrase.length) {
            typewriterDeleting = true;
            setTimeout(typewriterTick, HOLD_TIME);
            return;
        }
        setTimeout(typewriterTick, TYPE_SPEED);
    } else {
        typewriterCi--;
        el.textContent = phrase.slice(0, typewriterCi);
        if (typewriterCi <= 0) {
            typewriterDeleting = false;
            typewriterPi = (typewriterPi + 1) % typewriterPhrases.length;
            setTimeout(typewriterTick, GAP_TIME);
            return;
        }
        setTimeout(typewriterTick, DELETE_SPEED);
    }
}

/* ============================================================
   4. 回到顶部
   ============================================================ */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBackTopBtn() {
    var btn = document.getElementById('backTop');
    if (!btn) return;
    btn.classList.toggle('show', window.scrollY > 480);
}

/* ============================================================
   5. 滚动入场动画
   ============================================================ */
function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // 旧浏览器：直接全部显示
    if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
}

/* ============================================================
   6. 复制邮箱
   ============================================================ */
function copyEmail() {
    var btn    = document.getElementById('copyBtn');
    var textEl = document.getElementById('emailText');
    if (!btn || !textEl) return;

    var email = textEl.textContent.trim();

    function done() {
        var original = btn.textContent;
        btn.textContent = '已复制';
        btn.classList.add('done');
        setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove('done');
        }, 1600);
    }

    function fallback() {
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(fallback);
    } else {
        fallback();
    }
}

/* ============================================================
   7. 事件绑定
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

    // 主题切换按钮
    updateThemeButton();
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    // 打字机
    startTypewriter();

    // 回到顶部
    window.addEventListener('scroll', updateBackTopBtn, { passive: true });
    updateBackTopBtn();
    document.getElementById('backTop')?.addEventListener('click', scrollToTop);

    // 滚动入场动画
    initReveal();

    // 编辑器窗口操作
    initEditor();

    // 复制邮箱
    document.getElementById('copyBtn')?.addEventListener('click', copyEmail);

    // ⭐ 滑出菜单（新增）
    document.getElementById('menuBtn')?.addEventListener('click', openMenu);
    document.getElementById('menuClose')?.addEventListener('click', closeMenu);
    document.getElementById('menuOverlay')?.addEventListener('click', closeMenu);
    document.addEventListener('keydown', onMenuKeydown);

    // 点菜单链接后自动关闭
    document.querySelectorAll('#menuPanel .menu-item').forEach(function (a) {
        a.addEventListener('click', closeMenu);
    });

});

/* ============================================================
   8. 滑出菜单
   ============================================================ */
function openMenu() {
    var panel = document.getElementById('menuPanel');
    var overlay = document.getElementById('menuOverlay');
    var btn = document.getElementById('menuBtn');
    if (!panel || !overlay || !btn) return;

    panel.classList.add('open');
    overlay.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    var panel = document.getElementById('menuPanel');
    var overlay = document.getElementById('menuOverlay');
    var btn = document.getElementById('menuBtn');
    if (!panel || !overlay || !btn) return;

    panel.classList.remove('open');
    overlay.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function onMenuKeydown(e) {
    if (e.key === 'Escape') {
        var panel = document.getElementById('menuPanel');
        if (panel && panel.classList.contains('open')) closeMenu();
    }
}

/* ============================================================
   9. 编辑器窗口操作
   ============================================================ */
function initEditor() {
    var editor   = document.getElementById('editor');
    var minBtn   = document.getElementById('editorMin');
    var maxBtn   = document.getElementById('editorMax');
    var closeBtn = document.getElementById('editorClose');
    var restore  = document.getElementById('editorRestore');
    var restoreBtn = document.getElementById('editorRestoreBtn');

    if (!editor) return;

    // 最小化：折叠正文
    minBtn?.addEventListener('click', function () {
        editor.classList.toggle('minimized');
    });

    // 最大化：全屏
    maxBtn?.addEventListener('click', function () {
        editor.classList.toggle('maximized');
    });

    // 关闭：隐藏编辑器，显示恢复按钮
    closeBtn?.addEventListener('click', function () {
        editor.hidden = true;
        restore.hidden = false;
        editor.classList.remove('maximized');
    });

    // 重新打开
    restoreBtn?.addEventListener('click', function () {
        editor.hidden = false;
        restore.hidden = true;
    });

    // ESC 退出最大化
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && editor.classList.contains('maximized')) {
            editor.classList.remove('maximized');
        }
    });
}