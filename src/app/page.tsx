import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Super Menu — Digital Menus for Iraqi Restaurants',
  description: 'Browse the best restaurants in Iraq with digital menus, instant ordering via WhatsApp.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('id, name, slug, logo_url, theme_config')
    .order('name')
    
  if (error) {
    console.error("HomePage Supabase Error:", error)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans" dir="rtl">
      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60rem] h-[60rem] bg-green-500/5 rounded-full blur-[150px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-[-10%] w-[50rem] h-[50rem] bg-yellow-500/5 rounded-full blur-[130px] opacity-30 animate-pulse" />
      </div>

      {/* Header */}
      <header className="pt-20 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-green-400 opacity-70">
            منصة القوائم الرقمية
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            <span className="text-white">SUPER</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">MENU</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
            اطلب من أفضل المطاعم بكل سهولة عبر واتساب
          </p>
        </div>
      </header>

      {/* Restaurant Grid */}
      <main className="max-w-5xl mx-auto px-6 pb-32">
        <div className="mb-10 border-b border-white/5 pb-6">
          <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] block mb-2">مطاعمنا</span>
          <h2 className="text-3xl font-black text-white italic tracking-tight">
            {restaurants?.length || 0} مطعم متاح
          </h2>
        </div>

        {restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => {
              const primary = r.theme_config?.primary_color || '#00ca72'
              return (
                <Link key={r.id} href={`/${r.slug}`}>
                  <div
                    className="group relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.06] transition-all duration-500 cursor-pointer overflow-hidden hover:border-white/20 active:scale-95"
                    style={{ boxShadow: `0 0 0 0 ${primary}` }}
                  >
                    {/* Glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem]"
                      style={{ background: `radial-gradient(ellipse at top right, ${primary}15, transparent 70%)` }}
                    />

                    {/* Logo */}
                    <div
                      className="w-16 h-16 rounded-2xl mb-5 flex items-center justify-center text-2xl font-black border border-white/10 overflow-hidden"
                      style={{ backgroundColor: `${primary}20` }}
                    >
                      <img 
                        src={r.logo_url || '/final.jpeg'} 
                        alt={r.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <h3 className="text-xl font-black text-white mb-2 tracking-tight transition-all">
                      {r.name}
                    </h3>

                    {/* Arrow */}
                    <div className="flex items-center gap-2 mt-4">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: primary }}
                      >
                        عرض القائمة
                      </span>
                      <span className="text-gray-600 group-hover:translate-x-1 transition-transform" style={{ color: primary }}>←</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="font-bold">لا توجد مطاعم حتى الآن</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-white/5 text-gray-700 text-[10px] uppercase tracking-widest">
        © {new Date().getFullYear()} SUPER MENU — POWERED BY NEXA DIGITAL
      </footer>
    </div>
  )
}
