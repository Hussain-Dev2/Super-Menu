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

  // Handle CORS Preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') ?? ''
    if (origin.endsWith('.nexadigital.dev') || origin === 'https://nexadigital.dev') {
      const preflightHeaders = new Headers()
      preflightHeaders.set('Access-Control-Allow-Origin', origin)
      preflightHeaders.set('Access-Control-Allow-Credentials', 'true')
      preflightHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      preflightHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version')
      return new NextResponse(null, { headers: preflightHeaders, status: 204 })
    }
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
      
      const origin = request.headers.get('origin') ?? ''
      if (origin.endsWith('.nexadigital.dev') || origin === 'https://nexadigital.dev') {
        rewriteResponse.headers.set('Access-Control-Allow-Origin', origin)
        rewriteResponse.headers.set('Access-Control-Allow-Credentials', 'true')
        rewriteResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        rewriteResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version')
      }
      
      return rewriteResponse
    }
  }

  const origin = request.headers.get('origin') ?? ''
  if (origin.endsWith('.nexadigital.dev') || origin === 'https://nexadigital.dev') {
    supabaseResponse.headers.set('Access-Control-Allow-Origin', origin)
    supabaseResponse.headers.set('Access-Control-Allow-Credentials', 'true')
    supabaseResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    supabaseResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version')
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
