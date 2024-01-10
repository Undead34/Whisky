"use client";

import { useFormState, useFormStatus } from "react-dom";
import { actionSendEmail } from "@/app/lib/actions";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

import { HTMLTemplate } from "./text-template";

const initialState = {
  message: "NONE",
};

export default function EmailTemplate() {
  const [state, formAction] = useFormState(actionSendEmail, initialState);
  const templateRef = useRef<HTMLDivElement>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (templateRef.current) {
      const template = templateRef.current;
      template.innerHTML = HTMLTemplate({
        redirect: `${window.location.origin}/dashboard`,
        observer: `${window.location.origin}/observer.png`,
        image: `${window.location.origin}/microsoft-logo.png`,
      });
    }
  });

  useEffect(() => {
    if (state?.message === "ERROR") {
      toast.error("Error al enviar el email");
    } else if (state?.message === "SUCCESS") {
      toast.success("Email enviado creado");
    }

  }, [state]);

  return (
    <div className="absolute flex flex-col">
      <div ref={templateRef}></div>
      <div className="mx-auto w-max mt-10 flex flex-col gap-4 p-8">
        <form className="flex flex-col" action={formAction}>
          <input
            name="email"
            className="w-[280px] border outline-none rounded-sm py-2 px-2"
            placeholder="Enter an email address to test"
            type="email"
          />
          <button
            type="submit"
            aria-disabled={pending}
            onClick={() => toast.loading("Enviando...")}
            className="rounded-md bg-blue-500 px-4 py-2 hover:bg-blue-400 text-white">
            Test
          </button>
        </form>
      </div>
    </div>
  );
}

//   async function onEmailSend(event: any) {
//     event.preventDefault();
//     const email: string = event.target?.email?.value;
//     console.log(email);

//     if (!email || email === "") {
//       toast.error("Please DO NOT leave the fields empty.");
//       return;
//     }

//     toast.loading("Loading...");

//     try {
//       await fetch("/api/mailer", {
//         method: "POST",
//         body: JSON.stringify({ special: "league", id: 0 }),
//         headers: { "Content-Type": "aplication/json" },
//       });
//       toast.success("¡OK!");
//     } catch (error) {
//       console.log(error);
//     }
//   }
