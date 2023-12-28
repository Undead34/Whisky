import { useEffect, useState } from "react";

import { IUser } from "@/backend/types/globals";
import Database from "@/backend/database";

export default function useUsers(): [IUser[], boolean] {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = new Database();

    const unsubscribe = db.subscribe("users", (querySnapshot) => {
      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [users, loading];
}
