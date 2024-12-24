import createMiddleware from 'next-intl/middleware';

const middleware = createMiddleware({
  locales: ['en', 'de'],
  defaultLocale: 'en'
});

export default middleware;

export const config = {
  matcher: ['/', '/(de|en)/:page*']
};

// import authConfig from "./auth.config"
// import NextAuth from "next-auth"
// import createMiddleware from 'next-intl/middleware';
// import {defineRouting} from 'next-intl/routing';

// const publicPages = [ '/login', '/signup'];
// const { auth } = NextAuth(authConfig)
// export const routing = defineRouting({
//   locales: ['en', 'de'],
//   defaultLocale: 'en',
//   localePrefix: 'as-needed'
// });
// const intlMiddleware = createMiddleware(routing);
 
// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
//   const {nextUrl} = req;
//   console.log('authMiddleware', nextUrl.pathname, isLoggedIn);
//   const publicPathnameRegex = RegExp(
//     `^(/(${routing.locales.join('|')}))?(${publicPages
//       .flatMap((p) => (p === '/' ? ['', '/'] : p))
//       .join('|')})/?$`,
//     'i'
//   );
//   const isPublicPage = publicPathnameRegex.test(nextUrl.pathname);
//   console.log('isPublicPage', isPublicPage);
//   if (isPublicPage) {
//     return intlMiddleware(req);
//   }
//   return Response.redirect(new URL("/login", nextUrl));
// });
// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*).*)']
// };