import { NextResponse } from "next/server";

import { setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import Mailer, { oneTimeEmail } from "./utils";
import { db } from "@/config";
import { ILot, IUser } from "@/types/globals";

export async function POST(request: Request) {
  const isLot = (data: any): data is ILot => data.type === "lot";
  const jsonData: ILot | IUser = await request.json();

  Mailer.origin = new URL(request.url).origin;

  if (isLot(jsonData)) {
    const lot = doc(db, "lots", jsonData.id);
    const data: ILot = (await getDoc(lot)).data() as any;

    Mailer.push(data.nodes, jsonData.id);
    updateDoc(lot, { sended: true });

    return NextResponse.json({ success: true });
  } else {
    try {
      const email: any = jsonData as any;

      const response: any = await oneTimeEmail(email);

      if (response.rejected && response.rejected.length) {
        return NextResponse.json(
          { status: "fail", message: "ERROR" },
          { status: 400 }
        );
      }

      const docRef = doc(db, "lots", email.parentNode.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ILot;
        const nodes = data.nodes.map((item) => {
          if (item.id === email.id) {
            return { ...item, sended: true };
          }
          return item;
        });

        nodes.map(async (item) => {
          if (item.sended) {
            await updateDoc(doc(db, "users", item.id), {
              sended: true,
            });
          }
        });

        await updateDoc(docRef, { nodes: nodes });
      }

      return NextResponse.json(
        { status: "success", message: "OK" },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { status: "fail", message: "ERROR" },
        { status: 500 }
      );
    }
  }
}
