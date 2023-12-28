import { NextResponse } from "next/server";

import { TLot } from "@/backend/types/globals";
import Database from "@/backend/database";

export async function POST(request: Request) {
  try {
    const jsonData: TLot = await request.json();

    if (jsonData.type !== "lot") throw new Error("Can't Lot");

    const db = new Database();
    await db.deleteLot(jsonData.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}

export const dynamic = "force-dynamic";
