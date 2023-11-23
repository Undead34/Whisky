import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/config";

let cache: any = { data: null };
let isSubscribed = false;

async function initializeAndSubscribe() {
  if (cache.data === null) {
    // Primero, obtén los datos actuales y actualiza la caché
    const querySnapshot = await getDocs(collection(db, "lots"));
    cache.data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  if (!isSubscribed) {
    // Luego, configura la suscripción
    const unsubscribe = onSnapshot(collection(db, "lots"), (querySnapshot) => {
      cache.data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });

    isSubscribed = true;
  }
}

// Llama a initializeAndSubscribe al cargar el módulo
initializeAndSubscribe();

export function GET() {
  return NextResponse.json(cache.data, { status: 200 });
}
