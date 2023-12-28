import TargetsUsers from "./components/TargetsUsers";
import UploadForm from "./components/UploadForm";
import FormSend from "./components/FormSend";
import React from "react";

export default async function Launch() {
  return (
    <div className="relative flex h-screen flex-1 flex-col gap-6 overflow-auto p-7 pt-8">
      <h1 className="border-b border-gray-100 py-2 text-2xl font-semibold">
        Launch
      </h1>

      <div className="flex flex-col gap-4">
        <FormSend />
        <hr />
        <UploadForm />
      </div>

      <div className="mb-20 flex flex-1 flex-col">
        <TargetsUsers />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic"
