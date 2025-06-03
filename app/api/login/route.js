import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    
    if(!user || !(await bcrypt.compare(password, user.password))){
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, ironOptions);
    session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    await session.save();

    return NextResponse.json({ message: "Login Successful", user: { id: user.id, email: user.email, role: user.role } });
}
