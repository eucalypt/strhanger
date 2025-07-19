import { createClient } from '@supabase/supabase-js'

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Supabase URL is required. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable.')
  }

  if (!supabaseAnonKey) {
    throw new Error('Supabase Anon Key is required. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY environment variable.')
  }

  return { supabaseUrl, supabaseAnonKey }
}

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 資料庫表格名稱
export const TABLES = {
  MEMBERS: 'members',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders'
} as const

// 會員資料類型
export interface Member {
  id: string
  email?: string
  phone?: string
  name: string
  password?: string
  googleId?: string
  avatar?: string
  level: '管理員' | 'VIP' | '一般會員'
  points: number
  created_at: string
  updated_at: string
  last_login?: string
}

// 商品資料類型
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  stock: number
  created_at: string
  updated_at: string
}

// 分類資料類型
export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

// 訂單資料類型
export interface Order {
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