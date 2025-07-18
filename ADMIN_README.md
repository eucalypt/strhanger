# 後台管理功能說明

## 功能概述

本專案已建立完整的後台管理功能，讓管理員可以輕鬆管理商品資料。

## 功能特色

### 🔐 管理員認證
- 簡單的密碼保護機制
- 預設密碼：`admin123`
- 登入狀態會保存在瀏覽器本地儲存

### 📦 商品管理
- **新增商品**：完整的新增商品表單，包含圖片上傳
- **編輯商品**：修改現有商品的所有資訊
- **刪除商品**：安全刪除商品（含確認對話框）
- **庫存管理**：設定商品是否有庫存

### 🖼️ 圖片管理
- 支援圖片上傳功能
- 圖片會自動儲存到 `public/images/` 目錄
- 支援預覽功能

### 📊 資料管理
- 商品資料儲存在 `data/products.json`
- 支援分類管理
- 完整的 CRUD 操作

## 使用方式

### 1. 登入管理後台
```
http://localhost:3000/admin/login
```
輸入預設密碼：`admin123`

### 2. 管理商品
登入後會自動跳轉到管理頁面：
```
http://localhost:3000/admin
```

### 3. 功能操作
- **新增商品**：點擊「新增商品」按鈕
- **編輯商品**：點擊商品卡片上的「編輯」按鈕
- **刪除商品**：點擊商品卡片上的「刪除」按鈕
- **登出**：點擊右上角的「登出」按鈕

## API 端點

### 商品管理
- `GET /api/products` - 取得所有商品
- `POST /api/products` - 新增商品
- `PUT /api/products` - 更新商品
- `DELETE /api/products/[id]` - 刪除商品

### 分類管理
- `GET /api/categories` - 取得所有分類

### 圖片上傳
- `POST /api/upload` - 上傳商品圖片

## 資料結構

### 商品資料結構
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "inStock": "boolean",
  "created_at": "string",
  "updated_at": "string"
}
```

## 安全注意事項

⚠️ **重要提醒**：
- 目前使用簡單的密碼驗證，僅適用於開發環境
- 生產環境建議實作更安全的認證機制
- 圖片上傳功能需要確保檔案類型驗證
- 建議加入 CSRF 保護

## 技術架構

- **前端**：Next.js 15 + React 19 + TypeScript
- **UI 組件**：shadcn/ui
- **資料儲存**：JSON 檔案系統
- **圖片儲存**：本地檔案系統
- **狀態管理**：React Hooks
- **路由**：Next.js App Router

## 開發建議

1. **安全性增強**：
   - 實作 JWT 或 Session 認證
   - 加入角色權限管理
   - 實作 API 速率限制

2. **功能擴展**：
   - 訂單管理功能
   - 用戶管理功能
   - 統計報表功能
   - 批量操作功能

3. **使用者體驗**：
   - 加入載入動畫
   - 實作拖拽排序
   - 加入搜尋和篩選功能
   - 實作分頁功能

## 檔案結構

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # 登入頁面
│   └── page.tsx              # 管理主頁面
├── api/
│   ├── products/
│   │   ├── [id]/
│   │   │   └── route.ts      # 刪除商品 API
│   │   └── route.ts          # 商品 CRUD API
│   ├── categories/
│   │   └── route.ts          # 分類 API
│   └── upload/
│       └── route.ts          # 圖片上傳 API
components/
├── admin-nav.tsx             # 管理導航組件
└── ui/                       # UI 組件庫
lib/
└── db/
    └── database.ts           # 資料庫操作模組
data/
└── products.json             # 商品資料檔案
```

## 部署注意事項

1. 確保 `public/images/` 目錄有寫入權限
2. 確保 `data/` 目錄有讀寫權限
3. 生產環境建議使用資料庫而非 JSON 檔案
4. 實作適當的錯誤處理和日誌記錄 