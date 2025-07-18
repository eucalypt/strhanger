# 會員系統功能說明

## 功能概述

會員系統提供完整的會員管理功能，包括註冊、登入、會員資料管理、訂單查詢等，支援多種註冊方式和會員分級制度。

## 功能特色

### 1. 多種註冊方式
- **傳統註冊**：使用 email 或手機號碼 + 密碼註冊
- **Google SSO**：使用 Google 帳號快速註冊（開發中）
- **彈性驗證**：至少需要 email 或手機號碼其中一個

### 2. 會員分級制度
- **一般會員**：基本會員權益
- **VIP 會員**：享受特殊優惠和服務
- **會員點數**：購物累積點數，可兌換優惠

### 3. 會員資料管理
- 個人資料查看和編輯
- 會員等級和點數顯示
- 註冊時間和最後登入時間記錄

### 4. 訂單管理
- 查看所有訂單記錄
- 訂單狀態追蹤
- 訂單詳細資訊顯示

## 技術架構

### 資料庫結構

#### 會員資料 (Member)
```typescript
interface Member {
  id: string
  email?: string
  phone?: string
  name: string
  password?: string // 加密後的密碼
  googleId?: string // Google SSO ID
  avatar?: string
  level: 'VIP' | '一般會員'
  points: number
  created_at: string
  updated_at: string
  last_login?: string
}
```

#### 訂單資料 (Order)
```typescript
interface Order {
  id: string
  memberId: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: '待付款' | '已付款' | '處理中' | '已出貨' | '已完成' | '已取消'
  paymentMethod: '信用卡' | '轉帳' | '貨到付款'
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  created_at: string
  updated_at: string
}
```

### API 端點

#### 會員相關 API

##### POST /api/members
- **功能**：會員註冊
- **請求體**：`{ name, email?, phone?, password, googleId?, avatar? }`
- **回傳**：新增的會員資料（不含密碼）

##### POST /api/members/login
- **功能**：會員登入
- **請求體**：`{ email?, phone?, password }` 或 `{ googleId }`
- **回傳**：`{ success: true, member: Member }`

##### GET /api/members?id={memberId}
- **功能**：取得會員資料
- **回傳**：會員資料（不含密碼）

##### PUT /api/members/[id]
- **功能**：更新會員資料
- **請求體**：`{ name, email?, phone? }`
- **回傳**：`{ success: true }`

#### 訂單相關 API

##### GET /api/orders?memberId={memberId}
- **功能**：取得會員的所有訂單
- **回傳**：`Order[]`

##### GET /api/orders?id={orderId}
- **功能**：取得單一訂單
- **回傳**：`Order`

##### POST /api/orders
- **功能**：建立新訂單
- **請求體**：`{ memberId, items, total, paymentMethod, shippingAddress }`
- **回傳**：新增的訂單資料

### 檔案結構
```
lib/db/
├── members.ts              # 會員資料庫模組

app/api/members/
├── route.ts               # 會員註冊 API
├── login/route.ts         # 會員登入 API
└── [id]/route.ts         # 會員資料更新 API

app/api/orders/
└── route.ts              # 訂單 API

app/
├── register/page.tsx      # 會員註冊頁面
├── login/page.tsx        # 會員登入頁面
└── member/page.tsx       # 會員後台頁面

components/kokonutui/
└── top-bar.tsx          # 前台導航列（含會員按鈕）
```

## 使用方式

### 1. 會員註冊
1. 訪問 `/register` 頁面
2. 選擇註冊方式（傳統註冊或 Google 登入）
3. 填寫必要資料（姓名、email 或手機號碼、密碼）
4. 完成註冊後自動跳轉到登入頁面

### 2. 會員登入
1. 訪問 `/login` 頁面
2. 使用 email 或手機號碼 + 密碼登入
3. 登入成功後跳轉到會員後台

### 3. 會員後台
1. 訪問 `/member` 頁面（需要登入）
2. **會員資料**：查看和編輯個人資料
3. **訂單記錄**：查看所有訂單和狀態

### 4. 前台導航
- 右上角會員圖示：未登入時跳轉到登入頁面，已登入時跳轉到會員後台

## 安全機制

### 1. 密碼加密
- 使用 bcryptjs 進行密碼加密
- 密碼至少 6 個字元
- 密碼確認驗證

### 2. 資料驗證
- 會員資料唯一性檢查（email、手機號碼）
- 必填欄位驗證
- 資料格式驗證

### 3. 登入狀態管理
- 使用 localStorage 儲存登入狀態
- 會員資料本地快取
- 自動登入狀態檢查

### 4. 錯誤處理
- API 錯誤回傳適當的錯誤訊息
- 前端表單驗證
- Toast 訊息提示

## 會員分級制度

### 一般會員
- 基本購物功能
- 累積會員點數
- 查看訂單記錄

### VIP 會員
- 享受特殊優惠
- 優先客服支援
- 專屬活動參與

### 點數制度
- 購物累積點數
- 點數兌換優惠
- 等級升級機制

## 訂單狀態

### 訂單流程
1. **待付款**：訂單建立，等待付款
2. **已付款**：付款完成，等待處理
3. **處理中**：商家正在處理訂單
4. **已出貨**：商品已出貨
5. **已完成**：訂單完成
6. **已取消**：訂單已取消

### 付款方式
- 信用卡
- 銀行轉帳
- 貨到付款

## 開發注意事項

### 1. 資料一致性
- 會員資料更新時檢查唯一性
- 訂單狀態變更記錄時間戳
- 會員點數計算準確性

### 2. 使用者體驗
- 登入狀態即時更新
- 表單驗證即時回饋
- 載入狀態顯示

### 3. 安全性
- 密碼加密儲存
- API 權限驗證
- 敏感資料保護

### 4. 擴展性
- 支援多種登入方式
- 會員分級可擴展
- 訂單狀態可自定義

## 未來功能規劃

### 1. Google SSO 整合
- Google OAuth 2.0 實作
- 自動會員資料同步
- 安全 token 管理

### 2. 會員權限管理
- 角色基礎權限控制
- 功能權限細分
- 管理員權限設定

### 3. 進階功能
- 會員推薦制度
- 積分兌換系統
- 會員專屬優惠
- 個人化推薦

### 4. 行動端優化
- 響應式設計
- PWA 支援
- 推播通知

## 測試建議

### 1. 功能測試
- 註冊流程測試
- 登入登出測試
- 資料編輯測試
- 訂單查詢測試

### 2. 安全測試
- 密碼加密驗證
- 資料驗證測試
- 權限控制測試

### 3. 效能測試
- API 回應時間
- 大量資料處理
- 並發使用者測試

## 部署注意事項

### 1. 環境變數
- 資料庫連線設定
- API 金鑰管理
- 加密金鑰設定

### 2. 資料備份
- 會員資料備份
- 訂單資料備份
- 定期備份策略

### 3. 監控告警
- API 錯誤監控
- 效能監控
- 安全事件告警 