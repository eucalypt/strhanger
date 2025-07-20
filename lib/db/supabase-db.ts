import { supabase, TABLES, Member, Product, Category, Order } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

// 會員資料庫操作
export const memberDB = {
  // 取得所有會員
  async getAllMembers(): Promise<Member[]> {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 根據 ID 取得會員
  async getMemberById(id: string): Promise<Member | null> {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  // 根據 Email 取得會員
  async getMemberByEmail(email: string): Promise<Member | null> {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) return null
    return data
  },

  // 根據手機號碼取得會員
  async getMemberByPhone(phone: string): Promise<Member | null> {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .select('*')
      .eq('phone', phone)
      .single()
    
    if (error) return null
    return data
  },

  // 根據 Google ID 取得會員
  async getMemberByGoogleId(googleId: string): Promise<Member | null> {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .select('*')
      .eq('googleid', googleId)
      .single()
    
    if (error) return null
    return data
  },

  // 新增會員
  async addMember(memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<Member> {
    const id = `m${Date.now()}`
    const now = new Date().toISOString()
    
    const newMember = {
      ...memberData,
      id,
      created_at: now,
      updated_at: now
    }

    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .insert(newMember)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 更新會員
  async updateMember(id: string, updates: Partial<Member>): Promise<void> {
    const { error } = await supabase
      .from(TABLES.MEMBERS)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 更新最後登入時間
  async updateLastLogin(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.MEMBERS)
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 刪除會員
  async deleteMember(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.MEMBERS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// 商品資料庫操作
export const productDB = {
  // 取得所有商品
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 根據 ID 取得商品
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  // 根據分類取得商品
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 新增商品
  async addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const id = `p${Date.now()}`
    const now = new Date().toISOString()
    
    const newProduct = {
      ...productData,
      id,
      created_at: now,
      updated_at: now
    }

    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert(newProduct)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 更新商品
  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 刪除商品
  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // 更新庫存
  async updateStock(id: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .update({
        stock: quantity,
        instock: quantity > 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 搜尋產品
  async searchProducts(query: string): Promise<Product[]> {
    const searchQuery = query.toLowerCase()
    
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

// 分類資料庫操作
export const categoryDB = {
  // 取得所有分類
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // 根據 ID 取得分類
  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  // 新增分類
  async addCategory(categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const id = `c${Date.now()}`
    const now = new Date().toISOString()
    
    const newCategory = {
      ...categoryData,
      id,
      created_at: now,
      updated_at: now
    }

    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .insert(newCategory)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 更新分類
  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 刪除分類
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // 檢查分類是否被使用
  async isCategoryUsed(categoryName: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('id')
      .eq('category', categoryName)
      .limit(1)
    
    if (error) throw error
    return (data && data.length > 0)
  }
}

// 訂單資料庫操作
export const orderDB = {
  // 取得所有訂單
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 根據 ID 取得訂單
  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  // 根據會員 ID 取得訂單
  async getOrdersByMemberId(memberId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('memberid', memberId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 新增訂單
  async addOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const id = `o${Date.now()}`
    const now = new Date().toISOString()
    
    const newOrder = {
      ...orderData,
      id,
      created_at: now,
      updated_at: now
    }

    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .insert(newOrder)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 更新訂單
  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    const { error } = await supabase
      .from(TABLES.ORDERS)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // 刪除訂單
  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.ORDERS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 