'use client'

import { useState } from 'react'
import Image from 'next/image'

type CartItem = {
  product: any
  quantity: number
}

export default function ClientMenu({ restaurant, categories, products }: { restaurant: any, categories: any[], products: any[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || null)

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId)
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item))
  }

  const total = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)

  const sendOrder = () => {
    if (cart.length === 0) return

    let text = `طلب جديد من مطعم ${restaurant.name}:\n`
    cart.forEach(item => {
      text += `• ${item.quantity} ${item.product.title} - ${(Number(item.product.price) * item.quantity).toLocaleString()} د.ع\n`
    })
    text += `\nالمجموع الكلي: ${total.toLocaleString()} د.ع\n`
    text += `ملاحظات الزبون: [تترك فراغاً]`

    const encodedText = encodeURIComponent(text)
    const whatsappNumber = restaurant.whatsapp_number.replace(/\+/g, '').replace(/ /g, '')
    const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`
    window.open(url, '_blank')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm" style={{ borderBottomColor: 'var(--color-primary)', borderBottomWidth: '4px' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          {restaurant.logo_url && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2" style={{ borderColor: 'var(--color-primary)' }}>
              <Image src={restaurant.logo_url} alt={restaurant.name} fill sizes="64px" priority className="object-cover" />
            </div>
          )}
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{restaurant.name}</h1>
        </div>
        
        {/* Category Nav */}
        <div className="max-w-4xl mx-auto px-4 py-2 flex overflow-x-auto gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors`}
              style={{
                backgroundColor: activeCategory === cat.id ? 'var(--color-primary)' : '#f3f4f6',
                color: activeCategory === cat.id ? 'var(--color-secondary)' : '#374151'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.filter(p => p.category_id === activeCategory && p.is_available).map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
              {product.image_url ? (
                <div className="relative w-full h-48 bg-gray-100">
                  <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-lg leading-tight text-gray-900">{product.title}</h3>
                  <span className="font-bold whitespace-nowrap" style={{ color: 'var(--color-primary)' }}>
                    {Number(product.price).toLocaleString()} د.ع
                  </span>
                </div>
                {product.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                )}
                
                <div className="mt-auto pt-4 flex justify-center">
                  {cart.find(c => c.product.id === product.id) ? (
                    <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-full border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(product.id, cart.find(c => c.product.id === product.id)!.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 font-bold"
                      >-</button>
                      <span className="font-medium w-4 text-center">{cart.find(c => c.product.id === product.id)!.quantity}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 flex items-center justify-center rounded-full shadow-sm font-bold"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}
                      >+</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 rounded-xl font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}
                    >
                      إضافة للسلة
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Widget */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
          <div className="max-w-4xl mx-auto flex justify-center">
            <button 
              onClick={sendOrder}
              className="pointer-events-auto flex items-center justify-between gap-6 px-6 py-4 rounded-2xl shadow-xl w-full sm:w-auto min-w-[300px] transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#25D366', color: '#fff' }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
                <span className="font-bold text-lg">إرسال الطلب</span>
              </div>
              <span className="font-bold text-lg">{total.toLocaleString()} د.ع</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
