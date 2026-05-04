import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/api/webhooks(.*)',]);
const isOnboardingRoute = createRouteMatcher(['/user(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();
  const { userId, sessionClaims } = await auth();
  
  if (userId) {
    const isOnboarded = sessionClaims?.metadata?.Onboarded === true;
    const userRole = sessionClaims?.metadata?.role;
    if (!isOnboarded && !isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL('/user', req.url));
    }
    if(userRole !== 'admin' && isAdminRoute(req))
    {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  else{
    if(isAdminRoute(req)|| isOnboardingRoute(req))
    {
      await auth.protect();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};