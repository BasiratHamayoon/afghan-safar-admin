import { NextResponse } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

// Clean and extract raw JWT token string
function cleanToken(rawToken) {
  if (!rawToken) return null;
  let token = decodeURIComponent(rawToken).trim();
  // Remove quotes if wrapped
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  // Remove express session prefix s:
  if (token.startsWith("s:")) {
    token = token.slice(2).split(".")[0];
  }
  // Remove Bearer prefix
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }
  return token;
}

// Edge-compatible JWT verification
async function jwtVerifyer(rawToken) {
  try {
    const token = cleanToken(rawToken);
    if (!token) return false;

    const secret =
      process.env.NEXT_PUBLIC_SECRET_KEY ||
      process.env.SECRET_KEY ||
      "22c79e4b-dfbe-4f8c-a2cb-4e6b5d04f6f4";

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] }
    );
    return payload; // Token is valid!
  } catch (error) {
    return false; // Invalid token
  }
}

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

  // 1. Ignore public assets
  if (
    pathname.includes("request-account-deletion") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const rawAuthToken = request.cookies.get("authorization")?.value;
  const details = rawAuthToken ? await jwtVerifyer(rawAuthToken) : false;

  // 2. If user is ALREADY logged in and visits /login -> redirect to dashboard
  if (pathname.startsWith("/login")) {
    if (details) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 3. If user is NOT logged in and visits private routes -> redirect to /login
  if (!rawAuthToken || !details) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    redirectResponse.cookies.delete("authorization");
    return redirectResponse;
  }

  // 4. Role restrictions for transport company user
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