import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ClientMenu from '@/components/ClientMenu'

export default async function RestaurantMenu({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { slug } = await params

  // Fetch restaurant
  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (restaurantError || !restaurant) {
    notFound()
  }

  // Fetch categories and products in parallel
  const [
    { data: categories },
    { data: products }
  ] = await Promise.all([
    supabase.from('categories').select('*').eq('restaurant_id', restaurant.id).order('order_index', { ascending: true }),
    supabase.from('products').select('*').eq('restaurant_id', restaurant.id)
  ])

  return (
    <div 
      style={{
        // Define custom CSS variables for Tailwind to pick up, or just use them inline
        '--color-primary': restaurant.theme_config?.primary_color || '#000',
        '--color-secondary': restaurant.theme_config?.secondary_color || '#fff',
        fontFamily: restaurant.theme_config?.font || 'Inter, sans-serif'
      } as React.CSSProperties}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      <ClientMenu 
        restaurant={restaurant} 
        categories={categories || []} 
        products={products || []} 
      />
    </div>
  )
}
