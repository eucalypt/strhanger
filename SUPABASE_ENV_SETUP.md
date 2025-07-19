# Supabase 環境變數設置

## 問題

當前 Supabase Storage 上傳失敗，原因是環境變數未設置。

## 解決步驟

### 1. 創建環境變數檔案

在專案根目錄創建 `.env.local` 檔案：

```bash
touch .env.local
```

### 2. 添加 Supabase 配置

在 `.env.local` 檔案中添加以下內容：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 獲取 Supabase 配置值

**步驟：**
1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 進入 **Settings** > **API**
4. 複製以下值：
   - **Project URL**: 填入 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: 填入 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. 設置 Storage Bucket

**在 Supabase Dashboard 中：**
1. 進入 **Storage** 頁面
2. 點擊 **Create a new bucket**
3. 設置：
   - **Name**: `product-images`
   - **Public bucket**: ✅ 勾選
   - **File size limit**: 5MB

### 5. 設置 Storage 權限

**在 Storage > Policies 中執行以下 SQL：**

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

## 驗證設置

### 1. 檢查環境變數

```bash
echo "NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

### 2. 測試上傳功能

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "image=@public/images/coffee-set.jpg"
```

### 3. 預期回應

```json
{
  "message": "File uploaded successfully to cloud storage",
  "url": "https://xxx.supabase.co/storage/v1/object/public/product-images/123456.jpg",
  "fileName": "123456.jpg"
}
```

## 故障排除

### 常見問題

1. **環境變數未設置**
   - 確認 `.env.local` 檔案存在
   - 檢查變數名稱是否正確
   - 重新啟動開發伺服器

2. **Storage Bucket 不存在**
   - 確認已創建 `product-images` bucket
   - 檢查 bucket 是否為公開

3. **權限錯誤**
   - 確認已設置 Storage 權限政策
   - 檢查 SQL 語法是否正確

4. **上傳失敗**
   - 檢查 Supabase 專案狀態
   - 確認 API 金鑰是否有效
   - 查看瀏覽器開發者工具錯誤訊息

## 注意事項

⚠️ **重要提醒：**
- `.env.local` 檔案不應提交到 Git
- 確保 Supabase 專案處於活躍狀態
- 監控 Storage 使用量避免超出免費額度
- 定期備份重要圖片

## 完成設置後

設置完成後，圖片上傳功能將：
- ✅ 使用 Supabase Storage 雲端儲存
- ✅ 提供全球 CDN 加速
- ✅ 自動備份和高可用性
- ✅ 支援大量圖片儲存 