import { dbIncremetnVisits, markAsReaded } from "../lib/firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, action } = await req.json();

  if (action === "visits") {
    console.log("El usuario ", id, " ha visitado la pagina");
    await dbIncremetnVisits(id);
  } else if (action === "read") {
    console.log("El usuario ", id, " ha abierto el correo");
    await markAsReaded(id);
  }

  return NextResponse.json({ status: "OK" }, { status: 200 });
}
