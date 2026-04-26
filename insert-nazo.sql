-- ==========================================
-- 1. INSERT RESTAURANT
-- ==========================================
INSERT INTO restaurants (id, slug, name, whatsapp_number, theme_config)
VALUES (
  'fd9eff59-171b-43db-a583-56d5f934529a', 
  'shawarma-nazo-land', 
  'شاورما نازو لاند', 
  '+9647719933131',
  '{"primary_color": "#00ca72", "secondary_color": "#ffffff", "font": "Inter"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. INSERT CATEGORIES
-- ==========================================
INSERT INTO categories (id, restaurant_id, name, order_index) VALUES
  ('5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'fd9eff59-171b-43db-a583-56d5f934529a', 'شاورما', 0),
  ('bd574f51-b1d2-4a37-aaea-3c1721af4d22', 'fd9eff59-171b-43db-a583-56d5f934529a', 'سناكات', 1),
  ('9302c86b-261a-43ce-a696-4c46423d721f', 'fd9eff59-171b-43db-a583-56d5f934529a', 'كرسبي', 2),
  ('ffb0a97b-7103-4cfa-8f58-89da51527ffb', 'fd9eff59-171b-43db-a583-56d5f934529a', 'بيتزا', 3),
  ('68793007-a74f-48c3-94bb-04f7f55f0f8e', 'fd9eff59-171b-43db-a583-56d5f934529a', 'بركر', 4),
  ('78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'fd9eff59-171b-43db-a583-56d5f934529a', 'ريزو', 5),
  ('731e63bf-e27f-4de3-9e0f-4571cc4963a5', 'fd9eff59-171b-43db-a583-56d5f934529a', 'اطباق المقرمشات', 6),
  ('4717a5b7-f237-409d-8f85-63d8338b4921', 'fd9eff59-171b-43db-a583-56d5f934529a', 'بطاطا', 7),
  ('d3c803aa-bbb0-4918-be24-87319deb3e3f', 'fd9eff59-171b-43db-a583-56d5f934529a', 'مقبلات', 8),
  ('a9458164-37b7-47ef-ba27-f978ad3935cb', 'fd9eff59-171b-43db-a583-56d5f934529a', 'مشروبات', 9),
  ('2819f273-78f5-43d3-85c6-6346f9796f21', 'fd9eff59-171b-43db-a583-56d5f934529a', 'الجديد والقسم الخاص', 10)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. INSERT PRODUCTS
-- ==========================================
INSERT INTO products (id, restaurant_id, category_id, title, price, description, image_url, is_available) VALUES
  -- شاورما
  ('4d4cb5cf-cd6e-4c48-a00e-18a2504bf477', 'fd9eff59-171b-43db-a583-56d5f934529a', '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'شاورما عربي كبس', 2000, 'شرائح شاورما + ثومية + مخلل', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60', true),
  ('47c50b1c-d31a-4756-a264-fcca37a0d6c0', 'fd9eff59-171b-43db-a583-56d5f934529a', '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'شاورما عربي سبايسي', 2500, 'شرائح شاورما + ثومية + مخلل + هلابينو', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60', true),
  ('672d4561-748b-4da9-80bf-d16c6c68c835', 'fd9eff59-171b-43db-a583-56d5f934529a', '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'شاورما صمون فرنسي', 2000, 'شرائح شاورما + ثومية + مخلل + خس', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60', true),
  ('5c7b5e60-6cc7-4040-8580-79da387c6a69', 'fd9eff59-171b-43db-a583-56d5f934529a', '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'شاورما صمون فرنسي سبايسي', 2500, 'شرائح شاورما + ثومية + مخلل + هلابينو', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60', true),
  ('901dc838-5861-45a0-b11e-52aaa002bc9e', 'fd9eff59-171b-43db-a583-56d5f934529a', '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'وجبة شاورما عربي', 5000, 'شاورما مقطعة + ثومية + مخلل + فنكر', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60', true),
  ('748a863c-969b-49c2-a8d6-b1562d88e1f7', 'fd9eff59-171b-43db-a583-56d5f934529a', '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'شاورما اكسترا', 4000, 'شرائح شاورما + جبنة موزاريلا + فطر + ثومية', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=60', true),
  ('63a5dfbf-8d3d-49f9-b7cf-9dfb91b64566', 'fd9eff59-171b-43db-a583-56d5f934529a', '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', 'شاورما فرط', 5000, 'ربع كيلو شاورما + مخلل + ثومية + فنكر', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60', true),
  
  -- سناكات
  ('0057e0fe-c270-42bd-a76f-ae770150edee', 'fd9eff59-171b-43db-a583-56d5f934529a', 'bd574f51-b1d2-4a37-aaea-3c1721af4d22', 'ساندويش فاهيتا لحم', 3500, 'شرائح لحم + فطر + فليفلة + بصل + صوص', 'https://images.unsplash.com/photo-1501238298269-fb2c428a1ea5?w=500&auto=format&fit=crop&q=60', true),
  ('0fddce69-e46d-43e9-8beb-dc824d7ac8ad', 'fd9eff59-171b-43db-a583-56d5f934529a', 'bd574f51-b1d2-4a37-aaea-3c1721af4d22', 'ساندويش مكسيكانو لحم', 3500, 'شرائح لحم + فطر + فليفلة + هلابينو', 'https://images.unsplash.com/photo-1501238298269-fb2c428a1ea5?w=500&auto=format&fit=crop&q=60', true),
  ('a4a0ce59-c7f2-40d2-82c7-13f35f438ce0', 'fd9eff59-171b-43db-a583-56d5f934529a', 'bd574f51-b1d2-4a37-aaea-3c1721af4d22', 'ساندويش فاهيتا دجاج', 3000, 'شرائح دجاج + فطر + فليفلة + بصل + صوص', 'https://images.unsplash.com/photo-1501238298269-fb2c428a1ea5?w=500&auto=format&fit=crop&q=60', true),
  ('bdd32677-7933-416d-98ee-9e5c1a0c23d6', 'fd9eff59-171b-43db-a583-56d5f934529a', 'bd574f51-b1d2-4a37-aaea-3c1721af4d22', 'ساندويش مكسيكانو دجاج', 3000, 'شرائح دجاج + فطر + فليفلة + هلابينو', 'https://images.unsplash.com/photo-1501238298269-fb2c428a1ea5?w=500&auto=format&fit=crop&q=60', true),

  -- كرسبي
  ('d6e15980-17d5-4cf5-adf4-bd48df834359', 'fd9eff59-171b-43db-a583-56d5f934529a', '9302c86b-261a-43ce-a696-4c46423d721f', 'كرسبي كلاسيك', 2500, 'دجاج مقرمش + خس + طماطة + صوص', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),
  ('8c0830a0-992f-47d0-a0e6-4243f96489d9', 'fd9eff59-171b-43db-a583-56d5f934529a', '9302c86b-261a-43ce-a696-4c46423d721f', 'كرسبي بالجبن', 3000, 'دجاج مقرمش + خس + طماطة + جبن شيدر', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),
  ('8078c169-6f77-4b67-ac3d-490ef27a635b', 'fd9eff59-171b-43db-a583-56d5f934529a', '9302c86b-261a-43ce-a696-4c46423d721f', 'زنجر كلاسيك', 2500, 'دجاج مقرمش حار + خس + طماطة + صوص', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),
  ('1382fdd3-0f6d-4779-b34b-7b9352fcd7d5', 'fd9eff59-171b-43db-a583-56d5f934529a', '9302c86b-261a-43ce-a696-4c46423d721f', 'تويستر', 3000, 'خبز صاج + دجاج مقرمش + خس + جبن شيدر', 'https://images.unsplash.com/photo-1628815874207-5502ca0b355d?w=500&auto=format&fit=crop&q=60', true),
  ('870389b0-7f93-4886-a608-84ea8ac67457', 'fd9eff59-171b-43db-a583-56d5f934529a', '9302c86b-261a-43ce-a696-4c46423d721f', 'سكالوب دجاج', 3000, 'قطعة دجاج مقرمشة + خس + طماطة + فنكر + كولسلو', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),

  -- بيتزا
  ('9770d5d3-d801-4f8c-9669-cbbe1f1525ea', 'fd9eff59-171b-43db-a583-56d5f934529a', 'ffb0a97b-7103-4cfa-8f58-89da51527ffb', 'بيتزا لحم', 6000, 'لحم طازج مع الجبن والخضروات', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60', true),
  ('36014a3c-26fb-42f3-b513-28ef730432ac', 'fd9eff59-171b-43db-a583-56d5f934529a', 'ffb0a97b-7103-4cfa-8f58-89da51527ffb', 'بيتزا دجاج', 5000, 'دجاج مشوي مع الجبن والخضروات', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60', true),
  ('72ba9b87-1753-464e-94ad-29f61541de2b', 'fd9eff59-171b-43db-a583-56d5f934529a', 'ffb0a97b-7103-4cfa-8f58-89da51527ffb', 'بيتزا ببروني', 5000, 'ببروني بقري مع الجبن', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60', true),
  ('ee8dbd73-9c0f-42ac-88e6-e1362d308e85', 'fd9eff59-171b-43db-a583-56d5f934529a', 'ffb0a97b-7103-4cfa-8f58-89da51527ffb', 'بيتزا خضار', 5000, 'تشكيلة خضروات طازجة مع الجبن', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&auto=format&fit=crop&q=60', true),
  ('ba5958d9-499d-47cc-a36e-0e9352997e5a', 'fd9eff59-171b-43db-a583-56d5f934529a', 'ffb0a97b-7103-4cfa-8f58-89da51527ffb', 'بيتزا ماكريتا', 5000, 'صلصة طماطم وجبنة موزاريلا', 'https://images.unsplash.com/photo-1573821663912-5b99042adbb6?w=500&auto=format&fit=crop&q=60', true),
  ('e236aaf9-b63f-490e-8bf1-112bd1267f87', 'fd9eff59-171b-43db-a583-56d5f934529a', 'ffb0a97b-7103-4cfa-8f58-89da51527ffb', 'بيتزا نازولاند', 6000, 'خلطة نازولاند الخاصة والمميزة', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60', true),

  -- بركر
  ('d4d39c15-4c7e-425b-8ee1-a985a748b794', 'fd9eff59-171b-43db-a583-56d5f934529a', '68793007-a74f-48c3-94bb-04f7f55f0f8e', 'كلاسيك بركر', 3000, 'قطعة لحم + خس + طماطة + صوص + بصل مكرمل', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', true),
  ('7a140c68-804f-4f62-b11f-388cdebe8092', 'fd9eff59-171b-43db-a583-56d5f934529a', '68793007-a74f-48c3-94bb-04f7f55f0f8e', 'تشيز بركر', 3500, 'قطعة لحم + خس + طماطة + جبن شيدر + بصل مكرمل', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', true),
  ('3c424633-3a1f-43ab-8c7e-87fbf955eb5c', 'fd9eff59-171b-43db-a583-56d5f934529a', '68793007-a74f-48c3-94bb-04f7f55f0f8e', 'بركر سبايسي', 3500, 'قطعة لحم + طماطة + خس + بصل مكرمل + هلابينو', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60', true),
  ('f6bcc97e-81b6-43b5-b146-24b2c1888526', 'fd9eff59-171b-43db-a583-56d5f934529a', '68793007-a74f-48c3-94bb-04f7f55f0f8e', 'بركر مشروم', 4000, 'قطعة لحم + خس + طماطة + فطر بالكريمية', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', true),
  ('058b4349-a338-401a-9fa6-8841ac786df9', 'fd9eff59-171b-43db-a583-56d5f934529a', '68793007-a74f-48c3-94bb-04f7f55f0f8e', 'بركر نازولاند', 5000, 'قطعة لحم دبل + خس + طماطة + جبن شيدر + بصل مكرمل', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60', true),

  -- ريزو
  ('460573aa-7303-4987-8930-35db59d4123d', 'fd9eff59-171b-43db-a583-56d5f934529a', '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'ريزو كلاسيك', 5000, 'رز + قطع دجاج مقرمش + صوص', 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60', true),
  ('fab729a6-8d3d-41e5-9292-d77a3e3d458d', 'fd9eff59-171b-43db-a583-56d5f934529a', '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'ريزو شاورما', 5000, 'رز + شرائح شاورما + صوص', 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60', true),
  ('8e28bf7d-2007-44b4-9de0-8ef8a738f21d', 'fd9eff59-171b-43db-a583-56d5f934529a', '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'ريزو هني ماستر', 5500, 'رز + قطع دجاج مقرمش + صوص هني ماستر', 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60', true),
  ('4178128d-c3fb-4d55-b006-964e0468cc3b', 'fd9eff59-171b-43db-a583-56d5f934529a', '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'ريزو مدخن', 5500, 'رز + قطع دجاج مقرمش + صوص باربيكيو', 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60', true),
  ('d34e8a0d-3ddc-492e-921e-9ea659118aaa', 'fd9eff59-171b-43db-a583-56d5f934529a', '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'ريزو جبن', 5500, 'رز + قطع دجاج مقرمش + جبن + صوص', 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60', true),
  ('3deccbe6-c038-4cf1-b6f0-ffe32fea9deb', 'fd9eff59-171b-43db-a583-56d5f934529a', '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'ريزو سبايسي', 5000, 'رز + قطع دجاج مقرمش + سبايسي صوص', 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60', true),
  ('85fa56e4-31c2-40eb-a88b-904a820bbf88', 'fd9eff59-171b-43db-a583-56d5f934529a', '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', 'ريزو نازولاند', 6000, 'رز + شرائح دجاج + قطع دجاج + صوص + هلابينو', 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60', true),

  -- اطباق المقرمشات
  ('c6323584-933e-471f-8a59-d6c0a635b50f', 'fd9eff59-171b-43db-a583-56d5f934529a', '731e63bf-e27f-4de3-9e0f-4571cc4963a5', 'طبق زنجر مقرمش', 5000, 'قطع زنجر مقرمش 4 + صوص + فنكر + صمون', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),
  ('c9cba1a4-a197-4b6c-871d-23cc742a567b', 'fd9eff59-171b-43db-a583-56d5f934529a', '731e63bf-e27f-4de3-9e0f-4571cc4963a5', 'طبق زنجر عائلي', 7000, 'قطع زنجر دجاج 6 + صوص + فنكر + صمون', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),
  ('334e6770-fea9-472d-aa39-8f5c814a4f17', 'fd9eff59-171b-43db-a583-56d5f934529a', '731e63bf-e27f-4de3-9e0f-4571cc4963a5', 'طبق اسكالوب دجاج', 6000, 'دجاج مقرمش + صوص + فنكر + صمون + كولسلو', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),
  ('5fcff03f-9058-499a-a829-83759b0e53d4', 'fd9eff59-171b-43db-a583-56d5f934529a', '731e63bf-e27f-4de3-9e0f-4571cc4963a5', 'تندر هني ماستر', 5000, 'اصابع الدجاج المقرمش + صوص هني ماستر + فنكر', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60', true),

  -- بطاطا
  ('d836a58c-247f-4c01-aa9e-70ffb0113b3b', 'fd9eff59-171b-43db-a583-56d5f934529a', '4717a5b7-f237-409d-8f85-63d8338b4921', 'بطاطا صغير', 1000, 'صحن بطاطا مقلية صغير', 'https://images.unsplash.com/photo-1630384066252-19e1ad95b4f8?w=500&auto=format&fit=crop&q=60', true),
  ('22c2e937-dd21-4f9a-a384-e9202213a5ab', 'fd9eff59-171b-43db-a583-56d5f934529a', '4717a5b7-f237-409d-8f85-63d8338b4921', 'بطاطا كبير', 2000, 'صحن بطاطا مقلية كبير', 'https://images.unsplash.com/photo-1630384066252-19e1ad95b4f8?w=500&auto=format&fit=crop&q=60', true),
  ('3433ff3b-539f-4971-81f7-749e67940c11', 'fd9eff59-171b-43db-a583-56d5f934529a', '4717a5b7-f237-409d-8f85-63d8338b4921', 'بطاطا جبن وهليبينو', 2500, 'بطاطا مقلية مع الجبن والهلابينو', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60', true),
  ('0ac07310-f8ac-453d-ab5e-fcff86bb3ce8', 'fd9eff59-171b-43db-a583-56d5f934529a', '4717a5b7-f237-409d-8f85-63d8338b4921', 'ميكس البطاطا', 3500, 'تشكيلة بطاطا منوعة ومميزة', 'https://images.unsplash.com/photo-1630384066252-19e1ad95b4f8?w=500&auto=format&fit=crop&q=60', true),

  -- مقبلات
  ('32870bcc-0e15-460a-b13d-4a856de470b0', 'fd9eff59-171b-43db-a583-56d5f934529a', 'd3c803aa-bbb0-4918-be24-87319deb3e3f', 'مقبلات كبير', 3500, 'صحن مقبلات مشكل كبير', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60', true),
  ('362ca464-8b35-4316-8955-deebddab2af3', 'fd9eff59-171b-43db-a583-56d5f934529a', 'd3c803aa-bbb0-4918-be24-87319deb3e3f', 'مقبلات وسط', 2500, 'صحن مقبلات مشكل وسط', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60', true),
  ('1225bb2b-c9b2-4e15-8758-6e52833ec905', 'fd9eff59-171b-43db-a583-56d5f934529a', 'd3c803aa-bbb0-4918-be24-87319deb3e3f', 'مقبلات صغير', 1500, 'صحن مقبلات مشكل صغير', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60', true),
  ('fc859ec2-3c06-4f5e-bb40-aeba335b6a18', 'fd9eff59-171b-43db-a583-56d5f934529a', 'd3c803aa-bbb0-4918-be24-87319deb3e3f', 'ورق عنب كبير', 4000, 'وجبة ورق عنب كبيرة', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60', true),
  ('bc534891-244e-4fc0-8d13-a09f6f58de2e', 'fd9eff59-171b-43db-a583-56d5f934529a', 'd3c803aa-bbb0-4918-be24-87319deb3e3f', 'ورق عنب صغير', 2000, 'وجبة ورق عنب صغيرة', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60', true),

  -- مشروبات
  ('7653ea2a-a761-4d83-80bf-f6b8da15f671', 'fd9eff59-171b-43db-a583-56d5f934529a', 'a9458164-37b7-47ef-ba27-f978ad3935cb', 'ببسي', 500, 'قوطية', 'https://images.unsplash.com/photo-1622483767028-3f66f34a50f4?w=500&auto=format&fit=crop&q=60', true),
  ('7baac585-19a6-452a-a0bf-0ed61ed13075', 'fd9eff59-171b-43db-a583-56d5f934529a', 'a9458164-37b7-47ef-ba27-f978ad3935cb', 'سفن', 500, 'قوطية', 'https://images.unsplash.com/photo-1622483767028-3f66f34a50f4?w=500&auto=format&fit=crop&q=60', true),
  ('4c8fb752-cce1-49dd-a345-4955c34d4422', 'fd9eff59-171b-43db-a583-56d5f934529a', 'a9458164-37b7-47ef-ba27-f978ad3935cb', 'ميرندا', 500, 'قوطية', 'https://images.unsplash.com/photo-1622483767028-3f66f34a50f4?w=500&auto=format&fit=crop&q=60', true),
  ('715aba7e-0af8-4f72-8a01-b307cb305323', 'fd9eff59-171b-43db-a583-56d5f934529a', 'a9458164-37b7-47ef-ba27-f978ad3935cb', 'لبن', 500, 'كوب لبن', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60', true),
  ('aa5c42a0-651e-4cdf-9597-6deb53b6b100', 'fd9eff59-171b-43db-a583-56d5f934529a', 'a9458164-37b7-47ef-ba27-f978ad3935cb', 'مياه معدنية', 250, 'بطل ماء', 'https://images.unsplash.com/photo-1559839914-17aae19cea9e?w=500&auto=format&fit=crop&q=60', true),

  -- الجديد والقسم الخاص
  ('787578ee-0dd0-4779-8efd-4087f61e0e65', 'fd9eff59-171b-43db-a583-56d5f934529a', '2819f273-78f5-43d3-85c6-6346f9796f21', 'وجبة دايت', 5000, 'جديدنا وجبة دايت صحية', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60', true),
  ('1b8a9423-bd6b-45cc-84a8-9eb9e931af0b', 'fd9eff59-171b-43db-a583-56d5f934529a', '2819f273-78f5-43d3-85c6-6346f9796f21', 'صلصات منوعة', 500, 'تشكيلة من صوصاتنا الخاصة', 'https://images.unsplash.com/photo-1582233543660-5f65342d069b?w=500&auto=format&fit=crop&q=60', true)
ON CONFLICT (id) DO NOTHING;
