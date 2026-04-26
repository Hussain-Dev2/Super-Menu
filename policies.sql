-- ==========================================
-- ENABLE READING FOR EVERYONE (PUBLIC ACCESS)
-- ==========================================

-- 1. السماح بقراءة الأقسام
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "الاقسام مرئية للجميع" ON categories;
CREATE POLICY "الاقسام مرئية للجميع" 
ON categories FOR SELECT 
USING (true);

-- 2. السماح بقراءة المنتجات
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "المنتجات مرئية للجميع" ON products;
CREATE POLICY "المنتجات مرئية للجميع" 
ON products FOR SELECT 
USING (true);
