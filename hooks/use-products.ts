import { useState, useEffect, useCallback } from 'react'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  stock: number
  created_at?: string
  updated_at?: string
}

export interface CartItem extends Product {
  quantity: number
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 取得所有產品
  const fetchProducts = useCallback(async (category?: string, query?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (query) params.append('query', query)

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  // 取得單一產品
  const fetchProduct = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/products/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error('Failed to fetch product')
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }, [])

  // 新增產品
  const addProduct = useCallback(async (product: Omit<Product, 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add product')
      }

      // 重新取得產品列表
      await fetchProducts()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }, [fetchProducts])

  // 更新產品
  const updateProduct = useCallback(async (id: string, product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      // 重新取得產品列表
      await fetchProducts()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }, [fetchProducts])

  // 刪除產品
  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      // 重新取得產品列表
      await fetchProducts()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }, [fetchProducts])

  // 上傳圖片
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      return data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }, [])

  // 初始化時取得所有產品
  // useEffect(() => {
  //   fetchProducts()
  // }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  }
} 