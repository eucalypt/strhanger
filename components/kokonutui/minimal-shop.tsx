"use client"

import { AnimatePresence } from "motion/react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { ProductGrid } from "./product-grid"
import { CartDrawer } from "./cart-drawer"
import { ProductModal } from "./product-modal"
import { TopBar } from "./top-bar"
import { useProducts, type Product, type CartItem } from "@/hooks/use-products"

// localStorage 鍵名
const CART_STORAGE_KEY = 'shopping_cart'

export default function MinimalShop() {
  const { products, loading, error, fetchProducts } = useProducts()
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // 從 localStorage 載入購物車數據
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
        } catch (error) {
          console.error('Error parsing saved cart:', error)
          localStorage.removeItem(CART_STORAGE_KEY)
        }
      }
    }
  }, [])

  // 初始化時載入所有產品
  useEffect(() => {
    fetchProducts()
  }, []) // 只在組件掛載時執行一次

  // 當購物車變更時，保存到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart])

  // 處理搜尋（點擊搜尋按鈕或按下 Enter 時觸發）
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    // 執行搜尋
    const performSearch = async () => {
      // 無論搜尋框是否有內容都執行搜尋
      // 如果搜尋框為空，會搜尋出全部商品
      await fetchProducts(
        selectedCategory === "全部" ? undefined : selectedCategory, 
        query || undefined
      )
    }
    
    performSearch()
  }

  // 處理搜尋值變更（用於搜尋框輸入，不觸發搜尋）
  const handleSearchValueChange = (value: string) => {
    setSearchQuery(value)
  }

  // 處理搜尋框開關
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  // 處理分類篩選
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    // 分類變更時立即搜尋，不需要防抖
    await fetchProducts(
      category === "全部" ? undefined : category, 
      searchQuery || undefined
    )
  }

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0)
    )
  }

  // 清空購物車
  const clearCart = () => {
    setCart([])
  }

  // 計算購物車總價
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 計算購物車商品總數
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">載入失敗: {error}</p>
          <button
            onClick={() => fetchProducts()}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100"
          >
            重試
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950">
      <TopBar 
        cartItemCount={cartItemCount} 
        onCartClick={() => setIsCartOpen(!isCartOpen)} 
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        isSearchOpen={isSearchOpen}
        onSearchToggle={handleSearchToggle}
        searchValue={searchQuery}
        onSearchValueChange={handleSearchValueChange}
        onCloseCart={() => setIsCartOpen(false)}
        isCartOpen={isCartOpen}
      />

      <div className="mx-auto px-2 pt-16 md:pt-12 pb-16">
        <ProductGrid products={products} onProductSelect={setSelectedProduct} />
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(product) => {
              addToCart(product)
              setSelectedProduct(null)
              setIsCartOpen(true)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer 
            cart={cart} 
            onClose={() => setIsCartOpen(false)} 
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateCartItemQuantity}
            onClearCart={clearCart}
            cartTotal={cartTotal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
