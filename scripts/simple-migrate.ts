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

// 遷移商品資料
async function migrateProducts() {
  console.log('遷移商品資料...')
  
  try {
    const products = readJsonFile('products.json')
    
    for (const product of products) {
      // 使用 SQL 查詢直接插入
      const { error } = await supabase
        .rpc('insert_product', {
          product_data: product
        })
      
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

// 遷移會員資料
async function migrateMembers() {
  console.log('遷移會員資料...')
  
  try {
    const members = readJsonFile('members.json')
    
    for (const member of members) {
      // 使用 SQL 查詢直接插入
      const { error } = await supabase
        .rpc('insert_member', {
          member_data: member
        })
      
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

// 主遷移函數
async function simpleMigrate() {
  console.log('開始簡化遷移...')
  
  try {
    await migrateMembers()
    await migrateProducts()
    
    console.log('簡化遷移完成！')
  } catch (error) {
    console.error('簡化遷移失敗:', error)
  }
}

simpleMigrate() 