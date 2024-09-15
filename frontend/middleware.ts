import { NextRequest, NextResponse } from "next/server";
import { DASHBOARD_ROUTE, EMAIL_VERIFIED_PARAM, EXPIRED_SESSION_PARAM, FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, RESET_PASSWORD_ROUTE, VERIFY_EMAIL_ROUTE } from "./constants";
import { auth, getRenewedCookies, redirectToLoginWithExpiredCookie } from "./lib/auth/server";

// The middleware applies to all the routes, except static assets. Adjust as needed
export async function middleware(req : NextRequest) {
  const url = req.nextUrl.clone();

  try {
    if (url.pathname === LOGIN_ROUTE && url.searchParams.has(EXPIRED_SESSION_PARAM)) {
      return redirectToLoginWithExpiredCookie(url);
    }

    if (url.pathname === DASHBOARD_ROUTE && url.searchParams.has(EMAIL_VERIFIED_PARAM)) {
      const { cookies, authUserCookie } = await getRenewedCookies(req);

      url.searchParams.delete(EMAIL_VERIFIED_PARAM); // Avoid infinite redirects
      const response = NextResponse.redirect(url);

      response.headers.append("Set-Cookie", cookies);

      // * Important to update user's data so emailVerifiedAt is defined
      response.headers.append("Set-Cookie", authUserCookie);

      return response;
    }
    
    const { user } = await auth();

    console.log(user);

    if (user) {
      const needsRedirectToDashboard = url.pathname === LOGIN_ROUTE
        || url.pathname === REGISTER_ROUTE
        || url.pathname === FORGOT_PASSWORD_ROUTE
        || url.pathname.startsWith(RESET_PASSWORD_ROUTE)
        || url.pathname === VERIFY_EMAIL_ROUTE && user.emailVerifiedAt;

      if (needsRedirectToDashboard) {
        url.pathname = DASHBOARD_ROUTE;
        return NextResponse.redirect(url);
      }

      console.log(user.emailVerifiedAt)

      const needsRedirectToVerifyEmail = url.pathname !== VERIFY_EMAIL_ROUTE && !user.emailVerifiedAt;

      if (needsRedirectToVerifyEmail) {
        url.pathname = VERIFY_EMAIL_ROUTE;
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }

    const needsRedirectToLogin = url.pathname !== LOGIN_ROUTE
      && url.pathname !== REGISTER_ROUTE
      && url.pathname !== FORGOT_PASSWORD_ROUTE
      && !url.pathname.startsWith(RESET_PASSWORD_ROUTE)
      && url.pathname !== VERIFY_EMAIL_ROUTE;

    if (needsRedirectToLogin) {
      return redirectToLoginWithExpiredCookie(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Middleware Error:", error);
    return redirectToLoginWithExpiredCookie(url);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
