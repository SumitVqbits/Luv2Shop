-- Add products for Mobiles category (Category ID: 8)
INSERT INTO product (sku, name, description, unit_price, image_url, active, units_in_stock, category_id, date_created)
VALUES 
('MB-IP-17', 'iPhone 17 Pro', 'Apple iPhone 17 Pro with A19 chip', 129900.00, 'assets/images/products/mobiles/iphone_17_pro.png', 1, 50, 8, NOW()),
('MB-SS-24', 'Samsung S24 Ultra', 'Samsung Galaxy S24 Ultra with AI features', 124999.00, 'assets/images/products/mobiles/samsung.png', 1, 40, 8, NOW()),
('MB-RD-13', 'Redmi Note 13 Pro', 'Xiaomi Redmi Note 13 Pro 5G', 25999.00, 'assets/images/products/mobiles/readmi.png', 1, 100, 8, NOW()),
('MB-VV-30', 'Vivo V30 Pro', 'Vivo V30 Pro with Zeiss Optics', 33999.00, 'assets/images/products/mobiles/vivo.png', 1, 60, 8, NOW()),
('MB-OP-11', 'Oppo Reno 11 Pro', 'Oppo Reno 11 Pro 5G with Portrait Expert', 29999.00, 'assets/images/products/mobiles/oppo.png', 1, 45, 8, NOW());
