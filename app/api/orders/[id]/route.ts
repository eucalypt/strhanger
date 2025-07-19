import { NextRequest, NextResponse } from 'next/server'
import { orderDB, productDB } from '@/lib/db/supabase-db'

// PUT /api/orders/[id] - 更新訂單狀態
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // 驗證狀態值
    const validStatuses = ['待付款', '已付款', '處理中', '已出貨', '已完成', '已取消']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // 檢查訂單是否存在
    const existingOrder = await orderDB.getOrderById(id)
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // 如果訂單被取消，恢復商品庫存
    if (status === '已取消' && existingOrder.status !== '已取消') {
      try {
        const items = JSON.parse(existingOrder.items)
        for (const item of items) {
          const product = await productDB.getProductById(item.productId)
          if (product) {
            await productDB.updateProduct(item.productId, {
              stock: product.stock + item.quantity,
              instock: (product.stock + item.quantity) > 0
            })
          }
        }
      } catch (error) {
        console.error('Error restoring stock:', error)
        // 即使庫存恢復失敗，也繼續更新訂單狀態
      }
    }
    
    // 如果訂單從"已取消"改為其他狀態，重新扣減庫存
    if (existingOrder.status === '已取消' && status !== '已取消') {
      try {
        const items = JSON.parse(existingOrder.items)
        for (const item of items) {
          const product = await productDB.getProductById(item.productId)
          if (product && product.stock >= item.quantity) {
            await productDB.updateProduct(item.productId, {
              stock: product.stock - item.quantity,
              instock: (product.stock - item.quantity) > 0
            })
          } else if (product) {
            // 庫存不足，返回錯誤
            return NextResponse.json(
              { error: `商品「${item.name}」庫存不足，無法重新啟用訂單` },
              { status: 400 }
            )
          }
        }
      } catch (error) {
        console.error('Error deducting stock:', error)
        return NextResponse.json(
          { error: '重新啟用訂單時發生錯誤' },
          { status: 500 }
        )
      }
    }

    // 更新訂單狀態
    await orderDB.updateOrder(id, { status })

    return NextResponse.json(
      { message: 'Order status updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - 刪除訂單
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 檢查訂單是否存在
    const existingOrder = await orderDB.getOrderById(id)
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // 刪除訂單
    await orderDB.deleteOrder(id)

    return NextResponse.json(
      { message: 'Order deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
} 