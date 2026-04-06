import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categoryCount = await prisma.category.count();
    
    if (categoryCount === 0) {
      console.log('Seeding Shawarma Nazo Land Menu...');
      
      const categories = [
        { name: 'وجبات الصاج', items: [
          { name: 'وجبة صاج دجاج', desc: 'صاج+فنكر+ثومية', price: 5000 },
          { name: 'وجبة صاج مشكل نازو لاند', desc: 'صاج+فنكر+ثومية+طرشي', price: 9000 },
          { name: 'وجبة صاج عائلي', desc: 'صاج+فنكر+ثومية+طرشي', price: 12000 },
          { name: 'وجبة صاج بالجبن عائلي', desc: 'صاج بالجبن+فنكر+ثومية+طرشي', price: 16500 },
        ]},
        { name: 'البيتزا', items: [
          { name: 'بيتزا دجاج', desc: 'وسط', price: 8000 },
          { name: 'بيتزا الفصول الأربعة', desc: 'وسط', price: 8000 },
          { name: 'بيتزا محشية الأطراف', desc: 'كبير', price: 12000 },
        ]},
        { name: 'البركر', items: [
          { name: 'بركر لحم كلاسك', desc: '', price: 2500 },
          { name: 'بركر دجاج بالجبن', desc: '', price: 2500 },
          { name: 'بركر دبل لحم نازو لاند', desc: '', price: 4000 },
        ]},
        { name: 'الريزو', items: [
          { name: 'ريزو كلاسك', desc: '', price: 5000 },
          { name: 'ريزو دبل نازو لاند', desc: '', price: 8000 },
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
              imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60'
            }
          });
        }
      }
      return NextResponse.json({ success: true, message: 'Database seeded correctly.' });
    }
    return NextResponse.json({ success: true, message: 'Already seeded.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
