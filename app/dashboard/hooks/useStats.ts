import { useEffect, useState } from "react";

import { IStats } from "@/backend/types/globals";
import useUsers from "./useUsers";

export default function useStats(): [IStats, boolean] {
  const [users, isLoading] = useUsers();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<IStats>({
    total: 0,
    emailed: 0,
    captured: 0,
    read: 0,
    clicks: 0,
    users: [],
  });

  useEffect(() => {
    if (users) {
      setStats({
        total: users.length,
        emailed: users.filter((user) => user.sended).length,
        captured: users.filter((user) => user.captured).length,
        read: users.filter((user) => user.read).length,
        clicks: users.reduce((acumulador, objetoActual) => {
          return acumulador + objetoActual.clicks;
        }, 0),
        users: users.filter((user) => user.captured),
      });
    }
  }, [users]);

  useEffect(() => {
    setLoading(false);
  }, [isLoading]);

  return [stats, loading];
}
