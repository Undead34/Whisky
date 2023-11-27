"use client";

import { collection, onSnapshot } from "firebase/firestore";

import ChartDoughnut from "./components/ChartDoughnut";
import { useEffect, useState } from "react";
import Tables from "./components/Table";
import { IUser } from "@/types/globals";
import { db } from "@/config";

export default function Page() {
  const [data, setData] = useState<IUser[] | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
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

  console.log(data);

  const stats = {
    total: 0,
    emailed: 0,
    captured: 0,
    read: 0,
    clicks: 0,
  };

  if (data) {
    stats.total = data.length;
    stats.emailed = data.filter((user) => user.sended).length;
    stats.captured = data.filter((user) => user.captured).length;
    stats.read = data.filter((user) => user.read).length;
    stats.clicks = data.reduce((acumulador, objetoActual) => {
      return acumulador + objetoActual.clicks;
    }, 0);
  }

  const users = data?.filter((user) => user.captured);

  return (
    <div className="relative flex h-screen flex-1 flex-col gap-6 overflow-auto p-7 pt-8">
      <h1 className="border-b border-gray-100 py-2 text-2xl font-semibold">
        Dashboard
      </h1>

      <div className="flex h-[150px] justify-between rounded-sm px-12 py-4 shadow">
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Correos entregados</h4>
          <div className="relative h-full">
            <ChartDoughnut
              data={{ failed: stats.emailed, sent: stats.total }}
              text={`${stats.emailed}/${stats.total}`}
              color={"blue"}
              labels={["Enviados", "No enviados"]}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Informacion capturada</h4>
          <div className="relative h-full">
            <ChartDoughnut
              data={{ failed: stats.captured, sent: stats.total }}
              text={`${stats.captured}/${stats.total}`}
              labels={["Capturados", "No capturados"]}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Correos abiertos</h4>
          <div className="relative h-full">
            <ChartDoughnut
              data={{ failed: stats.read, sent: stats.total }}
              text={`${stats.read}/${stats.total}`}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Clics</h4>
          <div className="relative h-full">
            <ChartDoughnut
              data={{ failed: stats.clicks, sent: stats.total }}
              text={`${stats.clicks}/${stats.total}`}
              color={stats.clicks < stats.total ? "blue" : "red"}
            />
          </div>
        </div>
      </div>

      <div>
        <Tables values={(users && formatData(users)) ?? []}></Tables>
      </div>
    </div>
  );
}

function formatData(users: IUser[]): any {
  const format = users.map((user: any) => {
    user.captureDate = new Date(user.captureDate);

    return {
      ...user,
      nodes: [
        {
          browser: user.browser,
          ip: user.ip,
          os: user.os,
          country: user.country,
          countryCode: user.countryCode,
          city: user.city,
          isp: user.isp,
          sended: user.sended,
          captured: user.captured,
        },
      ],
    };
  });

  return format;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
