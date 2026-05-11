-- Seed Roles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO roles (name) VALUES ('ROLE_USER');

-- Seed Categories
INSERT INTO categories (name, description, image_url) VALUES ('Electronics', 'Gadgets and devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661');
INSERT INTO categories (name, description, image_url) VALUES ('Books', 'Various genres of books', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f');

-- Seed Users (Passwords: admin123, user123)
-- Role IDs: 1 (ADMIN), 2 (USER)
INSERT INTO users (email, password, role_id) VALUES ('admin@estore.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 1);
INSERT INTO users (email, password, role_id) VALUES ('user@estore.com', '$2a$10$7Pmq7G0XmH3wG6qK2o.8GuX5iG5l1fXpLhL6p.O7t/Y3rW8Y8y/mS', 2);

-- Seed Profiles
INSERT INTO profiles (first_name, last_name, user_id) VALUES ('Admin', 'User', 1);
INSERT INTO profiles (first_name, last_name, user_id) VALUES ('Test', 'User', 2);

-- Seed Carts
INSERT INTO carts (user_id) VALUES (1);
INSERT INTO carts (user_id) VALUES (2);

-- Seed Products
INSERT INTO products (name, description, current_price, old_price, category_id) VALUES ('Laptop Pro', 'High performance laptop', 1200.0, 1500.0, 1);
INSERT INTO products (name, description, current_price, old_price, category_id) VALUES ('Java Programming', 'Learn Java from scratch', 45.0, 60.0, 2);

-- Seed Product Images
-- Laptop Pro Images
INSERT INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1496181133206-80ce9b88a853', TRUE, 1);
INSERT INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1517336712461-4811a4866c1b', FALSE, 1);
-- Java Programming Images
INSERT INTO product_images (url, is_main, product_id) VALUES ('https://images.unsplash.com/photo-1587620962725-abab7fe55159', TRUE, 2);

-- Seed Inventories
INSERT INTO inventories (name, location, quantity, product_id) VALUES ('Main Warehouse', 'New York, USA', 10, 1);
INSERT INTO inventories (name, location, quantity, product_id) VALUES ('Secondary Hub', 'London, UK', 50, 2);
