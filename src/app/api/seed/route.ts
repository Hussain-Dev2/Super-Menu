import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if we have any categories already
    const { count, error: countError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    if (count === 0) {
      console.log('Seeding Shawarma Nazo Land Menu...');
      
      // First, ensure a restaurant exists to link everything to
      const restaurantId = 'b1234567-89ab-cdef-0123-456789abcdef'; // Use the same ID as in the SQL seed
      
      const { error: restError } = await supabase
        .from('restaurants')
        .upsert({
          id: restaurantId,
          slug: 'shawarma-nazo-land',
          name: 'شاورما نازو لاند',
          whatsapp_number: '+9647700000000',
          theme_config: { primary_color: '#e11d48', secondary_color: '#ffffff', font: 'Cairo' }
        });

      if (restError) throw restError;

      const seedData = [
        { name: 'وجبات الصاج', items: [
          { title: 'وجبة صاج دجاج', description: 'صاج+فنكر+ثومية', price: 5000 },
          { title: 'وجبة صاج مشكل نازو لاند', description: 'صاج+فنكر+ثومية+طرشي', price: 9000 },
          { title: 'وجبة صاج عائلي', description: 'صاج+فنكر+ثومية+طرشي', price: 12000 },
          { title: 'وجبة صاج بالجبن عائلي', description: 'صاج بالجبن+فنكر+ثومية+طرشي', price: 16500 },
        ]},
        { name: 'البيتزا', items: [
          { title: 'بيتزا دجاج', description: 'وسط', price: 8000 },
          { title: 'بيتزا الفصول الأربعة', description: 'وسط', price: 8000 },
          { title: 'بيتزا محشية الأطراف', description: 'كبير', price: 12000 },
        ]},
      ];

      for (const [index, catData] of seedData.entries()) {
        const { data: category, error: catError } = await supabase
          .from('categories')
          .insert({
            restaurant_id: restaurantId,
            name: catData.name,
            order_index: index
          })
          .select()
          .single();

        if (catError) throw catError;

        const productsToInsert = catData.items.map(item => ({
          ...item,
          restaurant_id: restaurantId,
          category_id: category.id,
          image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60'
        }));

        const { error: prodError } = await supabase
          .from('products')
          .insert(productsToInsert);

        if (prodError) throw prodError;
      }
      
      return NextResponse.json({ success: true, message: 'Database seeded correctly.' });
    }
    return NextResponse.json({ success: true, message: 'Already seeded.' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

