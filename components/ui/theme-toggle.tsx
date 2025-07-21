'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // 監聽全局點擊事件，當下拉選單開啟時，點擊外部會移除 focus
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        buttonRef.current.blur()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // 當下拉選單關閉時，立即移除按鈕的 focus
      buttonRef.current?.blur()
      // 額外確保移除 focus
      setTimeout(() => {
        buttonRef.current?.blur()
        document.activeElement instanceof HTMLElement && document.activeElement.blur()
      }, 0)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setOpen(false)
    // 立即移除 focus
    buttonRef.current?.blur()
    // 額外確保移除 focus
    setTimeout(() => {
      buttonRef.current?.blur()
      document.activeElement instanceof HTMLElement && document.activeElement.blur()
    }, 0)
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          ref={buttonRef}
          variant="ghost" 
          size="icon" 
          tabIndex={-1}
          className="relative focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切換主題</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>淺色模式</span>
          {theme === 'light' && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>深色模式</span>
          {theme === 'dark' && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>跟隨系統</span>
          {theme === 'system' && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 