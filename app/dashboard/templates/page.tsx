import React from "react";
import EmailTemplate from "@/app/ui/dashboard/templates/email-template";

export default function Templates() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-7 pt-8">
      <h1 className="border-b border-gray-100 py-2 text-2xl font-semibold">
        Templates
      </h1>
      <div className="relative h-full w-full overflow-auto">
        <EmailTemplate />
      </div>
    </div>
  );
}
