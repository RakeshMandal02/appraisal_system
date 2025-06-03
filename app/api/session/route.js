import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, ironOptions);
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user: session.user });
}
