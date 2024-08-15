import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, request) => {
  const url = request.nextUrl.clone()
  if (!isPublicRoute(request)) {
    if (!auth().userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    if (['/'].includes(url.pathname) && auth().userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
