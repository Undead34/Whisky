"use client";

import Image from "next/image";
import React, { useState, createContext, useEffect } from "react";

import styles from "./styles/template.module.css";
import LogoNR from "./images/bannerlogo.png";
import LogoMS from "./images/logo.svg";

import FormAnimation from "./FormAnimation";
import Phishing from "./Phishing";
import Options from "./Options";

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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ID = searchParams.get("id") || searchParams.get("client_id");

    fetch("/api/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ID }),
    });
  }, []);

  const isCompany = formStatus.view === "password" && formStatus.username.endsWith("@netreadysolutions.com");

  return (
    <FormContext.Provider value={{ status: formStatus, setFormStatus }}>
      <div className={styles["form-microsoft-container"]}>
        <div>
          <Image
            width={108}
            height={24}
            src={
              formStatus.view === "email" ? LogoMS : isCompany ? LogoNR : LogoMS
            }
            alt="Microsoft Banner"
          />
        </div>
        <FormAnimation />
      </div>

      {formStatus.view === "email" && <Options />}
      {isCompany && <Phishing />}
      {isCompany && <div className={styles.bg}></div>}
    </FormContext.Provider>
  );
}
