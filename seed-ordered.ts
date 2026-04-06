import prisma from './src/lib/prisma';

async function seed() {
  try {
    console.log('Seeding Shawarma Nazo Land Menu...');
    
    // Clear existing
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    const categories = [
      {
        name: 'شاورما',
        items: [
          { name: 'شاورما عربي كبس', desc: 'شرائح شاورما + ثومية + مخلل', price: 2000, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60' },
          { name: 'شاورما عربي سبايسي', desc: 'شرائح شاورما + ثومية + مخلل + هلابينو', price: 2500, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60' },
          { name: 'شاورما صمون فرنسي', desc: 'شرائح شاورما + ثومية + مخلل + خس', price: 2000, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60' },
          { name: 'شاورما صمون فرنسي سبايسي', desc: 'شرائح شاورما + ثومية + مخلل + هلابينو', price: 2500, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60' },
          { name: 'وجبة شاورما عربي', desc: 'شاورما مقطعة + ثومية + مخلل + فنكر', price: 5000, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60' },
          { name: 'شاورما اكسترا', desc: 'شرائح شاورما + جبنة موزاريلا + فطر + ثومية + مخلل + ذرة', price: 4000, img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=60' },
          { name: 'شاورما فرط', desc: 'ربع كيلو شاورما + مخلل + ثومية + فنكر', price: 5000, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'سناكات',
        items: [
          { name: 'ساندويش فاهيتا لحم', desc: 'شرائح لحم + فطر + فليفلة + بصل + صوص', price: 3500, img: 'https://images.unsplash.com/photo-1501238298269-fb2c428a1ea5?w=500&auto=format&fit=crop&q=60' },
          { name: 'ساندويش مكسيكانو لحم', desc: 'شرائح لحم + فطر + فليفلة + بصل + صوص + هلابينو', price: 3500, img: 'https://images.unsplash.com/photo-1501238298269-fb2c428a1ea5?w=500&auto=format&fit=crop&q=60' },
          { name: 'ساندويش فاهيتا دجاج', desc: 'شرائح دجاج + فطر + فليفلة + بصل + صوص', price: 3000, img: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=500&auto=format&fit=crop&q=60' },
          { name: 'ساندويش مكسيكانو دجاج', desc: 'شرائح دجاج + فطر + فليفلة + بصل + صوص + هلابينو', price: 3000, img: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'كرسبي',
        items: [
          { name: 'كرسبي كلاسيك', desc: 'دجاج مقرمش + خس + طماطة + صوص', price: 2500, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: 'كرسبي بالجبن', desc: 'دجاج مقرمش + خس + طماطة + جبن شيدر + صوص', price: 3000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: 'زنجر كلاسيك', desc: 'دجاج مقرمش حار + خس + طماطة + صوص', price: 2500, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: 'تويستر', desc: 'خبز صاج + دجاج مقرمش + خس + جبن شيدر + فنكر', price: 3000, img: 'https://images.unsplash.com/photo-1628815874207-5502ca0b355d?w=500&auto=format&fit=crop&q=60' },
          { name: 'سكالوب دجاج', desc: 'قطعة دجاج مقرمشة + خس + طماطة + فنكر + كولسلو + صوص', price: 3000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'بيتزا',
        items: [
          { name: 'بيتزا لحم', desc: 'لحم طازج مع الجبن والخضروات', price: 6000, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60' },
          { name: 'بيتزا دجاج', desc: 'دجاج مشوي مع الجبن والخضروات', price: 5000, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60' },
          { name: 'بيتزا ببروني', desc: 'ببروني بقري مع الجبن', price: 5000, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60' },
          { name: 'بيتزا خضار', desc: 'تشكيلة خضروات طازجة مع الجبن', price: 5000, img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&auto=format&fit=crop&q=60' },
          { name: 'بيتزا ماكريتا', desc: 'صلصة طماطم وجبنة موزاريلا', price: 5000, img: 'https://images.unsplash.com/photo-1573821663912-5b99042adbb6?w=500&auto=format&fit=crop&q=60' },
          { name: 'بيتزا نازولاند', desc: 'خلطة نازولاند الخاصة والمميزة', price: 6000, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'بركر',
        items: [
          { name: 'كلاسيك بركر', desc: 'قطعة لحم + خس + طماطة + صوص + بصل مكرمل', price: 3000, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'تشيز بركر', desc: 'قطعة لحم + خس + طماطة + جبن شيدر + بصل مكرمل + صوص', price: 3500, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'بركر سبايسي', desc: 'قطعة لحم + طماطة + خس + صوص + بصل مكرمل + هلابينو', price: 3500, img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60' },
          { name: 'بركر مشروم', desc: 'قطعة لحم + خس + طماطة + فطر بالكريمية + صوص', price: 4000, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'بركر نازولاند', desc: 'قطعة لحم دبل + خس + طماطة + جبن شيدر + بصل مكرمل', price: 5000, img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'ريزو',
        items: [
          { name: 'ريزو كلاسيك', desc: 'رز + قطع دجاج مقرمش + صوص', price: 5000, img: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'ريزو شاورما', desc: 'رز + شرائح شاورما + صوص', price: 5000, img: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'ريزو هني ماستر', desc: 'رز + قطع دجاج مقرمش + صوص هني ماستر', price: 5500, img: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'ريزو مدخن', desc: 'رز + قطع دجاج مقرمش + صوص باربيكيو', price: 5500, img: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'ريزو جبن', desc: 'رز + قطع دجاج مقرمش + جبن + صوص', price: 5500, img: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'ريزو سبايسي', desc: 'رز + قطع دجاج مقرمش + صوص + سبايسي صوص', price: 5000, img: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60' },
          { name: 'ريزو نازولاند', desc: 'رز + شرائح دجاج + قطع دجاج + صوص + هلابينو', price: 6000, img: 'https://images.unsplash.com/photo-1512058560566-427a1bd5a5cd?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'اطباق المقرمشات',
        items: [
          { name: 'طبق زنجر مقرمش', desc: 'قطع زنجر مقرمش 4 + صوص + فنكر + صمون', price: 5000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: 'طبق زنجر عائلي', desc: 'قطع زنجر دجاج 6 + صوص + فنكر + صمون', price: 7000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: 'طبق اسكالوب دجاج', desc: 'دجاج مقرمش + صوص + فنكر + صمون + كولسلو', price: 6000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: 'تندر هني ماستر', desc: 'اصابع الدجاج المقرمش + صوص هني ماستر + فنكر', price: 5000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'بطاطا',
        items: [
          { name: 'بطاطا صغير', desc: 'صحن بطاطا مقلية صغير', price: 1000, img: 'https://images.unsplash.com/photo-1630384066252-19e1ad95b4f8?w=500&auto=format&fit=crop&q=60' },
          { name: 'بطاطا كبير', desc: 'صحن بطاطا مقلية كبير', price: 2000, img: 'https://images.unsplash.com/photo-1630384066252-19e1ad95b4f8?w=500&auto=format&fit=crop&q=60' },
          { name: 'بطاطا جبن وهليبينو', desc: 'بطاطا مقلية مع الجبن والهلابينو', price: 2500, img: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60' },
          { name: 'ميكس البطاطا', desc: 'تشكيلة بطاطا منوعة ومميزة', price: 3500, img: 'https://images.unsplash.com/photo-1630384066252-19e1ad95b4f8?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'مقبلات',
        items: [
          { name: 'مقبلات كبير', desc: 'صحن مقبلات مشكل كبير', price: 3500, img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60' },
          { name: 'مقبلات وسط', desc: 'صحن مقبلات مشكل وسط', price: 2500, img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60' },
          { name: 'مقبلات صغير', desc: 'صحن مقبلات مشكل صغير', price: 1500, img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60' },
          { name: 'ورق عنب كبير', desc: 'وجبة ورق عنب كبيرة', price: 4000, img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60' },
          { name: 'ورق عنب صغير', desc: 'وجبة ورق عنب صغيرة', price: 2000, img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'مشروبات',
        items: [
          { name: 'ببسي', desc: 'قوطية', price: 500, img: 'https://images.unsplash.com/photo-1622483767028-3f66f34a50f4?w=500&auto=format&fit=crop&q=60' },
          { name: 'سفن', desc: 'قوطية', price: 500, img: 'https://images.unsplash.com/photo-1622483767028-3f66f34a50f4?w=500&auto=format&fit=crop&q=60' },
          { name: 'ميرندا', desc: 'قوطية', price: 500, img: 'https://images.unsplash.com/photo-1622483767028-3f66f34a50f4?w=500&auto=format&fit=crop&q=60' },
          { name: 'لبن', desc: 'كوب لبن', price: 500, img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60' },
          { name: 'مياه معدنية', desc: 'بطل ماء', price: 250, img: 'https://images.unsplash.com/photo-1559839914-17aae19cea9e?w=500&auto=format&fit=crop&q=60' },
        ]
      },
      {
        name: 'الجديد والقسم الخاص',
        items: [
          { name: 'وجبة دايت', desc: 'جديدنا وجبة دايت صحية', price: 5000, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },
          { name: 'صلصات منوعة', desc: 'تشكيلة من صوصاتنا الخاصة', price: 500, img: 'https://images.unsplash.com/photo-1582233543660-5f65342d069b?w=500&auto=format&fit=crop&q=60' },
        ]
      }
    ];

    for (const catData of categories) {
      const category = await prisma.category.create({
        data: { name: catData.name }
      });

      for (const item of catData.items) {
        await prisma.product.create({
          data: {
            name: item.name,
            description: item.desc,
            price: item.price,
            categoryId: category.id,
            imageUrl: item.img
          }
        });
      }
      console.log(`Created: ${catData.name}`);
    }

    console.log('Seed Success!');
  } catch (e: any) {
    console.error('Seed Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
