import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, ironOptions);

  if (!session.user || session.user.role !== "MANAGER") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { appraisalId, feedback } = await req.json();

  if (!appraisalId || !feedback) {
    return new Response("Missing fields", { status: 400 });
  }

  try {
    // Since feedback and managerId fields do not exist in the schema, update only existing fields
    // For example, update status to REVIEWED_BY_MANAGER
    const updated = await prisma.appraisal.update({
      where: { id: appraisalId },
      data: {
        status: "REVIEWED_BY_MANAGER",
        // Optionally, you can store feedback in content or another existing field if appropriate
        content: feedback, // store feedback in content as a workaround
      },
    });

    return Response.json({ success: true, updated });
  } catch (err) {
    console.error("Manager feedback error:", err);
    return new Response("Server error", { status: 500 });
  }
}
