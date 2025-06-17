// this will be used for testing on Postman, or just used for seeding later we will use this code in admin users creation

import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request){
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if(existing) {
        return new Response(JSON.stringify({ error: "User already exists" }),{
           status: 400, 
        });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password:hashed, role},
    });
    return new Response(JSON.stringify({ success: true }));
}
