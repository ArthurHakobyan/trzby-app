import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readJson } from "@/lib/read-json";

// GET /api/entries?month=2026-08  -> all entries for that user in that month
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // "YYYY-MM"

  const entries = await prisma.entry.findMany({
    where: {
      userId: session.user.id,
      ...(month ? { date: { startsWith: month } } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(entries);
}

// POST /api/entries  { amount, type, date }
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readJson(req);
  if (!body) {
    return NextResponse.json({ error: "Invalid entry." }, { status: 400 });
  }
  const { amount, type, date, isTip } = body;

  if (!amount || amount <= 0 || !["cash", "card"].includes(type) || !date) {
    return NextResponse.json({ error: "Invalid entry." }, { status: 400 });
  }

  const entry = await prisma.entry.create({
    data: {
      amount: Math.round(amount),
      type,
      isTip: Boolean(isTip),
      date,
      userId: session.user.id,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

// DELETE /api/entries?date=2026-08-15  -> deletes all of that user's entries for that day
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // "YYYY-MM-DD"

  if (!date) {
    return NextResponse.json({ error: "Missing date." }, { status: 400 });
  }

  await prisma.entry.deleteMany({
    where: { userId: session.user.id, date },
  });

  return NextResponse.json({ ok: true });
}
