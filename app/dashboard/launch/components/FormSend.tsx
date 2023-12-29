"use client";

import { useFormState } from 'react-dom'
import { SubmitButton } from "./Button";
import createLot from "./actions";
import { useEffect } from 'react';
import { toast } from "sonner";

const initialState = {
  message: "NONE",
}

export default function FormSend() {
  const [state, formAction] = useFormState(createLot, initialState)

  useEffect(() => {
    if (state.message === "NONE") return;
    else if (state.message === "Error al cargar los datos") {
      toast.error(state.message);
      return;
    }

    toast.success(state.message);
  }, [state])

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
        <SubmitButton />
      </div>
    </form>
  );
}


// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// import React, { useState } from "react";

// onChange={(e) => setTargets(e.target.value)}
// defaultValue={targets}
// onChange={(e) => setLotName(e.target.value)}

//  // const [targets, setTargets] = useState(
//   //   "Jhon Doe,jhondoe@example.com\nJane Doe,janedoe@example.com"
//   // );
//   // const [lotName, setLotName] = useState("");

//   async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
//     'use server'

//     // event.preventDefault();

//     // try {
//     //   const response = await fetch("/api/upload", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ data: targets.trim(), name: lotName.trim() }),
//     //     cache: "no-cache",
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error("Request failed");
//     //   }

//     // } catch (error) {
//     // }
//   }
