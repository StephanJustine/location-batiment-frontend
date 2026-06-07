// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//   const token = request.cookies.get('access_token')?.value;
//   const isLoginPage = request.nextUrl.pathname === '/login';
//   const isForgotPasswordPage = request.nextUrl.pathname === '/forgot-password';

//   if (!token && !isLoginPage && !isForgotPasswordPage) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (token && isLoginPage) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;
  
  console.log(`🔍 Proxy - Path: ${pathname}, Token: ${token ? 'Oui' : 'Non'}`);
  
  // Pages publiques
  const isPublicPage = pathname === '/login' || pathname === '/forgot-password';
  const isStaticAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/static') || 
                        pathname === '/favicon.ico';

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Si pas de token et pas page publique -> login
  if (!token && !isPublicPage) {
    console.log('🔄 Proxy: Redirection vers login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si token et page publique -> dashboard
  if (token && isPublicPage) {
    console.log('🔄 Proxy: Redirection vers dashboard');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|static).*)'],
};