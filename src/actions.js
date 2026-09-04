"use server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const fetchServer = async (
  directory,
  method,
  body,
  headers,
  sendAuthToken = true,
  expectCookie = false
) => {
  const rawBaseUrl =
    process.env.SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "http://127.0.0.1:5500";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const endpoint = directory.startsWith("/") ? directory : `/${directory}`;
  const fullUrl = `${baseUrl}${endpoint}`;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authorization")?.value;

    const requestHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    };

    // Forward the token in ALL formats the backend middleware might expect
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
      requestHeaders["authorization"] = `Bearer ${token}`;
      requestHeaders["Cookie"] = `authorization=${token}`;
    }

    const isGetOrHead =
      !method || method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD";

    const response = await fetch(fullUrl, {
      method: method ? method.toUpperCase() : "GET",
      body: !isGetOrHead && body ? JSON.stringify(body) : undefined,
      headers: requestHeaders,
      credentials: "include",
    });

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader && expectCookie) {
      const authCookieMatch = setCookieHeader.match(/authorization=([^;]+)/);
      if (authCookieMatch && authCookieMatch[1]) {
        cookieStore.set("authorization", authCookieMatch[1], {
          maxAge: 86400000 * 15,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          path: "/",
        });
      }
    }

    const parsedData = await response.json();
    return JSON.stringify(parsedData);
  } catch (error) {
    console.error(`❌ [fetchServer] Connection failed to ${fullUrl}:`, error.message);
    return JSON.stringify({
      success: false,
      message: "Could not communicate with backend server.",
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
    const authToken = cookieStore.get("authorization")?.value;
    if (!authToken) return false;

    const secretKey =
      process.env.NEXT_PUBLIC_SECRET_KEY || process.env.SECRET_KEY;
    const { payload } = await jwtVerify(
      authToken,
      new TextEncoder().encode(secretKey),
      { algorithms: ["HS256"] }
    );
    return payload;
  } catch (error) {
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
    secure: true,
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