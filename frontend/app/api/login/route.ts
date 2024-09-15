import { generateJWTCookie, getRenewedCookies } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

// For build time
export const dynamic = "force-dynamic";

// Intermediate route to save session cookies on the client
export async function POST(req: NextRequest) {
  const { cookies: userResponseCookies } = await getRenewedCookies(req);
  const { user } = await req.json();
  const authUserCookie = await generateJWTCookie(user);
  
  const response = NextResponse.json({
    user
  });

  response.headers.append("Set-Cookie", userResponseCookies);
  response.headers.append("Set-Cookie", authUserCookie);

  return response;
}
