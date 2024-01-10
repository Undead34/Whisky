"use client";

import { Row, Cell } from "@table-library/react-table-library/table";
import { CellTree } from "@table-library/react-table-library/tree";

import DeleteFormLot from "./delete-form-lot";
import SentFormLot from "./sent-form-lot";

export default function RowLot({ item }: { item: any }) {
  return (
    <Row item={item}>
      <CellTree item={item}>{item.name}</CellTree>
      <Cell></Cell>
      <Cell>
        <div className={`px-1 py-0.5 text-center text-white ${item.sended ? "bg-green-500" : "bg-red-500"}`}>
          {item.sended ? "Enviado" : "No enviado"}
        </div>
      </Cell>
      <Cell>
        <SentFormLot id={item.id}>
          {item.sended ? "Reenviar" : "Enviar"}
        </SentFormLot>
      </Cell>
      <Cell>
        <DeleteFormLot id={item.id} />
      </Cell>
    </Row>
  )
}
