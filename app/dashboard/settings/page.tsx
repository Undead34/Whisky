import React from "react";

export default function Settings() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-7 pt-8">
      <h1 className="border-b border-gray-100 py-2 text-2xl font-semibold">
        Settings
      </h1>

      <div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="redirect_url">
              URL de redirección:{" "}
              <span className="text-sm text-gray-500">
                https://www.google.com
              </span>
            </label>

            <input
              className="border border-blue-400 p-2 outline-none"
              id="redirect_url"
              type="text"
              placeholder="https://www.example.com"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-sm bg-blue-500 px-4 py-2 text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
