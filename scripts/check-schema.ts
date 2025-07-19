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

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 環境變數未正確設定')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  console.log('檢查 Supabase 表格結構...')
  
  try {
    // 檢查 members 表格結構
    console.log('\n=== members 表格結構 ===')
    const { data: membersData, error: membersError } = await supabase
      .from('members')
      .select('*')
      .limit(1)
    
    if (membersError) {
      console.error('members 表格錯誤:', membersError.message)
    } else {
      console.log('members 表格結構正常')
      if (membersData && membersData.length > 0) {
        console.log('範例資料:', Object.keys(membersData[0]))
      }
    }

    // 檢查 products 表格結構
    console.log('\n=== products 表格結構 ===')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('products 表格錯誤:', productsError.message)
    } else {
      console.log('products 表格結構正常')
      if (productsData && productsData.length > 0) {
        console.log('範例資料:', Object.keys(productsData[0]))
      }
    }

    // 檢查 categories 表格結構
    console.log('\n=== categories 表格結構 ===')
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (categoriesError) {
      console.error('categories 表格錯誤:', categoriesError.message)
    } else {
      console.log('categories 表格結構正常')
      if (categoriesData && categoriesData.length > 0) {
        console.log('範例資料:', Object.keys(categoriesData[0]))
      }
    }

    // 檢查 orders 表格結構
    console.log('\n=== orders 表格結構 ===')
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (ordersError) {
      console.error('orders 表格錯誤:', ordersError.message)
    } else {
      console.log('orders 表格結構正常')
      if (ordersData && ordersData.length > 0) {
        console.log('範例資料:', Object.keys(ordersData[0]))
      }
    }

    console.log('\n表格結構檢查完成')
    
  } catch (error) {
    console.error('檢查表格結構失敗:', error)
  }
}

checkSchema() 