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

async function checkOrdersSchema() {
  console.log('檢查 orders 表格結構...')
  
  try {
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
      } else {
        console.log('orders 表格是空的')
      }
    }

    console.log('\n表格結構檢查完成')
    
  } catch (error) {
    console.error('檢查表格結構失敗:', error)
  }
}

checkOrdersSchema() 