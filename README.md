# Something Right

一個極簡風格的現代電商網站，提供優雅的使用者體驗和流暢的購物流程。

## 🚀 專案特色

- **極簡設計**: 採用現代化的極簡設計風格
- **響應式佈局**: 完美適配桌面、平板和手機裝置
- **深色模式**: 支援深色/淺色主題切換
- **流暢動畫**: 使用 Framer Motion 提供流暢的互動動畫
- **購物車功能**: 完整的購物車管理和結帳流程
- **產品搜尋**: 即時搜尋和分類篩選功能

## 🛠️ 技術棧

- **框架**: Next.js 15.2.4
- **語言**: TypeScript
- **UI 庫**: React 19
- **樣式**: Tailwind CSS
- **組件**: Radix UI
- **動畫**: Framer Motion
- **圖標**: Lucide React
- **套件管理**: pnpm

## 📦 主要功能

### 🛍️ 購物體驗
- 產品網格展示
- 產品詳細資訊彈窗
- 購物車側邊欄
- 數量調整和移除商品
- 總價計算

### 🔍 搜尋與篩選
- 即時產品搜尋
- 分類篩選（照明、廚具、家居裝飾等）
- 搜尋結果即時更新

### 🎨 使用者介面
- 響應式設計
- 深色/淺色主題
- 流暢的頁面轉場
- 直觀的導航體驗

## 🚀 快速開始

### 前置需求
- Node.js 18+ 
- pnpm

### 安裝依賴
```bash
pnpm install
```

### 開發模式
```bash
pnpm dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置生產版本
```bash
pnpm build
pnpm start
```

## 📁 專案結構

```
strhanger/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全域樣式
│   ├── layout.tsx         # 根佈局
│   └── page.tsx           # 首頁
├── components/             # React 組件
│   ├── kokonutui/         # 電商相關組件
│   │   ├── cart-drawer.tsx    # 購物車側邊欄
│   │   ├── data.ts            # 產品資料
│   │   ├── minimal-shop.tsx   # 主要商店組件
│   │   ├── product-grid.tsx   # 產品網格
│   │   ├── product-modal.tsx  # 產品詳情彈窗
│   │   └── top-bar.tsx        # 頂部導航欄
│   └── ui/                # UI 組件庫
├── lib/                   # 工具函數
├── public/                # 靜態資源
└── styles/                # 樣式檔案
```

## 🎯 核心組件

### MinimalShop
主要的商店組件，整合所有功能：
- 購物車狀態管理
- 產品搜尋和篩選
- 產品選擇和購物車操作

### ProductGrid
產品展示網格：
- 響應式產品卡片
- 產品圖片和資訊
- 點擊開啟詳情

### CartDrawer
購物車側邊欄：
- 商品列表顯示
- 數量調整
- 移除商品
- 總價計算

### TopBar
頂部導航欄：
- 品牌標識
- 分類篩選
- 搜尋功能
- 購物車圖標

## 🎨 設計系統

### 色彩方案
- **主要色彩**: Zinc 色系
- **強調色彩**: 黑色/白色
- **背景**: 淺灰/深灰

### 字體
- **主要字體**: Inter (Google Fonts)
- **字體大小**: 響應式設計

### 間距
- **統一間距**: 使用 Tailwind CSS 間距系統
- **響應式**: 適配不同螢幕尺寸

## 🔧 開發指南

### 新增產品
在 `components/kokonutui/data.ts` 中新增產品資料：

```typescript
{
  id: "unique-id",
  name: "產品名稱",
  description: "產品描述",
  price: 99,
  image: "圖片URL",
  category: "分類"
}
```

### 自訂樣式
使用 Tailwind CSS 類別進行樣式自訂，或修改 `globals.css`。

### 新增功能
在對應的組件中新增功能，確保遵循現有的狀態管理模式。

## 📱 響應式設計

- **桌面**: 6 欄產品網格
- **平板**: 4 欄產品網格  
- **手機**: 3 欄產品網格

## 🌙 深色模式

專案內建深色模式支援，使用 `next-themes` 進行主題管理。

## 🚀 部署

### Vercel (推薦)
1. 連接 GitHub 倉庫
2. 自動部署和更新

### 其他平台
```bash
pnpm build
pnpm start
```

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**Something Right** - 讓購物體驗變得簡單而美好 ✨ 