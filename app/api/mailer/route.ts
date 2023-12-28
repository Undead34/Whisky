import { NextResponse } from "next/server";

import { IUser, TLot } from "@/backend/types/globals";
import Database from "@/backend/database";
import Mailer from "@/backend/mailer";

export async function POST(request: Request) {
  try {
    const data: TLot | IUser = await request.json();
    const db = new Database();

    // Check origin
    if (!Mailer.origin) {
      Mailer.origin = new URL(request.url).origin;
    }

    if ("type" in data && data.type === "lot") {
      try {
        data as TLot;
        const lots = await db.getLot(data.id);
        const mails = lots.nodes.map((users: IUser) => {
          return { email: users.email, id: users.id };
        });

        const end = (success: string[]) => {
          db.markAsSended(data.id);
          db.markEmailsAsSent(success, data.id);
        };

        const mailer = Mailer.getInstance(end);
        mailer.push(mails);
      } catch (error) {
        db.markAsSended(data.id, false);
        console.log(error);
        return NextResponse.json(
          { status: "fail", message: "ERROR" },
          { status: 500 }
        );
      }
    } else {
      try {
        const user = data as IUser;
        const response = await Mailer.sendMail({
          email: user.email,
          id: user.id,
        });
        console.log(response);
        //@ts-ignore
        db.markEmailsAsSent([user.id], data.parentNode.id);
      } catch (error) {
        return NextResponse.json(
          { status: "fail", message: "ERROR" },
          { status: 500 }
        );
      }
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

export const dynamic = "force-dynamic";
