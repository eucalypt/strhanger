"use client"

import { motion } from "motion/react"
import { X, Store, User, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import type { CartItem } from "@/hooks/use-products"

interface CheckoutModalProps {
  cart: CartItem[]
  cartTotal: number
  onClose: () => void
  onOrderSuccess: () => void
}

export function CheckoutModal({ cart, cartTotal, onClose, onOrderSuccess }: CheckoutModalProps) {
  const [pickupInfo, setPickupInfo] = useState({
    name: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 在組件載入時自動填入當前用戶資料
  useEffect(() => {
    try {
      const memberData = localStorage.getItem('memberData')
      if (memberData) {
        const member = JSON.parse(memberData)
        setPickupInfo({
          name: member.name || '',
          phone: member.phone || ''
        })
      }
    } catch (error) {
      console.error('載入用戶資料失敗:', error)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // 從localStorage取得會員資料
      const memberData = localStorage.getItem('memberData')
      if (!memberData) {
        throw new Error('請先登入會員')
      }

      const member = JSON.parse(memberData)
      
      const orderData = {
        memberId: member.id,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: cartTotal,
        pickupInfo
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '訂單建立失敗')
      }

      const order = await response.json()
      
      // 清空購物車
      localStorage.removeItem('shopping_cart')
      
      // 顯示成功訊息
      alert(`訂單建立成功！\n訂單編號：${order.id}\n請到店取貨並付款`)
      
      onOrderSuccess()
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : '訂單建立失敗')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 md:inset-[10%] z-50 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold">結帳</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 取貨方式 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-blue-900 dark:text-blue-100">到店取貨</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                請填寫取貨人資訊，商品準備完成後會通知您到店取貨
              </p>
            </div>

            {/* 訂單摘要 */}
            <div>
              <h3 className="font-medium mb-3">訂單摘要</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">數量：{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${item.price * item.quantity}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">總計</span>
                  <span className="text-lg font-semibold">${cartTotal}</span>
                </div>
              </div>
            </div>

            {/* 取貨人資訊表單 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  取貨人姓名
                </label>
                <input
                  type="text"
                  value={pickupInfo.name}
                  onChange={(e) => setPickupInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800"
                  placeholder="請輸入姓名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  聯絡電話
                </label>
                <input
                  type="tel"
                  value={pickupInfo.phone}
                  onChange={(e) => setPickupInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800"
                  placeholder="請輸入電話號碼"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !pickupInfo.name || !pickupInfo.phone}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting ? '處理中...' : '送出訂單'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  )
} 