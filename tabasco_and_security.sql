-- ==========================================================
-- 1. SECURITY (ROW LEVEL SECURITY & USER ROLES)
-- ==========================================================

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  role text DEFAULT 'owner',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing public policies just to recreate them cleanly
DROP POLICY IF EXISTS "الاقسام مرئية للجميع" ON categories;
DROP POLICY IF EXISTS "المنتجات مرئية للجميع" ON products;
DROP POLICY IF EXISTS "المطاعم مرئية للجميع" ON restaurants;

-- A. PUBLIC READ ACCESS (Anyone can view the menu)
CREATE POLICY "المطاعم مرئية للجميع" ON restaurants FOR SELECT USING (true);
CREATE POLICY "الاقسام مرئية للجميع" ON categories FOR SELECT USING (true);
CREATE POLICY "المنتجات مرئية للجميع" ON products FOR SELECT USING (true);

-- B. DASHBOARD OWNER ACCESS (Only owners can insert/update/delete their own data)

-- user_roles: User can see their own roles
DROP POLICY IF EXISTS "Users can see their own roles" ON user_roles;
CREATE POLICY "Users can see their own roles" ON user_roles
FOR SELECT USING (auth.uid() = user_id);

-- restaurants: Owners can update their own restaurant
DROP POLICY IF EXISTS "Owners can update their restaurant" ON restaurants;
CREATE POLICY "Owners can update their restaurant" ON restaurants
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND restaurant_id = restaurants.id
  )
);

-- categories: Owners can manage their own categories
DROP POLICY IF EXISTS "Owners can manage categories" ON categories;
CREATE POLICY "Owners can manage categories" ON categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND restaurant_id = categories.restaurant_id
  )
);

-- products: Owners can manage their own products
DROP POLICY IF EXISTS "Owners can manage products" ON products;
CREATE POLICY "Owners can manage products" ON products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND restaurant_id = products.restaurant_id
  )
);


-- ==========================================================
-- 2. SEED TABASCO AL-SHAM
-- ==========================================================

-- Use a specific UUID for Tabasco so we can easily link it
DO $$
DECLARE
  tabasco_id uuid := 'b1234567-89ab-cdef-0123-456789abcdef';
  cat_saj uuid := gen_random_uuid();
  cat_pizza uuid := gen_random_uuid();
  cat_fatayer uuid := gen_random_uuid();
  cat_burger uuid := gen_random_uuid();
  cat_rizo uuid := gen_random_uuid();
  cat_crispy uuid := gen_random_uuid();
  cat_sandwich uuid := gen_random_uuid();
  cat_shawarma uuid := gen_random_uuid();
  cat_appetizers uuid := gen_random_uuid();
  generic_img text := 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60';
