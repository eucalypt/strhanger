'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/kokonutui/top-bar'

export default function TestMemberPage() {
  const [cartItemCount, setCartItemCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Search query:', query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    console.log('Selected category:', category)
  }

  const handleCartClick = () => {
    console.log('Cart clicked')
  }

  useEffect(() => {
    // 測試設定會員登入狀態
    console.log('Setting test member login status...')
    if (typeof window !== 'undefined') {
      localStorage.setItem('memberLoggedIn', 'true')
      localStorage.setItem('memberData', JSON.stringify({
        id: 'test-member',
        name: '測試會員',
        email: 'test@example.com',
        level: '一般會員',
        points: 100
      }))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        cartItemCount={cartItemCount}
        onCartClick={handleCartClick}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">會員圖標測試頁面</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">測試功能</h2>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('memberLoggedIn', 'true')
                    localStorage.setItem('memberData', JSON.stringify({
                      id: 'test-member',
                      name: '測試會員',
                      email: 'test@example.com',
                      level: '一般會員',
                      points: 100
                    }))
                    window.location.reload()
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                設定為已登入狀態
              </button>
              
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('memberLoggedIn')
                    localStorage.removeItem('memberData')
                    window.location.reload()
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded ml-2"
              >
                設定為未登入狀態
              </button>
              
              <button 
                onClick={() => setCartItemCount(prev => prev + 1)}
                className="px-4 py-2 bg-green-500 text-white rounded ml-2"
              >
                增加購物車數量
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">目前狀態</h2>
            <div className="text-sm space-y-1">
              <p>會員登入狀態: {typeof window !== 'undefined' && localStorage.getItem('memberLoggedIn') === 'true' ? '已登入' : '未登入'}</p>
              <p>購物車數量: {cartItemCount}</p>
              <p>搜尋查詢: {searchQuery}</p>
              <p>選中分類: {selectedCategory}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 