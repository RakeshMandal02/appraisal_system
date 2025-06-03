import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";

export async function POST(request) {
    const session = await getIronSession(request, new Response(), ironOptions);
    session.destroy();
    return new Response(JSON.stringify({ success: true }));
}
