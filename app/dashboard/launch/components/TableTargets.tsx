"use client";

import { Header, HeaderRow } from "@table-library/react-table-library/table";
import { useTree, CellTree } from "@table-library/react-table-library/tree";
import { Row, Cell, Body } from "@table-library/react-table-library/table";
import * as ReactTable from "@table-library/react-table-library/table";
import { getTheme } from "@table-library/react-table-library/baseline";
import { HeaderCell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";

import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import { toast } from "sonner";
import React from "react";
import { IUser, ILot } from "@/types/globals";
import { v4 } from "uuid";

function copyUrl(item: IUser) {
  let uri = `${window.location.host}/?id=${item.id}`;
  window.navigator.clipboard.writeText(uri);
  toast.success("Copiado con éxito!");
}

function renderRow(item: ILot | IUser) {
  const isLot = (data: any): data is ILot => data.type === "lot";

  if (isLot(item)) {
    return (
      <Row  key={v4()} item={item}>
        <CellTree item={item}>{item.name}</CellTree>
        <Cell></Cell>
        <Cell>
          <div
            className={`px-1 py-0.5 text-center text-white
                        ${item.sended ? "bg-green-500" : "bg-red-500"}`}
          >
            {item.sended ? "Enviado" : "No enviado"}
          </div>
        </Cell>
        <Cell>
          <button
            onClick={() => sendEmail(item)}
            className="rounded bg-blue-500 px-4 py-1 text-white"
          >
            {item.sended ? "Reenviar" : "Enviar"}
          </button>
        </Cell>
        <Cell>
          <button
            // onClick={() => deleteLot(item)}
            className="rounded bg-red-500 px-4 py-1 text-white"
          >
            Borrar
          </button>
        </Cell>
      </Row>
    );
  } else {
    // Si no es un ILot, asumimos que es un IUser
    const user = item as IUser;
    return (
      <Row key={v4()} item={user}>
        <Cell>{user.name}</Cell>
        <Cell>{user.email}</Cell>
        <Cell>
          <div
            className={`px-1 py-0.5 text-center text-white
                          ${user.sended ? "bg-green-500" : "bg-red-500"}`}
          >
            {user.sended ? "Enviado" : "No enviado"}
          </div>
        </Cell>
        <Cell>
          <button
            className="rounded bg-blue-500 px-4 py-1 text-white"
            onClick={() => sendEmail(item)}
          >
            {user.sended ? "Reenviar" : "Enviar"}
          </button>
        </Cell>
        <Cell>
          <button
            onClick={() => copyUrl(user)}
            className="rounded bg-blue-500 px-4 py-1 text-white"
          >
            Copiar
          </button>
        </Cell>
      </Row>
    );
  }
}

export default function TableTargets({ data }: { data: ILot[] }) {
  const targets = { nodes: data };
  const theme = useTheme({
    ...getTheme(),
    Table:
      "--data-table-library_grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, min-content) minmax(0px, 1fr) minmax(0px, 1fr)",
  });

  const tree = useTree(
    targets,
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
      data={targets}
      theme={theme}
      tree={tree}
      layout={{ custom: true }}
    >
      {(tableList: ILot[]) => (
        <>
          <Header>
            <HeaderRow>
              <HeaderCell>Nombre</HeaderCell>
              <HeaderCell>Correo</HeaderCell>
              <HeaderCell>Enviado</HeaderCell>
              <HeaderCell>Enviar/Reenviar</HeaderCell>
              <HeaderCell>Copiar</HeaderCell>
            </HeaderRow>
          </Header>
          <Body>{tableList.map((item) => renderRow(item))}</Body>
        </>
      )}
    </ReactTable.Table>
  );
}

async function sendEmail(item: ILot | IUser) {
  const isLot = (data: any): data is ILot => data.type === "lot";

  if (isLot(item)) {
    console.log("Is item")
    await fetch("/api/mailer", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    toast("Los datos se están procesando...");
  } else {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/mailer", {
          method: "POST",
          body: JSON.stringify(item),
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const response = await res.json();
        if (response.status === "success") {
          resolve(true);
        } else {
          reject(response.message);
        }
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });

    toast.promise(promise, {
      loading: "Enviando...",
      success: () => {
        return "El correo se ha enviado correctamente!";
      },
      error: (reason) => {
        if (reason) {
          return reason;
        }

        return "Se ha producido un error al intentar enviar el correo electrónico, inténtelo de nuevo";
      },
    });
  }
}

// async function deleteLot(item: ILotTargets) {
//   const promise = new Promise(async (resolve, reject) => {
//     try {
//       const res = await fetch("/api/delete", {
//         method: "POST",
//         body: JSON.stringify(item),
//         headers: { "Content-Type": "application/json" },
//       });

//       const response = await res.json();
//       if (response.success) {
//         resolve(true);
//       } else {
//         reject(response.message);
//       }
//     } catch (error) {
//       console.log(error);
//       reject(false);
//     }
//   });

//   toast.promise(promise, {
//     loading: "Procesando...",
//     success: () => {
//       return "OK!";
//     },
//     error: (reason) => {
//       if (reason) {
//         return reason;
//       }

//       return "Se ha producido un error al intentar borrar el lote, inténtelo de nuevo";
//     },
//   });
// }
