"use client"

import { Search, ShoppingBag, X, User, LogIn, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import ShinyText from "@/components/ui/shiny-text"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface TopBarProps {
  cartItemCount: number
  onCartClick: () => void
  onSearch: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export function TopBar({ cartItemCount, onCartClick, onSearch, selectedCategory, onCategoryChange }: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [categories, setCategories] = useState<string[]>(["全部"])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [memberData, setMemberData] = useState<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [showMemberMenu, setShowMemberMenu] = useState(false)
  const memberMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 載入分類資料
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data: Category[] = await response.json()
        const categoryNames = ["全部", ...data.map(cat => cat.name)]
        setCategories(categoryNames)
      } catch (error) {
        console.error('Error fetching categories:', error)
        // 如果載入失敗，使用預設分類
        setCategories(["全部", "Lighting", "Kitchenware", "Home Decor", "Plants", "Office", "Textiles"])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // 檢查會員登入狀態
  useEffect(() => {
    const checkLoginStatus = () => {
      const memberLoggedIn = localStorage.getItem('memberLoggedIn') === 'true'
      const storedMemberData = localStorage.getItem('memberData')
      
      console.log('Member login status:', memberLoggedIn)
      setIsLoggedIn(memberLoggedIn)
      if (storedMemberData) {
        try {
          setMemberData(JSON.parse(storedMemberData))
        } catch (error) {
          console.error('Error parsing member data:', error)
        }
      }
    }

    checkLoginStatus()
    
    // 監聽 localStorage 變化
    window.addEventListener('storage', checkLoginStatus)
    return () => window.removeEventListener('storage', checkLoginStatus)
  }, [])

  // 點擊外部關閉下拉選單
  useEffect(() => {
    if (!showMemberMenu) return
    const handleClick = (e: MouseEvent) => {
      if (memberMenuRef.current && !memberMenuRef.current.contains(e.target as Node)) {
        setShowMemberMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMemberMenu])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false)
      searchInputRef.current?.blur()
    }
  }

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled ? "bg-white shadow-sm dark:bg-zinc-900" : "bg-white dark:bg-zinc-900"
      } border-b border-zinc-200 dark:border-zinc-800`}
    >
      {/* 手機版：簡化的導航列 */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-3 h-14">
          <Link
            href="/"
            className="shrink-0"
          >
            <ShinyText text="Something Right" speed={5} className="text-xl font-bold" />
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-md transition-colors text-zinc-700 dark:text-zinc-300 ${
                isSearchOpen ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="搜尋商品"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {/* 會員登入/註冊按鈕 */}
            <div className="relative" ref={memberMenuRef}>
              <button
                type="button"
                onClick={() => setShowMemberMenu((v) => !v)}
                className={`p-2 rounded-md transition-colors relative flex items-center gap-1 ${
                  isLoggedIn 
                    ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                title={isLoggedIn ? `會員中心 - ${memberData?.name || '會員'}` : "會員登入/註冊"}
              >
                {isLoggedIn ? (
                  <User className="w-4 h-4" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoggedIn && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                  />
                )}
              </button>
              {showMemberMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg z-50 animate-fade-in">
                  {isLoggedIn ? (
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400">{memberData?.name || '會員'}</div>
                      <Link href="/member" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">會員中心</Link>
                      <Link href="/member/orders" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">訂單查詢</Link>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                        onClick={() => {
                          localStorage.removeItem('memberLoggedIn')
                          localStorage.removeItem('memberData')
                          setShowMemberMenu(false)
                          window.location.reload()
                        }}
                      >登出</button>
                    </div>
                  ) : (
                    <div className="py-1">
                      <Link href="/login" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">登入/註冊</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={onCartClick}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md relative text-zinc-700 dark:text-zinc-300"
              title="購物車"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-zinc-900 dark:bg-white 
                                      text-white dark:text-zinc-900 text-xs font-medium w-4 h-4 
                                      flex items-center justify-center rounded-full"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
        
        {/* 手機版搜尋欄 */}
        {isSearchOpen && (
          <div className="px-3 pb-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="relative pt-3">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="搜尋商品..."
                className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm px-4 py-3 
                                  text-zinc-800 dark:text-zinc-200
                                  focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700
                                  border border-zinc-200 dark:border-zinc-700"
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false)
                  onSearch("")
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 
                                    dark:hover:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* 手機版分類選單 */}
        <div className="px-3 pb-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="overflow-x-auto flex items-center gap-3 scrollbar-none py-2">
            {!loading && categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`whitespace-nowrap transition-colors px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 桌面版：完整的導航列 */}
      <div className="hidden md:flex items-center justify-between px-3 h-12">
        <Link
          href="/"
          className="shrink-0"
        >
          <ShinyText text="Something Right" speed={5} className="text-xl font-bold" />
        </Link>
        <div className="flex-1 px-8 overflow-x-auto flex items-center justify-center gap-6 scrollbar-none">
          {!loading && categories.map((category) => (
            <button
              type="button"
              key={category}
              className={`whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "text-zinc-900 dark:text-white text-sm font-medium"
                  : "text-zinc-600 dark:text-zinc-400 text-sm hover:text-zinc-900 dark:hover:text-white"
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* 管理員專屬：管理後台連結 */}
          {isLoggedIn && memberData?.level === '管理員' && (
            <Link
              href="/admin"
              className="px-2 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors mr-2"
              title="進入管理後台"
            >
              管理後台
            </Link>
          )}
          <ThemeToggle />
          <motion.div className="relative" initial={false} animate={{ width: isSearchOpen ? "auto" : 0 }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="搜尋商品..."
              className={`w-48 sm:w-56 bg-zinc-100 dark:bg-zinc-800 rounded-md text-sm px-3 py-1.5 
                                text-zinc-800 dark:text-zinc-200
                                focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700
                                transition-all duration-200 ${isSearchOpen ? "opacity-100" : "opacity-0"}`}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            {isSearchOpen && (
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false)
                  onSearch("")
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 
                                    dark:hover:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded-md transition-colors text-zinc-700 dark:text-zinc-300 ${
              isSearchOpen ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="搜尋商品"
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* 會員登入/註冊下拉選單 */}
          <div className="relative" ref={memberMenuRef}>
            <button
              type="button"
              onClick={() => setShowMemberMenu((v) => !v)}
              className={`p-1.5 rounded-md transition-colors relative flex items-center gap-1 ${
                isLoggedIn 
                  ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title={isLoggedIn ? `會員中心 - ${memberData?.name || '會員'}` : "會員登入/註冊"}
            >
              {isLoggedIn ? (
                <User className="w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <ChevronDown className="w-3 h-3" />
              {isLoggedIn && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                />
              )}
            </button>
            {showMemberMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg z-50 animate-fade-in">
                {isLoggedIn ? (
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400">{memberData?.name || '會員'}</div>
                    <Link href="/member" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">會員中心</Link>
                    <Link href="/member/orders" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">訂單查詢</Link>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => {
                        localStorage.removeItem('memberLoggedIn')
                        localStorage.removeItem('memberData')
                        setShowMemberMenu(false)
                        window.location.reload()
                      }}
                    >登出</button>
                  </div>
                ) : (
                  <div className="py-1">
                    <Link href="/login" className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">登入/註冊</Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={onCartClick}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md relative text-zinc-700 dark:text-zinc-300"
            title="購物車"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-zinc-900 dark:bg-white 
                                    text-white dark:text-zinc-900 text-xs font-medium w-4 h-4 
                                    flex items-center justify-center rounded-full"
              >
                {cartItemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
