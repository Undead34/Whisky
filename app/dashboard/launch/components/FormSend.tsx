"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export default function FormSend() {
  const [targets, setTargets] = useState(
    "Jhon Doe,jhondoe@example.com\nJane Doe,janedoe@example.com"
  );
  const [lotName, setLotName] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: targets.trim(), name: lotName.trim() }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      toast.success("Datos cargados correctamente");
    } catch (error) {
      toast.error("Error al cargar los datos");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4">
      <label htmlFor="targets">Escribir una lista de objetivos</label>
      <textarea
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        onChange={(e) => setTargets(e.target.value)}
        aria-describedby="textarea_input_help"
        name="targets"
        id="targets"
        rows={5}
        required
        defaultValue={targets}
      ></textarea>
      <p className="text-sm" id="textarea_input_help">
        Por favor, escriba la lista de objetivos escribiendo el nombre una coma
        (,) el correo electrónico y un entrar.
      </p>
      <input
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        onChange={(e) => setLotName(e.target.value)}
        type="text"
        name="lot_name"
        id="lot_name"
        autoComplete="off"
        placeholder="Nombre del lote de objetivos"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-blue-500 px-6 py-2 text-white"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;