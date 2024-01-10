"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { actionCreateLot } from "@/app/lib/actions";

const initialState = {
  message: "NONE",
};

export default function FormSend() {
  const [state, formAction] = useFormState(actionCreateLot, initialState);
  const { pending } = useFormStatus();
  const router = useRouter();

  useEffect(() => {
    if (state?.message === "ERROR") {
      toast.error("Error al cargar los datos");
    } else if (state?.message === "SUCCESS") {
      toast.success("Lote creado");
    }

    if (state.message !== "NONE") {
      setTimeout(() => {
        router.refresh();
      }, 1500);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-1 flex-col gap-4">
      <label htmlFor="targets">Escribir una lista de objetivos</label>
      <textarea
        className="w-full rounded-sm border border-blue-400 p-2 text-black outline-none focus:border-blue-500"
        aria-describedby="textarea_input_help"
        name="targets"
        id="targets"
        rows={5}
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
        id="lot_name"
        autoComplete="off"
        placeholder="Nombre del lote"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          aria-disabled={pending}
          className={`rounded bg-blue-500 px-6 py-2 text-white ${pending ?? "bg-blue-400"
            }`}
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
