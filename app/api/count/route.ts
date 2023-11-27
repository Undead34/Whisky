import { db } from "@/config";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { clicks: increment(1) });
  }

  return NextResponse.json({ status: "success" });
}

export const dynamic = "force-dynamic";
