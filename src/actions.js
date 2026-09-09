"use server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose/jwt/verify";

// Only bypass in local development, not in production
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const fetchServer = async (
  directory,
  method = "GET",
  body,
  headers = {},
  sendAuthToken = true,
  expectCookie = false
) => {
  const rawBaseUrl =
    process.env.SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://api-afghanbooking.sanzylimited.com";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const endpoint = directory.startsWith("/") ? directory : `/${directory}`;
  const fullUrl = `${baseUrl}${endpoint}`;

  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("authorization")?.value;

    if (token) {
      token = decodeURIComponent(token);
      if (token.startsWith("s:")) {
        token = token.slice(2).split(".")[0];
      }
    }

    const requestHeaders = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ...headers,
    };

    if (sendAuthToken && token) {
      requestHeaders["Authorization"] = `Bearer ${token.trim()}`;
    }

    const isGetOrHead =
      method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD";

    const response = await fetch(fullUrl, {
      method: method.toUpperCase(),
      body: !isGetOrHead && body ? JSON.stringify(body) : undefined,
      headers: requestHeaders,
      cache: "no-store",
    });

    const rawText = await response.text();

    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      return JSON.stringify({
        success: false,
        data: [],
        message: `Server returned status ${response.status}`,
      });
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader && expectCookie) {
      const authCookieMatch = setCookieHeader.match(/authorization=([^;]+)/);
      if (authCookieMatch && authCookieMatch[1]) {
        let authValue = decodeURIComponent(authCookieMatch[1]);
        if (authValue.startsWith("s:")) {
          authValue = authValue.slice(2).split(".")[0];
        }

        cookieStore.set("authorization", authValue, {
          maxAge: 86400000 * 15,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
    }

    return JSON.stringify(parsedData);
  } catch (error) {
    return JSON.stringify({
      success: false,
      data: [],
      message: `Could not connect to ${fullUrl}.`,
    });
  }
};

const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("language");
  cookieStore.delete("authorization");
};

const getDetailsFromAuthToken = async () => {
  try {
    const cookieStore = await cookies();
    let authToken = cookieStore.get("authorization")?.value;
    if (!authToken) return false;

    authToken = decodeURIComponent(authToken);
    if (authToken.startsWith("s:")) {
      authToken = authToken.slice(2).split(".")[0];
    }

    const secretKey =
      process.env.NEXT_PUBLIC_SECRET_KEY || process.env.SECRET_KEY;
    const { payload } = await jwtVerify(
      authToken,
      new TextEncoder().encode(secretKey),
      { algorithms: ["HS256"] }
    );
    return payload;
  } catch {
    return false;
  }
};

const setLocale = async (value) => {
  const cookieStore = await cookies();
  cookieStore.set("language", value);
};

const getLocale = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("language")?.value || "en";
};

const setCookie = async (key, value) => {
  const cookieStore = await cookies();
  cookieStore.set(key, JSON.stringify(value), {
    httpOnly: true,
    sameSite: "strict",
    priority: "high",
    secure: process.env.NODE_ENV === "production",
    maxAge: 315576000000,
  });
};

const getCookie = async (key) => {
  const cookieStore = await cookies();
  return cookieStore.get(key);
};

export {
  fetchServer,
  logout,
  getDetailsFromAuthToken,
  getLocale,
  setLocale,
  getCookie,
  setCookie,
};