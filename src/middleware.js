import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { logout } from "./actions";

// 1. Move helper function to top (or use standard 'function' for hoisting)
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
    console.error("JWT Verification Failed:", error.message);
    return false; // Invalid token
  }
}

const allowedPatterns = [
  /^\/$/, // "/"
  /^\/transportations$/,
  /^\/add-transportations$/,
  /^\/send-notifications$/,
  /^\/booked-tickets$/,
  /^\/profile$/,
  /^\/my-company$/,
  /^\/transportations(\/.*)?$/,
  /^\/booked-tickets(\/.*)?$/,
];

export async function middleware(request) {
  if (request.url.includes("request-account-deletion")) return;

  const authToken = request.cookies.get("authorization")?.value;

  if (request.url.includes("login") && request.cookies.has("authorization")) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (!request.url.includes("login")) {
    const details = authToken ? await jwtVerifyer(authToken) : false;

    const isAllowed = allowedPatterns.some((pattern) =>
      pattern.test(request.nextUrl.pathname)
    );

    if (details?.role === "transport_company_user" && !isAllowed) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!authToken || !details) {
      await logout();
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|images).*)"],
};