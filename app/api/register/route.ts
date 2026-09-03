import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { issueEmailVerification } from "@/lib/verification";
import { readJson } from "@/lib/read-json";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limited = rateLimit(`register:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const body = await readJson(req);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { name, email, password, lang } = body;

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Email and a password of at least 6 characters are required." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: name || null, email: normalizedEmail, password: hashed },
  });

  await issueEmailVerification(user.id, user.email, lang === "en" ? "en" : "cs");

  return NextResponse.json({ id: user.id, email: user.email });
}
