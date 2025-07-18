import { motion } from "motion/react"
import { X } from "lucide-react"
import { useEffect } from "react"
import type { CartItem } from "@/hooks/use-products"

interface CartDrawerProps {
  cart: CartItem[]
  onClose: () => void
  onRemoveFromCart: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
}

export function CartDrawer({ cart, onClose, onRemoveFromCart, onUpdateQuantity }: CartDrawerProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 shadow-xl"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-medium">購物車</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.map((item) => (
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
            ))}
          </div>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between mb-4">
              <span className="text-base">總計</span>
              <span className="text-base font-medium">${total}</span>
            </div>
            <button className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-base font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
              結帳
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
