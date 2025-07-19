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

// 讀取 JSON 檔案
function readJsonFile(filename: string) {
  const filePath = path.join(process.cwd(), 'data', filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

// 清除所有資料
async function clearAllData() {
  console.log('清除所有現有資料...')
  
  try {
    // 清除訂單
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .neq('id', 'dummy')
    
    if (ordersError) {
      console.error('清除訂單失敗:', ordersError.message)
    } else {
      console.log('訂單資料已清除')
    }

    // 清除商品
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .neq('id', 'dummy')
    
    if (productsError) {
      console.error('清除商品失敗:', productsError.message)
    } else {
      console.log('商品資料已清除')
    }

    // 清除會員
    const { error: membersError } = await supabase
      .from('members')
      .delete()
      .neq('id', 'dummy')
    
    if (membersError) {
      console.error('清除會員失敗:', membersError.message)
    } else {
      console.log('會員資料已清除')
    }

    // 清除分類
    const { error: categoriesError } = await supabase
      .from('categories')
      .delete()
      .neq('id', 'dummy')
    
    if (categoriesError) {
      console.error('清除分類失敗:', categoriesError.message)
    } else {
      console.log('分類資料已清除')
    }

    console.log('所有資料清除完成')
  } catch (error) {
    console.error('清除資料失敗:', error)
  }
}

// 遷移分類資料
async function migrateCategories() {
  console.log('遷移分類資料...')
  
  try {
    const categories = readJsonFile('categories.json')
    
    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .insert(category)
      
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

// 遷移會員資料
async function migrateMembers() {
  console.log('遷移會員資料...')
  
  try {
    const members = readJsonFile('members.json')
    
    for (const member of members) {
      const { error } = await supabase
        .from('members')
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
        .from('products')
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

// 主遷移函數
async function cleanMigrate() {
  console.log('開始清除並重新遷移...')
  
  try {
    // 清除所有資料
    await clearAllData()
    
    // 等待一下讓清除操作完成
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重新遷移資料
    await migrateCategories()
    await migrateMembers()
    await migrateProducts()
    
    console.log('清除並重新遷移完成！')
  } catch (error) {
    console.error('清除並重新遷移失敗:', error)
  }
}

cleanMigrate() 