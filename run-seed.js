const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://qrzvjmxnablsncgqndxs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenZqbXhuYWJsc25jZ3FuZHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzYyNTQsImV4cCI6MjA5MjAxMjI1NH0.zTIQEszWmzSgKfi7gn1vaYkxKXAXTrduNIykZb40NK8'
);

const RESTAURANT_ID = 'fd9eff59-171b-43db-a583-56d5f934529a';

async function seed() {
  console.log('🚀 Seeding Shawarma Nazo Land...');

  // 1. Upsert restaurant
  const { error: rErr } = await supabase.from('restaurants').upsert({
    id: RESTAURANT_ID,
    slug: 'shawarma-nazo-land',
    name: 'شاورما نازو لاند',
    whatsapp_number: '+9647719933131',
    theme_config: { primary_color: '#00ca72', secondary_color: '#ffffff', font: 'Inter' }
  });
  if (rErr) { console.error('Restaurant error:', rErr.message); return; }
  console.log('✅ Restaurant inserted');

  // 2. Categories
  const categories = [
    { id: '5dc0a4c0-f9a3-4e24-a6f2-d8ec2716c986', name: 'شاورما', order_index: 0 },
    { id: 'bd574f51-b1d2-4a37-aaea-3c1721af4d22', name: 'سناكات', order_index: 1 },
    { id: '9302c86b-261a-43ce-a696-4c46423d721f', name: 'كرسبي', order_index: 2 },
    { id: 'ffb0a97b-7103-4cfa-8f58-89da51527ffb', name: 'بيتزا', order_index: 3 },
    { id: '68793007-a74f-48c3-94bb-04f7f55f0f8e', name: 'بركر', order_index: 4 },
    { id: '78105b2e-c27a-4a2a-b5f8-15a2387dd8b3', name: 'ريزو', order_index: 5 },
    { id: '731e63bf-e27f-4de3-9e0f-4571cc4963a5', name: 'اطباق المقرمشات', order_index: 6 },
    { id: '4717a5b7-f237-409d-8f85-63d8338b4921', name: 'بطاطا', order_index: 7 },
    { id: 'd3c803aa-bbb0-4918-be24-87319deb3e3f', name: 'مقبلات', order_index: 8 },
    { id: 'a9458164-37b7-47ef-ba27-f978ad3935cb', name: 'مشروبات', order_index: 9 },
    { id: '2819f273-78f5-43d3-85c6-6346f9796f21', name: 'الجديد والقسم الخاص', order_index: 10 },
  ];

  const { error: cErr } = await supabase.from('categories').upsert(
    categories.map(c => ({ ...c, restaurant_id: RESTAURANT_ID }))
  );
  if (cErr) { console.error('Categories error:', cErr.message); return; }
  console.log('✅ Categories inserted');

  // 3. Products
  const img = {
    shawarma: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60',
    shawarmaExtra: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=60',
    crispy: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    burgerSpicy: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60',
    rice: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60',
    fries: 'https://images.unsplash.com/photo-1630384066252-19e1ad95b4f8?w=500&auto=format&fit=crop&q=60',
    apps: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60',
    drinks: 'https://images.unsplash.com/photo-1622483767028-3f66f34a50f4?w=500&auto=format&fit=crop&q=60',
    snacks: 'https://images.unsplash.com/photo-1501238298269-fb2c428a1ea5?w=500&auto=format&fit=crop&q=60',
    twister: 'https://images.unsplash.com/photo-1628815874207-5502ca0b355d?w=500&auto=format&fit=crop&q=60',
    pizzaBbr: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
    pizzaVeg: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&auto=format&fit=crop&q=60',
    pizzaMarg: 'https://images.unsplash.com/photo-1573821663912-5b99042adbb6?w=500&auto=format&fit=crop&q=60',
    healthy: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    sauce: 'https://images.unsplash.com/photo-1582233543660-5f65342d069b?w=500&auto=format&fit=crop&q=60',
    friesCheese: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60',
    water: 'https://images.unsplash.com/photo-1559839914-17aae19cea9e?w=500&auto=format&fit=crop&q=60',
  };

  const CAT = (name) => categories.find(c => c.name === name)?.id;

  const products = [
    // شاورما
    { id: '4d4cb5cf-cd6e-4c48-a00e-18a2504bf477', category_id: CAT('شاورما'), title: 'شاورما عربي كبس', price: 2000, description: 'شرائح شاورما + ثومية + مخلل', image_url: img.shawarma },
    { id: '47c50b1c-d31a-4756-a264-fcca37a0d6c0', category_id: CAT('شاورما'), title: 'شاورما عربي سبايسي', price: 2500, description: 'شرائح شاورما + ثومية + مخلل + هلابينو', image_url: img.shawarma },
    { id: '672d4561-748b-4da9-80bf-d16c6c68c835', category_id: CAT('شاورما'), title: 'شاورما صمون فرنسي', price: 2000, description: 'شرائح شاورما + ثومية + مخلل + خس', image_url: img.shawarma },
    { id: '5c7b5e60-6cc7-4040-8580-79da387c6a69', category_id: CAT('شاورما'), title: 'شاورما صمون فرنسي سبايسي', price: 2500, description: 'شرائح شاورما + ثومية + مخلل + هلابينو', image_url: img.shawarma },
    { id: '901dc838-5861-45a0-b11e-52aaa002bc9e', category_id: CAT('شاورما'), title: 'وجبة شاورما عربي', price: 5000, description: 'شاورما مقطعة + ثومية + مخلل + فنكر', image_url: img.shawarma },
    { id: '748a863c-969b-49c2-a8d6-b1562d88e1f7', category_id: CAT('شاورما'), title: 'شاورما اكسترا', price: 4000, description: 'شرائح شاورما + جبنة موزاريلا + فطر + ثومية', image_url: img.shawarmaExtra },
    { id: '63a5dfbf-8d3d-49f9-b7cf-9dfb91b64566', category_id: CAT('شاورما'), title: 'شاورما فرط', price: 5000, description: 'ربع كيلو شاورما + مخلل + ثومية + فنكر', image_url: img.shawarma },
    // سناكات
    { id: '0057e0fe-c270-42bd-a76f-ae770150edee', category_id: CAT('سناكات'), title: 'ساندويش فاهيتا لحم', price: 3500, description: 'شرائح لحم + فطر + فليفلة + بصل + صوص', image_url: img.snacks },
    { id: '0fddce69-e46d-43e9-8beb-dc824d7ac8ad', category_id: CAT('سناكات'), title: 'ساندويش مكسيكانو لحم', price: 3500, description: 'شرائح لحم + فطر + فليفلة + هلابينو', image_url: img.snacks },
    { id: 'a4a0ce59-c7f2-40d2-82c7-13f35f438ce0', category_id: CAT('سناكات'), title: 'ساندويش فاهيتا دجاج', price: 3000, description: 'شرائح دجاج + فطر + فليفلة + بصل + صوص', image_url: img.snacks },
    { id: 'bdd32677-7933-416d-98ee-9e5c1a0c23d6', category_id: CAT('سناكات'), title: 'ساندويش مكسيكانو دجاج', price: 3000, description: 'شرائح دجاج + فطر + فليفلة + هلابينو', image_url: img.snacks },
    // كرسبي
    { id: 'd6e15980-17d5-4cf5-adf4-bd48df834359', category_id: CAT('كرسبي'), title: 'كرسبي كلاسيك', price: 2500, description: 'دجاج مقرمش + خس + طماطة + صوص', image_url: img.crispy },
    { id: '8c0830a0-992f-47d0-a0e6-4243f96489d9', category_id: CAT('كرسبي'), title: 'كرسبي بالجبن', price: 3000, description: 'دجاج مقرمش + خس + طماطة + جبن شيدر', image_url: img.crispy },
    { id: '8078c169-6f77-4b67-ac3d-490ef27a635b', category_id: CAT('كرسبي'), title: 'زنجر كلاسيك', price: 2500, description: 'دجاج مقرمش حار + خس + طماطة + صوص', image_url: img.crispy },
    { id: '1382fdd3-0f6d-4779-b34b-7b9352fcd7d5', category_id: CAT('كرسبي'), title: 'تويستر', price: 3000, description: 'خبز صاج + دجاج مقرمش + خس + جبن شيدر', image_url: img.twister },
    { id: '870389b0-7f93-4886-a608-84ea8ac67457', category_id: CAT('كرسبي'), title: 'سكالوب دجاج', price: 3000, description: 'قطعة دجاج مقرمشة + خس + طماطة + فنكر + كولسلو', image_url: img.crispy },
    // بيتزا
    { id: '9770d5d3-d801-4f8c-9669-cbbe1f1525ea', category_id: CAT('بيتزا'), title: 'بيتزا لحم', price: 6000, description: 'لحم طازج مع الجبن والخضروات', image_url: img.pizza },
    { id: '36014a3c-26fb-42f3-b513-28ef730432ac', category_id: CAT('بيتزا'), title: 'بيتزا دجاج', price: 5000, description: 'دجاج مشوي مع الجبن والخضروات', image_url: img.pizza },
    { id: '72ba9b87-1753-464e-94ad-29f61541de2b', category_id: CAT('بيتزا'), title: 'بيتزا ببروني', price: 5000, description: 'ببروني بقري مع الجبن', image_url: img.pizzaBbr },
    { id: 'ee8dbd73-9c0f-42ac-88e6-e1362d308e85', category_id: CAT('بيتزا'), title: 'بيتزا خضار', price: 5000, description: 'تشكيلة خضروات طازجة مع الجبن', image_url: img.pizzaVeg },
    { id: 'ba5958d9-499d-47cc-a36e-0e9352997e5a', category_id: CAT('بيتزا'), title: 'بيتزا ماكريتا', price: 5000, description: 'صلصة طماطم وجبنة موزاريلا', image_url: img.pizzaMarg },
    { id: 'e236aaf9-b63f-490e-8bf1-112bd1267f87', category_id: CAT('بيتزا'), title: 'بيتزا نازولاند', price: 6000, description: 'خلطة نازولاند الخاصة والمميزة', image_url: img.pizza },
    // بركر
    { id: 'd4d39c15-4c7e-425b-8ee1-a985a748b794', category_id: CAT('بركر'), title: 'كلاسيك بركر', price: 3000, description: 'قطعة لحم + خس + طماطة + صوص + بصل مكرمل', image_url: img.burger },
    { id: '7a140c68-804f-4f62-b11f-388cdebe8092', category_id: CAT('بركر'), title: 'تشيز بركر', price: 3500, description: 'قطعة لحم + خس + طماطة + جبن شيدر + بصل مكرمل', image_url: img.burger },
    { id: '3c424633-3a1f-43ab-8c7e-87fbf955eb5c', category_id: CAT('بركر'), title: 'بركر سبايسي', price: 3500, description: 'قطعة لحم + طماطة + خس + بصل مكرمل + هلابينو', image_url: img.burgerSpicy },
    { id: 'f6bcc97e-81b6-43b5-b146-24b2c1888526', category_id: CAT('بركر'), title: 'بركر مشروم', price: 4000, description: 'قطعة لحم + خس + طماطة + فطر بالكريمية', image_url: img.burger },
    { id: '058b4349-a338-401a-9fa6-8841ac786df9', category_id: CAT('بركر'), title: 'بركر نازولاند', price: 5000, description: 'قطعة لحم دبل + خس + طماطة + جبن شيدر + بصل مكرمل', image_url: img.burgerSpicy },
    // ريزو
    { id: '460573aa-7303-4987-8930-35db59d4123d', category_id: CAT('ريزو'), title: 'ريزو كلاسيك', price: 5000, description: 'رز + قطع دجاج مقرمش + صوص', image_url: img.rice },
    { id: 'fab729a6-8d3d-41e5-9292-d77a3e3d458d', category_id: CAT('ريزو'), title: 'ريزو شاورما', price: 5000, description: 'رز + شرائح شاورما + صوص', image_url: img.rice },
    { id: '8e28bf7d-2007-44b4-9de0-8ef8a738f21d', category_id: CAT('ريزو'), title: 'ريزو هني ماستر', price: 5500, description: 'رز + قطع دجاج مقرمش + صوص هني ماستر', image_url: img.rice },
    { id: '4178128d-c3fb-4d55-b006-964e0468cc3b', category_id: CAT('ريزو'), title: 'ريزو مدخن', price: 5500, description: 'رز + قطع دجاج مقرمش + صوص باربيكيو', image_url: img.rice },
    { id: 'd34e8a0d-3ddc-492e-921e-9ea659118aaa', category_id: CAT('ريزو'), title: 'ريزو جبن', price: 5500, description: 'رز + قطع دجاج مقرمش + جبن + صوص', image_url: img.rice },
    { id: '3deccbe6-c038-4cf1-b6f0-ffe32fea9deb', category_id: CAT('ريزو'), title: 'ريزو سبايسي', price: 5000, description: 'رز + قطع دجاج مقرمش + سبايسي صوص', image_url: img.rice },
    { id: '85fa56e4-31c2-40eb-a88b-904a820bbf88', category_id: CAT('ريزو'), title: 'ريزو نازولاند', price: 6000, description: 'رز + شرائح دجاج + قطع دجاج + صوص + هلابينو', image_url: img.rice },
    // اطباق المقرمشات
    { id: 'c6323584-933e-471f-8a59-d6c0a635b50f', category_id: CAT('اطباق المقرمشات'), title: 'طبق زنجر مقرمش', price: 5000, description: 'قطع زنجر مقرمش 4 + صوص + فنكر + صمون', image_url: img.crispy },
    { id: 'c9cba1a4-a197-4b6c-871d-23cc742a567b', category_id: CAT('اطباق المقرمشات'), title: 'طبق زنجر عائلي', price: 7000, description: 'قطع زنجر دجاج 6 + صوص + فنكر + صمون', image_url: img.crispy },
    { id: '334e6770-fea9-472d-aa39-8f5c814a4f17', category_id: CAT('اطباق المقرمشات'), title: 'طبق اسكالوب دجاج', price: 6000, description: 'دجاج مقرمش + صوص + فنكر + صمون + كولسلو', image_url: img.crispy },
    { id: '5fcff03f-9058-499a-a829-83759b0e53d4', category_id: CAT('اطباق المقرمشات'), title: 'تندر هني ماستر', price: 5000, description: 'اصابع الدجاج المقرمش + صوص هني ماستر + فنكر', image_url: img.crispy },
    // بطاطا
    { id: 'd836a58c-247f-4c01-aa9e-70ffb0113b3b', category_id: CAT('بطاطا'), title: 'بطاطا صغير', price: 1000, description: 'صحن بطاطا مقلية صغير', image_url: img.fries },
    { id: '22c2e937-dd21-4f9a-a384-e9202213a5ab', category_id: CAT('بطاطا'), title: 'بطاطا كبير', price: 2000, description: 'صحن بطاطا مقلية كبير', image_url: img.fries },
    { id: '3433ff3b-539f-4971-81f7-749e67940c11', category_id: CAT('بطاطا'), title: 'بطاطا جبن وهليبينو', price: 2500, description: 'بطاطا مقلية مع الجبن والهلابينو', image_url: img.friesCheese },
    { id: '0ac07310-f8ac-453d-ab5e-fcff86bb3ce8', category_id: CAT('بطاطا'), title: 'ميكس البطاطا', price: 3500, description: 'تشكيلة بطاطا منوعة ومميزة', image_url: img.fries },
    // مقبلات
    { id: '32870bcc-0e15-460a-b13d-4a856de470b0', category_id: CAT('مقبلات'), title: 'مقبلات كبير', price: 3500, description: 'صحن مقبلات مشكل كبير', image_url: img.apps },
    { id: '362ca464-8b35-4316-8955-deebddab2af3', category_id: CAT('مقبلات'), title: 'مقبلات وسط', price: 2500, description: 'صحن مقبلات مشكل وسط', image_url: img.apps },
    { id: '1225bb2b-c9b2-4e15-8758-6e52833ec905', category_id: CAT('مقبلات'), title: 'مقبلات صغير', price: 1500, description: 'صحن مقبلات مشكل صغير', image_url: img.apps },
    { id: 'fc859ec2-3c06-4f5e-bb40-aeba335b6a18', category_id: CAT('مقبلات'), title: 'ورق عنب كبير', price: 4000, description: 'وجبة ورق عنب كبيرة', image_url: img.apps },
    { id: 'bc534891-244e-4fc0-8d13-a09f6f58de2e', category_id: CAT('مقبلات'), title: 'ورق عنب صغير', price: 2000, description: 'وجبة ورق عنب صغيرة', image_url: img.apps },
    // مشروبات
    { id: '7653ea2a-a761-4d83-80bf-f6b8da15f671', category_id: CAT('مشروبات'), title: 'ببسي', price: 500, description: 'قوطية', image_url: img.drinks },
    { id: '7baac585-19a6-452a-a0bf-0ed61ed13075', category_id: CAT('مشروبات'), title: 'سفن', price: 500, description: 'قوطية', image_url: img.drinks },
    { id: '4c8fb752-cce1-49dd-a345-4955c34d4422', category_id: CAT('مشروبات'), title: 'ميرندا', price: 500, description: 'قوطية', image_url: img.drinks },
    { id: '715aba7e-0af8-4f72-8a01-b307cb305323', category_id: CAT('مشروبات'), title: 'لبن', price: 500, description: 'كوب لبن', image_url: img.apps },
    { id: 'aa5c42a0-651e-4cdf-9597-6deb53b6b100', category_id: CAT('مشروبات'), title: 'مياه معدنية', price: 250, description: 'بطل ماء', image_url: img.water },
    // الجديد والقسم الخاص
    { id: '787578ee-0dd0-4779-8efd-4087f61e0e65', category_id: CAT('الجديد والقسم الخاص'), title: 'وجبة دايت', price: 5000, description: 'جديدنا وجبة دايت صحية', image_url: img.healthy },
    { id: '1b8a9423-bd6b-45cc-84a8-9eb9e931af0b', category_id: CAT('الجديد والقسم الخاص'), title: 'صلصات منوعة', price: 500, description: 'تشكيلة من صوصاتنا الخاصة', image_url: img.sauce },
  ];

  const { error: pErr } = await supabase.from('products').upsert(
    products.map(p => ({ ...p, restaurant_id: RESTAURANT_ID, is_available: true }))
  );
  if (pErr) { console.error('Products error:', pErr.message); return; }
  console.log(`✅ ${products.length} products inserted`);
  console.log('\n🎉 Seed complete! Menu is live at /shawarma-nazo-land');
  console.log('🔗 Restaurant ID:', RESTAURANT_ID);
}

seed();
