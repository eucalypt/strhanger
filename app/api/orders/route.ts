import { NextRequest, NextResponse } from 'next/server'
import { orderDB } from '@/lib/db/members'
import { productDB } from '@/lib/db/database'

// GET /api/orders - 取得會員訂單
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const orderId = searchParams.get('id')

    if (orderId) {
      // 取得單一訂單
      const order = await orderDB.getOrderById(orderId)
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(order)
    }

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    // 取得會員的所有訂單
    const orders = await orderDB.getOrdersByMemberId(memberId)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - 建立新訂單
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberId, items, total, paymentMethod, shippingAddress } = body

    // 驗證必填欄位
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    // 檢查每個商品庫存
    for (const item of items) {
      const product = await productDB.getProductById(item.productId)
      if (!product) {
        return NextResponse.json({ error: `商品不存在: ${item.name}` }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `商品「${item.name}」庫存不足` }, { status: 400 })
      }
    }
    // 扣減庫存
    for (const item of items) {
      const product = await productDB.getProductById(item.productId)
      await productDB.updateProduct(item.productId, {
        stock: (product!.stock) - item.quantity
      })
    }

    const newOrder = await orderDB.addOrder({
      memberId,
      items,
      total,
      status: '待付款',
      paymentMethod,
      shippingAddress,
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 