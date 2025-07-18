"use client"

import { motion } from "motion/react"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import type { Product } from "@/hooks/use-products"

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)

  // 監聽 ESC 鍵關閉模態框
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
        layoutId={`product-${product.id}`}
        className="fixed inset-x-4 bottom-0 md:inset-[25%] z-50 bg-white dark:bg-zinc-900 rounded-t-xl md:rounded-xl overflow-hidden max-h-[80vh] md:max-h-[500px]"
      >
        <div className="h-full md:flex">
          <div className="relative md:w-2/5">
            <img src={product.image} alt={product.name} className="w-full h-[200px] md:h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 md:w-3/5 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-base font-medium">{product.name}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{product.category}</p>
                </div>
                <p className="text-base font-medium">${product.price}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{product.description}</p>
                <div className="text-sm space-y-1">
                  <p className="text-zinc-500">SKU: {product.id}</p>
                  <p className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    庫存: {product.inStock ? '有庫存' : '缺貨'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className={`w-full mt-3 py-2 text-sm font-medium rounded-md transition-colors ${
                product.inStock 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100' 
                  : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
              }`}
            >
              {product.inStock ? '加入購物車' : '缺貨'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
