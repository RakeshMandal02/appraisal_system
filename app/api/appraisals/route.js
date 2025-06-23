import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, ironOptions);

  console.log("Session object:", session);

  if (!session.user || !["MANAGER", "REVIEWER"].includes(session.user.role)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const status = searchParams.get("status"); // 'pending' or 'reviewed'

  const skip = (page - 1) * limit;

  let where = {};
  if (status === "pending") {
    where.reviewerRemarks = null;
  } else if (status === "reviewed") {
    where.reviewerRemarks = { not: null };
  }

  try {
    const total = await prisma.appraisal.count({ where });

    const appraisals = await prisma.appraisal.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        employee: {
          select: { name: true, email: true },
        },
      },
    });

    const formatted = appraisals.map((a) => ({
      id: a.id,
      content: a.content,
      feedback: a.feedback,
      reviewerRemarks: a.reviewerRemarks,
      employeeName: a.employee.name,
      employeeEmail: a.employee.email,
    }));

    return Response.json({
      appraisals: formatted,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET appraisals error:", err);
    return new Response("Server error", { status: 500 });
  }
}
