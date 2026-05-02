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
('MB-IP-17', 'iPhone 17 Pro', 'Apple iPhone 17 Pro with A19 chip', 129900.00, 'assets/images/products/mobiles/iphone_17_pro.png', 1, 50, 8, NOW()),
('MB-SS-24', 'Samsung S24 Ultra', 'Samsung Galaxy S24 Ultra with AI features', 124999.00, 'assets/images/products/mobiles/samsung.png', 1, 40, 8, NOW()),
('MB-RD-13', 'Redmi Note 13 Pro', 'Xiaomi Redmi Note 13 Pro 5G', 25999.00, 'assets/images/products/mobiles/readmi.png', 1, 100, 8, NOW()),
('MB-VV-30', 'Vivo V30 Pro', 'Vivo V30 Pro with Zeiss Optics', 33999.00, 'assets/images/products/mobiles/vivo.png', 1, 60, 8, NOW()),
('MB-OP-11', 'Oppo Reno 11 Pro', 'Oppo Reno 11 Pro 5G with Portrait Expert', 29999.00, 'assets/images/products/mobiles/oppo.png', 1, 45, 8, NOW());
