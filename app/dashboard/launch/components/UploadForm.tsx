"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lotName = e.currentTarget.lot_name.value.trim();
    if (!file) return;

    if (
      file.size > 150000000 ||
      !["text/plain", "text/csv"].includes(file.type)
    ) {
      toast.error("Archivo inválido o demasiado grande.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lotName", lotName);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al cargar el archivo");
      }

      toast.success("Archivo cargado correctamente");
    } catch (error) {
      toast.error("Error al cargar el archivo");
      console.error(error);
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
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <p className="!text-sm" id="file_input_help">
        CSV or TXT (MAX. 150MB).
      </p>
      <input
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        type="text"
        name="lot_name"
        id="lot_name"
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
