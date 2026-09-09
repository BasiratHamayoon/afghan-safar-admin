"use server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose/jwt/verify";

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

function cleanToken(rawToken) {
  if (!rawToken) return null;
  let token = decodeURIComponent(rawToken).trim();
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  if (token.startsWith("s:")) {
    token = token.slice(2).split(".")[0];
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }
  return token;
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
    const rawToken = cookieStore.get("authorization")?.value;
    const token = cleanToken(rawToken);

    const requestHeaders = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ...headers,
    };

    if (sendAuthToken && token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
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

    // Capture & save cookie reliably across Vercel and local environments
    if (expectCookie) {
      let tokenToSave = null;

      // Check all Set-Cookie headers
      const setCookies =
        typeof response.headers.getSetCookie === "function"
          ? response.headers.getSetCookie()
          : [response.headers.get("set-cookie")];

      for (const cookieStr of setCookies) {
        if (cookieStr && cookieStr.includes("authorization=")) {
          const match = cookieStr.match(/authorization=([^;]+)/);
          if (match && match[1]) {
            tokenToSave = cleanToken(match[1]);
            break;
          }
        }
      }

      // Fallback: Check JSON body
      if (!tokenToSave && (parsedData?.temp || parsedData?.token)) {
        tokenToSave = cleanToken(parsedData.temp || parsedData.token);
      }

      if (tokenToSave) {
        cookieStore.set("authorization", tokenToSave, {
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
      message: "Could not connect to server.",
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
    const rawToken = cookieStore.get("authorization")?.value;
    const token = cleanToken(rawToken);
    if (!token) return false;

    const secretKey =
      process.env.NEXT_PUBLIC_SECRET_KEY ||
      process.env.SECRET_KEY ||
      "22c79e4b-dfbe-4f8c-a2cb-4e6b5d04f6f4";

    const { payload } = await jwtVerify(
      token,
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