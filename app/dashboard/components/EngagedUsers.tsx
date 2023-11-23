// "use client";

// import {
//   Cell,
//   HeaderRow,
//   HeaderCell,
// } from "@table-library/react-table-library/table";

// import { Body, Row, Header } from "@table-library/react-table-library/table";
// import * as ReactTable from "@table-library/react-table-library/table";
// import { getTheme } from "@table-library/react-table-library/baseline";
// import { useTheme } from "@table-library/react-table-library/theme";
// import {
//   useSort,
//   HeaderCellSort,
// } from "@table-library/react-table-library/sort";
// import { FaEye, FaEyeSlash } from "react-icons/fa6";
// import { v4 as uuid } from "uuid";

// import React, { useState } from "react";

// import { IEngagedUser } from "@/app/types/shared";

// export default function EngagedUsers({ values }: IProps) {
//   const theme = useTheme({
//     ...getTheme(),
//     Table:
//       "--data-table-library_grid-template-columns: minmax(0px, 1fr) minmax(0px, max-content) minmax(0px, min-content) minmax(0px, min-content) minmax(0px, min-content) minmax(0px, 1fr) minmax(0px, max-content) minmax(0px, 1fr)",
//   });

//   const data = {
//     nodes: values,
//   };

//   data.nodes.map((node) => {
//     if (node.id === "494fc6ad-fb24-4110-8b47-05482d5aa181") {
//       console.log(node);
//     }
//   });

//   const sort = useSort(
//     data,
//     {},
//     {
//       sortFns: {
//         visits: (array) => {
//           return array.sort(
//             (a, b) => a.statistics.mail_read - b.statistics.mail_read,
//           );
//         },
//         clicks: (array) => {
//           return array.sort(
//             (a, b) => a.statistics.clicks - b.statistics.clicks,
//           );
//         },
//       },
//     },
//   );

//   const handleDownloadCsv = () => {
//     const columns = [
//       { accessor: (item: IEngagedUser) => item.id, name: "ID" },
//       { accessor: (item: IEngagedUser) => item.name, name: "Nombre" },
//       { accessor: (item: IEngagedUser) => item.email, name: "Correo" },
//       {
//         accessor: (item: IEngagedUser) => item.statistics.clicks,
//         name: "Clics",
//       },
//       {
//         accessor: (item: IEngagedUser) => item.statistics.visits,
//         name: "Visitas",
//       },
//       {
//         accessor: (item: IEngagedUser) => item.statistics.mail_read,
//         name: "Correo leído",
//       },
//       {
//         accessor: (item: IEngagedUser) => item.statistics.captured,
//         name: "Credenciales capturadas",
//       },
//       {
//         accessor: (item: IEngagedUser) => item.user_agent.ip,
//         name: "IP",
//       },
//       {
//         accessor: (item: IEngagedUser) => item.user_agent.browser,
//         name: "Navegador",
//       },
//       {
//         accessor: (item: IEngagedUser) => item.user_agent.os,
//         name: "OS",
//       },
//     ];

//     downloadAsCsv(columns, data.nodes, "table");
//   };

//   function PasswordCell({ password }: { password: string }) {
//     const [show, setShow] = useState(false);

//     return (
//       <div className="flex h-full w-full">
//         <div className="w-[80%]">
//           <input
//             className="w-full bg-transparent px-1 py-2"
//             type={show ? "text" : "password"}
//             defaultValue={password}
//             disabled
//           />
//         </div>
//         <button onClick={() => setShow(!show)} className="w-[20%]">
//           {!show ? <FaEye /> : <FaEyeSlash />}
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <button type="button" onClick={handleDownloadCsv}>
//         Descargar como CSV
//       </button>

//       <ReactTable.Table
//         data={data}
//         theme={theme}
//         layout={{ custom: true }}
//         sort={sort}
//       >
//         {(tableList: IEngagedUser[]) => {
//           return (
//             <React.Fragment key={uuid()}>
//               <Header>
//                 <HeaderRow>
//                   <HeaderCell>Nombre</HeaderCell>
//                   <HeaderCell>Correo</HeaderCell>
//                   <HeaderCellSort sortKey="clicks">Clics</HeaderCellSort>
//                   <HeaderCell>Visitas</HeaderCell>
//                   <HeaderCellSort sortKey="visits">Vistas</HeaderCellSort>
//                   <HeaderCell>Cédula</HeaderCell>
//                   <HeaderCell>Fecha</HeaderCell>
//                   <HeaderCell>Metadatos</HeaderCell>
//                 </HeaderRow>
//               </Header>
//               <Body>
//                 {tableList.map((item) => {
//                   const tempDate = new Date(
//                     // @ts-ignore
//                     item.credentials.date.seconds * 1000,
//                   );

//                   return (
//                     <Row key={uuid()} item={item}>
//                       <Cell>
//                         <div title={item.name}>{item.name}</div>
//                       </Cell>
//                       <Cell>{item.email}</Cell>
//                       <Cell>{item.statistics.clicks}</Cell>
//                       <Cell>{item.statistics.visits}</Cell>
//                       <Cell>
//                         {item.statistics.mail_read ? "Visto" : "No visto"}
//                       </Cell>
//                       <Cell>
//                         <PasswordCell
//                           password={item.credentials.identity_document}
//                         />
//                       </Cell>
//                       <Cell>{tempDate.toLocaleString("es-VE")}</Cell>
//                       <Cell>
//                         <ul>
//                           <li>{item.user_agent.ip}</li>
//                           <li>{item.user_agent.browser}</li>
//                           <li>{item.user_agent.os}</li>
//                         </ul>
//                       </Cell>
//                     </Row>
//                   );
//                 })}
//               </Body>
//             </React.Fragment>
//           );
//         }}
//       </ReactTable.Table>
//     </>
//   );
// }

// const escapeCsvCell = (cell: string) => {
//   if (cell == null) {
//     return "";
//   }
//   const sc = cell.toString().trim();
//   if (sc === "" || sc === '""') {
//     return sc;
//   }
//   if (
//     sc.includes('"') ||
//     sc.includes(",") ||
//     sc.includes("\n") ||
//     sc.includes("\r")
//   ) {
//     return '"' + sc.replace(/"/g, '""') + '"';
//   }
//   return sc;
// };

// const makeCsvData = (
//   columns: { accessor: (item: any) => any; name: string }[],
//   data: IEngagedUser[],
// ) => {
//   return data.reduce(
//     (csvString, rowItem) => {
//       return (
//         csvString +
//         columns
//           .map(({ accessor }) => escapeCsvCell(accessor(rowItem)))
//           .join(",") +
//         "\r\n"
//       );
//     },
//     columns.map(({ name }) => escapeCsvCell(name)).join(",") + "\r\n",
//   );
// };

// const downloadAsCsv = (
//   columns: { accessor: (item: any) => any; name: string }[],
//   data: IEngagedUser[],
//   filename: string,
// ) => {
//   const csvData = makeCsvData(columns, data);
//   const csvFile = new Blob([csvData], { type: "text/csv" });
//   const downloadLink = document.createElement("a");

//   downloadLink.style.display = "none";
//   downloadLink.download = filename;
//   downloadLink.href = window.URL.createObjectURL(csvFile);
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
// };

// interface IProps {
//   values: IEngagedUser[];
// }
