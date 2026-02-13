/**
 * Next.js Middleware
 * Handles authentication and CORS headers for API routes
 */

import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Configure Clerk middleware with protected routes
export default clerkMiddleware((auth, request) => {
  const path = request.nextUrl.pathname;
  
  // Protect user-specific endpoints (same as .NET [Authorize] attribute)
  if (path.startsWith('/api/user/bookmark') || path.startsWith('/api/user/')) {
    auth().protect(); // Requires authentication
  }
  
  // Protect admin endpoints
  if (path.startsWith('/api/data-imports') || 
      path.startsWith('/api/bible-imports') ||
      path.match(/\/api\/seo\/import/)) {
    auth().protect();
    // Note: Additional admin role check is done in handlers
  }
  
  // Add CORS headers for all API routes
  if (path.startsWith('/api')) {
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? ['https://www.scripturespot.com', 'https://scripturespot.com']
      : ['http://localhost:3000', 'http://localhost:5002'];
    
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    
    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Add CORS headers for actual requests
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', corsOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }
});

export const config = {
  matcher: [
    // Include all routes except static files and _next
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
