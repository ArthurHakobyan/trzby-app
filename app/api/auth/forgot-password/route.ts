import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { readJson } from "@/lib/read-json";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// POST /api/auth/forgot-password  { email }
export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const ipLimited = rateLimit(`forgot-password:ip:${ip}`, 5, 10 * 60 * 1000);
  if (!ipLimited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipLimited.retryAfterSeconds) } }
    );
  }

  const body = await readJson(req);
  const email = body?.email;
  const lang = body?.lang === "en" ? "en" : "cs";
  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";

  // Always return a generic success response, whether or not the account exists,
  // so this endpoint can't be used to enumerate registered emails.
  if (!normalizedEmail) {
    return NextResponse.json({ ok: true });
  }

  // Separately cap attempts per target address so one email can't be
  // flooded with reset emails from many different IPs.
  const emailLimited = rateLimit(`forgot-password:email:${normalizedEmail}`, 3, 15 * 60 * 1000);
  if (!emailLimited.ok) {
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl, lang);
    } catch (err) {
      console.error("Failed to send password reset email:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
