import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([ '/api/webhooks/clerk(.*)']);
const isOnboardingRoute = createRouteMatcher(['/user(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();
  const { userId, sessionClaims } = await auth();

  if (userId) {
    const isOnboarded = sessionClaims?.metadata?.Onboarded === true;
    if (!isOnboarded && !isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL('/user', req.url));
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