'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Google SSO callback 處理
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('google') === '1') {
        const memberId = params.get('memberId')
        if (memberId) {
          fetch(`/api/members?id=${memberId}`)
            .then(res => res.json())
            .then(member => {
              if (member.level === '管理員') {
                localStorage.setItem('adminLoggedIn', 'true')
                localStorage.setItem('memberLoggedIn', 'true')
                localStorage.setItem('memberData', JSON.stringify(member))
                toast({ title: 'Google 管理員登入成功', description: `歡迎管理員，${member.name || member.email}` })
                setTimeout(() => {
                  window.history.replaceState({}, document.title, window.location.pathname)
                  window.location.replace('/admin')
                }, 1000)
              } else {
                toast({ title: '權限不足', description: '此 Google 帳號非管理員，無法登入後台', variant: 'destructive' })
                setTimeout(() => {
                  window.history.replaceState({}, document.title, window.location.pathname)
                }, 1500)
              }
            })
        }
      } else if (params.get('error')) {
        toast({ title: 'Google 登入失敗', description: 'Google SSO 流程發生錯誤', variant: 'destructive' })
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

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
          <div className="mt-6 text-center">
            <Button
              onClick={() => window.location.href = '/api/auth/google'}
              variant="outline"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 登入
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 