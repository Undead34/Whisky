"use client";

import { Header, HeaderRow } from "@table-library/react-table-library/table";
import { useTree } from "@table-library/react-table-library/tree";
import { Body } from "@table-library/react-table-library/table";

import * as ReactTable from "@table-library/react-table-library/table";
import { getTheme } from "@table-library/react-table-library/baseline";
import { HeaderCell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";

import { ILot, INode, ITargets } from "@/app/lib/definitions";
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import RowVictim from "./row-victim";
import { v4 as uuid } from "uuid";
import RowLot from "./row-lot";

export default function TableTargets({ lots, targets }: { lots: ILot[], targets: ITargets[] }) {
  const data = { nodes: formatData(lots, targets) };
  const theme = useTheme({
    ...getTheme(),
    Table:
      "--data-table-library_grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, min-content) minmax(0px, 1fr) minmax(0px, 1fr)",
  });

  const tree = useTree<any>(
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
    <ReactTable.Table
      data={data}
      theme={theme}
      tree={tree}
      layout={{ custom: true }}
    >
      {(tableList: any) => (
        <>
          <Header>
            <HeaderRow>
              <HeaderCell>Nombre</HeaderCell>
              <HeaderCell>Correo</HeaderCell>
              <HeaderCell>Enviado</HeaderCell>
              <HeaderCell>Enviar/Reenviar</HeaderCell>
              <HeaderCell>ID</HeaderCell>
            </HeaderRow>
          </Header>
          <Body>{tableList.map((item: ILot) => {
            if (item.type === "lot") {
              return (
                <RowLot key={uuid()} item={item} />
              );
            } else {
              return (
                <RowVictim key={uuid()} item={item} />
              );
            }
          })}</Body>
        </>
      )}
    </ReactTable.Table>
  );
}


function formatData(lots: ILot[], targets: ITargets[]): INode[] {
  return lots.map((lot: ILot) => {
    const targetNode: ITargets[] = [];

    for (let i = 0; i < lot.nodes.length; i++) {
      const node = lot.nodes[i];
      const target = targets.find((target) => target.id === node);
      if (!target) continue;

      targetNode.push(target);
    }

    return {
      id: lot.id,
      type: "lot",
      name: lot.name,
      sended: lot.sended,
      nodes: targetNode,
    };
  });
}
