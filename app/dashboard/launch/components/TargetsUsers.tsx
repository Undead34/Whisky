"use client";

import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import TableTargets from "./TableTargets";
import { db } from "@/config";

export default function TargetsUsers() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lots"), (querySnapshot) => {
      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!data) return <div>Cargando...</div>;

  return <TableTargets data={data ?? []} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
