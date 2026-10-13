/* ============================================================
   1. 主题初始化（同步执行，防止深色模式闪烁）
   ============================================================ */
(function () {
    var root = document.documentElement;
    try {
        var saved = localStorage.getItem('theme');
        // 没有保存过主题时，默认深色
        root.dataset.theme = saved || 'dark';
    } catch (e) {
        root.dataset.theme = 'dark';
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
    // 回到顶部
    window.addEventListener('scroll', updateBackTopBtn, { passive: true });
    updateBackTopBtn();
    document.getElementById('backTop')?.addEventListener('click', scrollToTop);
    // 滚动入场动画
    initReveal();
    // 编辑器窗口操作
    initEditor();
    // CMD 窗口操作
    initCmd();
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

        // RPG 卡片：鼠标悬停联系方式时，底部提示跟着变
    (function () {
        var hint = document.querySelector('.rpg-hint');
        var rows = document.querySelectorAll('.rpg-contact');
        if (!hint || !rows.length) return;

        var originalHTML = hint.innerHTML;

        rows.forEach(function (row) {
            row.addEventListener('mouseenter', function () {
                var name = row.querySelector('.rpg-contact-name');
                var label = name ? name.textContent : '';
                hint.innerHTML = '<span class="rpg-key">[CLICK]</span> 打开 ' + label;
            });
            row.addEventListener('mouseleave', function () {
                hint.innerHTML = originalHTML;
            });
        });
    })();

        /* RPG 技能条：进入视口时填充 + 数字滚动 */
    (function () {
        var skills = document.querySelector('.rpg-skills');
        if (!skills) return;

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function countUp(el, target, duration) {
            var startTime = performance.now();
            function tick(now) {
                var t = Math.min((now - startTime) / duration, 1);
                el.textContent = Math.round(easeOutCubic(t) * target);
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            }
            requestAnimationFrame(tick);
        }

        function run() {
            skills.classList.add('in');

            skills.querySelectorAll('.rpg-skill-bar i[data-val]').forEach(function (bar) {
                bar.style.setProperty('--fill', bar.dataset.val + '%');
            });

            skills.querySelectorAll('.rpg-skill-num[data-val]').forEach(function (num, i) {
                var target = parseInt(num.dataset.val, 10) || 0;
                setTimeout(function () {
                    countUp(num, target, 900);
                }, i * 100);
            });
        }

        // 尊重「减少动效」
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            skills.classList.add('in');
            skills.querySelectorAll('.rpg-skill-bar i[data-val]').forEach(function (bar) {
                bar.style.setProperty('--fill', bar.dataset.val + '%');
            });
            skills.querySelectorAll('.rpg-skill-num[data-val]').forEach(function (num) {
                num.textContent = num.dataset.val;
            });
            return;
        }

        if (!('IntersectionObserver' in window)) {
            run();
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    run();
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        io.observe(skills);
    })();

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
        // 先退出最大化
        if (editor.classList.contains('maximized')) {
            editor.classList.remove('maximized');
            editor.classList.add('minimized');
            return;
        }
        editor.classList.toggle('minimized');
    });

    // 最大化：CSS 全屏
    maxBtn?.addEventListener('click', function () {
        // 先退出最小化
        if (editor.classList.contains('minimized')) {
            editor.classList.remove('minimized');
        }
        editor.classList.toggle('maximized');
    });

    // 关闭：隐藏 + 清空两个状态
    closeBtn?.addEventListener('click', function () {
        editor.hidden = true;
        restore.hidden = false;
        editor.classList.remove('maximized');
        editor.classList.remove('minimized');
    });

    // ESC 退出最大化
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && editor.classList.contains('maximized')) {
            editor.classList.remove('maximized');
        }
    });

    // 关闭：隐藏编辑器，显示恢复按钮
    closeBtn?.addEventListener('click', function () {
        editor.hidden = true;
        restore.hidden = false;
        editor.classList.remove('maximized');
        editor.classList.remove('minimized');
    });

    // 重新打开
    restoreBtn?.addEventListener('click', function () {
        editor.hidden = false;
        restore.hidden = true;
    });

        // Run 按钮
    var runBtn    = document.getElementById('editorRun');
    var runLabel  = runBtn ? runBtn.querySelector('.run-label') : null;
    var output    = document.getElementById('editorOutput');
    var outputBody = document.getElementById('outputBody');
    var outputClose = document.getElementById('outputClose');

    var outputLines = [
        'TigerFong — 前端 / 游戏程序',
        '学生。平时写点网页，也在学着做游戏。',
        '  · 网页 —— 从设计到前端，自己搭',
        '  · 桌宠 —— WPF + 大模型，能对话',
        '  · 游戏 —— Unity 项目，程序归我',
        '  · 后端 —— 碰过一点，还在学'
    ];

    var runTimer = null;

    if (runBtn && output && outputBody) {
        runBtn.addEventListener('click', function () {
            if (runBtn.classList.contains('running')) return;

            runBtn.classList.add('running');
            if (runLabel) runLabel.textContent = 'Running…';

            output.hidden = false;
            outputBody.textContent = '';

            var i = 0;
            clearInterval(runTimer);

            // 启动延迟，模拟 Python 启动
            setTimeout(function () {
                runTimer = setInterval(function () {
                    if (i >= outputLines.length) {
                        clearInterval(runTimer);
                        runBtn.classList.remove('running');
                        if (runLabel) runLabel.textContent = 'Run';
                        return;
                    }
                    outputBody.textContent += outputLines[i] + '\n';
                    i++;
                }, 80);
            }, 260);
        });
    }

    if (outputClose && output) {
        outputClose.addEventListener('click', function () {
            clearInterval(runTimer);
            output.hidden = true;
        });
    }
}

/* ============================================================
   10. CMD 窗口操作
   ============================================================ */
function initCmd() {
    var cmd      = document.getElementById('cmd');
    var minBtn   = document.getElementById('cmdMin');
    var maxBtn   = document.getElementById('cmdMax');
    var closeBtn = document.getElementById('cmdClose');
    var restore  = document.getElementById('cmdRestore');
    var restoreBtn = document.getElementById('cmdRestoreBtn');

    if (!cmd) return;

    // 最小化
    minBtn?.addEventListener('click', function () {
        if (cmd.classList.contains('maximized')) {
            cmd.classList.remove('maximized');
            cmd.classList.add('minimized');
            return;
        }
        cmd.classList.toggle('minimized');
    });

    // 最大化
    maxBtn?.addEventListener('click', function () {
        if (cmd.classList.contains('minimized')) {
            cmd.classList.remove('minimized');
        }
        cmd.classList.toggle('maximized');
    });

    // 关闭
    closeBtn?.addEventListener('click', function () {
        cmd.hidden = true;
        restore.hidden = false;
        cmd.classList.remove('maximized');
        cmd.classList.remove('minimized');
    });

    // 重新打开
    restoreBtn?.addEventListener('click', function () {
        cmd.hidden = false;
        restore.hidden = true;
    });

    // ESC 退出最大化
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && cmd.classList.contains('maximized')) {
            cmd.classList.remove('maximized');
        }
    });
}