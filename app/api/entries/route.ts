import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const { amount, type, date, isTip } = await req.json();

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
