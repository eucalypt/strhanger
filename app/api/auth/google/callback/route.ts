import { NextRequest, NextResponse } from 'next/server'
import { memberDB } from '@/lib/db/members'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=google_no_code', request.url))
  }
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!

  // 交換 code 取得 access_token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    })
  })
  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    return NextResponse.redirect(new URL('/login?error=google_token', request.url))
  }

  // 取得用戶資訊
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  })
  const user = await userRes.json()
  if (!user.id || !user.email) {
    return NextResponse.redirect(new URL('/login?error=google_userinfo', request.url))
  }

  // 檢查會員是否存在
  let member = await memberDB.getMemberByGoogleId(user.id)
  if (!member) {
    // 若 email 已存在，綁定 Google ID
    member = await memberDB.getMemberByEmail(user.email)
    if (member) {
      await memberDB.updateMember(member.id, { googleId: user.id })
      member = await memberDB.getMemberById(member.id) // 重新查詢，確保資料完整
    } else {
      // 建立新會員
      member = await memberDB.addMember({
        name: user.name || user.email,
        email: user.email,
        phone: '',
        password: '',
        googleId: user.id,
        avatar: user.picture,
        level: '一般會員',
      })
    }
  }
  // 再次查詢，確保 member 為最新資料
  member = await memberDB.getMemberById(member!.id)

  // 設定登入狀態（localStorage 需前端處理，這裡用 redirect 帶參數）
  const params = new URLSearchParams({
    google: '1',
    memberId: member!.id,
  })
  return NextResponse.redirect(new URL(`/login?${params.toString()}`, request.url))
}