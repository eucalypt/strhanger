'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [uploadedImage, setUploadedImage] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setResult('請選擇檔案')
      return
    }

    setUploading(true)
    setResult('上傳中...')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ 上傳成功！\n檔案名稱: ${data.fileName}\nURL: ${data.url}`)
        setUploadedImage(data.url)
      } else {
        setResult(`❌ 上傳失敗: ${data.error}`)
      }
    } catch (error: any) {
      setResult(`❌ 錯誤: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">測試雲端圖片上傳</h2>
          <p className="mt-2 text-sm text-gray-600">
            測試 Supabase Storage 圖片上傳功能
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>上傳圖片到雲端</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                選擇圖片檔案
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? '上傳中...' : '上傳到雲端'}
            </Button>
            
            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <pre className="text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            )}
            
            {uploadedImage && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">上傳的圖片：</h3>
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 