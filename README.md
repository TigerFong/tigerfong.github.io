# TigerFong · 個人主頁

> 一個用程式碼、終端機、遊戲三種介面講自己的個人主頁。

[![網站](https://img.shields.io/badge/網站-線上訪問-2c5f8a?style=flat-square)](https://tigerfong.github.io)
![狀態](https://img.shields.io/badge/status-active-success?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 簡介

個人主頁把三塊內容做成三種介面：

| 區塊 | 介面隱喻 | 內容 |
|------|----------|------|
| 關於我 | VS Code 編輯器 | 一段 Python 程式碼，`print(Me())` 輸出自我介紹 |
| 作品集 | Windows CMD | `dir` + `type` 展示兩個專案 |
| 聯絡我 | RPG 存檔畫面 | 頭像、等級、技能條、聯絡方式 |

三塊不只是裝飾，都能「操作」——編輯器可以 Run、CMD 可以最小化、RPG 技能條會隨捲動填充。

🔗 **線上訪問**：<https://tigerfong.github.io>

---

## 功能

### 互動

- **編輯器視窗**：最小化 / 最大化 / 關閉 / Run（模擬 Python 輸出）
- **CMD 視窗**：最小化 / 最大化 / 關閉
- **RPG 技能條**：進入視口時捲動填充
- **主題切換**：深色 / 淺色，預設深色，選擇存在 localStorage
- **滑出選單**：右側抽屜，含導覽和連結
- **複製信箱**：點擊後變成「已複製」，並冒出粒子

### 動效

- **首屏入場**：四個元素逐個淡入上移
- **程式碼行交錯**：編輯器 21 行程式碼從上往下逐行出現
- **CMD 打字**：三條指令逐字敲出
- **捲動淡入**：區塊進入視口時淡入
- **滑鼠光暈**：跟隨滑鼠移動的淡藍光
- **捲動進度條**：頂部 2px 進度指示
- **箭頭滑動**：連結懸停時 `→` 右移
- **頭像呼吸**：RPG 頭像輕微上下浮動
- **CRT 掃描線**：RPG 卡片覆蓋極細掃描線

### 鍵盤快捷鍵

| 鍵 | 功能 |
|----|------|
| `T` | 切換主題 |
| `M` | 開關選單 |
| `G` | 回到頂部 |
| `Esc` | 關閉選單 |

---

## 技術棧

- **原生 HTML / CSS / JavaScript**——無框架、無建置工具、無依賴
- **字型**：系統字型堆疊 + 等寬字型
- **主題**：CSS 變數驅動，`data-theme` 屬性切換
- **動畫**：CSS `@keyframes` + Web Animations API + IntersectionObserver
- **圖示**：全部內嵌 SVG，無圖示庫

整個專案**零外部依賴**，無 npm、無打包、無 CDN 請求（除了 GitHub 頭像）。

---

## 專案結構

```
tigerfong.github.io/
├── index.html      # 頁面結構
├── style.css       # 全部樣式（約 1600 行）
├── script.js       # 互動邏輯（約 700 行）
├── README.md
├── LICENSE
└── images/
    ├── bg-light.png   # 首屏淺色背景
    └── bg-dark.png    # 首屏深色背景
```

---

## 本地執行

純靜態頁面，不需要伺服器。

### 方式 1：直接開啟

雙擊 `index.html` 即可。

### 方式 2：本地伺服器（推薦，避免背景圖載入問題）

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

然後訪問 <http://localhost:8000>。

---

## 自訂

### 改主題色

`style.css` 頂部：

```css
:root {
  --accent: #2c5f8a;       /* 淺色模式強調色 */
  --accent-dark: #1e4468;
  --accent-soft: #e8eff6;
}
:root[data-theme="dark"] {
  --accent: #6ba3d4;       /* 深色模式強調色 */
  --accent-dark: #4a86b8;
  --accent-soft: #1e2a38;
}
```

改這幾個色值，全站跟著變：按鈕、下劃線、連結、技能條、像素圖示、選單高亮。

### 改內容

| 想改什麼 | 改哪裡 |
|----------|--------|
| 首屏名字、定位小字 | `index.html` 的 `.hero` |
| 自我介紹（Python 程式碼） | `index.html` 的 `.editor-body` |
| Run 後的輸出 | `script.js` 裡 `outputLines` 陣列 |
| 作品集專案 | `index.html` 的 `.cmd-item` |
| 聯絡方式 | `index.html` 的 `.rpg-contact` |
| 技能條數值 | `index.html` 的 `data-val`，或狀態詞 |
| 技能條填充 | `index.html` 裡 `<i data-val="72">` 的數值 |
| 等級 | `index.html` 的 `.rpg-level`（Lv. 12） |

### 換頭像

`index.html` 搜 `github.com/TigerFong.png`，改成你的 GitHub 使用者名稱：

```html
<img src="https://github.com/你的使用者名稱.png?size=200" alt="頭像">
```

### 換 favicon

`index.html` 的 `<head>` 裡搜 `rel="icon"`：

```html
<link rel="icon" href="data:image/svg+xml,<svg ...><rect fill='%232c5f8a'/><text ...>T</text></svg>">
```

- `fill='%232c5f8a'` → 背景色（`%23` 是 `#` 的轉義）
- `>T<` → 顯示的字
- `rx='20'` → 圓角半徑（0-50，50 是圓形）

### 換背景圖

替換 `images/bg-light.png`（淺色模式）和 `images/bg-dark.png`（深色模式）。

**建議尺寸**：1920×1080 以上，橫構圖。

**沒圖也行**——瀏覽器會忽略載入失敗的背景圖，只顯示純色。

---

## 部署

### GitHub Pages（推薦）

1. 建立倉庫，名稱為 `你的使用者名稱.github.io`
2. 把所有檔案推到 `main` 分支根目錄
3. 等 1-2 分鐘，訪問 `https://你的使用者名稱.github.io`

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的使用者名稱/你的使用者名稱.github.io.git
git push -u origin main
```

### 其他平台

- **Vercel**：匯入 GitHub 倉庫，零配置
- **Netlify**：拖曳整個資料夾到網頁即可
- **Cloudflare Pages**：連接 GitHub 倉庫

全部支援純靜態站點，無需任何建置配置。

---

## 瀏覽器支援

| 瀏覽器 | 支援 |
|--------|------|
| Chrome / Edge | ✅ 完整支援 |
| Safari | ✅ 完整支援 |
| Firefox | ✅ 完整支援 |
| 行動端 Safari / Chrome | ✅ 響應式適配 |
| IE 11 | ❌ 不支援 |

使用的現代特性：CSS 變數、IntersectionObserver、Web Animations API、`backdrop-filter`。

所有動效在 `prefers-reduced-motion: reduce` 下自動停用。

---

## 設計說明

### 為什麼用三種介面？

個人主頁最容易做得千篇一律——一段自我介紹、幾張卡片、底部聯絡。這個專案想讓訪客**記住**，所以把內容裝進三個真實的介面裡：

- **編輯器**對應「寫程式」
- **CMD** 對應「做專案」
- **RPG 畫面**對應「做遊戲」

三塊介面串起來，就是一句不說的自我介紹：**這個人寫程式、做東西、還玩遊戲**。

### 關於動畫

所有動畫都遵循一個原則：**不為了動而動**。

- 首屏入場：建立閱讀順序
- 程式碼行交錯：模擬「程式碼被寫出來」
- CMD 打字：模擬「指令被執行」
- 技能條填充：模擬「角色屬性被載入」

每個動畫都在講一件事，不是裝飾。

---

## License

本專案採用 [MIT License](LICENSE) 授權。

可自由參考程式碼，但請替換成你自己的個人資訊（名字、信箱、GitHub 使用者名稱、專案內容等）。

---

<p align="center">
  <sub>Built with code, a terminal, and a game.</sub>
</p>
