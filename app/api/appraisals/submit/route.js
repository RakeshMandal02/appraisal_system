import { getIronSession } from "iron-session";
import { ironOptions } from "@lib/session";
import { prisma } from "@lib/prisma";

export async function POST(req) {
    const session = await getIronSession(req.cookies, ironOptions);
    const user = session.user;

    if(!user || user.role !== "EMPLOYEE") {
        return new Response("unauthorized", { status:401});
    }

    const { content } = await req.json();

    try{
        const appraisal = await prisma.appraisal.create({
            data: {
                employeeId: user.id,
                content,
            },
        });

        return new Response(JSON.stringify({ message: "Appraisal submitted", appraisal}), { status: 200 });
    } catch(error){
        console.error("Appraisal Submission Error:",error)
        return new Response("Failed to submit appraisal", {status:500})
    }
}
