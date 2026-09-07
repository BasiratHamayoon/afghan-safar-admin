import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Safe, Edge-compatible JWT verification
async function jwtVerifyer(token) {
  try {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY || process.env.SECRET_KEY;
    if (!secret) {
      console.error("JWT Secret Key is missing in environment variables!");
      return false;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] }
    );
    return payload; // Token is valid
  } catch (error) {
    return false; // Invalid or expired token
  }
}

// Whitelisted routes for transport company users
const allowedPatternsCompanyUser = [
  /^\/$/,
  /^\/transportations(\/.*)?$/,
  /^\/add-transportations$/,
  /^\/send-notifications$/,
  /^\/booked-tickets(\/.*)?$/,
  /^\/profile$/,
  /^\/my-company$/,
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Ignore account deletion or public assets
  if (pathname.includes("request-account-deletion")) return NextResponse.next();

  const authToken = request.cookies.get("authorization")?.value;

  // 2. Handle /login route
  if (pathname.startsWith("/login")) {
    if (authToken) {
      const details = await jwtVerifyer(authToken);
      // ONLY redirect to dashboard if the token is ACTUALLY VALID
      if (details) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    // If no token or token is invalid, let user see the login page cleanly
    return NextResponse.next();
  }

  // 3. Protect all private routes
  const details = authToken ? await jwtVerifyer(authToken) : false;

  // If no token or token validation fails, clear cookies and redirect to /login
  if (!authToken || !details) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    redirectResponse.cookies.delete("authorization");
    redirectResponse.cookies.delete("language");
    return redirectResponse;
  }

  // 4. Role-based route protection for transport_company_user
  if (details.role === "transport_company_user") {
    const isAllowed = allowedPatternsCompanyUser.some((pattern) =>
      pattern.test(pathname)
    );
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};