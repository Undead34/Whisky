"use client";

import {
  Header,
  HeaderRow,
  HeaderCell,
} from "@table-library/react-table-library/table";
import { Row, Cell, Body } from "@table-library/react-table-library/table";
import { useTree, CellTree } from "@table-library/react-table-library/tree";
import * as ReactTable from "@table-library/react-table-library/table";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useTheme } from "@table-library/react-table-library/theme";
import { ILotTargets, ITargets } from "@/app/types/shared";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import { toast } from "sonner";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/api/firebase.config";

async function sendEmail(item: ILotTargets) {
  if (item.type === "lot") {
    await fetch("/api/smtp", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
    });

    toast("Los datos se están procesando...");
  } else {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/smtp", {
          method: "POST",
          body: JSON.stringify(item),
          headers: { "Content-Type": "application/json" },
        });

        const response = await res.json();
        if (response.success) {
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

async function deleteLot(item: ILotTargets) {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        body: JSON.stringify(item),
        headers: { "Content-Type": "application/json" },
      });

      const response = await res.json();
      if (response.success) {
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
    loading: "Procesando...",
    success: () => {
      return "OK!";
    },
    error: (reason) => {
      if (reason) {
        return reason;
      }

      return "Se ha producido un error al intentar borrar el lote, inténtelo de nuevo";
    },
  });
}

export default function TargetsUsers() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    try {
      const unsubscribeTargets = onSnapshot(
        collection(db, "lots"),
        (querySnapshot) => {
          setData(
            querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          );
        },
      );

      return () => {
        unsubscribeTargets();
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  const targets = {
    nodes: data,
  };

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
    },
  );

  function copyUrl(item: any) {
    let uri = `${window.location.host}/?id=${item.id}`;
    window.navigator.clipboard.writeText(uri);

    toast.success("Copiado con éxito!");
  }

  return (
    <ReactTable.Table
      data={targets}
      theme={theme}
      tree={tree}
      layout={{ custom: true }}
    >
      {(tableList: ILotTargets[]) => {
        return (
          <React.Fragment key={uuid()}>
            <Header>
              <HeaderRow>
                <HeaderCell>Nombre</HeaderCell>
                <HeaderCell>Correo</HeaderCell>
                <HeaderCell>Enviado</HeaderCell>
                <HeaderCell>Enviar/Reenviar</HeaderCell>
                <HeaderCell>Copiar</HeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item) => {
                if (item.type === "lot") {
                  return (
                    <Row key={item.id} item={item}>
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
                          onClick={() => {
                            sendEmail(item);
                          }}
                          className="rounded bg-blue-500 px-4 py-1 text-white"
                        >
                          {item.sended ? "Reenviar" : "Enviar"}
                        </button>
                      </Cell>
                      <Cell>
                        <button
                          onClick={() => {
                            deleteLot(item);
                          }}
                          className="rounded bg-red-500 px-4 py-1 text-white"
                        >
                          Borrar
                        </button>
                      </Cell>
                    </Row>
                  );
                } else {
                  // @ts-ignore
                  const row: ITargets = item as ITargets;

                  return (
                    <Row key={uuid()} item={row}>
                      <Cell>{row.name}</Cell>
                      <Cell>{row.email}</Cell>
                      <Cell>
                        <div
                          className={`px-1 py-0.5 text-center text-white
                          ${row.sended ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {row.sended ? "Enviado" : "No enviado"}
                        </div>
                      </Cell>
                      <Cell>
                        <button
                          onClick={() => {
                            sendEmail(item);
                          }}
                          className="rounded bg-blue-500 px-4 py-1 text-white"
                        >
                          {row.sended ? "Reenviar" : "Enviar"}
                        </button>
                      </Cell>
                      <Cell>
                        <button
                          onClick={() => {
                            copyUrl(row);
                          }}
                          className="rounded bg-blue-500 px-4 py-1 text-white"
                        >
                          Copiar
                        </button>
                      </Cell>
                    </Row>
                  );
                }
              })}
            </Body>
          </React.Fragment>
        );
      }}
    </ReactTable.Table>
  );
}
