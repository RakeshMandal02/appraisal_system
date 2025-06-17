import { getIronSession } from "iron-session";
import { ironOptions } from "../../lib/session";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  console.log("Request body received:", req.body);

  try {
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
    const { email, password } = body;
    console.log("Login attempt for email:", email);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("User not found");
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password mismatch");
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const session = await getIronSession(req, res, ironOptions);
    session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    await session.save();

    console.log("Login successful for user:", user.email);

    res.status(200).json({ message: "Login Successful", user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    console.error(error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
}
