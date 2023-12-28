"use client";

import ChartDoughnut from "./components/ChartDoughnut";
import { IUser } from "@/backend/types/globals";
import Tables from "./components/Table";
import useStats from "./hooks/useStats";

export default function Page() {
  const [stats, isLoading] = useStats();

  if (isLoading) return <div>Cargando...</div>;

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
        <Tables values={formatData(stats.users)}></Tables>
      </div>
    </div>
  );
}

function formatData(users: IUser[]): Partial<IUser>[] {
  const format = users.map((user: Partial<IUser>) => {
    //@ts-ignore
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
