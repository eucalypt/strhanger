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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? '已設定' : '未設定')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 環境變數未正確設定')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('測試 Supabase 連線...')
  
  try {
    // 測試 members 表格
    console.log('檢查 members 表格...')
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*')
      .limit(1)
    
    if (membersError) {
      console.error('members 表格錯誤:', membersError.message)
    } else {
      console.log('members 表格連線成功')
    }

    // 測試 products 表格
    console.log('檢查 products 表格...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('products 表格錯誤:', productsError.message)
    } else {
      console.log('products 表格連線成功')
    }

    // 測試 categories 表格
    console.log('檢查 categories 表格...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (categoriesError) {
      console.error('categories 表格錯誤:', categoriesError.message)
    } else {
      console.log('categories 表格連線成功')
    }

    // 測試 orders 表格
    console.log('檢查 orders 表格...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (ordersError) {
      console.error('orders 表格錯誤:', ordersError.message)
    } else {
      console.log('orders 表格連線成功')
    }

    console.log('所有表格連線測試完成')
    
  } catch (error) {
    console.error('連線測試失敗:', error)
  }
}

testConnection() 