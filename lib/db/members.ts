import fs from 'fs'
import path from 'path'

export interface Member {
  id: string
  email?: string
  phone?: string
  name: string
  password?: string // 加密後的密碼
  googleId?: string // Google SSO ID
  avatar?: string
  level: '管理員' | 'VIP' | '一般會員'
  points: number
  created_at: string
  updated_at: string
  last_login?: string
}

export interface Order {
  id: string
  memberId: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: '待付款' | '已付款' | '處理中' | '已出貨' | '已完成' | '已取消'
  paymentMethod: '信用卡' | '轉帳' | '貨到付款'
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  created_at: string
  updated_at: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

async function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

async function readMembers(): Promise<Member[]> {
  await ensureDataDir()
  
  if (!fs.existsSync(MEMBERS_FILE)) {
    await writeMembers([])
    return []
  }
  
  const data = fs.readFileSync(MEMBERS_FILE, 'utf-8')
  return JSON.parse(data)
}

async function writeMembers(members: Member[]): Promise<void> {
  await ensureDataDir()
  fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2))
}

async function readOrders(): Promise<Order[]> {
  await ensureDataDir()
  
  if (!fs.existsSync(ORDERS_FILE)) {
    await writeOrders([])
    return []
  }
  
  const data = fs.readFileSync(ORDERS_FILE, 'utf-8')
  return JSON.parse(data)
}

async function writeOrders(orders: Order[]): Promise<void> {
  await ensureDataDir()
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

// 會員相關的資料庫操作
export const memberDB = {
  // 取得所有會員
  async getAllMembers(): Promise<Member[]> {
    return await readMembers()
  },

  // 根據 ID 取得會員
  async getMemberById(id: string): Promise<Member | null> {
    const members = await readMembers()
    return members.find(member => member.id === id) || null
  },

  // 根據 email 取得會員
  async getMemberByEmail(email: string): Promise<Member | null> {
    const members = await readMembers()
    return members.find(member => member.email === email) || null
  },

  // 根據手機號碼取得會員
  async getMemberByPhone(phone: string): Promise<Member | null> {
    const members = await readMembers()
    return members.find(member => member.phone === phone) || null
  },

  // 根據 Google ID 取得會員
  async getMemberByGoogleId(googleId: string): Promise<Member | null> {
    const members = await readMembers()
    return members.find(member => member.googleId === googleId) || null
  },

  // 新增會員
  async addMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at' | 'points'>): Promise<Member> {
    const members = await readMembers()
    const now = new Date().toISOString()
    const newMember: Member = {
      ...member,
      id: `m${Date.now()}`,
      points: 0,
      created_at: now,
      updated_at: now,
    }
    members.push(newMember)
    await writeMembers(members)
    return newMember
  },

  // 更新會員
  async updateMember(id: string, updates: Partial<Omit<Member, 'id' | 'created_at'>>): Promise<void> {
    const members = await readMembers()
    const index = members.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Member not found')
    }
    const now = new Date().toISOString()
    members[index] = {
      ...members[index],
      ...updates,
      updated_at: now,
    }
    await writeMembers(members)
  },

  // 更新最後登入時間
  async updateLastLogin(id: string): Promise<void> {
    const now = new Date().toISOString()
    await this.updateMember(id, { last_login: now })
  },

  // 刪除會員
  async deleteMember(id: string): Promise<void> {
    const members = await readMembers()
    const filteredMembers = members.filter(member => member.id !== id)
    await writeMembers(filteredMembers)
  },

  // 增加會員點數
  async addPoints(id: string, points: number): Promise<void> {
    const members = await readMembers()
    const index = members.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Member not found')
    }
    members[index].points += points
    await writeMembers(members)
  },

  // 升級會員等級
  async upgradeMember(id: string, level: '管理員' | 'VIP' | '一般會員'): Promise<void> {
    await this.updateMember(id, { level })
  }
}

// 訂單相關的資料庫操作
export const orderDB = {
  // 取得所有訂單
  async getAllOrders(): Promise<Order[]> {
    return await readOrders()
  },

  // 根據 ID 取得訂單
  async getOrderById(id: string): Promise<Order | null> {
    const orders = await readOrders()
    return orders.find(order => order.id === id) || null
  },

  // 根據會員 ID 取得訂單
  async getOrdersByMemberId(memberId: string): Promise<Order[]> {
    const orders = await readOrders()
    return orders.filter(order => order.memberId === memberId)
  },

  // 新增訂單
  async addOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const orders = await readOrders()
    const now = new Date().toISOString()
    const newOrder: Order = {
      ...order,
      id: `o${Date.now()}`,
      created_at: now,
      updated_at: now,
    }
    orders.push(newOrder)
    await writeOrders(orders)
    return newOrder
  },

  // 更新訂單狀態
  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const orders = await readOrders()
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    const now = new Date().toISOString()
    orders[index] = {
      ...orders[index],
      status,
      updated_at: now,
    }
    await writeOrders(orders)
  },

  // 刪除訂單
  async deleteOrder(id: string): Promise<void> {
    const orders = await readOrders()
    const filteredOrders = orders.filter(order => order.id !== id)
    await writeOrders(filteredOrders)
  }
} 