"use server";

import { parseCSV } from "@/backend/utils/utils";
import { TUser } from "@/backend/types/globals";
import Database from "@/backend/database";

export default async function createLot(state: any, payload: FormData) {
  try {
    const targets = (payload.get("targets") as string).trim();
    const lotName = (payload.get("lot_name") as string).trim();
    const csv = "name,email\n" + targets;

    const parsedData = await parseCSV<TUser>(csv);

    const db = new Database();
    db.createLot(parsedData, lotName);

    // revalidatePath("/");
    return { message: "Datos cargados correctamente" };
  } catch (e) {
    return { message: "Error al cargar los datos" };
  }
}
