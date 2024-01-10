"use client";

import { Row, Cell } from "@table-library/react-table-library/table";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { actionSendTargetEmail } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

const initialState = {
  message: "NONE",
  error: "IERROR"
};

export default function RowVictim({ item }: { item: any }) {
  const [state, formAction] = useFormState(actionSendTargetEmail, initialState);
  const [toastId, setToastId] = useState<string | number>(0);
  const { pending } = useFormStatus();
  const router = useRouter();

  useEffect(() => {
    if (state?.message === "ERROR") {
      toast.error(
        <div className="flex gap-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p>Se ha producido un error al intentar enviar el correo electrónico, inténtelo de nuevo</p>
            <p className="text-gray-600">Error Code: {state?.error || "IERROR"}</p>
          </div>
        </div>
      );
    }

    if (state?.message === "SUCCESS") {
      toast.success("¡El correo se ha enviado correctamente!");
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
    <Row item={item}>
      <Cell>{item.name}</Cell>
      <Cell>{item.email}</Cell>
      <Cell>
        <div className={`px-1 py-0.5 text-center text-white ${item.sended ? "bg-green-500" : "bg-red-500"}`}>
          {item.sended ? "Enviado" : "No enviado"}
        </div>
      </Cell>
      <Cell>
        <form action={formAction}>
          <input type="hidden" name="id" defaultValue={item.id} />
          <input type="hidden" name="email" defaultValue={item.email} />
          <button
            type="submit"
            aria-disabled={pending}
            onClick={() => setToastId(toast.loading("Enviando..."))}
            className="rounded bg-blue-500 px-4 py-1 text-white">
            {item.sended ? "Reenviar" : "Enviar"}
          </button>
        </form>
      </Cell>
      <Cell>
        <button
          onClick={() => {
            window.navigator.clipboard.writeText(`${window.location.host}/?id=${item.id}`);
            toast.success("Copiado con éxito!");
          }}
          className="rounded bg-blue-500 px-4 py-1 text-white text-sm truncate max-w-44"
        >
          {item.id}
        </button>
      </Cell>
    </Row>
  )
}


// async function sendEmail(item: any) {
//   const isLot = (data: any): data is TLot => data.type === "lot";

//   if (isLot(item)) {
//     console.log("Is item");
//     await fetch("/api/v1/mailer", {
//       method: "POST",
//       body: JSON.stringify(item),
//       headers: { "Content-Type": "application/json" },
//       cache: "no-store",
//     });

//     toast("Los datos se están procesando...");
//   } else {
//     const promise = new Promise(async (resolve, reject) => {
//       try {
//         const res = await fetch("/api/v1/mailer", {
//           method: "POST",
//           body: JSON.stringify(item),
//           headers: { "Content-Type": "application/json" },
//           cache: "no-store",
//         });

//         const response = await res.json();
//         if (response.status === "success") {
//           resolve(true);
//         } else {
//           reject(response.message);
//         }
//       } catch (error) {
//         console.log(error);
//         reject(false);
//       }
//     });

//     toast.promise(promise, {
//       loading: "Enviando...",
//       success: () => {
//         return "El correo se ha enviado correctamente!";
//       },
//       error: (reason) => {
//         if (reason) {
//           return reason;
//         }

//         return "Se ha producido un error al intentar enviar el correo electrónico, inténtelo de nuevo";
//       },
//     });
//   }
// }
