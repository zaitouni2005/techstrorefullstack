-- Seed Roles
INSERT IGNORE INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT IGNORE INTO roles (name) VALUES ('ROLE_USER');

-- Seed Categories
INSERT IGNORE INTO categories (name, slug, description, image_url) VALUES ('Smartphones', 'smartphones', 'Mobile Devices', 'https://images.unsplash.com/photo-1520769964010-69725c274047');
INSERT IGNORE INTO categories (name, slug, description, image_url) VALUES ('Ordinateurs', 'ordinateurs', 'Laptops, Desktops, and Accessories', 'https://images.unsplash.com/photo-1593642532400-26828103835b');
INSERT IGNORE INTO categories (name, slug, description, image_url) VALUES ('Tablettes', 'tablettes', 'Tablets and e-readers', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0');
INSERT IGNORE INTO categories (name, slug, description, image_url) VALUES ('Accessoires', 'accessoires', 'Gadgets and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661');

-- Seed Brands
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Apple', 'https://images.unsplash.com/photo-1611188431972-e085c14418e1?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Dell', 'https://images.unsplash.com/photo-1611188431972-e085c14418e1?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('HP', 'https://images.unsplash.com/photo-1541627365049-465311d053a1?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Sony', 'https://images.unsplash.com/photo-1559532517-3e6e917f9b5d?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Microsoft', 'https://images.unsplash.com/photo-1574864017778-2c10027191c2?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Logitech', 'https://images.unsplash.com/photo-1593349054460-1b87b3253b7e?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Google', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('OnePlus', 'https://images.unsplash.com/photo-1678911821544-88b7e408b8a6?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Xiaomi', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Lenovo', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('ASUS', 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('Bose', 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=200');
INSERT IGNORE INTO brands (name, logo_url) VALUES ('JBL', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200');

-- Seed Users (Passwords: admin123, user123, password123)
-- Passwords: admin123, user123 (same for all user accounts)
INSERT IGNORE INTO users (email, password, role_id, status) VALUES ('admin@estore.com', '$2b$10$vhMKlIMT0cl3iIMwMl2QyeXLXCP15tpcL8I7VvsFE.aGbTNbu0jty', 1, 'active');
INSERT IGNORE INTO users (email, password, role_id, status) VALUES ('user@estore.com', '$2b$10$Xnz5q3XIMRu8f1C5BtBY/eBiI0n4Ojj5OfDBCe04M9AIUZX8rI9CO', 2, 'active');
INSERT IGNORE INTO users (email, password, role_id, status) VALUES ('jean.dupont@example.com', '$2b$10$Xnz5q3XIMRu8f1C5BtBY/eBiI0n4Ojj5OfDBCe04M9AIUZX8rI9CO', 2, 'active');
INSERT IGNORE INTO users (email, password, role_id, status) VALUES ('marie.curie@example.com', '$2b$10$Xnz5q3XIMRu8f1C5BtBY/eBiI0n4Ojj5OfDBCe04M9AIUZX8rI9CO', 2, 'active');
INSERT IGNORE INTO users (email, password, role_id, status) VALUES ('lucas.b@example.com', '$2b$10$Xnz5q3XIMRu8f1C5BtBY/eBiI0n4Ojj5OfDBCe04M9AIUZX8rI9CO', 2, 'inactive');

-- Seed Profiles
INSERT IGNORE INTO profiles (first_name, last_name, user_id) VALUES ('Admin', 'User', 1);
INSERT IGNORE INTO profiles (first_name, last_name, user_id) VALUES ('Test', 'User', 2);
INSERT IGNORE INTO profiles (first_name, last_name, user_id) VALUES ('Jean', 'Dupont', 3);
INSERT IGNORE INTO profiles (first_name, last_name, user_id) VALUES ('Marie', 'Curie', 4);
INSERT IGNORE INTO profiles (first_name, last_name, user_id) VALUES ('Lucas', 'Bernard', 5);

-- Seed Carts
INSERT IGNORE INTO carts (user_id) VALUES (1);
INSERT IGNORE INTO carts (user_id) VALUES (2);
INSERT IGNORE INTO carts (user_id) VALUES (3);
INSERT IGNORE INTO carts (user_id) VALUES (4);
INSERT IGNORE INTO carts (user_id) VALUES (5);

-- Seed Products (Smartphones - cat 1)
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('iPhone 15 Pro Max', 'Latest Apple flagship with A17 Pro chip and titanium design', 1499.0, 1599.0, 4.8, 1, 1);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Samsung Galaxy S24 Ultra', 'Premium Android experience with AI features and S Pen', 1399.0, 1499.0, 4.7, 1, 2);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Google Pixel 8 Pro', 'Pure Android with exceptional camera capabilities', 999.0, 1099.0, 4.6, 1, 8);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('OnePlus 12', 'Fast and smooth flagship killer', 899.0, 999.0, 4.5, 1, 9);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Xiaomi 14 Pro', 'High-end specs at a competitive price', 799.0, 899.0, 4.4, 1, 10);

-- Seed Products (Ordinateurs - cat 2)
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('MacBook Pro 14" M3 Pro', 'High performance laptop with M3 Pro chip', 1999.0, 2299.0, 4.9, 2, 1);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Dell XPS 15', 'Stunning display, powerful performance', 1599.0, 1899.0, 4.6, 2, 3);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('HP Spectre x360', 'Versatile 2-in-1 laptop for professionals', 1249.0, 1499.0, 4.5, 2, 4);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Microsoft Surface Pro 9', 'Powerful tablet and laptop in one', 999.0, 1199.0, 4.4, 2, 6);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Lenovo ThinkPad X1 Carbon', 'Ultralight business laptop with legendary keyboard', 1699.0, 1899.0, 4.7, 2, 11);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('ASUS ROG Zephyrus G14', 'Compact gaming powerhouse', 1499.0, 1699.0, 4.5, 2, 12);

