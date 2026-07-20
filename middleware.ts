import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "hotelynk_session";

// Note: this only checks whether the cookie exists, not whether it's
// still valid/unexpired — Firebase Admin SDK (needed for real
// verification) can't run in Edge middleware. The real check happens in
// app/demo/layout.tsx via getCurrentUser(), which redirects if the
// cookie turns out to be invalid. This middleware just avoids an
// unnecessary render for the common case of "no cookie at all."
export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/demo/:path*", "/admin/:path*"],
};
