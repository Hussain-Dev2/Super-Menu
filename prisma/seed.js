require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Tabasco Al-Sham Menu...');

  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  const categories = [
    { name: 'وجبات الصاج', items: [
      { name: 'وجبة صاج دجاج', desc: 'صاج+فنكر+ثومية', price: 5000 },
      { name: 'وجبة صاج مشكل تباسكو الشام', desc: 'صاج+فنكر+ثومية+طرشي', price: 9000 },
      { name: 'وجبة صاج عائلي', desc: 'صاج+فنكر+ثومية+طرشي', price: 12000 },
      { name: 'وجبة صاج بالجبن عائلي', desc: 'صاج بالجبن+فنكر+ثومية+طرشي', price: 16500 },
    ]},
    { name: 'البيتزا', items: [
      { name: 'بيتزا دجاج', desc: 'وسط', price: 8000 },
      { name: 'بيتزا خضار', desc: 'وسط', price: 7000 },
      { name: 'بيتزا بپروني', desc: 'وسط', price: 7000 },
      { name: 'بيتزا الفصول الأربعة', desc: 'وسط', price: 8000 },
      { name: 'بيتزا محشية الأطراف', desc: 'كبير', price: 12000 },
    ]},
    { name: 'لغم وفطائر', items: [
      { name: 'لغم دجاج تباسكو الشام', desc: '', price: 5000 },
      { name: 'لغم لحم', desc: '', price: 6000 },
      { name: 'عروسة دجاج بالجبن', desc: '', price: 4000 },
      { name: 'فطيرة دجاج', desc: '', price: 6000 },
      { name: 'فطيرة خضار', desc: '', price: 5000 },
      { name: 'فطيرة لحم', desc: '', price: 6000 },
    ]},
    { name: 'البركر', items: [
      { name: 'بركر لحم كلاسك', desc: '', price: 2500 },
      { name: 'بركر لحم بالجبن', desc: '', price: 3000 },
      { name: 'بركر لحم مكسيكانو', desc: '', price: 3000 },
      { name: 'بركر لحم دبل', desc: '', price: 5000 },
      { name: 'بركر دجاج كلاسك', desc: '', price: 2000 },
      { name: 'بركر دجاج بالجبن', desc: '', price: 2500 },
      { name: 'بركر دجاج دبل', desc: '', price: 4500 },
      { name: 'بركر دبل لحم تباسكو الشام', desc: '', price: 4000 },
      { name: 'بركر دجاج تباسكو الشام', desc: '', price: 3500 },
    ]},
    { name: 'الريزو', items: [
      { name: 'ريزو كلاسك', desc: '', price: 5000 },
      { name: 'ريزو جبن', desc: '', price: 5000 },
      { name: 'ريزو مدخن', desc: '', price: 5000 },
      { name: 'ريزو شاورما دجاج', desc: '', price: 5000 },
      { name: 'ريزو دبل تباسكو الشام', desc: '', price: 8000 },
    ]},
    { name: 'الدجاج المقرمش', items: [
      { name: 'ستربس 4 قطع', desc: 'صوص+صمون+فنكر+كاتشب+مايونيز+ثومية', price: 5000 },
      { name: 'ستربس عائلي', desc: 'ببسي وسط+صمون+فنكر+صوص+كاتشب+مايونيز+ثومية', price: 10000 },
      { name: 'وجبة كنتاكي 3 قطع', desc: 'صمون+فنكر+صوص+كاتشب+مايونيز+ثومية', price: 6000 },
      { name: 'وجبة كنتاكي عائلي', desc: '12 قطعة', price: 20000 },
    ]},
    { name: 'السندويش', items: [
      { name: 'سندويش زنجر', desc: '', price: 3000 },
      { name: 'تويستر', desc: '', price: 3000 },
      { name: 'سندويش فاهيتا دجاج', desc: '', price: 3500 },
      { name: 'سندويش سكالوب', desc: '', price: 3500 },
    ]},
    { name: 'الشاورما', items: [
      { name: 'صاج دجاج كلاسك', desc: '', price: 2000 },
      { name: 'صاج دجاج بالجبن', desc: '', price: 3000 },
      { name: 'صاج دجاج عربي', desc: '', price: 2000 },
      { name: 'شاورما دجاج صمون فرنسي', desc: '', price: 2000 },
      { name: 'نصف كيلو شاورما دجاج', desc: '', price: 9000 },
      { name: 'كيلو شاورما دجاج', desc: '', price: 18000 },
    ]},
    { name: 'المقبلات والصوصات', items: [
      { name: 'مقبلات صغير', desc: '', price: 1000 },
      { name: 'مقبلات كبير', desc: '', price: 2000 },
      { name: 'صحن فنكر بالجبن', desc: '', price: 1500 },
      { name: 'ثومية', desc: 'صوص', price: 500 },
      { name: 'رانش', desc: 'صوص', price: 500 },
      { name: 'سبايسي', desc: 'صوص', price: 500 },
      { name: 'ببسي', desc: 'مشروب', price: 500 },
    ]},
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
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' // generic placeholder
        }
      });
    }
  }

  await prisma.settings.upsert({
    where: { id: "global" },
    update: {
      openTime: "14:30",
      closeTime: "01:30",
      openDays: "1,2,3,4,5,6,0",
      isOpen: true
    },
    create: {
      id: "global",
      openTime: "14:30",
      closeTime: "01:30",
      openDays: "1,2,3,4,5,6,0",
      isOpen: true
    }
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
