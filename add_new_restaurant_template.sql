-- =========================================================================
-- SUPER MENU: STANDARD TEMPLATE FOR ADDING A NEW RESTAURANT
-- =========================================================================
-- INSTRUCTIONS:
-- 1. Replace 'restaurant-slug' with the URL name (e.g., 'burger-king')
-- 2. Replace 'اسم المطعم' with the real name
-- 3. Replace the phone number '+9647700000000'
-- 4. Customize the colors and fonts in theme_config
-- 5. Copy and Paste the whole file into Supabase SQL Editor and run it!
-- =========================================================================

-- PERFORMANCE INDEXES (Ensures speed even with 1000+ restaurants)
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_products_restaurant_id ON products(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

DO $$
DECLARE
  -- Automatically generate unique IDs for the restaurant and its categories
  new_restaurant_id uuid := gen_random_uuid();
  
  -- Create variables for your categories
  cat_1 uuid := gen_random_uuid();
  cat_2 uuid := gen_random_uuid();
  cat_3 uuid := gen_random_uuid();
  
  -- A default image to use if you don't have product images yet
  default_img text := 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';

BEGIN
  -- 1. CREATE THE RESTAURANT
  INSERT INTO restaurants (id, slug, name, whatsapp_number, logo_url, theme_config)
  VALUES (
    new_restaurant_id,
    'restaurant-slug',               -- CHANGE THIS: The URL link
    'اسم المطعم هنا',                 -- CHANGE THIS: The Display Name
    '+9647700000000',                -- CHANGE THIS: WhatsApp Number
    '/final.jpeg',                   -- CHANGE THIS: Logo (or leave default)
    '{"primary_color": "#ff3366", "secondary_color": "#ffffff", "font": "Cairo"}'::jsonb
  );

  -- 2. CREATE CATEGORIES
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES 
  (cat_1, new_restaurant_id, 'القسم الأول (مثال: وجبات)', 0),
  (cat_2, new_restaurant_id, 'القسم الثاني (مثال: مقبلات)', 1),
  (cat_3, new_restaurant_id, 'القسم الثالث (مثال: مشروبات)', 2);

  -- 3. ADD PRODUCTS TO CATEGORY 1
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (new_restaurant_id, cat_1, 'اسم الوجبة 1', 'وصف الوجبة والمكونات هنا', 5000, default_img),
  (new_restaurant_id, cat_1, 'اسم الوجبة 2', 'وصف الوجبة والمكونات هنا', 6500, default_img);

  -- 4. ADD PRODUCTS TO CATEGORY 2
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (new_restaurant_id, cat_2, 'اسم المقبلات', 'وصف', 2000, default_img);

  -- 5. ADD PRODUCTS TO CATEGORY 3
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (new_restaurant_id, cat_3, 'بيبسي', 'مشروب غازي', 500, default_img),
  (new_restaurant_id, cat_3, 'ماء', 'قنينة ماء', 250, default_img);

  -- Print the new restaurant ID to the logs so you can use it in user_roles
  RAISE NOTICE 'SUCCESS! The New Restaurant ID is: %', new_restaurant_id;

END $$;
