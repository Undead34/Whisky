import { NextResponse } from "next/server";
import Database from "@/backend/database";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const db = new Database();
    await db.markAsRead(id);

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "success" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
