import { NextRequest, NextResponse } from 'next/server'
import { memberDB } from '@/lib/db/supabase-db'
import bcrypt from 'bcryptjs'

// GET /api/members - 取得會員資料（需要登入）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('id')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    const member = await memberDB.getMemberById(memberId)
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // 移除敏感資訊
    const { password, ...memberData } = member
    return NextResponse.json(memberData)
  } catch (error) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    )
  }
}

// POST /api/members - 會員註冊
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, name, password, googleId, avatar, level } = body

    // 驗證必填欄位
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // 至少需要 email 或 phone 其中一個
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone number is required' },
        { status: 400 }
      )
    }

    // 如果是傳統註冊，需要密碼
    if (!googleId && !password) {
      return NextResponse.json(
        { error: 'Password is required for traditional registration' },
        { status: 400 }
      )
    }

    // 檢查 email 是否已存在
    if (email) {
      const existingMember = await memberDB.getMemberByEmail(email)
      if (existingMember) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // 檢查手機號碼是否已存在
    if (phone) {
      const existingMember = await memberDB.getMemberByPhone(phone)
      if (existingMember) {
        return NextResponse.json(
          { error: 'Phone number already exists' },
          { status: 400 }
        )
      }
    }

    // 檢查 Google ID 是否已存在
    if (googleId) {
      const existingMember = await memberDB.getMemberByGoogleId(googleId)
      if (existingMember) {
        return NextResponse.json(
          { error: 'Google account already registered' },
          { status: 400 }
        )
      }
    }

    // 加密密碼
    let hashedPassword: string | undefined
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const newMember = await memberDB.addMember({
      email,
      phone,
      name,
      password: hashedPassword,
      googleId,
      avatar,
      level: level || '一般會員',
      points: 0,
    })

    // 移除敏感資訊
    const { password: _, ...memberData } = newMember
    return NextResponse.json(memberData, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
} 