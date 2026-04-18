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
      alert('Settings saved successfully!')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{restaurant.name} - Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Logged in as {user.email}</p>
        </div>
        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
        >
          Sign Out
        </button>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button 
          className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('categories')}
        >
          Manage Categories
        </button>
        <button 
          className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'settings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('settings')}
        >
          Restaurant Settings
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="border p-2 rounded" />
              <input type="number" placeholder="Price (IQD)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="border p-2 rounded" />
              <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="border p-2 rounded md:col-span-2" />
              <select value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} className="border p-2 rounded">
                <option value="" disabled>Select Category</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleProductUpload} className="text-sm" />
                {isUploading && <span className="text-sm text-blue-600">Uploading...</span>}
              </div>
            </div>
            <button onClick={addProduct} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50" disabled={isUploading || !newProduct.title || !newProduct.price || !newProduct.category_id}>
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${!product.is_available && 'opacity-60'}`}>
                {product.image_url && <div className="h-40 relative"><Image src={product.image_url} alt="" fill className="object-cover" /></div>}
                <div className="p-4">
                  <h3 className="font-bold">{product.title}</h3>
                  <p className="text-blue-600 font-medium">{product.price} د.ع</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => toggleAvailability(product)} className="flex-1 px-3 py-1.5 bg-gray-100 text-sm font-medium rounded hover:bg-gray-200">
                      {product.is_available ? 'Set Unavailable' : 'Set Available'}
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded hover:bg-red-100">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-lg font-bold mb-4">Add New Category</h2>
             <div className="flex gap-4">
                <input type="text" placeholder="Category Name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="border p-2 rounded flex-1" />
                <button onClick={addCategory} disabled={!newCategoryName} className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50">Add</button>
             </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
            {categories.map((cat: any) => (
              <div key={cat.id} className="p-4 flex justify-between items-center">
                <span className="font-medium text-gray-900">{cat.name}</span>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold">Restaurant Settings</h2>
          
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input type="text" placeholder="e.g. +9647701234567" value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full border p-2 rounded" />
              <p className="text-xs text-gray-500 mt-1">Include country code, no spaces or dashes.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="h-10 w-10 cursor-pointer" />
                <input type="text" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="border p-2 rounded flex-1" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color (Text)</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={settings.secondary_color} onChange={e => setSettings({...settings, secondary_color: e.target.value})} className="h-10 w-10 cursor-pointer" />
                <input type="text" value={settings.secondary_color} onChange={e => setSettings({...settings, secondary_color: e.target.value})} className="border p-2 rounded flex-1" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Logo</label>
              <div className="flex items-center gap-4">
                {restaurant.logo_url && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                    <Image src={restaurant.logo_url} alt="Logo" fill className="object-cover" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm" />
                {isUploadingLogo && <span className="text-sm text-blue-600">Uploading...</span>}
              </div>
            </div>

            <button onClick={saveSettings} className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
