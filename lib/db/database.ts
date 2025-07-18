import fs from 'fs/promises'
import path from 'path'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  inStock: boolean // 保留相容性，實際由 stock > 0 決定
  created_at: string
  updated_at: string
}

export interface CartItem extends Product {
  quantity: number
}

// 確保資料目錄存在
const dataDir = path.join(process.cwd(), 'data')
const productsFile = path.join(dataDir, 'products.json')

async function ensureDataDir() {
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// 讀取產品資料
async function readProducts(): Promise<Product[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(productsFile, 'utf-8')
    return JSON.parse(data)
  } catch {
    // 如果檔案不存在，返回預設資料
    return getDefaultProducts()
  }
}

// 寫入產品資料
async function writeProducts(products: Product[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
}

// 取得預設產品資料
function getDefaultProducts(): Product[] {
  const now = new Date().toISOString()
  return [
    {
      id: "p1",
      name: "Minimal Desk Lamp",
      description: "A sleek and modern desk lamp with adjustable brightness and color temperature.",
      price: 89,
      image: "/images/desk-lamp.jpg",
      category: "Lighting",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p2",
      name: "Ceramic Coffee Set",
      description: "Handcrafted ceramic coffee set including 4 cups and a matching pour-over dripper.",
      price: 65,
      image: "/images/coffee-set.jpg",
      category: "Kitchenware",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p3",
      name: "Linen Throw Pillow",
      description: "Soft linen throw pillow with minimalist pattern design.",
      price: 45,
      image: "/images/throw-pillow.jpg",
      category: "Home Decor",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p4",
      name: "Wooden Wall Clock",
      description: "Modern wooden wall clock with silent movement.",
      price: 79,
      image: "/images/wall-clock.jpg",
      category: "Home Decor",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p5",
      name: "Concrete Planter",
      description: "Minimalist concrete planter perfect for succulents.",
      price: 34,
      image: "/images/concrete-planter.jpg",
      category: "Plants",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p6",
      name: "Glass Vase Set",
      description: "Set of 3 minimalist glass vases in varying sizes.",
      price: 55,
      image: "/images/glass-vase.jpg",
      category: "Home Decor",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p7",
      name: "Bamboo Organizer",
      description: "Desk organizer made from sustainable bamboo.",
      price: 42,
      image: "/images/bamboo-organizer.jpg",
      category: "Office",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p8",
      name: "Marble Coasters",
      description: "Set of 4 marble coasters with cork backing.",
      price: 38,
      image: "/images/marble-coasters.jpg",
      category: "Kitchenware",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p9",
      name: "Brass Bookends",
      description: "Modern geometric brass bookends, set of 2.",
      price: 68,
      image: "/images/brass-bookends.jpg",
      category: "Office",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p10",
      name: "Ceramic Plant Pot",
      description: "Handmade ceramic plant pot with drainage hole.",
      price: 48,
      image: "/images/ceramic-pot.jpg",
      category: "Plants",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: "p11",
      name: "Wall Mirror",
      description: "Round wall mirror with minimal metal frame.",
      price: 120,
      image: "/images/wall-mirror.jpg",
      category: "Home Decor",
      stock: 0,
      inStock: false,
      created_at: now,
      updated_at: now,
    },
  ]
}

// 產品相關的資料庫操作
export const productDB = {
  // 取得所有產品
  async getAllProducts(): Promise<Product[]> {
    return await readProducts()
  },

  // 根據分類取得產品
  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await readProducts()
    if (category === 'All') {
      return products
    }
    return products.filter(product => product.category === category)
  },

  // 搜尋產品
  async searchProducts(query: string): Promise<Product[]> {
    const products = await readProducts()
    const searchQuery = query.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
    )
  },

  // 取得單一產品
  async getProductById(id: string): Promise<Product | null> {
    const products = await readProducts()
    return products.find(product => product.id === id) || null
  },

  // 新增產品
  async addProduct(product: Omit<Product, 'created_at' | 'updated_at'>): Promise<void> {
    const products = await readProducts()
    const now = new Date().toISOString()
    const newProduct: Product = {
      ...product,
      stock: product.stock !== undefined ? product.stock : 0,
      inStock: (product.stock !== undefined ? product.stock : 0) > 0,
      created_at: now,
      updated_at: now,
    }
    products.push(newProduct)
    await writeProducts(products)
  },

  // 更新產品
  async updateProduct(id: string, update: Partial<Product>): Promise<void> {
    const products = await readProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    const now = new Date().toISOString()
    products[index] = {
      ...products[index],
      ...update,
      stock: update.stock !== undefined ? update.stock : products[index].stock,
      inStock: (update.stock !== undefined ? update.stock : products[index].stock) > 0,
      updated_at: now,
    }
    await writeProducts(products)
  },

  // 刪除產品
  async deleteProduct(id: string): Promise<void> {
    const products = await readProducts()
    const filteredProducts = products.filter(product => product.id !== id)
    await writeProducts(filteredProducts)
  },

  // 取得所有分類
  async getCategories(): Promise<string[]> {
    const products = await readProducts()
    const categories = [...new Set(products.map(product => product.category))]
    return categories.sort()
  },
} 