'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [formError, setFormError] = useState<string | null>(null)
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
              localStorage.setItem('memberLoggedIn', 'true')
              localStorage.setItem('memberData', JSON.stringify(member))
              toast({ title: 'Google 註冊成功', description: `歡迎加入，${member.name || member.email}` })
              setTimeout(() => {
                window.history.replaceState({}, document.title, window.location.pathname)
                window.location.replace('/member')
              }, 1000)
            })
        }
      } else if (params.get('error')) {
        toast({ title: 'Google 註冊失敗', description: 'Google SSO 流程發生錯誤', variant: 'destructive' })
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setFormError(null) // 清除錯誤訊息
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    try {
      // 驗證密碼
      if (formData.password !== formData.confirmPassword) {
        setFormError('密碼確認不符')
        return
      }
      if (formData.password.length < 6) {
        setFormError('密碼至少需要 6 個字元')
        return
      }
      if (!formData.name) {
        setFormError('姓名為必填')
        return
      }
      if (!formData.email && !formData.phone) {
        setFormError('請輸入電子郵件或手機號碼')
        return
      }
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        setFormError(data.error || '註冊失敗')
        return
      }
      setFormError(null)
      toast({
        title: "成功",
        description: "註冊成功！請登入您的帳號",
      })
      router.push('/login')
    } catch (error: any) {
      setFormError(error.message || '註冊失敗')
      console.error('註冊錯誤:', error)
      toast({
        title: "錯誤",
        description: error.message || "註冊失敗",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">註冊會員</h2>
          <p className="mt-2 text-sm text-gray-600">
            加入 Something Right，享受更好的購物體驗
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>建立新帳號</CardTitle>
            <CardDescription>
              選擇您偏好的註冊方式
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="traditional" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="traditional">傳統註冊</TabsTrigger>
                <TabsTrigger value="google">Google 註冊</TabsTrigger>
              </TabsList>

              <TabsContent value="traditional" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      姓名 *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      電子郵件
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      手機號碼
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      密碼 *
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      確認密碼 *
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? '註冊中...' : '註冊'}
                  </Button>
                  {formError && (
                    <div className="mt-2 text-red-600 text-sm text-center font-medium">{formError}</div>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    使用 Google 帳號快速註冊
                  </p>
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
                    使用 Google 註冊
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                已有帳號？{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  立即登入
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 