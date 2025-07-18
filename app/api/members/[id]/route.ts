import { NextRequest, NextResponse } from 'next/server'
import { memberDB } from '@/lib/db/members'

// PUT /api/members/[id] - 更新會員資料
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    // 驗證必填欄位
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // 檢查會員是否存在
    const existingMember = await memberDB.getMemberById(params.id)
    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // 檢查 email 是否與其他會員衝突
    if (email && email !== existingMember.email) {
      const emailConflict = await memberDB.getMemberByEmail(email)
      if (emailConflict && emailConflict.id !== params.id) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // 檢查手機號碼是否與其他會員衝突
    if (phone && phone !== existingMember.phone) {
      const phoneConflict = await memberDB.getMemberByPhone(phone)
      if (phoneConflict && phoneConflict.id !== params.id) {
        return NextResponse.json(
          { error: 'Phone number already exists' },
          { status: 400 }
        )
      }
    }

    await memberDB.updateMember(params.id, {
      name,
      email: email || undefined,
      phone: phone || undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    )
  }
} 