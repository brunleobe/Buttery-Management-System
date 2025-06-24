-- Insert default locations
INSERT INTO locations (name, description) VALUES
('Mary Hall Buttery', 'Main buttery at Mary Hall'),
('CST Hall Buttery', 'Computer Science and Technology Hall buttery'),
('Paul Hall Buttery', 'Paul Hall residential buttery'),
('Engineering Buttery', 'Engineering faculty buttery'),
('Medical Buttery', 'Medical school buttery');

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Drinks', 'Beverages and soft drinks'),
('Pastry', 'Baked goods and pastries'),
('Snacks', 'Light snacks and confectionery'),
('Others', 'Miscellaneous items');

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, phone, password_hash, role, location, status) VALUES
('System Admin', 'admin@buttery.com', '08000000000', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeH8H8H8H8H8H8H8H8H8H8H8H8H8H8H8', 'admin', 'All', 'active');

-- Insert sample products
INSERT INTO products (name, category_id, price, stock_quantity, low_stock_threshold, location_id) VALUES
('Coca Cola', 1, 300.00, 50, 10, 1),
('Bread', 2, 200.00, 30, 10, 2),
('Biscuits', 3, 150.00, 25, 15, 3),
('Water', 1, 100.00, 100, 20, 1),
('Meat Pie', 2, 400.00, 15, 10, 4),
('Juice', 1, 250.00, 40, 15, 2);
