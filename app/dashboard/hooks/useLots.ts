import { useEffect, useState } from "react";

import { TLot } from "@/backend/types/globals";
import Database from "@/backend/database";

export default function useLots(): [TLot[], boolean] {
  const [lots, setLots] = useState<TLot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = new Database();

    const unsubscribe = db.subscribe("lots", (querySnapshot) => {
      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLots(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [lots, loading];
}
