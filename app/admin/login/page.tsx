'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || '登入失敗')
      }
      if (data.member.level !== '管理員') {
        toast({
          title: '無權限',
          description: '此帳號非管理員，無法登入後台',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      // 設定管理員登入狀態
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('memberLoggedIn', 'true')
      localStorage.setItem('memberData', JSON.stringify(data.member))
      toast({
        title: '登入成功',
        description: '歡迎來到管理後台',
      })
      router.push('/admin')
    } catch (error: any) {
      toast({
        title: '登入失敗',
        description: error.message || '登入失敗',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
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
              <label className="text-sm font-medium">電子郵件</label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="請輸入電子郵件"
              />
            </div>
            <div>
              <label className="text-sm font-medium">手機號碼</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="請輸入手機號碼"
              />
            </div>
            <div>
              <label className="text-sm font-medium">密碼</label>
              <Input
                type="password"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder="請輸入密碼"
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
        </CardContent>
      </Card>
    </div>
  )
} 