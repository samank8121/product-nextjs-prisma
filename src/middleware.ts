import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware  from 'next-intl/middleware';

const middleware = createIntlMiddleware ({
  locales: ['en', 'de'],
  defaultLocale: 'en'
});

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/:locale/api(.*)'])

export default clerkMiddleware(async (auth, req) => {  
  if (!isPublicRoute(req)) await auth.protect()

  return middleware(req)
})


export const config = {
  matcher: [
     '/', '/(de|en)/:page*', '/(api|trpc)(.*)']
};