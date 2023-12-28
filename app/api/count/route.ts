import Database from "@/backend/database";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  const db = new Database();
  db.clicksIncrement(id);

  return NextResponse.json({ status: "success" });
}

export const dynamic = "force-dynamic";
