# Supabase Storage 權限修復指南

## 問題分析

**錯誤訊息：**
```
Supabase Storage upload error: {
  statusCode: '403',
  error: 'Unauthorized',
  message: 'new row violates row-level security policy'
}
```

**問題原因：**
- Supabase Storage 的 Row Level Security (RLS) 政策阻止上傳
- 需要設置正確的權限政策

## 解決步驟

### 1. 登入 Supabase Dashboard

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案：`cdwgsxxrtrnmikpkhpgg`

### 2. 創建 Storage Bucket

1. 進入 **Storage** 頁面
2. 點擊 **Create a new bucket**
3. 設置：
   - **Name**: `product-images`
   - **Public bucket**: ✅ 勾選
   - **File size limit**: 5MB

### 3. 設置 Storage 權限

**在 Storage > Policies 中執行以下 SQL：**

#### 步驟 1: 刪除現有政策（如果存在）
```sql
-- 刪除現有的 product-images 政策
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
```

#### 步驟 2: 創建新的權限政策
```sql
-- 公開讀取權限（允許所有人讀取圖片）
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- 公開上傳權限（允許所有人上傳圖片）
CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- 公開刪除權限（允許所有人刪除圖片）
CREATE POLICY "Public Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
```

### 4. 驗證設置

**檢查 Storage Bucket：**
1. 進入 **Storage** > **Buckets**
2. 確認 `product-images` bucket 存在
3. 確認狀態為 **Public**

**檢查權限政策：**
1. 進入 **Storage** > **Policies**
2. 確認以下政策存在：
   - Public Access
   - Public Upload
   - Public Delete

### 5. 測試上傳

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "image=@public/images/coffee-set.jpg"
```

**預期回應：**
```json
{
  "message": "File uploaded successfully to cloud storage",
  "url": "https://cdwgsxxrtrnmikpkhpgg.supabase.co/storage/v1/object/public/product-images/123456.jpg",
  "fileName": "123456.jpg"
}
```

## 權限政策說明

### 公開權限（推薦用於圖片）
```sql
-- 允許所有人讀取、上傳、刪除
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
```

### 認證用戶權限（更安全）
```sql
-- 只允許認證用戶上傳、刪除
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

## 故障排除

### 常見問題

1. **403 Unauthorized**
   - 確認 bucket 已創建
   - 檢查權限政策是否正確設置
   - 確認 bucket 為公開

2. **Bucket 不存在**
   - 創建 `product-images` bucket
   - 設置為公開 bucket

3. **權限政策錯誤**
   - 刪除現有政策
   - 重新創建正確的政策

4. **環境變數問題**
   - 確認 `.env.local` 檔案存在
   - 重新啟動開發伺服器

## 完成設置後

設置完成後，圖片上傳功能將：
- ✅ 使用 Supabase Storage 雲端儲存
- ✅ 提供全球 CDN 加速
- ✅ 支援公開訪問
- ✅ 自動備份和高可用性

## 注意事項

⚠️ **重要提醒：**
- 公開權限允許任何人上傳圖片
- 建議在生產環境中使用更嚴格的權限
- 監控 Storage 使用量
- 定期清理不需要的圖片 