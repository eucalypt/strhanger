'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, Calendar, DollarSign } from 'lucide-react'

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

export default function MemberOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 檢查會員登入狀態
    const memberData = localStorage.getItem('memberData')
    if (!memberData) {
      router.push('/login')
      return
    }

    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const memberData = localStorage.getItem('memberData')
      if (!memberData) return

      const member = JSON.parse(memberData)
      const response = await fetch(`/api/orders?memberId=${member.id}`)
      
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">載入中...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto p-6">
        {/* 頁面標題 */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold">我的訂單</h1>
            <p className="text-gray-600 dark:text-gray-400">查看您的所有訂單記錄</p>
          </div>
        </div>

        {/* 訂單列表 */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">尚無訂單</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  您還沒有任何訂單記錄
                </p>
                <Button onClick={() => router.push('/')}>
                  開始購物
                </Button>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
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
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* 商品列表 */}
                    <div className="space-y-4 mb-6">
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

                    {/* 訂單狀態說明 */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">訂單狀態說明</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {order.status === '待付款' && (
                          <p>• 請到店取貨並付款</p>
                        )}
                        {order.status === '已付款' && (
                          <p>• 付款已確認，商品準備中</p>
                        )}
                        {order.status === '處理中' && (
                          <p>• 商品正在準備中，請稍候</p>
                        )}
                        {order.status === '已出貨' && (
                          <p>• 商品已準備完成，請到店取貨</p>
                        )}
                        {order.status === '已完成' && (
                          <p>• 訂單已完成，感謝您的購買</p>
                        )}
                        {order.status === '已取消' && (
                          <p>• 訂單已取消</p>
                        )}
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