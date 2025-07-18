'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 簡單的密碼驗證（在實際應用中應該使用更安全的認證方式）
    if (password === 'admin123') {
      // 設定管理員登入狀態
      localStorage.setItem('adminLoggedIn', 'true')
      toast({
        title: "登入成功",
        description: "歡迎來到管理後台",
      })
      router.push('/admin')
    } else {
      toast({
        title: "登入失敗",
        description: "密碼錯誤",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">管理員登入</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">管理員密碼</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入管理員密碼"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? '登入中...' : '登入'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            預設密碼：admin123
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 