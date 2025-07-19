import { NextRequest, NextResponse } from 'next/server'
import { productDB } from '@/lib/db/supabase-db'
import { storageDB } from '@/lib/supabase-storage'

// GET /api/products/[id] - 取得單一產品
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await productDB.getProductById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - 更新產品
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, price, image, category } = body

    // 驗證必要欄位
    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 檢查產品是否存在
    const existingProduct = await productDB.getProductById(params.id)
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // 更新產品
    await productDB.updateProduct(params.id, {
      name,
      description,
      price: Number(price),
      image,
      category
    })

    return NextResponse.json(
      { message: 'Product updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - 刪除產品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 檢查產品是否存在
    const existingProduct = await productDB.getProductById(id)
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // 如果產品有圖片，從 Storage 中刪除
    if (existingProduct.image) {
      try {
        // 從 URL 中提取檔案名稱
        const imageUrl = existingProduct.image
        const fileName = imageUrl.split('/').pop()
        
        if (fileName) {
          await storageDB.deleteImage(fileName)
        }
      } catch (storageError) {
        console.error('Error deleting image from storage:', storageError)
        // 即使圖片刪除失敗，也繼續刪除產品
      }
    }

    // 刪除產品
    await productDB.deleteProduct(id)

    return NextResponse.json(
      { message: 'Product and associated image deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 