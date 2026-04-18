import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Find the restaurant linked to this user
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .single()
    
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">Your account is not linked to any restaurant. Please contact the administrator.</p>
        </div>
      </div>
    )
  }

  const restaurantId = userRole.restaurant_id

  const [
    { data: restaurant },
    { data: categories },
    { data: products }
  ] = await Promise.all([
    supabase.from('restaurants').select('*').eq('id', restaurantId).single(),
    supabase.from('categories').select('*').eq('restaurant_id', restaurantId).order('order_index'),
    supabase.from('products').select('*').eq('restaurant_id', restaurantId)
  ])

  return <DashboardClient user={user} restaurant={restaurant} initialCategories={categories || []} initialProducts={products || []} />
}
