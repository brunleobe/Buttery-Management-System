-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS buttery_management;
USE buttery_management;

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    manager_name VARCHAR(100),
    contact_phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('vendor', 'inventory_manager', 'admin') NOT NULL,
    location VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2),
    barcode VARCHAR(100),
    sku VARCHAR(100),
    unit VARCHAR(50) DEFAULT 'piece',
    reorder_level INT DEFAULT 10,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_barcode (barcode),
    INDEX idx_sku (sku),
    INDEX idx_status (status)
);

-- Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    transaction_type ENUM('stock_in', 'stock_out', 'adjustment', 'transfer', 'damage', 'expired') NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),
    reference_type ENUM('purchase', 'sale', 'adjustment', 'transfer', 'damage', 'expiry') NOT NULL,
    reference_id INT,
    notes TEXT,
    user_id INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_location (location),
    INDEX idx_type (transaction_type),
    INDEX idx_date (transaction_date),
    INDEX idx_reference (reference_type, reference_id)
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(50) NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'mobile_money', 'bank_transfer', 'credit') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
    notes TEXT,
    user_id INT NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sale_number (sale_number),
    INDEX idx_location (location),
    INDEX idx_date (sale_date),
    INDEX idx_user (user_id),
    INDEX idx_payment_method (payment_method),
    INDEX idx_payment_status (payment_status)
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_sale (sale_id),
    INDEX idx_product (product_id)
);

-- Create current_stock view for easy stock checking
CREATE OR REPLACE VIEW current_stock AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    it.location,
    COALESCE(SUM(
        CASE 
            WHEN it.transaction_type IN ('stock_in', 'adjustment') THEN it.quantity
            WHEN it.transaction_type IN ('stock_out', 'damage', 'expired') THEN -it.quantity
            ELSE 0
        END
    ), 0) as current_quantity,
    p.reorder_level,
    CASE 
        WHEN COALESCE(SUM(
            CASE 
                WHEN it.transaction_type IN ('stock_in', 'adjustment') THEN it.quantity
                WHEN it.transaction_type IN ('stock_out', 'damage', 'expired') THEN -it.quantity
                ELSE 0
            END
        ), 0) <= p.reorder_level THEN 'low'
        ELSE 'normal'
    END as stock_status
FROM products p
CROSS JOIN (SELECT DISTINCT location FROM inventory_transactions) loc
LEFT JOIN inventory_transactions it ON p.id = it.product_id AND loc.location = it.location
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.sku, it.location, p.reorder_level;

-- Show tables created
SHOW TABLES;