BEGIN
  -- Insert Restaurant
  INSERT INTO restaurants (id, slug, name, whatsapp_number, theme_config)
  VALUES (
    tabasco_id,
    'tabasco-al-sham',
    'تباسكو الشام',
    '+9647700000000',
    '{"primary_color": "#e11d48", "secondary_color": "#ffffff", "font": "Cairo"}'::jsonb
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert Categories
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_saj, tabasco_id, 'وجبات الصاج', 0);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_pizza, tabasco_id, 'البيتزا', 1);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_fatayer, tabasco_id, 'لغم وفطائر', 2);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_burger, tabasco_id, 'البركر', 3);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_rizo, tabasco_id, 'الريزو', 4);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_crispy, tabasco_id, 'الدجاج المقرمش', 5);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_sandwich, tabasco_id, 'السندويش', 6);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_shawarma, tabasco_id, 'الشاورما', 7);
  INSERT INTO categories (id, restaurant_id, name, order_index) VALUES (cat_appetizers, tabasco_id, 'المقبلات والصوصات', 8);

  -- Insert Products for 'وجبات الصاج'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_saj, 'وجبة صاج دجاج', 'صاج+فنكر+ثومية', 5000, generic_img),
  (tabasco_id, cat_saj, 'وجبة صاج مشكل تباسكو الشام', 'صاج+فنكر+ثومية+طرشي', 9000, generic_img),
  (tabasco_id, cat_saj, 'وجبة صاج عائلي', 'صاج+فنكر+ثومية+طرشي', 12000, generic_img),
  (tabasco_id, cat_saj, 'وجبة صاج بالجبن عائلي', 'صاج بالجبن+فنكر+ثومية+طرشي', 16500, generic_img);

  -- Insert Products for 'البيتزا'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_pizza, 'بيتزا دجاج', 'وسط', 8000, generic_img),
  (tabasco_id, cat_pizza, 'بيتزا خضار', 'وسط', 7000, generic_img),
  (tabasco_id, cat_pizza, 'بيتزا بپروني', 'وسط', 7000, generic_img),
  (tabasco_id, cat_pizza, 'بيتزا الفصول الأربعة', 'وسط', 8000, generic_img),
  (tabasco_id, cat_pizza, 'بيتزا محشية الأطراف', 'كبير', 12000, generic_img);

  -- Insert Products for 'لغم وفطائر'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_fatayer, 'لغم دجاج تباسكو الشام', '', 5000, generic_img),
  (tabasco_id, cat_fatayer, 'لغم لحم', '', 6000, generic_img),
  (tabasco_id, cat_fatayer, 'عروسة دجاج بالجبن', '', 4000, generic_img),
  (tabasco_id, cat_fatayer, 'فطيرة دجاج', '', 6000, generic_img),
  (tabasco_id, cat_fatayer, 'فطيرة خضار', '', 5000, generic_img),
  (tabasco_id, cat_fatayer, 'فطيرة لحم', '', 6000, generic_img);

  -- Insert Products for 'البركر'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_burger, 'بركر لحم كلاسك', '', 2500, generic_img),
  (tabasco_id, cat_burger, 'بركر لحم بالجبن', '', 3000, generic_img),
  (tabasco_id, cat_burger, 'بركر لحم مكسيكانو', '', 3000, generic_img),
  (tabasco_id, cat_burger, 'بركر لحم دبل', '', 5000, generic_img),
  (tabasco_id, cat_burger, 'بركر دجاج كلاسك', '', 2000, generic_img),
  (tabasco_id, cat_burger, 'بركر دجاج بالجبن', '', 2500, generic_img),
  (tabasco_id, cat_burger, 'بركر دجاج دبل', '', 4500, generic_img),
  (tabasco_id, cat_burger, 'بركر دبل لحم تباسكو الشام', '', 4000, generic_img),
  (tabasco_id, cat_burger, 'بركر دجاج تباسكو الشام', '', 3500, generic_img);

  -- Insert Products for 'الريزو'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_rizo, 'ريزو كلاسك', '', 5000, generic_img),
  (tabasco_id, cat_rizo, 'ريزو جبن', '', 5000, generic_img),
  (tabasco_id, cat_rizo, 'ريزو مدخن', '', 5000, generic_img),
  (tabasco_id, cat_rizo, 'ريزو شاورما دجاج', '', 5000, generic_img),
  (tabasco_id, cat_rizo, 'ريزو دبل تباسكو الشام', '', 8000, generic_img);

  -- Insert Products for 'الدجاج المقرمش'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_crispy, 'ستربس 4 قطع', 'صوص+صمون+فنكر+كاتشب+مايونيز+ثومية', 5000, generic_img),
  (tabasco_id, cat_crispy, 'ستربس عائلي', 'ببسي وسط+صمون+فنكر+صوص+كاتشب+مايونيز+ثومية', 10000, generic_img),
  (tabasco_id, cat_crispy, 'وجبة كنتاكي 3 قطع', 'صمون+فنكر+صوص+كاتشب+مايونيز+ثومية', 6000, generic_img),
  (tabasco_id, cat_crispy, 'وجبة كنتاكي عائلي', '12 قطعة', 20000, generic_img);

  -- Insert Products for 'السندويش'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_sandwich, 'سندويش زنجر', '', 3000, generic_img),
  (tabasco_id, cat_sandwich, 'تويستر', '', 3000, generic_img),
  (tabasco_id, cat_sandwich, 'سندويش فاهيتا دجاج', '', 3500, generic_img),
  (tabasco_id, cat_sandwich, 'سندويش سكالوب', '', 3500, generic_img);

  -- Insert Products for 'الشاورما'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_shawarma, 'صاج دجاج كلاسك', '', 2000, generic_img),
  (tabasco_id, cat_shawarma, 'صاج دجاج بالجبن', '', 3000, generic_img),
  (tabasco_id, cat_shawarma, 'صاج دجاج عربي', '', 2000, generic_img),
  (tabasco_id, cat_shawarma, 'شاورما دجاج صمون فرنسي', '', 2000, generic_img),
  (tabasco_id, cat_shawarma, 'نصف كيلو شاورما دجاج', '', 9000, generic_img),
  (tabasco_id, cat_shawarma, 'كيلو شاورما دجاج', '', 18000, generic_img);

  -- Insert Products for 'المقبلات والصوصات'
  INSERT INTO products (restaurant_id, category_id, title, description, price, image_url) VALUES
  (tabasco_id, cat_appetizers, 'مقبلات صغير', '', 1000, generic_img),
  (tabasco_id, cat_appetizers, 'مقبلات كبير', '', 2000, generic_img),
  (tabasco_id, cat_appetizers, 'صحن فنكر بالجبن', '', 1500, generic_img),
  (tabasco_id, cat_appetizers, 'ثومية', 'صوص', 500, generic_img),
  (tabasco_id, cat_appetizers, 'رانش', 'صوص', 500, generic_img),
  (tabasco_id, cat_appetizers, 'سبايسي', 'صوص', 500, generic_img),
  (tabasco_id, cat_appetizers, 'ببسي', 'مشروب', 500, generic_img);

END $$;
