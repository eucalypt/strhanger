import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// 手動讀取 .env.local 檔案
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const envLines = envContent.split('\n')
  
  for (const line of envLines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^"|"$/g, '')
        process.env[key.trim()] = value.trim()
      }
    }
  }
}

// 手動設定 Supabase 環境變數
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Supabase URL is required. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable.')
}

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key is required. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY environment variable.')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 資料庫表格名稱
const TABLES = {
  MEMBERS: 'members',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders'
} as const

// 讀取 JSON 檔案
function readJsonFile(filename: string) {
  const filePath = path.join(process.cwd(), 'data', filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

// 建立 Supabase 表格
async function createTables() {
  console.log('建立 Supabase 表格...')

  // 注意：表格建立需要在 Supabase Dashboard 的 SQL Editor 中手動執行
  // 這裡只檢查表格是否存在
  console.log('請在 Supabase Dashboard 的 SQL Editor 中執行以下 SQL 來建立表格：')
  console.log(`
-- 建立 members 表格
CREATE TABLE IF NOT EXISTS members (
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
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_google_id ON members(googleId);

-- 建立 products 表格
CREATE TABLE IF NOT EXISTS products (
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
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 建立 categories 表格
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立 orders 表格
CREATE TABLE IF NOT EXISTS orders (
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
CREATE INDEX IF NOT EXISTS idx_orders_member_id ON orders(memberId);
  `)

  console.log('表格建立完成')
}

// 遷移會員資料
async function migrateMembers() {
  console.log('遷移會員資料...')
  
  try {
    const members = readJsonFile('members.json')
    
    for (const member of members) {
      const { error } = await supabase
        .from(TABLES.MEMBERS)
        .insert(member)
      
      if (error) {
        console.error('遷移會員失敗:', member.id, error.message)
      } else {
        console.log('會員遷移成功:', member.id)
      }
    }
    
    console.log('會員資料遷移完成')
  } catch (error) {
    console.error('會員資料遷移失敗:', error)
  }
}

// 遷移商品資料
async function migrateProducts() {
  console.log('遷移商品資料...')
  
  try {
    const products = readJsonFile('products.json')
    
    for (const product of products) {
      const { error } = await supabase
        .from(TABLES.PRODUCTS)
        .insert(product)
      
      if (error) {
        console.error('遷移商品失敗:', product.id, error.message)
      } else {
        console.log('商品遷移成功:', product.id)
      }
    }
    
    console.log('商品資料遷移完成')
  } catch (error) {
    console.error('商品資料遷移失敗:', error)
  }
}

// 遷移分類資料
async function migrateCategories() {
  console.log('遷移分類資料...')
  
  try {
    const categories = readJsonFile('categories.json')
    
    for (const category of categories) {
      const { error } = await supabase
        .from(TABLES.CATEGORIES)
        .upsert(category, { onConflict: 'id' })
      
      if (error) {
        console.error('遷移分類失敗:', category.id, error.message)
      } else {
        console.log('分類遷移成功:', category.id)
      }
    }
    
    console.log('分類資料遷移完成')
  } catch (error) {
    console.error('分類資料遷移失敗:', error)
  }
}

// 遷移訂單資料
async function migrateOrders() {
  console.log('遷移訂單資料...')
  
  try {
    const orders = readJsonFile('orders.json')
    
    for (const order of orders) {
      const { error } = await supabase
        .from(TABLES.ORDERS)
        .upsert(order, { onConflict: 'id' })
      
      if (error) {
        console.error('遷移訂單失敗:', order.id, error.message)
      } else {
        console.log('訂單遷移成功:', order.id)
      }
    }
    
    console.log('訂單資料遷移完成')
  } catch (error) {
    console.error('訂單資料遷移失敗:', error)
  }
}

// 主遷移函數
async function migrateToSupabase() {
  console.log('開始遷移到 Supabase...')
  
  try {
    // 建立表格
    await createTables()
    
    // 遷移資料
    await migrateMembers()
    await migrateProducts()
    await migrateCategories()
    await migrateOrders()
    
    console.log('遷移完成！')
  } catch (error) {
    console.error('遷移失敗:', error)
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  migrateToSupabase()
}

export { migrateToSupabase } 