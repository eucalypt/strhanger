import fs from 'fs'
import path from 'path'

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

function checkOAuthConfig() {
  console.log('檢查 Google OAuth 設定...')
  
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI'
  ]
  
  const missingVars = []
  
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (!value) {
      missingVars.push(varName)
      console.log(`❌ ${varName}: 未設定`)
    } else {
      console.log(`✅ ${varName}: 已設定`)
      if (varName === 'GOOGLE_REDIRECT_URI') {
        console.log(`   URL: ${value}`)
      }
    }
  }
  
  if (missingVars.length > 0) {
    console.log('\n⚠️  缺少必要的環境變數：')
    console.log('請在 Vercel 專案設定中設定以下環境變數：')
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`)
    })
  } else {
    console.log('\n✅ Google OAuth 設定完整')
  }
  
  console.log('\n📋 設定檢查完成')
}

checkOAuthConfig() 