import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req, res) {
    const session = await getIronSession(req, res, ironOptions);

    if(!session.user || session.user.role !== "ADMIN") {
        return new Response("Unauthorized", {status: 403});
    }

    const { name, email,password, role} = await req.json();

    if(!name || !email || !password || !role) {
        return new Response("All fields are required" , { status:400});
    }

    const existing = await prisma.user.findUnique({ where: { email }});
    if(existing) {
        return new Response("Email already exists", { status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        }
    })
    return new Response("User Created successfully");
}
