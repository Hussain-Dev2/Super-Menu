import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Map custom domains to their respective slugs
const customDomains: Record<string, string> = {
  'shawarma-nazoland.nexadigital.dev': 'shawarma-nazo-land',
  'tabasco-al-sham.nexadigital.dev': 'tabasco-al-sham',
}

// Routes that are global and should NOT be rewritten to /[slug]/...
const globalRoutes = ['/dashboard', '/login', '/api']

export async function middleware(request: NextRequest) {
  // 1. Handle Supabase Auth Session
  const supabaseResponse = await updateSession(request)

  // If Supabase triggered a redirect, return it immediately
  if (supabaseResponse.headers.get('Location')) {
    return supabaseResponse
  }

  // 2. Custom Domain White-Label Rewriting
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const hostWithoutPort = hostname.split(':')[0]

  if (customDomains[hostWithoutPort]) {
    const slug = customDomains[hostWithoutPort]
    const isGlobalRoute = globalRoutes.some(route => url.pathname.startsWith(route))
    
    // If it's not a global route, and it hasn't already been rewritten
    if (!isGlobalRoute && !url.pathname.startsWith(`/${slug}`)) {
      // Rewrite the URL internally to add the slug prefix
      // E.g., shawarma.dev/ -> /shawarma-nazo-land
      // E.g., shawarma.dev/admin -> /shawarma-nazo-land/admin
      const rewriteUrl = new URL(`/${slug}${url.pathname === '/' ? '' : url.pathname}`, request.url)
      const rewriteResponse = NextResponse.rewrite(rewriteUrl)
      
      // Preserve auth cookies from Supabase
      supabaseResponse.cookies.getAll().forEach(cookie => {
        rewriteResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      
      return rewriteResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
