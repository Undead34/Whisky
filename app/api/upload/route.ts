// pages/api/upload.js

import { doc, setDoc, writeBatch } from "firebase/firestore";
import { NextResponse } from "next/server";
import { parse } from "csv-parse";
import { v4 as uuid } from "uuid";
import { db } from "@/config";
import { IUser } from "@/types/globals";

interface User {
  name: string;
  email: string;
}

// Función para parsear CSV
async function parseCSV(csvString: string): Promise<User[]> {
  return new Promise((resolve, reject) => {
    parse(
      csvString,
      { columns: true, skip_empty_lines: true },
      (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      }
    );
  });
}

// Función para crear nodos a partir de los datos
async function createNodes(data: User[]): Promise<IUser[]> {
  return data.map((item) => {
    const user: IUser = {
      id: uuid(),
      name: item.name,
      email: item.email,
      username: null,
      password: null,
      captureDate: null,
      browser: null,
      ip: null,
      os: null,
      country: null,
      countryCode: null,
      city: null,
      isp: null,
      captured: false,
      sended: false,
      read: false,
      attempts: 0,
      clicks: 0,
      visits: 0,
    };

    return user;
  });
}

// Función principal para manejar la petición POST
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");
    let data, lotName: string;

    if (contentType === "application/json") {
      const req = await request.json();
      data = "name,email\n" + req.data;
      lotName = req.name;
    } else {
      // Manejo de formData (si es necesario)
      const formData = await request.formData();
      const file: File | null = formData.get("file") as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      data = buffer.toString("utf-8");
      lotName = formData.get("lotName")?.toString() || "N/A";
    }

    const parsedData = await parseCSV(data);
    const nodes = await createNodes(parsedData);

    // Guardar nodos en la base de datos
    const batch = writeBatch(db);
    nodes.forEach((node) => {
      const nodeRef = doc(db, "users", node.id);
      batch.set(nodeRef, node);
    });
    await batch.commit();

    // Crear y guardar el lote
    const lot = {
      id: uuid(),
      type: "lot",
      name: lotName,
      nodes,
      sended: false,
    };

    await setDoc(doc(db, "lots", lot.id), lot);

    return NextResponse.json({ success: true, ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
