import ChartDoughnut from "./components/ChartDoughnut";
import Tables from "./components/Table";

export default function Page() {
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
              data={{ sent: 10, failed: 10 }}
              color={"blue"}
              text={`10/10`}
              labels={["Enviados", "No enviados"]}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Informacion capturada</h4>
          <div className="relative h-full">
            <ChartDoughnut
              data={{ sent: 10, failed: 10 }}
              text={`10/10`}
              labels={["Capturados", "No capturados"]}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Correos abiertos</h4>
          <div className="relative h-full">
            <ChartDoughnut data={{ sent: 10, failed: 10 }} text={`10/10`} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Clics</h4>
          <div className="relative h-full">
            <ChartDoughnut
              data={{ sent: 10, failed: 10 }}
              text={`10/10`}
              color="blue"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center font-semibold">Visitas</h4>
          <div className="relative h-full">
            <ChartDoughnut
              data={{ sent: 10, failed: 10 }}
              text={`10/10`}
              color="blue"
            />
          </div>
        </div>
      </div>

      <div>
        <Tables values={[]}></Tables>
      </div>
    </div>
  );
}


// {
//   /* <ChartDoughnut
//               data={{
//                 sent: statistics.captured_info_no_send,
//                 failed: statistics.captured_info,
//               }}
//               labels={}
//               text={`${statistics.captured_info}/${
//                 statistics.mails_delivered + statistics.mails_delivered_no_send
//               }`}
//             /> */
// }

// import { onSnapshot, doc, collection } from "firebase/firestore";

// import Tables from "./components/EngagedUsers";
// import { ILotTargets } from "../types/shared";
// import { db } from "../api/firebase.config";
// import { v4 as uuid } from "uuid";

// const [data, setData] = useState<any>([]);
// const [statistics, setStatistics] = useState({
//   mails_delivered: 0,
//   mails_delivered_no_send: 0,
//   captured_info: 0,
//   captured_info_no_send: 0,
//   mails_read: 0,
//   mails_no_read: 0,
//   visits: 0,
//   clicks: 0,
// });

// useEffect(() => {
//   try {
//     const unsubscribeGraphs = onSnapshot(
//       doc(db, "statisctics", "visits"),
//       (querySnapshot) => {
//         const data = querySnapshot.data();
//         setStatistics((prevStat: any) => ({ ...prevStat, ...data }));
//       },
//     );

//     const unsubscribeUsers = onSnapshot(
//       collection(db, "users"),
//       (querySnapshot) => {
//         const statistics = {
//           captured_info: 0,
//           captured_info_no_send: 0,
//           mails_read: 0,
//           mails_no_read: 0,
//         };

//         const users = querySnapshot.docs.map((doc) => {
//           const userData = doc.data();

//           if (userData.statistics.captured) {
//             statistics.captured_info++;
//           } else {
//             statistics.captured_info_no_send++;
//           }

//           if (userData.statistics.mail_read) {
//             statistics.mails_read++;
//           } else {
//             statistics.mails_no_read++;
//           }

//           return { id: doc.id, ...userData };
//         });

//         setStatistics((prevStat: any) => ({ ...prevStat, ...statistics }));
//         setData(users);
//       },
//     );

//     const unsubscribeLots = onSnapshot(
//       collection(db, "lots"),
//       (querySnapshot) => {
//         const statistics = {
//           mails_delivered: 0,
//           mails_delivered_no_send: 0,
//         };
//         querySnapshot.docs.map((doc) => {
//           const lotsData: ILotTargets = doc.data() as any;

//           lotsData.nodes.map((node) => {
//             if (node.sended) {
//               statistics.mails_delivered++;
//             } else {
//               statistics.mails_delivered_no_send++;
//             }
//           });
//         });

//         setStatistics((prevStat: any) => ({ ...prevStat, ...statistics }));
//       },
//     );

//     return () => {
//       unsubscribeGraphs();
//       unsubscribeUsers();
//       unsubscribeLots();
//     };
//   } catch (error) {
//     console.error(error);
//   }
// }, []);