-- Seed Products (Tablettes - cat 3)
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('iPad Pro 12.9"', 'The ultimate iPad experience with M2 chip', 1299.0, 1399.0, 4.8, 3, 1);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('iPad Air M2', 'Powerful and portable tablet', 699.0, 749.0, 4.7, 3, 1);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Samsung Galaxy Tab S9 Ultra', 'Massive AMOLED display for productivity', 1099.0, 1199.0, 4.6, 3, 2);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Samsung Galaxy Tab S9 FE', 'Affordable tablet with S Pen included', 449.0, 499.0, 4.4, 3, 2);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Xiaomi Pad 6', 'Great value Android tablet', 399.0, 449.0, 4.3, 3, 10);

-- Seed Products (Accessoires - cat 4)
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Sony WH-1000XM5', 'Industry-leading noise canceling headphones', 349.0, 399.0, 4.8, 4, 5);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('AirPods Pro 2', 'Premium wireless earbuds with ANC', 249.0, 279.0, 4.7, 4, 1);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Logitech MX Master 3S', 'Advanced wireless mouse for productivity', 99.0, 119.0, 4.6, 4, 7);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Bose QuietComfort Ultra', 'Immersive sound with spatial audio', 429.0, 449.0, 4.7, 4, 13);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('JBL Flip 6', 'Portable Bluetooth speaker', 129.0, 149.0, 4.5, 4, 14);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Logitech G Pro X Superlight', 'Ultralight gaming mouse', 149.0, 169.0, 4.6, 4, 7);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Apple AirTag', 'Find your items with precision tracking', 35.0, 39.0, 4.4, 4, 1);
INSERT IGNORE INTO products (name, description, current_price, old_price, rating, category_id, brand_id) VALUES ('Samsung Galaxy Buds2 Pro', 'Premium earbuds with Hi-Fi sound', 189.0, 229.0, 4.5, 4, 2);

-- Seed Product Images (Smartphones)
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1678609777203-42d89d15d7e1', TRUE, 1);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1523209492578-b966f1e11d37', FALSE, 1);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', TRUE, 2);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1598327105666-5b89351aff97', TRUE, 3);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1678911821544-88b7e408b8a6', TRUE, 4);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1598327105666-5b89351aff97', TRUE, 5);

-- Seed Product Images (Ordinateurs)
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1593642532400-26828103835b', TRUE, 6);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1611188431972-e085c14418e1', FALSE, 6);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1593642532756-3000010762e0', TRUE, 7);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1541627365049-465311d053a1', TRUE, 8);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1574864017778-2c10027191c2', TRUE, 9);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', TRUE, 10);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1611078489935-0cb964de46d6', TRUE, 11);

-- Seed Product Images (Tablettes)
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', TRUE, 12);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1561154464-82e9adf32764', TRUE, 13);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1561154464-82e9adf32764', TRUE, 14);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1561154464-82e9adf32764', TRUE, 15);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1561154464-82e9adf32764', TRUE, 16);

-- Seed Product Images (Accessoires)
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1559532517-3e6e917f9b5d', TRUE, 17);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1600294037681-c80b4cb5b2b8', TRUE, 18);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1593349054460-1b87b3253b7e', TRUE, 19);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1590658268037-6bf12f032f55', TRUE, 20);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', TRUE, 21);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7', TRUE, 22);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1606940964789-f0507b5ec608', TRUE, 23);
INSERT IGNORE INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1606225457115-9b0de873c5db', TRUE, 24);

