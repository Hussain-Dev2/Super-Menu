"use client";

import { useState, memo } from "react";
import { submitOrder } from "@/app/actions";

const CheckoutModal = memo(({ cart, totalPrice, onClose, onSuccess }: any) => {
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !location) {
      setError("يرجى إدخال رقم الهاتف والعنوان بدقة");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const orderData = {
      phone,
      location,
      total: totalPrice,
      items: cart.map((c: any) => ({
        id: c.product.id,
        name: `${c.product.name}${c.selectedSize ? ` (${c.selectedSize})` : ''}`,
        price: c.selectedPrice || c.product.price,
        quantity: c.quantity,
        size: c.selectedSize
      }))
    };

    const res = await submitOrder(orderData);
    
    setIsSubmitting(false);

    if (res.success) {
      // WhatsApp Integration
      const whatsappNumber = "9647727681903";
      const itemsList = cart.map((c: any) => {
        const itemName = `${c.product.name}${c.selectedSize ? ` (${c.selectedSize})` : ''}`;
        const itemPrice = c.selectedPrice || c.product.price;
        return `📦 ${c.quantity}x ${itemName} (${(itemPrice * c.quantity).toLocaleString()} د.ع)`;
      }).join('\n');
      
      const message = `*طلب جديد من تطبيق Shawarma Nazo Land* 🌯🔥\n\n` +
        `*التفاصيل:*\n${itemsList}\n\n` +
        `*المجموع النهائي:* ${totalPrice.toLocaleString()} دينار عراقي\n\n` +
        `*معلومات التوصيل:*\n` +
        `📱 الهاتف: ${phone}\n` +
        `📍 العنوان: ${location}\n\n` +
        `_شكراً لطلبكم من شاورما نازولاند!_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      onSuccess();
      window.open(whatsappUrl, '_blank');
    } else {
      setError(res.message || "عذراً، حدث خطأ أثناء إرسال الطلب");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 pb-0 sm:p-6 animate-fade-in">
      {/* Dynamic Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose}
      />
      
      {/* Luxury Modal Container */}
      <div className="glass bg-brand-dark/95 w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 border border-white/10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-500">
        
        {/* Glow Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-brand-green to-transparent opacity-50"></div>

        {/* Modal Header */}
        <div className="p-6 md:p-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white font-cairo leading-none">تأكيد الطلب</h2>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Order Confirmation</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 pt-2 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-[1.5rem] text-xs font-bold mb-6 border border-red-500/20 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* Order Summary Card */}
          <div className="bg-white/[0.03] rounded-[2rem] p-5 mb-8 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/5 blur-2xl rounded-full"></div>
             <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase">المبلغ الإجمالي</span>
                <span className="text-[10px] font-black text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded-lg">قيد الدفع</span>
             </div>
             <div className="text-3xl font-black text-white flex items-baseline gap-1 font-cairo">
                {totalPrice.toLocaleString("ar-IQ")}
                <small className="text-sm font-bold text-gray-500">د.ع</small>
             </div>
             <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[11px] font-bold text-gray-400">
                <span>العدد: {cart.reduce((a:number,b:any)=>a+b.quantity,0)} وجبات</span>
                <span>توصيل سريع 🛵</span>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">رقم الهاتف للهوية</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-brand-green transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف للتواصل..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] pr-12 pl-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green/50 focus:bg-white/[0.05] transition-all font-bold text-base md:text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">عنوان التوصيل بدقة</label>
              <div className="relative group/input">
                 <div className="absolute top-4 right-4 text-gray-500 group-focus-within/input:text-brand-green transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <textarea
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="المنطقة، أقرب نقطة دالة، رقم الزقاق..."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] pr-12 pl-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green/50 focus:bg-white/[0.05] transition-all font-bold text-base md:text-sm resize-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full py-5 rounded-[1.8rem] font-black text-lg transition-all active:scale-[0.98] overflow-hidden ${
                isSubmitting ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5" : "bg-brand-green text-white neon-green"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? "جاري المعالجة..." : (
                  <>
                    تأكيد وإرسال الطلب
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              {!isSubmitting && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-8">
            Shawarma Nazo Land • Premium Food Experience
          </p>
        </div>
      </div>
    </div>
  );
});

export default CheckoutModal;

