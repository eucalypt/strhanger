# Supabase 整合設定指南

## 概述

本專案已整合 Supabase 作為雲端資料庫，取代原本的本地 JSON 檔案資料庫。Supabase 提供 PostgreSQL 資料庫、即時訂閱、認證等功能。

## 設定步驟

### 1. 建立 Supabase 專案

1. 前往 [Supabase](https://supabase.com) 註冊帳號
2. 建立新專案
3. 記下專案 URL 和 API 金鑰

### 2. 設定環境變數

在 `.env.local` 檔案中設定：

```bash
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 建立資料庫表格

在 Supabase Dashboard 的 SQL Editor 中執行以下 SQL：

```sql
-- 建立 members 表格
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  email TEXT,
  phone TEXT,
  name TEXT NOT NULL,
  password TEXT,
  googleId TEXT,
  avatar TEXT,
  level TEXT NOT NULL DEFAULT '一般會員',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 建立索引
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_phone ON members(phone);
CREATE INDEX idx_members_google_id ON members(googleId);

-- 建立 products 表格
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category TEXT,
  inStock BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_products_category ON products(category);

-- 建立 categories 表格
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立 orders 表格
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  memberId TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT '待付款',
  paymentMethod TEXT,
  shippingAddress JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_orders_member_id ON orders(memberId);
```

### 4. 設定 Row Level Security (RLS)

```sql
-- 啟用 RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 設定 policies
-- members 表格：所有使用者可讀，僅管理員可寫
CREATE POLICY "Members are viewable by everyone" ON members FOR SELECT USING (true);
CREATE POLICY "Members are insertable by authenticated users" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Members are updatable by themselves or admins" ON members FOR UPDATE USING (true);

-- products 表格：所有人可讀，僅管理員可寫
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by admins" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products are updatable by admins" ON products FOR UPDATE USING (true);
CREATE POLICY "Products are deletable by admins" ON products FOR DELETE USING (true);

-- categories 表格：所有人可讀，僅管理員可寫
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by admins" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Categories are updatable by admins" ON categories FOR UPDATE USING (true);
CREATE POLICY "Categories are deletable by admins" ON categories FOR DELETE USING (true);

-- orders 表格：會員只能看到自己的訂單，管理員可看全部
CREATE POLICY "Orders are viewable by owner or admins" ON orders FOR SELECT USING (
  auth.uid()::text = memberId OR 
  EXISTS (SELECT 1 FROM members WHERE id = auth.uid()::text AND level = '管理員')
);
CREATE POLICY "Orders are insertable by authenticated users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are updatable by admins" ON orders FOR UPDATE USING (true);
```

### 5. 資料遷移

執行遷移腳本將現有 JSON 資料遷移到 Supabase：

```bash
# 安裝依賴
pnpm install

# 執行遷移腳本
npx tsx scripts/migrate-to-supabase.ts
```

### 6. 測試整合

啟動開發伺服器測試功能：

```bash
pnpm dev
```

## 功能特色

### 1. 即時資料同步
- 使用 Supabase 即時訂閱功能
- 多使用者同時操作時資料即時同步

### 2. 資料安全
- Row Level Security (RLS) 保護
- 使用者只能存取有權限的資料

### 3. 效能優化
- 資料庫索引優化查詢效能
- 連線池管理

### 4. 備份與恢復
- Supabase 自動備份
- 點擊恢復功能

## API 端點更新

所有 API 端點已更新為使用 Supabase：

- `/api/members` - 會員管理
- `/api/products` - 商品管理  
- `/api/categories` - 分類管理
- `/api/orders` - 訂單管理

## 環境變數

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 匿名 API 金鑰 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## 部署注意事項

### Vercel 部署

1. 在 Vercel 專案設定中新增環境變數
2. 確保 Supabase 專案允許 Vercel 網域存取
3. 設定 CORS 政策

### 生產環境安全

1. 使用 Supabase 的 Service Role Key 進行管理操作
2. 設定適當的 RLS 政策
3. 定期監控資料庫使用量

## 故障排除

### 常見問題

1. **連線失敗**
   - 檢查環境變數是否正確
   - 確認 Supabase 專案狀態

2. **權限錯誤**
   - 檢查 RLS 政策設定
   - 確認使用者認證狀態

3. **資料遷移失敗**
   - 檢查表格結構是否正確
   - 確認 API 金鑰權限

### 支援

- [Supabase 文件](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 開發工具

### Supabase CLI

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入
supabase login

# 連結專案
supabase link --project-ref your-project-ref

# 本地開發
supabase start
```

### 資料庫管理

- Supabase Dashboard 提供完整的資料庫管理介面
- 支援 SQL 查詢、表格編輯、備份管理
- 即時監控和效能分析 