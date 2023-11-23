"use client";

import React from "react";

import {
  Table,
  HeaderRow,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { Virtualized } from "@table-library/react-table-library/virtualized";
import { useTree, CellTree } from "@table-library/react-table-library/tree";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useTheme } from "@table-library/react-table-library/theme";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface ITableProps {
  values: any[];
}

function PasswordCell({ password }: { password: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex h-full w-full">
      <div className="w-[80%]">
        <input
          className="w-full bg-transparent px-1 py-2"
          type={show ? "text" : "password"}
          defaultValue={password}
          disabled
        />
      </div>
      <button onClick={() => setShow(!show)} className="w-[20%]">
        {!show ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
}

const z: any = [];

for (let x = 0; x < 29; x++) {
  z.push({
    id: uuid(),
    username:
      Math.floor(Math.random() * 10000000) - Math.floor(Math.random() * 100000),
    password: "Loki123--",
    captureDate: new Date(2020, 2, 28),
    isCaptured: !0,
    isRead: !0,
    numClicks: 22,
    numVisits: 15,
    nodes: [
      {
        id: "metadata-" + uuid(),
        ip: "::1",
        os: "Windows 11",
        browser: "Chrome 90",
        country: "Venezuela",
        countryCode: "VE",
        city: "Caracas",
        isp: "Fibex Telecom",
        nodes: null,
      },
    ],
  });
}

export default function Tables(props: ITableProps) {
  const theme = useTheme({
    ...getTheme(),
    Table:
      "--data-table-library_grid-template-columns: " +
      "minmax(60px, min-content) minmax(122px, 1fr) minmax(122px,  1fr) " +
      "minmax(60px, min-content) minmax(122px, 1fr) minmax(60px, min-content) minmax(60px, min-content) minmax(0px, 1fr)",
  });

  const { values } = props;
  const ROW_HEIGHT = 30;

  const data = {
    nodes: z,
  };

  const tree = useTree(data);

  return (
    <div style={{ height: "600px" }}>
      <Table
        data={data}
        layout={{ isDiv: true, fixedHeader: true, custom: true }}
        theme={theme}
        tree={tree}
      >
        {(tableList: any) => (
          <Virtualized
            tableList={tableList}
            rowHeight={ROW_HEIGHT}
            header={() => (
              <HeaderRow>
                <HeaderCell stiff>#</HeaderCell>
                <HeaderCell>Username</HeaderCell>
                <HeaderCell>Password</HeaderCell>
                <HeaderCell>Read</HeaderCell>
                <HeaderCell>Captured</HeaderCell>
                <HeaderCell>Capture date</HeaderCell>
                <HeaderCell>Clicks</HeaderCell>
                <HeaderCell>Visits</HeaderCell>
              </HeaderRow>
            )}
            body={(item, index) => (
              <Row item={item}>
                <CellTree item={item} stiff>
                  {!item.id.toString().startsWith("metadata") ? index : ""}
                </CellTree>
                <Cell>
                  {item?.username ||
                    (item.ip && <PasswordCell password={"IP: " + item.ip} />) ||
                    "N/A"}
                </Cell>
                <Cell>
                  {(item?.password && (
                    <PasswordCell password={item?.password} />
                  )) ||
                    "OS: " + item.os ||
                    "N/A"}
                </Cell>
                <Cell>{item?.isRead ? "Yes" : "No"}</Cell>
                <Cell>
                  {item?.captureDate?.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }) ||
                    "Browser: " + item.browser ||
                    "N/A"}
                </Cell>
                <Cell>
                  {item?.isCaptured?.toString() ||
                    "Country: " + item.country ||
                    "N/A"}
                </Cell>
                <Cell>{item?.isRead?.toString() || "false"}</Cell>
                <Cell>{item?.numClicks || "City: " + item.city || "N/A"}</Cell>
                <Cell>{item?.numVisits || "ISP: " + item.isp}</Cell>
              </Row>
            )}
          />
        )}
      </Table>
    </div>
  );
}

// import { Body, Row, Header } from "@table-library/react-table-library/table";
// import { HeaderRow, Cell } from "@table-library/react-table-library/table";
// import * as ReactTable from "@table-library/react-table-library/table";

// import { Virtualized } from "@table-library/react-table-library/virtualized";
// import { useTree, CellTree } from "@table-library/react-table-library/tree";
// import { HeaderCellSort } from "@table-library/react-table-library/sort";
// import { getTheme } from "@table-library/react-table-library/baseline";
// import { HeaderCell } from "@table-library/react-table-library/table";
// import { useTheme } from "@table-library/react-table-library/theme";
// import { useSort } from "@table-library/react-table-library/sort";

// <div style={{ height: "600px" }}>
//   <ReactTable.Table data={data} layout={{ isDiv: true, fixedHeader: true }}>
//     {(tableList: any) => (
//       <Virtualized
//         tableList={tableList}
//         rowHeight={ROW_HEIGHT}
//         header={() => (
//           <HeaderRow>
//             <HeaderCell stiff>Index</HeaderCell>
//             <HeaderCell>Task</HeaderCell>
//             <HeaderCell>Deadline</HeaderCell>
//             <HeaderCell>Type</HeaderCell>
//             <HeaderCell>Complete</HeaderCell>
//             <HeaderCell>Tasks</HeaderCell>
//           </HeaderRow>
//         )}
//         body={(item, index) => (
//           <Row item={item}>
//             <Cell stiff>{index}</Cell>
//             <Cell>{item.name}</Cell>
//             <Cell>
//               {item.deadline.toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "2-digit",
//                 day: "2-digit",
//               })}
//             </Cell>
//             <Cell>{item.type}</Cell>
//             <Cell>{item.isComplete.toString()}</Cell>
//             <Cell>{item.nodes?.length}</Cell>
//           </Row>
//         )}
//       />
//     )}
//   </ReactTable.Table>
// </div>
