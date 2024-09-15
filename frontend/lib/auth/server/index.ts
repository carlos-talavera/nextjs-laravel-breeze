import { AUTH_COOKIE_NAME, EXPIRED_SESSION_PARAM, LOGIN_ROUTE } from "@/constants";
import { User } from "@/types";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createUserToken, verifyUserToken } from "../jwt";

const isSecureCookie = process.env.NODE_ENV !== "development";

export const generateJWTCookie = async (user: User) => {
  const token = await createUserToken({ data: user });

  const cookie = serialize(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  return cookie;
}

export const expireCookie = (cookieKey: string, isSecure: boolean = isSecureCookie) => {
  const secureAttribute = isSecure ? "Secure;" : "";
  return `${cookieKey}=; HttpOnly; ${secureAttribute} SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const redirectToLoginWithExpiredCookie = (url: URL) => {
  url.pathname = LOGIN_ROUTE;
  url.searchParams.delete(EXPIRED_SESSION_PARAM); // Avoid infinite redirects

  const response = NextResponse.redirect(url);
  response.headers.append("Set-Cookie", expireCookie(AUTH_COOKIE_NAME));
  return response;
};

const fetchUser = async (req?: NextRequest) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const referer = process.env.FRONTEND_URL as string; // * Important so it matches Sanctum's accepted domains
  const cookie = req?.headers.get("Cookie") || cookies().toString() || "";

  const fetchResponse = await fetch(`${backendUrl}/api/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: referer, // * Important so it matches Sanctum's accepted domains
      Cookie: cookie, // * Important so the cookies of the session are sent with the request
    },
    cache: "no-store",
  });

  if (!fetchResponse.ok) {
    // If the response is not ok, throw an error
    const error = new Error(`HTTP error! status: ${fetchResponse.status}`);
    // Add response data if it exists
    (error as any).response = {
      status: fetchResponse.status,
      data: await fetchResponse.json(),
    };
    throw error;
  }

  return fetchResponse;
};

export const getRenewedCookies = async (req?: NextRequest) => {
  try {
    const fetchUserResponse = await fetchUser(req);
    const user = await fetchUserResponse.json();

    const cookies = fetchUserResponse.headers.get("Set-Cookie") as string;
    const csrfTokenCookie = cookies
      .trim()
      .split(";")
      .find((cookie: string) => cookie.startsWith("XSRF-TOKEN")) as string;
    const authUserCookie = await generateJWTCookie(user);

    return {
      cookies,
      csrfTokenCookie,
      authUserCookie
    };
  } catch (error) {
    console.error("Get Renewed Cookies Error:", error);
    return {
      cookies: "",
      csrfTokenCookie: "",
      authUserCookie: ""
    };
  }
}

export const auth = async () => {
  try {
    const token = cookies().get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return { user: null };
    }

    const user = await verifyUserToken(token);
    return { user };
  } catch (error) {
    console.error("Auth Error:", error);
    return { user: null };
  }
}