import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Intermediate route to get user's info from the client (since auth_user cookie is HttpOnly)
export async function GET(req: NextRequest) {
  const { user } = await auth();

  return NextResponse.json({
    user
  });
}