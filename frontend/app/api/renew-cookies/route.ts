import { getRenewedCookies } from "@/lib/auth/server";
import serverSideRequestsManager from "@/lib/auth/server-side-requests-manager";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Intermediate route to renew cookies
export async function GET(req: NextRequest) {
  let cookies = serverSideRequestsManager.getCookiesString;

  if (!cookies) {
    const { cookies: userCookies } = await getRenewedCookies(req);

    cookies = userCookies;
  }

  const response = NextResponse.json({});

  response.headers.append("Set-Cookie", cookies);

  return response;
}