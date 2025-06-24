USE buttery_management;

-- Insert default locations
INSERT IGNORE INTO locations (name, address, manager_name, contact_phone) VALUES
('Mary Hall Buttery', 'Mary Hall, University Campus', 'John Manager', '+233123456789'),
('CST Hall Buttery', 'CST Hall, University Campus', 'Jane Manager', '+233123456790'),
('Paul Hall Buttery', 'Paul Hall, University Campus', 'Bob Manager', '+233123456791'),
('Engineering Buttery', 'Engineering Block, University Campus', 'Alice Manager', '+233123456792'),
('Medical Buttery', 'Medical School, University Campus', 'Charlie Manager', '+233123456793');

-- Insert default categories
INSERT IGNORE INTO categories (name, description) VALUES
('Beverages', 'Soft drinks, juices, water, etc.'),
('Snacks', 'Chips, biscuits, nuts, etc.'),
('Confectionery', 'Sweets, chocolates, candies'),
('Stationery', 'Pens, pencils, notebooks, etc.'),
('Personal Care', 'Soap, toothpaste, shampoo, etc.'),
('Food Items', 'Bread, instant noodles, canned food'),
('Electronics', 'Phone accessories, batteries, etc.');

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (name, email, phone, password_hash, role, location) VALUES
('System Administrator', 'admin@buttery.com', '+233100000000', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Mary Hall Buttery');

-- Insert sample users
INSERT IGNORE INTO users (name, email, phone, password_hash, role, location) VALUES
('John Vendor', 'vendor@buttery.com', '+233100000001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendor', 'Mary Hall Buttery'),
('Jane Manager', 'manager@buttery.com', '+233100000002', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'inventory_manager', 'CST Hall Buttery');

-- Insert sample products
INSERT IGNORE INTO products (name, description, category_id, price, cost_price, sku, reorder_level) VALUES
('Coca Cola 350ml', 'Coca Cola soft drink 350ml bottle', 1, 3.50, 2.50, 'BEV001', 50),
('Pepsi 350ml', 'Pepsi soft drink 350ml bottle', 1, 3.50, 2.50, 'BEV002', 50),
('Pure Water 500ml', 'Pure drinking water 500ml sachet', 1, 1.00, 0.70, 'BEV003', 100),
('Pringles Original', 'Pringles potato chips original flavor', 2, 8.00, 6.00, 'SNK001', 20),
('Digestive Biscuits', 'McVities digestive biscuits pack', 2, 5.50, 4.00, 'SNK002', 30),
('Cadbury Dairy Milk', 'Cadbury chocolate bar 45g', 3, 4.00, 3.00, 'CON001', 40),
('Mentos Mint', 'Mentos mint flavored candy roll', 3, 2.50, 1.80, 'CON002', 60),
('Bic Pen Blue', 'Bic ballpoint pen blue ink', 4, 1.50, 1.00, 'STA001', 100),
('A4 Exercise Book', 'A4 size exercise book 80 pages', 4, 3.00, 2.20, 'STA002', 50),
('Colgate Toothpaste', 'Colgate toothpaste 75ml tube', 5, 6.50, 5.00, 'PER001', 25);

-- Insert initial stock for Mary Hall Buttery
INSERT IGNORE INTO inventory_transactions (product_id, location, transaction_type, quantity, unit_cost, total_cost, reference_type, user_id, notes) VALUES
(1, 'Mary Hall Buttery', 'stock_in', 100, 2.50, 250.00, 'purchase', 1, 'Initial stock'),
(2, 'Mary Hall Buttery', 'stock_in', 80, 2.50, 200.00, 'purchase', 1, 'Initial stock'),
(3, 'Mary Hall Buttery', 'stock_in', 200, 0.70, 140.00, 'purchase', 1, 'Initial stock'),
(4, 'Mary Hall Buttery', 'stock_in', 50, 6.00, 300.00, 'purchase', 1, 'Initial stock'),
(5, 'Mary Hall Buttery', 'stock_in', 60, 4.00, 240.00, 'purchase', 1, 'Initial stock'),
(6, 'Mary Hall Buttery', 'stock_in', 80, 3.00, 240.00, 'purchase', 1, 'Initial stock'),
(7, 'Mary Hall Buttery', 'stock_in', 100, 1.80, 180.00, 'purchase', 1, 'Initial stock'),
(8, 'Mary Hall Buttery', 'stock_in', 200, 1.00, 200.00, 'purchase', 1, 'Initial stock'),
(9, 'Mary Hall Buttery', 'stock_in', 100, 2.20, 220.00, 'purchase', 1, 'Initial stock'),
(10, 'Mary Hall Buttery', 'stock_in', 50, 5.00, 250.00, 'purchase', 1, 'Initial stock');

-- Show inserted data
SELECT 'Locations:' as Info;
SELECT * FROM locations;

SELECT 'Categories:' as Info;
SELECT * FROM categories;

SELECT 'Users:' as Info;
SELECT id, name, email, role, location, status FROM users;

SELECT 'Products:' as Info;
SELECT id, name, price, cost_price, sku, reorder_level FROM products LIMIT 10;

SELECT 'Current Stock:' as Info;
SELECT * FROM current_stock WHERE location = 'Mary Hall Buttery' LIMIT 10;
