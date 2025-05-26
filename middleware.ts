import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const middleware = (request: NextRequest) => {
  const cookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  if (!cookie) {
    return NextResponse.redirect(new URL("/", request.url));
  } else {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/feeds", request.url));
    }

    return NextResponse.next();
  }
};

export default middleware;
export const config = {
  matcher: [ "/feeds/:path*"],
};
