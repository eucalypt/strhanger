import { NextRequest, NextResponse } from 'next/server'
import { productDB } from '@/lib/db/database'

// GET /api/categories - 取得所有分類
export async function GET(request: NextRequest) {
  try {
    const categories = await productDB.getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 