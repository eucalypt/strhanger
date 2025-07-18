import { NextRequest, NextResponse } from 'next/server'
import { categoryDB } from '@/lib/db/categories'

// PUT /api/categories/[id] - 更新分類
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // 檢查分類是否存在
    const existingCategory = await categoryDB.getCategoryById(params.id)
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // 檢查新名稱是否與其他分類衝突
    const allCategories = await categoryDB.getAllCategories()
    const nameConflict = allCategories.some(
      cat => cat.name === name && cat.id !== params.id
    )
    if (nameConflict) {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 400 }
      )
    }

    await categoryDB.updateCategory(params.id, {
      name,
      description: description || '',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - 刪除分類
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 檢查分類是否存在
    const existingCategory = await categoryDB.getCategoryById(params.id)
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // 檢查分類是否被使用
    const isUsed = await categoryDB.isCategoryUsed(existingCategory.name)
    if (isUsed) {
      return NextResponse.json(
        { error: 'Cannot delete category that is being used by products' },
        { status: 400 }
      )
    }

    await categoryDB.deleteCategory(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
} 