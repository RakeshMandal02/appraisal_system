import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const res = new Response();

  const session = await getIronSession(req, res, ironOptions);
  if (!session.user || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 403 });
  }

  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return new Response("Email and newPassword are required", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return new Response("Password reset successfully", { status: 200 });
  } catch (error) {
    return new Response("Error resetting password", { status: 500 });
  }
}
