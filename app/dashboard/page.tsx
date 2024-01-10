import { dbGetTargets, dbGetVictims } from "../lib/firebase/firestore";
import ChartDoughnut from "../ui/dashboard/chart-doughnut";
import Tables from "../ui/dashboard/tables";

export default async function Page() {
  const users = await dbGetVictims();
  const victims = await dbGetTargets();

  const stats = {
    total: users.length,
    emailed: victims.filter((user: any) => user.sended).length,
    captured: users.filter((user: any) => user.captured).length,
    read: users.filter((user: any) => user.readed).length,
    clicks: users.reduce((acumulador: any, object: any) => {
      return acumulador + object.clicks;
    }, 0),
    users: users.filter((user: any) => user.captured),
  };

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
        <Tables values={users}></Tables>
      </div>
    </div>
  );
}
