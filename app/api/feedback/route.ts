import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/feedback  { message }
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();
  const trimmed = typeof message === "string" ? message.trim() : "";

  if (!trimmed || trimmed.length > 2000) {
    return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: {
      message: trimmed,
      userId: session.user.id,
    },
  });

  return NextResponse.json(feedback, { status: 201 });
}