-- Seed Inventories
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tech Warehouse', 'California, USA', 15, 1);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tech Warehouse', 'California, USA', 20, 2);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tech Warehouse', 'California, USA', 12, 3);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tech Warehouse', 'California, USA', 8, 4);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tech Warehouse', 'California, USA', 25, 5);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Main Warehouse', 'New York, USA', 10, 6);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Main Warehouse', 'New York, USA', 5, 7);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Main Warehouse', 'New York, USA', 8, 8);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Main Warehouse', 'New York, USA', 12, 9);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Main Warehouse', 'New York, USA', 7, 10);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Main Warehouse', 'New York, USA', 6, 11);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tablet Storage', 'Texas, USA', 18, 12);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tablet Storage', 'Texas, USA', 22, 13);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tablet Storage', 'Texas, USA', 14, 14);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tablet Storage', 'Texas, USA', 30, 15);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Tablet Storage', 'Texas, USA', 35, 16);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Audio Stock', 'Germany', 20, 17);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Audio Stock', 'Germany', 30, 18);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Accessory Stock', 'California, USA', 40, 19);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Audio Stock', 'Germany', 15, 20);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Audio Stock', 'Germany', 25, 21);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Accessory Stock', 'California, USA', 50, 22);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Accessory Stock', 'California, USA', 100, 23);
INSERT IGNORE INTO inventories (name, location, quantity, product_id) VALUES ('Audio Stock', 'Germany', 28, 24);

-- Seed Orders (for users with history)
-- Order 1: Jean Dupont (user id 3)
INSERT IGNORE INTO orders (user_id, customer_name, order_date, total_amount, status, created_at, updated_at) VALUES (3, 'Jean Dupont', '2026-05-11 10:00:00', 2499.0, 'delivered', '2026-05-11 10:00:00', '2026-05-13 10:00:00');
-- Order 2: Jean Dupont
INSERT IGNORE INTO orders (user_id, customer_name, order_date, total_amount, status, created_at, updated_at) VALUES (3, 'Jean Dupont', '2026-05-04 10:00:00', 1399.0, 'shipped', '2026-05-04 10:00:00', '2026-05-08 10:00:00');
-- Order 3: Marie Curie (user id 4)
INSERT IGNORE INTO orders (user_id, customer_name, order_date, total_amount, status, created_at, updated_at) VALUES (4, 'Marie Curie', '2026-05-15 10:00:00', 1999.0, 'processing', '2026-05-15 10:00:00', '2026-05-16 10:00:00');
-- Order 4: Marie Curie
INSERT IGNORE INTO orders (user_id, customer_name, order_date, total_amount, status, created_at, updated_at) VALUES (4, 'Marie Curie', '2026-04-18 10:00:00', 1299.0, 'delivered', '2026-04-18 10:00:00', '2026-04-23 10:00:00');
-- Order 5: Test User (user id 2)
INSERT IGNORE INTO orders (user_id, customer_name, order_date, total_amount, status, created_at, updated_at) VALUES (2, 'Test User', '2026-05-17 10:00:00', 449.0, 'pending', '2026-05-17 10:00:00', '2026-05-17 10:00:00');

-- Seed Order Items
-- Order 1 items: MacBook Pro + Sony WH-1000XM5
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price, name, image) VALUES (1, 6, 1, 1999.0, 'MacBook Pro 14" M3 Pro', 'https://images.unsplash.com/photo-1593642532400-26828103835b');
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price, name, image) VALUES (1, 17, 1, 349.0, 'Sony WH-1000XM5', 'https://images.unsplash.com/photo-1559532517-3e6e917f9b5d');
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price, name, image) VALUES (1, 23, 4, 35.0, 'Apple AirTag', 'https://images.unsplash.com/photo-1606940964789-f0507b5ec608');

-- Order 2 items: Samsung Galaxy S24 Ultra
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price, name, image) VALUES (2, 2, 1, 1399.0, 'Samsung Galaxy S24 Ultra', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf');

-- Order 3 items: MacBook Pro + Logitech MX Master
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price, name, image) VALUES (3, 6, 1, 1999.0, 'MacBook Pro 14" M3 Pro', 'https://images.unsplash.com/photo-1593642532400-26828103835b');

-- Order 4 items: iPad Pro 12.9
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price, name, image) VALUES (4, 12, 1, 1299.0, 'iPad Pro 12.9"', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0');

-- Order 5 items: Samsung Galaxy Tab S9 FE
INSERT IGNORE INTO order_items (order_id, product_id, quantity, unit_price, name, image) VALUES (5, 15, 1, 449.0, 'Samsung Galaxy Tab S9 FE', 'https://images.unsplash.com/photo-1561154464-82e9adf32764');
