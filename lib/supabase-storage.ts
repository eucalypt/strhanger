import { supabase } from '@/lib/supabase'

// Storage bucket 名稱
export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images'
} as const

// 圖片儲存相關操作
export const storageDB = {
  // 上傳圖片
  async uploadImage(file: File, fileName: string): Promise<{ url: string; fileName: string }> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // 取得公開URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .getPublicUrl(fileName)

    return {
      url: urlData.publicUrl,
      fileName: fileName
    }
  },

  // 刪除圖片
  async deleteImage(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .remove([fileName])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  },

  // 取得圖片列表
  async listImages(): Promise<string[]> {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .list()

    if (error) {
      throw new Error(`List failed: ${error.message}`)
    }

    return data.map(file => file.name)
  },

  // 取得圖片公開URL
  getPublicUrl(fileName: string): string {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .getPublicUrl(fileName)

    return data.publicUrl
  }
} 