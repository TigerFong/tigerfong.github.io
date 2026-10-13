# TigerFong · 个人主页

> 一个用代码、终端、游戏三种界面讲自己的个人主页。

[![网站](https://img.shields.io/badge/网站-在线访问-2c5f8a?style=flat-square)](https://tigerfong.github.io)
![状态](https://img.shields.io/badge/status-active-success?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 简介

个人主页把三块内容做成三种界面：

| 区块 | 界面隐喻 | 内容 |
|------|----------|------|
| 关于我 | VS Code 编辑器 | 一段 Python 代码，`print(Me())` 输出自我介绍 |
| 作品集 | Windows CMD | `dir` + `type` 展示两个项目 |
| 联系我 | RPG 存档画面 | 头像、等级、技能条、联系方式 |

三块不只是装饰，都能「操作」——编辑器可以 Run、CMD 可以最小化、RPG 技能条会随滚动填充。

🔗 **在线访问**：<https://tigerfong.github.io>

---

## 功能

### 交互

- **编辑器窗口**：最小化 / 最大化 / 关闭 / Run（模拟 Python 输出）
- **CMD 窗口**：最小化 / 最大化 / 关闭
- **RPG 技能条**：进入视口时滚动填充
- **主题切换**：深色 / 浅色，默认深色，选择存在 localStorage
- **滑出菜单**：右侧抽屉，含导航和链接
- **复制邮箱**：点击后变成「已复制」，并冒出粒子

### 动效

- **首屏入场**：四个元素逐个淡入上移
- **代码行交错**：编辑器 21 行代码从上往下逐行出现
- **CMD 打字**：三条命令逐字敲出
- **滚动淡入**：区块进入视口时淡入
- **鼠标光晕**：跟随鼠标移动的淡蓝光
- **滚动进度条**：顶部 2px 进度指示
- **箭头滑动**：链接悬停时 `→` 右移
- **头像呼吸**：RPG 头像轻微上下浮动
- **CRT 扫描线**：RPG 卡片覆盖极细扫描线

### 键盘快捷键

| 键 | 功能 |
|----|------|
| `T` | 切换主题 |
| `M` | 开关菜单 |
| `G` | 回到顶部 |
| `Esc` | 关闭菜单 |

---

## 技术栈

- **原生 HTML / CSS / JavaScript**——无框架、无构建工具、无依赖
- **字体**：系统字体栈 + 等宽字体
- **主题**：CSS 变量驱动，`data-theme` 属性切换
- **动画**：CSS `@keyframes` + Web Animations API + IntersectionObserver
- **图标**：全部内联 SVG，无图标库

整个项目**零外部依赖**，无 npm、无打包、无 CDN 请求（除了 GitHub 头像）。

---

## 项目结构

```
tigerfong.github.io/
├── index.html      # 页面结构
├── style.css       # 全部样式（约 1600 行）
├── script.js       # 交互逻辑（约 700 行）
├── README.md
├── LICENSE
└── images/
    ├── bg-light.png   # 首屏浅色背景
    └── bg-dark.png    # 首屏深色背景
```

---

## 本地运行

纯静态页面，不需要服务器。

### 方式 1：直接打开

双击 `index.html` 即可。

### 方式 2：本地服务器（推荐，避免背景图加载问题）

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

然后访问 <http://localhost:8000>。

---

## 自定义

### 改主题色

`style.css` 顶部：

```css
:root {
  --accent: #2c5f8a;       /* 浅色模式强调色 */
  --accent-dark: #1e4468;
  --accent-soft: #e8eff6;
}
:root[data-theme="dark"] {
  --accent: #6ba3d4;       /* 深色模式强调色 */
  --accent-dark: #4a86b8;
  --accent-soft: #1e2a38;
}
```

改这几个色值，全站跟着变：按钮、下划线、链接、技能条、像素图标、菜单高亮。

### 改内容

| 想改什么 | 改哪里 |
|----------|--------|
| 首屏名字、定位小字 | `index.html` 的 `.hero` |
| 自我介绍（Python 代码） | `index.html` 的 `.editor-body` |
| Run 后的输出 | `script.js` 里 `outputLines` 数组 |
| 作品集项目 | `index.html` 的 `.cmd-item` |
| 联系方式 | `index.html` 的 `.rpg-contact` |
| 技能条数值 | `index.html` 的 `data-val`，或状态词 |
| 技能条填充 | `index.html` 里 `<i data-val="72">` 的数值 |
| 等级 | `index.html` 的 `.rpg-level`（Lv. 12） |

### 换头像

`index.html` 搜 `github.com/TigerFong.png`，改成你的 GitHub 用户名：

```html
<img src="https://github.com/你的用户名.png?size=200" alt="头像">
```

### 换 favicon

`index.html` 的 `<head>` 里搜 `rel="icon"`：

```html
<link rel="icon" href="data:image/svg+xml,<svg ...><rect fill='%232c5f8a'/><text ...>T</text></svg>">
```

- `fill='%232c5f8a'` → 背景色（`%23` 是 `#` 的转义）
- `>T<` → 显示的字
- `rx='20'` → 圆角半径（0-50，50 是圆形）

### 换背景图

替换 `images/bg-light.png`（浅色模式）和 `images/bg-dark.png`（深色模式）。

**建议尺寸**：1920×1080 以上，横构图。

**没图也行**——浏览器会忽略加载失败的背景图，只显示纯色。

---

## 部署

### GitHub Pages（推荐）

1. 创建仓库，名称为 `你的用户名.github.io`
2. 把所有文件推到 `main` 分支根目录
3. 等 1-2 分钟，访问 `https://你的用户名.github.io`

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

### 其他平台

- **Vercel**：导入 GitHub 仓库，零配置
- **Netlify**：拖拽整个文件夹到网页即可
- **Cloudflare Pages**：连接 GitHub 仓库

全部支持纯静态站点，无需任何构建配置。

---

## 浏览器支持

| 浏览器 | 支持 |
|--------|------|
| Chrome / Edge | ✅ 完整支持 |
| Safari | ✅ 完整支持 |
| Firefox | ✅ 完整支持 |
| 移动端 Safari / Chrome | ✅ 响应式适配 |
| IE 11 | ❌ 不支持 |

使用的现代特性：CSS 变量、IntersectionObserver、Web Animations API、`backdrop-filter`。

所有动效在 `prefers-reduced-motion: reduce` 下自动禁用。

---

## 设计说明

### 为什么用三种界面？

个人主页最容易做得千篇一律——一段自我介绍、几张卡片、底部联系。这个项目想让访客**记住**，所以把内容装进三个真实的界面里：

- **编辑器**对应「写代码」
- **CMD** 对应「做项目」
- **RPG 画面**对应「做游戏」

三块界面串起来，就是一句不说的自我介绍：**这个人写代码、做东西、还玩游戏**。

### 关于动画

所有动画都遵循一个原则：**不为了动而动**。

- 首屏入场：建立阅读顺序
- 代码行交错：模拟「代码被写出来」
- CMD 打字：模拟「命令被执行」
- 技能条填充：模拟「角色属性被加载」

每个动画都在讲一件事，不是装饰。

---

## License

本项目采用 [MIT License](LICENSE) 授权。

可自由参考代码，但请替换成你自己的个人信息（名字、邮箱、GitHub 用户名、项目内容等）。

---

<p align="center">
  <sub>Built with code, a terminal, and a game.</sub>
</p>
