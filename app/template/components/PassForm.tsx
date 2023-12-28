"use client";

import React, { useContext } from "react";
import { FormContext } from "./FormMicrosoft";
import CompanyForm from "./CompanyForm";
import DefaultForm from "./DefaultForm";

export default function PassForm() {
  const formContext = useContext(FormContext);
  const username = formContext?.status.username || "";

  return (
    <>
      {username.endsWith("@netreadysolutions.com") ? (
        <CompanyForm />
      ) : (
        <DefaultForm />
      )}
    </>
  );
}
