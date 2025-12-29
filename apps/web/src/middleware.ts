import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'es', 'pt'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().includes(locale)) {
      return locale;
    }
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request);
  
  // Set locale in cookie for server components
  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', locale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\..*).*)'],
};
