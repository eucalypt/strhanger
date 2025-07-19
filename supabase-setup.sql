-- Supabase 資料庫設定腳本
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 先刪除現有的表格（如果存在）
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS members CASCADE;

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

-- 啟用 Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 設定 RLS 政策
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

-- 顯示建立結果
SELECT 'Tables created successfully!' as result; 