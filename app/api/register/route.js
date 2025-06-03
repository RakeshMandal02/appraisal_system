// this will be used for testing on Postman, or just used for seeding later we will use this code in admin users creation

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request){
    const { name, email, password, role } = await request.json();

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