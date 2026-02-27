import { NextResponse } from "next/server";
import { prisma } from "@/utils/db.ts";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token || token !== process.env.KEEP_ALIVE_TOKEN) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  // سبک‌ترین کوئری ممکن
  await prisma.product.findFirst({
    select: { id: true },
  });

  return NextResponse.json({ ok: true, ts: Date.now() });
}
