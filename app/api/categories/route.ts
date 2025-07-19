import { NextRequest, NextResponse } from 'next/server'
import { categoryDB } from '@/lib/db/supabase-db'

// GET /api/categories - 取得所有分類
export async function GET(request: NextRequest) {
  try {
    const categories = await categoryDB.getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - 新增分類
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // 檢查分類名稱是否已存在
    const existingCategories = await categoryDB.getAllCategories()
    if (existingCategories.some(cat => cat.name === name)) {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 400 }
      )
    }

    const newCategory = await categoryDB.addCategory({
      name,
      description: description || '',
    })
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 