'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

export default function TestThemePage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">主題切換測試頁面</h1>
            <p className="text-muted-foreground mt-2">
              測試深色模式、淺色模式和系統模式的主題切換功能
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 主題資訊卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>當前主題</CardTitle>
              <CardDescription>查看當前使用的主題設定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">當前主題：</span>
                <Badge variant="outline">{theme}</Badge>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  onClick={() => setTheme('light')}
                  className="w-full"
                >
                  淺色模式
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  onClick={() => setTheme('dark')}
                  className="w-full"
                >
                  深色模式
                </Button>
                <Button 
                  variant={theme === 'system' ? 'default' : 'outline'} 
                  onClick={() => setTheme('system')}
                  className="w-full"
                >
                  跟隨系統
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* UI 組件測試 */}
          <Card>
            <CardHeader>
              <CardTitle>UI 組件測試</CardTitle>
              <CardDescription>測試各種 UI 組件在深色模式下的表現</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="輸入框測試" />
                <Textarea placeholder="文字區域測試" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch />
                <span className="text-sm">開關組件</span>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm">進度條測試</span>
                <Progress value={65} />
              </div>
              
              <div className="space-y-2">
                <span className="text-sm">滑桿測試</span>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            </CardContent>
          </Card>

          {/* 色彩測試 */}
          <Card>
            <CardHeader>
              <CardTitle>色彩系統測試</CardTitle>
              <CardDescription>測試各種色彩在深色模式下的表現</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-12 bg-primary rounded-md flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">Primary</span>
                  </div>
                  <div className="h-12 bg-secondary rounded-md flex items-center justify-center">
                    <span className="text-secondary-foreground text-sm font-medium">Secondary</span>
                  </div>
                  <div className="h-12 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground text-sm font-medium">Muted</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-accent rounded-md flex items-center justify-center">
                    <span className="text-accent-foreground text-sm font-medium">Accent</span>
                  </div>
                  <div className="h-12 bg-destructive rounded-md flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm font-medium">Destructive</span>
                  </div>
                  <div className="h-12 bg-border rounded-md flex items-center justify-center">
                    <span className="text-foreground text-sm font-medium">Border</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 文字和排版測試 */}
          <Card>
            <CardHeader>
              <CardTitle>文字和排版測試</CardTitle>
              <CardDescription>測試各種文字樣式在深色模式下的表現</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">標題文字</h1>
                <h2 className="text-xl font-semibold text-foreground">副標題文字</h2>
                <p className="text-base text-foreground">一般段落文字，用於顯示主要內容。</p>
                <p className="text-sm text-muted-foreground">次要文字，用於顯示輔助資訊。</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Badge variant="default">預設標籤</Badge>
                <Badge variant="secondary">次要標籤</Badge>
                <Badge variant="outline">外框標籤</Badge>
                <Badge variant="destructive">危險標籤</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 標籤頁測試 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>標籤頁組件測試</CardTitle>
              <CardDescription>測試標籤頁在深色模式下的表現</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList>
                  <TabsTrigger value="tab1">第一個標籤</TabsTrigger>
                  <TabsTrigger value="tab2">第二個標籤</TabsTrigger>
                  <TabsTrigger value="tab3">第三個標籤</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      這是第一個標籤的內容，包含一個警告訊息。
                    </AlertDescription>
                  </Alert>
                  <p className="text-foreground">
                    這裡是第一個標籤的詳細內容，可以包含各種文字和組件。
                  </p>
                </TabsContent>
                <TabsContent value="tab2" className="space-y-4">
                  <p className="text-foreground">
                    這是第二個標籤的內容，展示不同的內容佈局。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">子卡片 1</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">子卡片 2</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="tab3" className="space-y-4">
                  <p className="text-foreground">
                    這是第三個標籤的內容，展示最後的測試內容。
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="default">主要按鈕</Button>
                    <Button variant="outline">次要按鈕</Button>
                    <Button variant="ghost">幽靈按鈕</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 主題說明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>主題切換功能說明</CardTitle>
            <CardDescription>了解如何使用主題切換功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">淺色模式</h3>
                <p className="text-sm text-muted-foreground">
                  使用明亮的背景和深色文字，適合日間使用或偏好明亮介面的使用者。
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">深色模式</h3>
                <p className="text-sm text-muted-foreground">
                  使用深色背景和淺色文字，適合夜間使用或偏好深色介面的使用者。
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">跟隨系統</h3>
                <p className="text-sm text-muted-foreground">
                  自動跟隨作業系統的主題設定，提供最符合使用者習慣的體驗。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 