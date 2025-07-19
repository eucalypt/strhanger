import { NextRequest, NextResponse } from 'next/server'
import { memberDB } from '@/lib/db/supabase-db'
import bcrypt from 'bcryptjs'

// POST /api/members/login - 會員登入
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, password, googleId } = body

    // 驗證必填欄位
    if (!email && !phone && !googleId) {
      return NextResponse.json(
        { error: 'Email, phone number, or Google ID is required' },
        { status: 400 }
      )
    }

    let member = null

    // Google SSO 登入
    if (googleId) {
      member = await memberDB.getMemberByGoogleId(googleId)
      if (!member) {
        return NextResponse.json(
          { error: 'Google account not registered' },
          { status: 404 }
        )
      }
    } else {
      // 傳統登入
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        )
      }

      // 根據 email 或 phone 查找會員
      if (email) {
        member = await memberDB.getMemberByEmail(email)
      } else if (phone) {
        member = await memberDB.getMemberByPhone(phone)
      }

      if (!member) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        )
      }

      // 驗證密碼
      if (!member.password) {
        return NextResponse.json(
          { error: 'Invalid login method' },
          { status: 400 }
        )
      }

      const isPasswordValid = await bcrypt.compare(password, member.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        )
      }
    }

    // 更新最後登入時間
    await memberDB.updateLastLogin(member.id)

    // 移除敏感資訊
    const { password: _, ...memberData } = member
    return NextResponse.json({
      success: true,
      member: memberData
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
} 