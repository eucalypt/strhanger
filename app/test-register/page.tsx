'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TestRegisterPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testRegister = async () => {
    setLoading(true)
    setResult('測試中...')
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '測試會員',
          email: `test${Date.now()}@test.com`,
          password: '123456',
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ 註冊成功！會員ID: ${data.id}`)
      } else {
        setResult(`❌ 註冊失敗: ${data.error}`)
      }
    } catch (error: any) {
      setResult(`❌ 錯誤: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">測試註冊功能</h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <Button 
            onClick={testRegister} 
            disabled={loading}
            className="w-full"
          >
            {loading ? '測試中...' : '測試註冊API'}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="text-sm">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 