import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("Session API called");
  console.log("Request headers:", req.headers.get("cookie"));
  const res = NextResponse.next();
  const session = await getIronSession(req, res, ironOptions);
  console.log("Session user:", session.user);
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user: session.user });
}
