import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueEmailVerification } from "@/lib/verification";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { readJson } from "@/lib/read-json";

// POST /api/auth/resend-verification  { email }
export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const ipLimited = rateLimit(`resend-verification:ip:${ip}`, 5, 10 * 60 * 1000);
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

  // Always return a generic success response, whether or not the account
  // exists or is already verified, so this endpoint can't be used to
  // enumerate registered emails.
  if (!normalizedEmail) {
    return NextResponse.json({ ok: true });
  }

  const emailLimited = rateLimit(`resend-verification:email:${normalizedEmail}`, 3, 15 * 60 * 1000);
  if (!emailLimited.ok) {
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (user && !user.emailVerified) {
    await issueEmailVerification(user.id, user.email, lang);
  }

  return NextResponse.json({ ok: true });
}
