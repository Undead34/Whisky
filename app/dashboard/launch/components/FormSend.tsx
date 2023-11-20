"use client";

import React from "react";
import { toast } from "sonner";

export default function FormSend() {
  async function onSubmit(event: any) {
    event.preventDefault();
    const data = event.target.targets.value.trim();
    const lotName = event.target.lot_name.value.trim();

    const res = fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: data, name: lotName }),
    });

    const promise = new Promise((resolver, reject) => {
      res
        .then((data) => {
          if (!data.ok) reject(true);
          resolver(true);
        })
        .catch(() => {
          reject(true);
        });
    });

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        return "Datos cargados correctamente";
      },
      error: "Error al cargar los datos",
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4">
      <label htmlFor="targets">Escribir una lista de objetivos</label>
      <textarea
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        name="targets"
        aria-describedby="textarea_input_help"
        id="targets"
        rows={5}
        defaultValue={
          "Jhon Doe,jhondoe@example.com\nJane Doe,janedoe@example.com"
        }
        required
      ></textarea>
      <p className="text-sm" id="textarea_input_help">
        Por favor, escriba la lista de objetivos escribiendo el nombre una coma
        (,) el correo electrónico y un entrar.
      </p>
      <input
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        type="text"
        name="lot_name"
        placeholder="Nombre del lote de objetivos"
        autoComplete="off"
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
