import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

const ONLY_AUTHENTICATED_USERS_PATHS: string[] = ["/app"];
const ONLY_UNAUTHENTICATED_USERS_PATHS: string[] = ["/auth"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = new URL(req.url);

  const isPathUnauthenticated = ONLY_UNAUTHENTICATED_USERS_PATHS.some((path) =>
    url.pathname.includes(path),
  );
  const isPathAuthenticated = ONLY_AUTHENTICATED_USERS_PATHS.some((path) =>
    url.pathname.includes(path),
  );

  // if the path is authenticated, we only allow authenticated users
  if (isPathAuthenticated) {
    if (session) {
      return res;
    } else {
      console.log("path is protected for non-authenticated users, redirecting");
      return NextResponse.redirect(`${req.nextUrl.origin}/auth/log-in`);
    }
  }

  // if the path is only for unauthenticated users, we only allow unauthenticated users
  if (isPathUnauthenticated) {
    if (session) {
      console.log("path is protected for authenticated users, redirecting");
      console.log(req.nextUrl.origin);
      return NextResponse.redirect(`${req.nextUrl.origin}/`);
    } else {
      return res;
    }
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/, /_auth/ (special pages for OG tags proxying and password protection)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/|_next/|.*\\..*|_proxy/|_auth/|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
