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

type IUser = any;

function formatData(users: IUser[]): Partial<IUser>[] {
  const format = users.map((user: Partial<IUser>) => {
    // @ts-ignore
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

interface ITableProps {
  values: Partial<IUser>[];
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
      <Cell>
        <div title={item.username}>
          {item.username}
        </div>
      </Cell>
      <Cell>
        {item.password ? <PasswordCell password={item.password} /> : "N/A"}
      </Cell>
      <Cell>{item.readed ? "Yes" : "No"}</Cell>
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
      <Cell>{String(item.clicks)}</Cell>
      <Cell>{String(item.visits)}</Cell>
      <Cell>
        <div title={item.id} className="flex flex-col relative truncate">
          {item.id}
        </div>
      </Cell>
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
      <Cell></Cell>
    </Row>
  );
}

export default function Tables({ values }: ITableProps) {
  const theme = useTheme({
    ...getTheme(),
    Table:
      "--data-table-library_grid-template-columns: minmax(0px, min-content) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(80px, min-content) minmax(80px, 1fr)",
  });

  const ROW_HEIGHT = 30;
  const data = { nodes: formatData(values) };

  const tree = useTree(
    //@ts-ignore
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
                <HeaderCell resize>ID</HeaderCell>
              </HeaderRow>
            )}
            body={(item: IUser, index) => {
              if (Object.hasOwn(item, "username")) {
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
