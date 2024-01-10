"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { actionSendEmailLots } from "@/app/lib/actions";

const initialState = {
  message: "NONE",
};

export default function SentFormLot({ id, children }: { id: string, children: React.ReactNode }) {
  const [state, formAction] = useFormState(actionSendEmailLots, initialState);
  const [toastId, setToastId] = useState<string | number>(0);
  const { pending } = useFormStatus();
  const router = useRouter();

  useEffect(() => {
    if (state.message === "SUCCESS") {
      toast.success("El lote se ha enviado correctamente");
    } else if (state.message === "ERROR") {
      toast.error("Se ha producido un error al enviar algunos o todos los emails, inténtelo de nuevo");
    }

    if (state.message !== "NONE") {
      setTimeout(() => {
        router.refresh();
      }, 1500);
    }
  }, [state, router]);

  useEffect(() => {
    toast.dismiss(toastId);
    setToastId(0);
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" defaultValue={id} />
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-1 text-white"
        onClick={() => setToastId(toast.loading("Enviando...", { duration: 10 * 1000 }))}
        aria-disabled={pending}>
        {children}
      </button>
    </form>
  )
}
