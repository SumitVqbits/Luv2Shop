-- 1. Create 4 separate new categories
INSERT INTO product_category (category_name) VALUES ('Mouse');
INSERT INTO product_category (category_name) VALUES ('Headphones');
INSERT INTO product_category (category_name) VALUES ('Laptops');
INSERT INTO product_category (category_name) VALUES ('Mobiles');

-- 2. Add the products (Assuming Category IDs are 5, 6, 7, and 8)
-- MySQL uses NOW() or CURRENT_TIMESTAMP instead of GETDATE()
INSERT INTO product (sku, name, description, unit_price, image_url, active, units_in_stock, category_id, date_created)
VALUES 
('TECH-MS-01', 'Wireless Mouse', 'Ergonomic 2.4GHz Mouse', 1200.00, 'assets/images/products/tech/mouse.png', 1, 100, 5, NOW()),
('TECH-AB-01', 'Air Buds Pro', 'TWS Bluetooth Earbuds', 2500.00, 'assets/images/products/tech/airbuds.png', 1, 50, 6, NOW()),
('TECH-LP-01', 'Developer Laptop', 'Core i7, 16GB RAM Laptop', 75000.00, 'assets/images/products/tech/laptop.png', 1, 20, 7, NOW()),
('TECH-MB-01', 'Smart Phone', '6.5 inch AMOLED Mobile', 35000.00, 'assets/images/products/tech/mobile.png', 1, 40, 8, NOW());
