'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPageComponent({ slug, defaultEmail, defaultPassword }: { slug?: string, defaultEmail?: string, defaultPassword?: string }) {
  const [email, setEmail] = useState(defaultEmail || '')
  const [password, setPassword] = useState(defaultPassword || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Behind the scenes, we convert the username to an email for Supabase Auth
    const loginEmail = email.includes('@') ? email : `${email}@supermenu.com`

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      
      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(234,179,8,0.2)] mb-6 p-1 bg-black/40 backdrop-blur-xl group">
             <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                <img 
                  src="/final.jpeg" 
                  alt="Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
             </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase text-center">
            <span className="text-yellow-500">Super</span> Menu
            <span className="block text-[10px] tracking-[0.5em] text-gray-500 mt-2 not-italic font-bold opacity-50">{slug ? slug.replace(/-/g, ' ') : 'Administration Portal'}</span>
          </h1>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secret Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all font-medium"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold px-4 py-3 rounded-xl animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : 'Access Dashboard'}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest opacity-40">
          Secure Cloud Access &copy; {new Date().getFullYear()} Super Menu
        </p>
      </div>
    </div>
  )
}
