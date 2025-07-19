import { NextRequest, NextResponse } from 'next/server'
import { productDB } from '@/lib/db/supabase-db'

// GET /api/products - 取得所有產品
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const query = searchParams.get('query')

    let products

    if (category) {
      // 根據分類取得產品
      products = await productDB.getProductsByCategory(category)
    } else {
      // 取得所有產品
      products = await productDB.getAllProducts()
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - 新增產品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, image, category, stock } = body

    // 驗證必要欄位
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 生成 ID（如果沒有提供）
    const productId = id || `p${Date.now()}`
    
    // 檢查產品是否已存在
    const existingProduct = await productDB.getProductById(productId)
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this ID already exists' },
        { status: 409 }
      )
    }

    // 新增產品
    await productDB.addProduct({
      name,
      description,
      price: Number(price),
      image: image || '',
      category,
      stock: stock !== undefined ? Number(stock) : 0,
      instock: stock !== undefined ? Number(stock) > 0 : false
    })

    return NextResponse.json(
      { message: 'Product added successfully', id: productId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    )
  }
}

// PUT /api/products - 更新產品
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, image, category, stock } = body

    // 驗證必要欄位
    if (!id || !name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 檢查產品是否存在
    const existingProduct = await productDB.getProductById(id)
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // 更新產品
    const newStock = stock !== undefined ? Number(stock) : existingProduct.stock
    await productDB.updateProduct(id, {
      name,
      description,
      price: Number(price),
      image: image || '',
      category,
      stock: newStock,
      instock: newStock > 0
    })

    return NextResponse.json(
      { message: 'Product updated successfully', id },
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