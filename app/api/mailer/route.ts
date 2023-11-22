import TextTemplate from "@/app/dashboard/templates/components/TextTemplate";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { b64Image } from "./b64";

export async function GET(req: Request) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USER || "maizogabriel@gmail.com",
      pass: process.env.MAILER_PASS || "fbxudjriivkldjjm",
    },
  });

  const html = TextTemplate({
    image: b64Image,
    observer: "https://8t7w8kc4-3000.use2.devtunnels.ms/observer.png",
    redirect: "https://google.com",
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAILER_USER || "maizogabriel@gmail.com",
    to: ["maizogabriel@gmail.com"],
    subject: "Hello",
    html: html,
  });

  console.log(info);

  return NextResponse.json({ code: 200 });
}
