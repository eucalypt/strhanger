import { motion } from "motion/react"
import { X, Trash2, ShoppingBag, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import type { CartItem } from "@/hooks/use-products"
import { CheckoutModal } from "./checkout-modal"
import { AnimatePresence } from "motion/react"

interface CartDrawerProps {
  cart: CartItem[]
  onClose: () => void
  onRemoveFromCart: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onClearCart: () => void
  cartTotal: number
}

export function CartDrawer({ cart, onClose, onRemoveFromCart, onUpdateQuantity, onClearCart, cartTotal }: CartDrawerProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // 監聽 ESC 鍵關閉購物車
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    // 清理事件監聽器
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleCheckout = () => {
    // 檢查是否已登入
    const memberData = localStorage.getItem('memberData')
    if (!memberData) {
      alert('請先登入會員才能結帳')
      return
    }
    setIsCheckoutOpen(true)
  }

  const handleOrderSuccess = () => {
    onClearCart()
    onClose()
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
      {/* 手機版專用：左側可點擊關閉區域 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        className="fixed left-0 top-0 h-full w-1/4 sm:hidden"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-medium">購物車</h2>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button 
                  onClick={onClearCart}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500"
                  title="清空購物車"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-zinc-400 dark:text-zinc-500 mb-2">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">購物車是空的</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">加入一些商品開始購物吧！</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-medium truncate">{item.name}</h3>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-base font-medium mt-2">${item.price * item.quantity}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between mb-4">
                <span className="text-base">總計</span>
                <span className="text-base font-medium">${cartTotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                結帳
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            cart={cart}
            cartTotal={cartTotal}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>
    </>
  )
}
