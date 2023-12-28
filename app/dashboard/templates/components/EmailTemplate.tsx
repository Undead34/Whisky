"use client";

import React, { useEffect, useRef } from "react";
import { b64Image } from "@/backend/utils/b64";
import TextTemplate from "./TextTemplate";
import { toast } from "sonner";

export default function EmailTemplate() {
  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (templateRef.current) {
      const template = templateRef.current;
      template.innerHTML = TextTemplate({
        image: b64Image,
        redirect: `${window.location.origin}/dashboard`,
        observer: `${window.location.origin}/observer.png`,
      });
    }
  });

  async function onEmailSend(event: any) {
    event.preventDefault();
    const email: string = event.target?.email?.value;
    console.log(email);

    if (!email || email === "") {
      toast.error("Please DO NOT leave the fields empty.");
      return;
    }

    toast.loading("Loading...");

    try {
      await fetch("/api/mailer", {
        method: "POST",
        body: JSON.stringify({ special: "league", id: 0,  }),
        headers: { "Content-Type": "aplication/json" },
      });
      toast.success("¡OK!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="absolute flex flex-col">
      <div ref={templateRef}></div>
      <div className="mx-auto w-max mt-10 flex flex-col gap-4 p-8">
        <form onSubmit={onEmailSend}>
          <input
            name="email"
            id="email"
            className="w-[280px] border-none rounded-sm py-2 px-2"
            placeholder="Enter an email address to test"
            type="email"
          />
          <button className="rounded-md bg-blue-500 px-4 py-2 hover:bg-blue-400 text-white">
            Test
          </button>
        </form>
      </div>
    </div>
  );
}
