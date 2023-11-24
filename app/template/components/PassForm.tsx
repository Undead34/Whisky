"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

import { FormContext, IFormStatus } from "./FormMicrosoft";
import CompanyForm from "./CompanyForm";
import DefaultForm from "./DefaultForm";

export default function PassForm() {
  const formContext = useContext(FormContext);
  const username = formContext?.status.username || "";

  console.log(username.endsWith("@netreadysolutions.com"));

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
