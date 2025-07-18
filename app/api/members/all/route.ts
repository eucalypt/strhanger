import { NextRequest, NextResponse } from 'next/server'
import { memberDB } from '@/lib/db/members'

// GET /api/members/all - 取得所有會員資料
export async function GET(request: NextRequest) {
  try {
    const members = await memberDB.getAllMembers()
    // 移除密碼等敏感資訊
    const safeMembers = members.map(({ password, ...rest }) => rest)
    return NextResponse.json(safeMembers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
} 