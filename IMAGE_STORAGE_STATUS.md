# 圖片儲存狀態說明

## 當前狀態

### ✅ 圖片上傳功能已遷移到雲端

**已完成：**
- 修改上傳API使用 Supabase Storage
- 商品刪除時同時刪除雲端圖片
- 創建詳細的設置說明檔案

**待完成：**
- 設置 Supabase 環境變數
- 創建 Storage Bucket
- 配置權限政策

## 圖片儲存架構

### 當前架構（雲端）
```
上傳圖片 → 儲存到 Supabase Storage → 返回雲端URL
```

### 本地備份架構
```
上傳圖片 → 儲存到 public/images/ → 返回本地URL
```

## 檔案位置

### 本地儲存
- **目錄**: `public/images/`
- **URL格式**: `/images/檔案名稱`
- **範例**: `/images/1752942214080.jpg`

### 雲端儲存（待設置）
- **Bucket**: `product-images`
- **URL格式**: `https://xxx.supabase.co/storage/v1/object/public/product-images/檔案名稱`

## 設置步驟

### 1. 設置 Supabase Storage

**在 Supabase Dashboard 中：**
1. 進入 Storage 頁面
2. 創建 `product-images` bucket
3. 設置為公開 bucket
4. 配置權限政策

### 2. 設置權限

```sql
-- 公開讀取權限
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- 認證用戶上傳權限
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 認證用戶刪除權限
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### 3. 環境變數

確保 `.env.local` 包含：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 遷移到雲端

### 步驟 1: 設置 Supabase Storage
- 完成上述設置步驟

### 步驟 2: 修改上傳API
- 將 `app/api/upload/route.ts` 改回使用 Supabase Storage
- 參考 `SUPABASE_STORAGE_SETUP.md`

### 步驟 3: 遷移現有圖片
- 創建遷移腳本
- 將本地圖片上傳到 Supabase Storage
- 更新資料庫中的圖片URL

## 測試

### 測試上傳功能
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "image=@public/images/coffee-set.jpg"
```

### 預期回應
```json
{
  "message": "File uploaded successfully",
  "url": "/images/1752942214080.jpg",
  "fileName": "1752942214080.jpg"
}
```

## 注意事項

⚠️ **重要提醒：**
- 當前使用本地儲存，圖片會保存在伺服器上
- 部署時需要確保 `public/images/` 目錄可寫入
- 建議最終遷移到雲端儲存以提升可擴展性

## 故障排除

### 常見問題

1. **上傳失敗**
   - 檢查 `public/images/` 目錄權限
   - 確認檔案大小不超過 5MB
   - 檢查檔案格式是否支援

2. **圖片無法顯示**
   - 確認圖片檔案存在
   - 檢查URL路徑是否正確
   - 驗證檔案權限

3. **權限錯誤**
   - 檢查目錄寫入權限
   - 確認伺服器用戶有適當權限

## 下一步

1. 設置 Supabase Storage
2. 測試雲端上傳功能
3. 遷移現有圖片到雲端
4. 更新文檔和說明 