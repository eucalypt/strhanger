'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

interface Member {
  id: string
  name: string
  email?: string
  phone?: string
  level: '管理員' | 'VIP' | '一般會員'
  points: number
  avatar?: string
  created_at: string
  last_login?: string
}

interface Order {
  id: string
  items: Array<{
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: '待付款' | '已付款' | '處理中' | '已出貨' | '已完成' | '已取消'
  paymentMethod: '信用卡' | '轉帳' | '貨到付款'
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  created_at: string
}

export default function MemberPage() {
  const [member, setMember] = useState<Member | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 檢查會員登入狀態
    const isLoggedIn = localStorage.getItem('memberLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const memberData = localStorage.getItem('memberData')
    if (memberData) {
      const parsedMember = JSON.parse(memberData)
      setMember(parsedMember)
      setFormData({
        name: parsedMember.name,
        email: parsedMember.email || '',
        phone: parsedMember.phone || ''
      })
      fetchOrders(parsedMember.id)
    }
  }, [])

  const fetchOrders = async (memberId: string) => {
    try {
      const response = await fetch(`/api/orders?memberId=${memberId}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('memberLoggedIn')
    localStorage.removeItem('memberData')
    router.push('/')
    toast({
      title: "已登出",
      description: "您已成功登出",
    })
  }

  const handleSaveProfile = async () => {
    if (!member) return

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('更新失敗')
      }

      // 更新本地儲存的會員資料
      const updatedMember = { ...member, ...formData }
      setMember(updatedMember)
      localStorage.setItem('memberData', JSON.stringify(updatedMember))

      setEditing(false)
      toast({
        title: "成功",
        description: "會員資料已更新",
      })
    } catch (error: any) {
      toast({
        title: "錯誤",
        description: error.message || "更新失敗",
        variant: "destructive",
      })
    }
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    setPasswordError(null)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordLoading(true)
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('新密碼與確認新密碼不一致')
      setPasswordLoading(false)
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('新密碼至少需要 6 個字元')
      setPasswordLoading(false)
      return
    }
    try {
      const response = await fetch(`/api/members/${member?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setPasswordError(data.error || '密碼修改失敗')
        setPasswordLoading(false)
        return
      }
      setShowPasswordForm(false)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' })
      toast({ title: '成功', description: '密碼已成功修改，請重新登入。' })
      // 強制登出
      localStorage.removeItem('memberLoggedIn')
      localStorage.removeItem('memberData')
      router.push('/login')
    } catch (error: any) {
      setPasswordError(error.message || '密碼修改失敗')
      toast({
        title: '錯誤',
        description: error.message || '密碼修改失敗',
        variant: 'destructive',
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待付款': return 'bg-yellow-100 text-yellow-800'
      case '已付款': return 'bg-blue-100 text-blue-800'
      case '處理中': return 'bg-purple-100 text-purple-800'
      case '已出貨': return 'bg-indigo-100 text-indigo-800'
      case '已完成': return 'bg-green-100 text-green-800'
      case '已取消': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">請先登入</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">會員中心</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/')}>
                返回首頁
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                登出
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">會員資料</TabsTrigger>
            <TabsTrigger value="orders">訂單記錄</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>會員資料</CardTitle>
                <CardDescription>
                  管理您的個人資料和會員資訊
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      電子郵件
                    </label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      手機號碼
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      會員等級
                    </label>
                    <Badge variant={member.level === 'VIP' ? 'default' : 'secondary'}>
                      {member.level}
                    </Badge>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      會員點數
                    </label>
                    <div className="text-lg font-semibold text-blue-600">
                      {member.points} 點
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      註冊時間
                    </label>
                    <div className="text-sm text-gray-600">
                      {new Date(member.created_at).toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  {editing ? (
                    <>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        取消
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        儲存
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditing(true)}>
                      編輯資料
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => setShowPasswordForm(v => !v)}>
                    {showPasswordForm ? '取消修改密碼' : '修改密碼'}
                  </Button>
                </div>
                {showPasswordForm && (
                  <form onSubmit={handleChangePassword} className="mt-6 space-y-4 max-w-md mx-auto bg-zinc-50 p-4 rounded border border-zinc-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">舊密碼</label>
                      <Input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={e => handlePasswordChange('oldPassword', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">新密碼</label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={e => handlePasswordChange('newPassword', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">確認新密碼</label>
                      <Input
                        type="password"
                        value={passwordForm.confirmNewPassword}
                        onChange={e => handlePasswordChange('confirmNewPassword', e.target.value)}
                        required
                      />
                    </div>
                    {passwordError && <div className="text-red-600 text-sm text-center font-medium">{passwordError}</div>}
                    <Button type="submit" className="w-full" disabled={passwordLoading}>
                      {passwordLoading ? '修改中...' : '確認修改密碼'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>訂單記錄</CardTitle>
                <CardDescription>
                  查看您的所有訂單和狀態
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">尚無訂單記錄</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">訂單 #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('zh-TW')}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span>{item.name} x {item.quantity}</span>
                              <span>NT$ {item.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">總計</span>
                            <span className="font-semibold">NT$ {order.total}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            付款方式: {order.paymentMethod}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 