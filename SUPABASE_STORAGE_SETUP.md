# Supabase Storage 設置指南

## 概述

本專案已將商品圖片上傳功能從本地檔案系統遷移到 Supabase Storage 雲端儲存。

## 設置步驟

### 1. 在 Supabase Dashboard 中創建 Storage Bucket

1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 進入 **Storage** 頁面
4. 點擊 **Create a new bucket**
5. 設置以下參數：
   - **Name**: `product-images`
   - **Public bucket**: ✅ 勾選（允許公開訪問）
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### 2. 設置 Storage 權限

在 Supabase Dashboard 的 **Storage** > **Policies** 中設置以下權限：

#### 讀取權限（公開）
```sql
-- 允許所有人讀取圖片
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

#### 上傳權限（認證用戶）
```sql
-- 允許認證用戶上傳圖片
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

#### 刪除權限（認證用戶）
```sql
-- 允許認證用戶刪除圖片
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### 3. 環境變數設置

確保您的 `.env.local` 檔案包含：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 功能特色

### ✅ 雲端儲存
- 圖片儲存在 Supabase Storage
- 自動 CDN 加速
- 全球分佈式儲存

### ✅ 安全性
- 檔案類型驗證
- 檔案大小限制（5MB）
- 權限控制

### ✅ 可擴展性
- 支援大量圖片
- 自動備份
- 高可用性

## API 端點

### 上傳圖片
```
POST /api/upload
Content-Type: multipart/form-data

參數：
- image: File (圖片檔案)

回應：
{
  "message": "File uploaded successfully to cloud storage",
  "url": "https://xxx.supabase.co/storage/v1/object/public/product-images/123456.jpg",
  "fileName": "123456.jpg"
}
```

## 測試

訪問測試頁面：
```
http://localhost:3000/test-upload
```

## 遷移現有圖片

如果需要將現有圖片遷移到雲端：

1. 創建遷移腳本
2. 上傳本地圖片到 Supabase Storage
3. 更新資料庫中的圖片 URL
4. 刪除本地圖片檔案

## 注意事項

⚠️ **重要提醒**：
- 確保 Supabase Storage bucket 已正確設置
- 檢查權限設置是否正確
- 測試上傳和刪除功能
- 監控儲存使用量

## 故障排除

### 常見問題

1. **上傳失敗**
   - 檢查 bucket 是否存在
   - 確認權限設置
   - 檢查檔案大小和類型

2. **圖片無法顯示**
   - 確認 bucket 為公開
   - 檢查 URL 格式
   - 驗證 CDN 設置

3. **刪除失敗**
   - 檢查刪除權限
   - 確認檔案存在
   - 查看錯誤日誌

## 成本考量

- Supabase Storage 有免費額度
- 超出免費額度後按使用量計費
- 建議監控儲存使用量 