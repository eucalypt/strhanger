import { NextRequest, NextResponse } from 'next/server'
import { memberDB } from '@/lib/db/supabase-db'
import bcrypt from 'bcryptjs'

// PUT /api/members/[id] - 更新會員資料
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, phone, level, password } = body

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

    // 只更新有傳入的欄位
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email || undefined
    if (phone !== undefined) updateData.phone = phone || undefined
    if (level !== undefined) updateData.level = level
    if (password !== undefined && password !== '') {
      updateData.password = await bcrypt.hash(password, 10)
    }
    await memberDB.updateMember(params.id, updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    )
  }
}

// DELETE /api/members/[id] - 刪除會員
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await memberDB.deleteMember(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}

// PATCH /api/members/[id] - 修改密碼
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { oldPassword, newPassword } = body

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: '請輸入舊密碼與新密碼' },
        { status: 400 }
      )
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密碼至少需要 6 個字元' },
        { status: 400 }
      )
    }
    const member = await memberDB.getMemberById(params.id)
    if (!member || !member.password) {
      return NextResponse.json(
        { error: '會員不存在或無密碼紀錄' },
        { status: 404 }
      )
    }
    // 驗證舊密碼
    const isMatch = await bcrypt.compare(oldPassword, member.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: '舊密碼錯誤' },
        { status: 400 }
      )
    }
    // 加密新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await memberDB.updateMember(params.id, { password: hashedPassword })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: '密碼修改失敗' },
      { status: 500 }
    )
  }
} 