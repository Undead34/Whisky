import { db } from "@/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  console.log("Image: ", id)

  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { read: true });
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "success" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
