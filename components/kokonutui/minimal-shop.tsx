"use client"

import { AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { ProductGrid } from "./product-grid"
import { CartDrawer } from "./cart-drawer"
import { ProductModal } from "./product-modal"
import { TopBar } from "./top-bar"
import { useProducts, type Product, type CartItem } from "@/hooks/use-products"

export default function MinimalShop() {
  const { products, loading, error, fetchProducts } = useProducts()
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // 處理搜尋
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    await fetchProducts(selectedCategory === "All" ? undefined : selectedCategory, query || undefined)
  }

  // 處理分類篩選
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    await fetchProducts(category === "All" ? undefined : category, searchQuery || undefined)
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

  if (loading) {
    return (
      <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">錯誤: {error}</p>
          <button 
            onClick={() => fetchProducts()} 
            className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md"
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
        cartItemCount={cart.length} 
        onCartClick={() => setIsCartOpen(true)} 
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mx-auto px-2 pt-12 pb-16">
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
          />
        )}
      </AnimatePresence>
    </div>
  )
}
