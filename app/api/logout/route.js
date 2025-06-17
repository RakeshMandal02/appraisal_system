import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { NextResponse } from "next/server";

export async function POST(request) {
    const res = NextResponse.next();
    const session = await getIronSession(request, res, ironOptions);
    session.destroy();
    await session.save();
    return NextResponse.json({ success: true });
}
