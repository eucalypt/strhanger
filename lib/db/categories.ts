import fs from 'fs'
import path from 'path'

export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json')

async function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

async function readCategories(): Promise<Category[]> {
  await ensureDataDir()
  
  if (!fs.existsSync(CATEGORIES_FILE)) {
    // 建立預設分類
    const defaultCategories = getDefaultCategories()
    await writeCategories(defaultCategories)
    return defaultCategories
  }
  
  const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8')
  return JSON.parse(data)
}

async function writeCategories(categories: Category[]): Promise<void> {
  await ensureDataDir()
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
}

function getDefaultCategories(): Category[] {
  const now = new Date().toISOString()
  return [
    {
      id: "c1",
      name: "Home Decor",
      description: "家居裝飾用品",
      created_at: now,
      updated_at: now,
    },
    {
      id: "c2", 
      name: "Kitchenware",
      description: "廚房用品",
      created_at: now,
      updated_at: now,
    },
    {
      id: "c3",
      name: "Lighting",
      description: "照明設備",
      created_at: now,
      updated_at: now,
    },
    {
      id: "c4",
      name: "Office",
      description: "辦公用品",
      created_at: now,
      updated_at: now,
    },
    {
      id: "c5",
      name: "Plants",
      description: "植物相關",
      created_at: now,
      updated_at: now,
    },
  ]
}

// 分類相關的資料庫操作
export const categoryDB = {
  // 取得所有分類
  async getAllCategories(): Promise<Category[]> {
    return await readCategories()
  },

  // 取得單一分類
  async getCategoryById(id: string): Promise<Category | null> {
    const categories = await readCategories()
    return categories.find(category => category.id === id) || null
  },

  // 新增分類
  async addCategory(category: Omit<Category, 'created_at' | 'updated_at'>): Promise<void> {
    const categories = await readCategories()
    const now = new Date().toISOString()
    const newCategory: Category = {
      ...category,
      created_at: now,
      updated_at: now,
    }
    categories.push(newCategory)
    await writeCategories(categories)
  },

  // 更新分類
  async updateCategory(id: string, category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const categories = await readCategories()
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    const now = new Date().toISOString()
    categories[index] = {
      ...categories[index],
      ...category,
      updated_at: now,
    }
    await writeCategories(categories)
  },

  // 刪除分類
  async deleteCategory(id: string): Promise<void> {
    const categories = await readCategories()
    const filteredCategories = categories.filter(category => category.id !== id)
    await writeCategories(filteredCategories)
  },

  // 檢查分類是否被使用
  async isCategoryUsed(categoryName: string): Promise<boolean> {
    const { productDB } = await import('./database')
    const products = await productDB.getAllProducts()
    return products.some((product: any) => product.category === categoryName)
  },
} 