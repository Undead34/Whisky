import { NextResponse } from "next/server";

import Database from "@/backend/database";
import { TUser } from "@/backend/types/globals";
import { parseCSV } from "@/backend/utils/utils";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");
    let data, lotName: string;

    // Validate the type of request
    if (contentType === "application/json") {
      const req = await request.json();
      data = "name,email\n" + req.data;
      lotName = req.name;
    } else {
      const formData = await request.formData();
      const file: File | null = formData.get("file") as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      data = buffer.toString("utf-8");
      lotName = formData.get("lotName")?.toString() || "N/A";
    }

    const parsedData = await parseCSV<TUser>(data);

    const db = new Database();
    db.createLot(parsedData, lotName);

    return NextResponse.json({ success: true, ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export const dynamic = "force-dynamic";
