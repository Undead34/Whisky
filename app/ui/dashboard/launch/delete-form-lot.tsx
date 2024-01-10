"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { actionDeleteLot } from "@/app/lib/actions";

const initialState = {
  message: "NONE",
};


export default function DeleteFormLot({ id }: { id: string }) {
  const [state, formAction] = useFormState(actionDeleteLot, initialState);
  const { pending } = useFormStatus();
  const router = useRouter();

  useEffect(() => {
    if (state.message === "SUCCESS") {
      toast.success("El lote se ha borrado correctamente!");
    } else if (state.message === "ERROR") {
      toast("Se ha producido un error al intentar borrar el lote, inténtelo de nuevo");
    }

    if (state.message !== "NONE") {
      setTimeout(() => {
        router.refresh();
      }, 1500);
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" defaultValue={id} />
      <button
        type="submit"
        className="rounded bg-red-500 px-4 py-1 text-white"
        aria-disabled={pending}>
        Borrar
      </button>
    </form>
  )
}
