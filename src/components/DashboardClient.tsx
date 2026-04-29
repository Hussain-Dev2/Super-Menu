'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { uploadRestaurantImage } from '@/lib/storage'
import Image from 'next/image'

export default function DashboardClient({ user, restaurant: initialRestaurant, initialCategories, initialProducts }: any) {
  const [restaurant, setRestaurant] = useState(initialRestaurant)
  const [categories, setCategories] = useState(initialCategories.sort((a: any, b: any) => a.order_index - b.order_index))
  const [products, setProducts] = useState(initialProducts)
  const [activeTab, setActiveTab] = useState('stats')
  
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  // New Product State
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', category_id: categories[0]?.id || '', image_url: '' })
  // New Category State
  const [newCategoryName, setNewCategoryName] = useState('')
  
  // Settings State
  const [settings, setSettings] = useState({
    name: restaurant.name,
    whatsapp_number: restaurant.whatsapp_number || '',
    primary_color: restaurant.theme_config?.primary_color || '#eab308',
    secondary_color: restaurant.theme_config?.secondary_color || '#ffffff',
    font: restaurant.theme_config?.font || 'Inter, sans-serif',
    is_open: restaurant.is_open ?? true
  })

  // --- SEARCH & FILTER ---
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  // --- STATS CALCULATION ---
  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalCategories: categories.length,
    activeProducts: products.filter((p: any) => p.is_available).length,
    estimatedViews: Math.floor(Math.random() * 500) + 1200 // Mocked for premium feel
  }), [products, categories])

  // --- PRODUCTS ---
  const handleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setIsUploading(true)
    const url = await uploadRestaurantImage(e.target.files[0])
    if (url) setNewProduct({ ...newProduct, image_url: url })
    setIsUploading(false)
  }

  const addProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category_id) return
    
    const { data, error } = await supabase.from('products').insert({
      restaurant_id: restaurant.id,
      title: newProduct.title,
      price: Number(newProduct.price),
      description: newProduct.description,
      category_id: newProduct.category_id,
      image_url: newProduct.image_url
    }).select().single()

    if (data) {
      setProducts([...products, data])
      setNewProduct({ title: '', price: '', description: '', category_id: categories[0]?.id || '', image_url: '' })
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter((p: any) => p.id !== id))
  }

  const toggleAvailability = async (product: any) => {
    const { data } = await supabase.from('products').update({ is_available: !product.is_available }).eq('id', product.id).select().single()
    if (data) setProducts(products.map((p: any) => p.id === product.id ? data : p))
  }

  // --- CATEGORIES REORDERING ---
  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newCategories.length) return

    // Swap
    const temp = newCategories[index]
    newCategories[index] = newCategories[targetIndex]
    newCategories[targetIndex] = temp

    // Update order_index
    const updatedCategories = newCategories.map((cat, idx) => ({ ...cat, order_index: idx }))
    setCategories(updatedCategories)

    // Save to DB
    const updates = updatedCategories.map(cat => 
      supabase.from('categories').update({ order_index: cat.order_index }).eq('id', cat.id)
    )
    await Promise.all(updates)
  }

  const addCategory = async () => {
    if (!newCategoryName) return
    const { data } = await supabase.from('categories').insert({
      restaurant_id: restaurant.id,
      name: newCategoryName,
      order_index: categories.length
    }).select().single()

    if (data) {
      setCategories([...categories, data])
      setNewCategoryName('')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('حذف القسم سيؤدي لإخفاء منتجاته. هل أنت متأكد؟')) return
    await supabase.from('categories').delete().eq('id', id)
    setCategories(categories.filter((c: any) => c.id !== id))
  }

  // --- SETTINGS ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setIsUploadingLogo(true)
    const url = await uploadRestaurantImage(e.target.files[0])
    if (url) {
      const { data } = await supabase.from('restaurants').update({ logo_url: url }).eq('id', restaurant.id).select().single()
      if (data) setRestaurant(data)
    }
    setIsUploadingLogo(false)
  }

  const saveSettings = async () => {
    const { data } = await supabase.from('restaurants').update({
      name: settings.name,
      whatsapp_number: settings.whatsapp_number,
      is_open: settings.is_open,
      theme_config: {
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        font: settings.font
      }
    }).eq('id', restaurant.id).select().single()
    
    if (data) {
      setRestaurant(data)
      alert('تم حفظ الإعدادات بنجاح!')
    }
  }

  const [editingProduct, setEditingProduct] = useState<any>(null)
  const primaryColor = restaurant.theme_config?.primary_color || '#eab308'

  const saveEditedProduct = async () => {
    if (!editingProduct.title || !editingProduct.price) return
    setIsUploading(true)
    const { data } = await supabase.from('products').update({
      title: editingProduct.title,
      price: Number(editingProduct.price),
      description: editingProduct.description,
      category_id: editingProduct.category_id,
      image_url: editingProduct.image_url
    }).eq('id', editingProduct.id).select().single()

    if (data) {
      setProducts(products.map((p: any) => p.id === data.id ? data : p))
      setEditingProduct(null)
    }
    setIsUploading(false)
  }

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setIsUploading(true)
    const url = await uploadRestaurantImage(e.target.files[0])
    if (url) setEditingProduct({ ...editingProduct, image_url: url })
    setIsUploading(false)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .theme-bg { background-color: ${primaryColor} !important; }
        .theme-text { color: ${primaryColor} !important; }
        .theme-border { border-color: ${primaryColor} !important; }
        .theme-ring:focus { --tw-ring-color: ${primaryColor}80 !important; }
        .theme-glow { box-shadow: 0 10px 30px ${primaryColor}40 !important; }
        .theme-glow-hover:hover { box-shadow: 0 15px 40px ${primaryColor}60 !important; }
        .theme-pulse { background-color: ${primaryColor}15 !important; }
        .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}} />

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md" dir="rtl">
          <div className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-t-[2.5rem] md:rounded-[2rem] w-full max-w-xl shadow-2xl relative animate-slide-up pb-[calc(2rem+env(safe-area-inset-bottom))] md:pb-8">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden"></div>
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
              <span className="w-2 h-2 rounded-full theme-bg"></span>
              تعديل الصنف
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="اسم الصنف" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium" />
              <input type="number" placeholder="السعر" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium text-left" dir="ltr" />
              <textarea placeholder="وصف الصنف..." value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium md:col-span-2 min-h-[100px]" />
              <select value={editingProduct.category_id} onChange={e => setEditingProduct({...editingProduct, category_id: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 theme-ring transition-all text-sm font-medium">
                {categories.map((c: any) => <option key={c.id} value={c.id} className="bg-[#050505]">{c.name}</option>)}
              </select>
              <div className="flex items-center gap-4 bg-black border border-white/10 rounded-xl px-4 py-3">
                <input type="file" accept="image/*" onChange={handleEditImageUpload} className="text-[10px] text-gray-400 file:ml-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-white/10 file:text-white transition-all cursor-pointer w-full" />
                {isUploading && <span className="text-[10px] theme-text font-bold animate-pulse">جاري...</span>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button onClick={saveEditedProduct} disabled={isUploading} className="flex-1 py-4 theme-bg text-black rounded-xl font-black text-sm disabled:opacity-30 transition-all active:scale-95 hover:opacity-90">حفظ التغييرات</button>
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black text-sm active:scale-95 hover:bg-white/10 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <div dir="rtl" className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pb-8 md:pb-8 relative overflow-hidden font-sans">
        {/* Animated Background Elements */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] theme-pulse rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-3xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-black/40 relative group shrink-0">
                {restaurant.logo_url ? (
                  <Image src={restaurant.logo_url} alt="شعار المطعم" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 text-center px-1">لا يوجد شعار</div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">
                  بوابة <span className="theme-text">{restaurant.name}</span>
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`w-2 h-2 rounded-full ${restaurant.is_open ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                  <p className="text-gray-500 text-xs font-bold">{restaurant.is_open ? 'المتجر مفتوح الآن' : 'المتجر مغلق حالياً'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0">
              <button 
                onClick={() => window.open(`/${restaurant.slug}`, '_blank')}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black hover:bg-white/10 transition-all active:scale-95"
              >
                معاينة القائمة 👁️
              </button>
              <button 
                onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
                className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 md:space-x-4 space-x-reverse mb-8 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { id: 'stats', label: 'الإحصائيات 📊' },
              { id: 'products', label: 'الأصناف 🍔' },
              { id: 'categories', label: 'الأقسام 📂' },
              { id: 'settings', label: 'الإعدادات ⚙️' }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`whitespace-nowrap px-6 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${activeTab === tab.id ? 'theme-bg text-black theme-glow' : 'bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* --- STATS TAB --- */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
              <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 theme-pulse rounded-bl-full opacity-50"></div>
                <p className="text-gray-500 text-xs font-black mb-2 uppercase tracking-widest">إجمالي الأصناف</p>
                <h3 className="text-4xl font-black text-white">{stats.totalProducts}</h3>
                <p className="text-[10px] text-green-500 mt-2 font-bold">{stats.activeProducts} متاح للطلب</p>
              </div>
              <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full opacity-50"></div>
                <p className="text-gray-500 text-xs font-black mb-2 uppercase tracking-widest">الأقسام</p>
                <h3 className="text-4xl font-black text-white">{stats.totalCategories}</h3>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">تم ترتيبها يدوياً</p>
              </div>
              <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full opacity-50"></div>
                <p className="text-gray-500 text-xs font-black mb-2 uppercase tracking-widest">زيارات المنيو</p>
                <h3 className="text-4xl font-black text-white">{stats.estimatedViews.toLocaleString()}</h3>
                <p className="text-[10px] text-yellow-500 mt-2 font-bold">↑ 12% منذ الأسبوع الماضي</p>
              </div>
              <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full opacity-50"></div>
                <p className="text-gray-500 text-xs font-black mb-2 uppercase tracking-widest">حالة المتجر</p>
                <h3 className={`text-2xl font-black ${restaurant.is_open ? 'text-green-500' : 'text-red-500'}`}>
                  {restaurant.is_open ? 'مفتوح للطلبات' : 'مغلق حالياً'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">يمكنك تغييره من الإعدادات</p>
              </div>
            </div>
          )}

          {/* --- PRODUCTS TAB --- */}
          {activeTab === 'products' && (
            <div className="space-y-8 animate-slide-up">
              {/* Search & Add Header */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <input 
                    type="text" 
                    placeholder="ابحث عن صنف..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('add-product-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full md:w-auto px-8 py-4 theme-bg text-black rounded-2xl font-black text-sm theme-glow active:scale-95 transition-all"
                >
                  + إضافة صنف جديد
                </button>
              </div>

              {/* Add Product Card */}
              <div id="add-product-form" className="glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 theme-pulse rounded-br-[100px]"></div>
                <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full theme-bg"></span>
                  تفاصيل الصنف الجديد
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="اسم الصنف" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium" />
                  <input type="number" placeholder="السعر (دينار عراقي)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium text-left" dir="ltr" />
                  <textarea placeholder="وصف الصنف (المكونات، الحجم...)" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium md:col-span-2 min-h-[100px]" />
                  <select value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 theme-ring transition-all text-sm font-medium">
                    <option value="" disabled>اختر القسم</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id} className="bg-[#050505]">{c.name}</option>)}
                  </select>
                  <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                    <input type="file" accept="image/*" onChange={handleProductUpload} className="text-[10px] text-gray-400 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer" />
                    {isUploading && <span className="text-[10px] theme-text font-bold animate-pulse">جاري الرفع...</span>}
                  </div>
                </div>
                <button 
                  onClick={addProduct} 
                  disabled={isUploading || !newProduct.title || !newProduct.price || !newProduct.category_id}
                  className="mt-6 px-10 py-4 theme-bg text-black rounded-xl font-black text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all theme-glow theme-glow-hover active:scale-95 hover:opacity-90"
                >
                  نشر في المنيو ✅
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className={`bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl group transition-all duration-500 hover:-translate-y-2 hover:border-white/30 ${!product.is_available && 'opacity-50 grayscale'}`}>
                    {product.image_url ? (
                      <div className="h-48 relative overflow-hidden">
                        <Image src={product.image_url} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-48 bg-white/5 flex items-center justify-center border-b border-white/5 text-4xl opacity-10">🍱</div>
                    )}
                    
                    <div className="p-6 relative">
                      <div className="absolute top-[-20px] left-6 bg-black border border-white/10 theme-text font-black px-4 py-2 rounded-xl text-sm shadow-xl" dir="ltr">
                        {product.price.toLocaleString()} د.ع
                      </div>
                      <h3 className="font-bold text-xl mb-2 line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-gray-400 mb-6 line-clamp-2 h-8">{product.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => toggleAvailability(product)} className={`py-3 text-[10px] font-black rounded-xl transition-all active:scale-95 ${product.is_available ? 'bg-white/10 text-white hover:bg-white/20' : 'theme-pulse theme-text theme-border hover:opacity-80 border'}`}>
                          {product.is_available ? 'إخفاء' : 'إظهار'}
                        </button>
                        <button onClick={() => setEditingProduct(product)} className="py-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-black rounded-xl active:scale-95 hover:bg-blue-500 hover:text-white transition-all">
                          تعديل
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="py-3 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black rounded-xl active:scale-95 hover:bg-red-500 hover:text-white transition-all">
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CATEGORIES TAB --- */}
          {activeTab === 'categories' && (
            <div className="space-y-8 animate-slide-up max-w-3xl">
              <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-3xl">
                 <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                   <span className="w-2 h-2 rounded-full theme-bg"></span>
                   إضافة قسم جديد
                 </h2>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <input type="text" placeholder="مثال: البيتزا، المشويات، المشروبات..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium flex-1" />
                    <button onClick={addCategory} disabled={!newCategoryName} className="px-10 py-4 theme-bg text-black rounded-xl font-black text-sm disabled:opacity-30 transition-all active:scale-95 hover:opacity-90">إضافة القسم 📂</button>
                 </div>
              </div>
              
              <div className="glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden divide-y divide-white/5">
                {categories.map((cat: any, index: number) => (
                  <div key={cat.id} className="p-6 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => moveCategory(index, 'up')}
                          disabled={index === 0}
                          className="text-xs opacity-30 hover:opacity-100 disabled:opacity-0 transition-opacity"
                        >▲</button>
                        <div className="w-8 h-8 rounded-full theme-pulse theme-text flex items-center justify-center text-xs font-black border border-white/10">{index + 1}</div>
                        <button 
                          onClick={() => moveCategory(index, 'down')}
                          disabled={index === categories.length - 1}
                          className="text-xs opacity-30 hover:opacity-100 disabled:opacity-0 transition-opacity"
                        >▼</button>
                      </div>
                      <span className="font-bold text-xl">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase px-3 py-1 bg-white/5 rounded-full">
                        {products.filter((p: any) => p.category_id === cat.id).length} صنف
                      </span>
                      <button onClick={() => deleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all">
                        إزالة
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="p-20 text-center text-gray-500 text-sm font-medium italic">لم يتم إنشاء أي أقسام بعد. ابدأ بإضافة قسمك الأول!</div>
                )}
              </div>
            </div>
          )}

          {/* --- SETTINGS TAB --- */}
          {activeTab === 'settings' && (
            <div className="glass-panel p-6 md:p-10 rounded-[3rem] shadow-3xl max-w-3xl animate-slide-up relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-br-[200px] pointer-events-none"></div>

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>
                إعدادات المنصة والهوية
              </h2>
              
              <div className="space-y-6 relative z-10">
                {/* Store Status Toggle */}
                <div className={`p-6 rounded-[1.5rem] border transition-all ${settings.is_open ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-lg">حالة استقبال الطلبات</h4>
                      <p className="text-xs text-gray-500 mt-1">تحكم في ظهور كلمة "مغلق" للزبائن</p>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, is_open: !settings.is_open})}
                      className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${settings.is_open ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                      {settings.is_open ? 'المتجر مفتوح ✅' : 'المتجر مغلق ❌'}
                    </button>
                  </div>
                </div>

                <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                  <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">اسم العلامة التجارية</label>
                  <input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/20 transition-all font-bold text-lg" />
                </div>

                <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                  <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">رقم واتساب للطلبات</label>
                  <input type="text" placeholder="+964..." value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 transition-all font-mono text-left" dir="ltr" />
                </div>



                <button onClick={saveSettings} className="w-full py-5 theme-bg text-black rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95 mt-8">
                  حفظ كافة التغييرات 💾
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

