import { NextRequest, NextResponse } from 'next/server'
import { productDB } from '@/lib/db/database'

// GET /api/products - 取得所有產品
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const query = searchParams.get('query')

    let products

    if (query) {
      // 搜尋產品
      products = await productDB.searchProducts(query)
    } else if (category) {
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
    const { id, name, description, price, image, category } = body

    // 驗證必要欄位
    if (!id || !name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 檢查產品是否已存在
    const existingProduct = await productDB.getProductById(id)
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this ID already exists' },
        { status: 409 }
      )
    }

    // 新增產品
    await productDB.addProduct({
      id,
      name,
      description,
      price: Number(price),
      image,
      category
    })

    return NextResponse.json(
      { message: 'Product added successfully', id },
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