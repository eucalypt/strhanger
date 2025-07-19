'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AdminNav() {
  const router = useRouter()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">管理後台</h2>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/')}
            >
              前往前台
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/admin')}
            >
              商品管理
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/admin/categories')}
            >
              分類管理
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/admin/members')}
            >
              會員管理
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/admin/orders')}
            >
              訂單管理
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">管理員</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              localStorage.removeItem('adminLoggedIn')
              router.push('/admin/login')
            }}
          >
            登出
          </Button>
        </div>
      </div>
    </div>
  )
} 