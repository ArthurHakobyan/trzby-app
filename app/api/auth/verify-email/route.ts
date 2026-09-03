import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { readJson } from "@/lib/read-json";

// POST /api/auth/verify-email  { token }
export async function POST(req: Request) {
  const body = await readJson(req);
  const token = body?.token;

  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "A valid token is required." }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const verificationToken = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "This verification link is invalid or has expired." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: verificationToken.userId }, data: { emailVerified: new Date() } }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: verificationToken.userId } }),
  ]);

  return NextResponse.json({ ok: true });
}
