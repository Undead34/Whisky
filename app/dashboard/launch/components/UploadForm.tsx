"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function UploadForm() {
  const [file, setFile] = useState<File>();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const lotName: string = e.target.lot_name.value.trim();
    if (!file) return;

    try {
      const data = new FormData();

      if (
        file.size > 150000000 ||
        !["text/plain", "text/csv"].includes(file.type)
      ) {
        return;
      }

      data.set("file", file);
      data.set("lotName", lotName);

      const res = fetch("/api/upload", {
        method: "POST",
        body: data,
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
          return "Archivo cargado correctamente";
        },
        error: "Error al cargar el archivo",
      });

      // handle the error
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="block font-medium" htmlFor="file_input">
        Upload file
      </label>
      <input
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        accept=".txt,.csv"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      <p className="!text-sm" id="file_input_help">
        CSV or TXT (MAX. 150MB).
      </p>
      <input
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        type="text"
        name="lot_name"
        placeholder="Nombre del lote de objetivos"
        required
        autoComplete="off"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-blue-500 px-6 py-2 text-white"
        >
          Cargar
        </button>
      </div>
    </form>
  );
}
