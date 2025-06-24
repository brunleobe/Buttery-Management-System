// Fallback storage system using localStorage for development
export class LocalStorage {
  private static getItem(key: string) {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  }

  private static setItem(key: string, value: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  static getUsers() {
    return this.getItem("buttery_users") || []
  }

  static addUser(user: any) {
    const users = this.getUsers()
    const newUser = { ...user, id: Date.now(), created_at: new Date().toISOString() }
    users.push(newUser)
    this.setItem("buttery_users", users)
    return newUser
  }

  static findUserByEmail(email: string) {
    const users = this.getUsers()
    return users.find((user: any) => user.email === email)
  }

  static getProducts() {
    return this.getItem("buttery_products") || []
  }

  static addProduct(product: any) {
    const products = this.getProducts()
    const newProduct = { ...product, id: Date.now(), created_at: new Date().toISOString() }
    products.push(newProduct)
    this.setItem("buttery_products", products)
    return newProduct
  }

  static getSales() {
    return this.getItem("buttery_sales") || []
  }

  static addSale(sale: any) {
    const sales = this.getSales()
    const newSale = { ...sale, id: Date.now(), created_at: new Date().toISOString() }
    sales.push(newSale)
    this.setItem("buttery_sales", sales)
    return newSale
  }

  static getLocations() {
    return (
      this.getItem("buttery_locations") || [
        { id: 1, name: "Main Campus", description: "Main campus location" },
        { id: 2, name: "Hostel Block A", description: "Hostel Block A location" },
        { id: 3, name: "Hostel Block B", description: "Hostel Block B location" },
      ]
    )
  }

  static getCategories() {
    return (
      this.getItem("buttery_categories") || [
        { id: 1, name: "Beverages", description: "Drinks and beverages" },
        { id: 2, name: "Snacks", description: "Snacks and light meals" },
        { id: 3, name: "Stationery", description: "Office and school supplies" },
      ]
    )
  }

  static initializeDefaultData() {
    // Initialize with default admin user if no users exist
    const users = this.getUsers()
    if (users.length === 0) {
      this.addUser({
        name: "System Administrator",
        email: "admin@buttery.com",
        phone: "+1234567890",
        password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: admin123
        role: "admin",
        location: "Main Campus",
        status: "active",
      })
    }

    // Initialize with sample products
    const products = this.getProducts()
    if (products.length === 0) {
      const sampleProducts = [
        { name: "Coca Cola", category_id: 1, price: 2.5, stock_quantity: 50, location_id: 1 },
        { name: "Pepsi", category_id: 1, price: 2.5, stock_quantity: 30, location_id: 1 },
        { name: "Chips", category_id: 2, price: 1.5, stock_quantity: 25, location_id: 1 },
        { name: "Notebook", category_id: 3, price: 3.0, stock_quantity: 15, location_id: 1 },
      ]
      sampleProducts.forEach((product) => this.addProduct(product))
    }
  }
}
