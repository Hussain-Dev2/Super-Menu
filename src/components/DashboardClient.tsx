'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { uploadRestaurantImage } from '@/lib/storage'
import Image from 'next/image'

export default function DashboardClient({ user, restaurant: initialRestaurant, initialCategories, initialProducts }: any) {
  const [restaurant, setRestaurant] = useState(initialRestaurant)
  const [categories, setCategories] = useState(initialCategories)
  const [products, setProducts] = useState(initialProducts)
  const [activeTab, setActiveTab] = useState('products')
  
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const supabase = createClient()

  // New Product State
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', category_id: categories[0]?.id || '', image_url: '' })
  // New Category State
  const [newCategoryName, setNewCategoryName] = useState('')
  
  // Settings State
  const [settings, setSettings] = useState({
    name: restaurant.name,
    whatsapp_number: restaurant.whatsapp_number || '',
    primary_color: restaurant.theme_config?.primary_color || '#000000',
    secondary_color: restaurant.theme_config?.secondary_color || '#ffffff',
    font: restaurant.theme_config?.font || 'Inter, sans-serif'
  })

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
    
    const { data } = await supabase.from('products').insert({
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
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter((p: any) => p.id !== id))
  }

  const toggleAvailability = async (product: any) => {
    const { data } = await supabase.from('products').update({ is_available: !product.is_available }).eq('id', product.id).select().single()
    if (data) setProducts(products.map((p: any) => p.id === product.id ? data : p))
  }

  // --- CATEGORIES ---
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
      `}} />

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
          <div className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-[2rem] w-full max-w-xl shadow-2xl relative animate-slide-up">
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
            <div className="flex gap-4 mt-8">
              <button onClick={saveEditedProduct} disabled={isUploading} className="flex-1 py-4 theme-bg text-black rounded-xl font-black text-sm disabled:opacity-30 transition-all hover:opacity-90">حفظ التغييرات</button>
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black text-sm hover:bg-white/10 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <div dir="rtl" className="min-h-screen bg-[#050505] text-white p-4 md:p-8 relative overflow-hidden font-sans">
        {/* Animated Background Elements */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] theme-pulse rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-3xl">
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
                <p className="text-gray-500 text-xs mt-1 font-bold">حساب المسؤول: {user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
              className="mt-6 md:mt-0 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              تسجيل الخروج
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 md:space-x-4 space-x-reverse mb-8 overflow-x-auto pb-4 scrollbar-hide">
            <button 
              className={`whitespace-nowrap px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'products' ? 'theme-bg text-black theme-glow' : 'bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'}`}
              onClick={() => setActiveTab('products')}
            >
              عناصر القائمة
            </button>
            <button 
              className={`whitespace-nowrap px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'categories' ? 'theme-bg text-black theme-glow' : 'bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'}`}
              onClick={() => setActiveTab('categories')}
            >
              الأقسام
            </button>
            <button 
              className={`whitespace-nowrap px-6 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'settings' ? 'theme-bg text-black theme-glow' : 'bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'}`}
              onClick={() => setActiveTab('settings')}
            >
              إعدادات النظام
            </button>
          </div>

          {/* --- PRODUCTS TAB --- */}
          {activeTab === 'products' && (
            <div className="space-y-8 animate-slide-up">
              {/* Add Product Card */}
              <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 theme-pulse rounded-br-[100px]"></div>
                
                <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full theme-bg"></span>
                  إضافة صنف جديد
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="اسم الصنف" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium" />
                  <input type="number" placeholder="السعر (دينار عراقي)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium text-left" dir="ltr" />
                  <textarea placeholder="وصف الصنف..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium md:col-span-2 min-h-[100px]" />
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
                  className="mt-6 px-8 py-4 theme-bg text-black rounded-xl font-black text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all theme-glow theme-glow-hover active:scale-95 hover:opacity-90"
                >
                  نشر في القائمة
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <div key={product.id} className={`bg-white/[0.02] backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl group transition-all duration-500 hover:-translate-y-2 hover:border-white/30 ${!product.is_available && 'opacity-50 grayscale'}`}>
                    {product.image_url ? (
                      <div className="h-48 relative overflow-hidden">
                        <Image src={product.image_url} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-48 bg-white/5 flex items-center justify-center border-b border-white/5">
                         <span className="text-white/20 text-xs font-black">لا توجد صورة</span>
                      </div>
                    )}
                    
                    <div className="p-6 relative">
                      <div className="absolute top-[-20px] left-6 bg-black border border-white/10 theme-text font-black px-4 py-2 rounded-xl text-sm shadow-xl" dir="ltr">
                        {product.price.toLocaleString()} د.ع
                      </div>
                      <h3 className="font-bold text-xl mb-2 line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-gray-400 mb-6 line-clamp-2 h-8">{product.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => toggleAvailability(product)} className={`py-3 text-[10px] font-black rounded-xl transition-all ${product.is_available ? 'bg-white/10 text-white hover:bg-white/20' : 'theme-pulse theme-text theme-border hover:opacity-80 border'}`}>
                          {product.is_available ? 'إخفاء' : 'إظهار'}
                        </button>
                        <button onClick={() => setEditingProduct(product)} className="py-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-black rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                          تعديل
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="py-3 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black rounded-xl hover:bg-red-500 hover:text-white transition-all">
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
              <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-3xl">
                 <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                   <span className="w-2 h-2 rounded-full theme-bg"></span>
                   إضافة قسم جديد
                 </h2>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <input type="text" placeholder="مثال: الأطباق الرئيسية" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:ring-2 theme-ring transition-all text-sm font-medium flex-1" />
                    <button onClick={addCategory} disabled={!newCategoryName} className="px-8 py-4 theme-bg text-black rounded-xl font-black text-sm disabled:opacity-30 transition-all active:scale-95 hover:opacity-90">إضافة</button>
                 </div>
              </div>
              
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden divide-y divide-white/10">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="p-6 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full theme-pulse theme-text flex items-center justify-center text-xs font-black">{categories.indexOf(cat) + 1}</div>
                      <span className="font-bold text-lg">{cat.name}</span>
                    </div>
                    <button onClick={() => deleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black hover:bg-red-500 hover:text-white transition-all">
                      إزالة
                    </button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="p-10 text-center text-gray-500 text-sm font-medium">لم يتم إنشاء أي أقسام بعد.</div>
                )}
              </div>
            </div>
          )}

          {/* --- SETTINGS TAB --- */}
          {activeTab === 'settings' && (
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-[2rem] shadow-3xl max-w-3xl animate-slide-up relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-br-[200px] pointer-events-none"></div>

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>
                إعدادات المنصة
              </h2>
              
              <div className="space-y-6 relative z-10">
                <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                  <label className="block text-xs font-black text-gray-500 mb-3">اسم المطعم</label>
                  <input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/20 transition-all font-bold text-lg" />
                </div>

                <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                  <label className="block text-xs font-black text-gray-500 mb-3">رقم واتساب للطلبات</label>
                  <input type="text" placeholder="+964..." value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 transition-all font-mono text-left" dir="ltr" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                    <label className="block text-xs font-black text-gray-500 mb-3">اللون الأساسي للثيم</label>
                    <div className="flex gap-4 items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                         <input type="color" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer" />
                      </div>
                      <input type="text" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/20 transition-all font-mono text-sm uppercase text-left" dir="ltr" />
                    </div>
                  </div>

                  <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                    <label className="block text-xs font-black text-gray-500 mb-3">لون النصوص الثانوي</label>
                    <div className="flex gap-4 items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                         <input type="color" value={settings.secondary_color} onChange={e => setSettings({...settings, secondary_color: e.target.value})} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer" />
                      </div>
                      <input type="text" value={settings.secondary_color} onChange={e => setSettings({...settings, secondary_color: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/20 transition-all font-mono text-sm uppercase text-left" dir="ltr" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                  <label className="block text-xs font-black text-gray-500 mb-3">شعار العلامة التجارية</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 border border-white/10 rounded-xl p-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 bg-black shadow-xl shrink-0 flex items-center justify-center">
                      {restaurant.logo_url ? (
                        <Image src={restaurant.logo_url} alt="Logo" fill className="object-cover" />
                      ) : (
                        <span className="text-white/20 text-[10px] font-black text-center px-1">بدون شعار</span>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-xs text-gray-400 file:mr-0 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer" />
                      {isUploadingLogo && <p className="text-[10px] theme-text font-bold animate-pulse mt-2">جاري الرفع...</p>}
                    </div>
                  </div>
                </div>

                <button onClick={saveSettings} className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm hover:bg-gray-200 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.2)] active:scale-95 mt-8">
                  حفظ الإعدادات والتغييرات
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

