'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AdminNav } from '@/components/admin-nav'
import { Search, Filter, Calendar, DollarSign, Package } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  memberid: string
  items: string // JSON字符串
  total: number
  status: '待付款' | '已付款' | '處理中' | '已出貨' | '已完成' | '已取消'
  created_at: string
  updated_at: string
}

interface Member {
  id: string
  name: string
  email?: string
  phone?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    // 檢查管理員登入狀態
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/admin/login')
      return
    }

    fetchOrders()
    fetchMembers()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "成功",
          description: "訂單狀態已更新",
        })
        fetchOrders() // 重新載入訂單
      } else {
        throw new Error('更新失敗')
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "無法更新訂單狀態",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case '待付款':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case '已付款':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case '處理中':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case '已出貨':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case '已完成':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case '已取消':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const parseOrderItems = (itemsString: string): OrderItem[] => {
    try {
      return JSON.parse(itemsString)
    } catch {
      return []
    }
  }

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId)
    return member ? member.name : '未知會員'
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getMemberName(order.memberid).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">載入中...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">訂單管理</h1>
            <p className="text-gray-600 dark:text-gray-400">管理所有會員訂單</p>
          </div>
        </div>

        {/* 篩選和搜尋 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜尋訂單編號或會員姓名..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="篩選狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部狀態</SelectItem>
                    <SelectItem value="待付款">待付款</SelectItem>
                    <SelectItem value="已付款">已付款</SelectItem>
                    <SelectItem value="處理中">處理中</SelectItem>
                    <SelectItem value="已出貨">已出貨</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已取消">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 訂單列表 */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">尚無訂單</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== 'all' ? '沒有符合條件的訂單' : '目前沒有任何訂單'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const items = parseOrderItems(order.items)
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 dark:bg-zinc-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">訂單 #{order.id}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            NT$ {order.total}
                          </div>
                                                     <div>
                             會員：{getMemberName(order.memberid)}
                           </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Select
                          value={order.status}
                          onValueChange={(value: Order['status']) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="待付款">待付款</SelectItem>
                            <SelectItem value="已付款">已付款</SelectItem>
                            <SelectItem value="處理中">處理中</SelectItem>
                            <SelectItem value="已出貨">已出貨</SelectItem>
                            <SelectItem value="已完成">已完成</SelectItem>
                            <SelectItem value="已取消">已取消</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* 商品列表 */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium">訂單商品</h4>
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              數量：{item.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              NT$ {item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 訂單統計 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                        <div className="text-sm text-gray-600">商品種類</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {items.reduce((sum, item) => sum + item.quantity, 0)}
                        </div>
                        <div className="text-sm text-gray-600">總數量</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">NT$ {order.total}</div>
                        <div className="text-sm text-gray-600">總金額</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
} 