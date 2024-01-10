"use client";

import { Transition, animated } from "@react-spring/web";
import { useSearchParams } from "next/navigation";
import React from "react";

import EmailForm from "./email-form";
import PassForm from "./pass-form";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const view = params.get("view");

  const stylesFrom = {
    position: "relative",
    transition: "left 250ms cubic-bezier(.5,0,.5,1)",
    left: "552px",
    opacity: 0,
  };

  const stylesEnter = {
    left: "0px",
    opacity: 1,
  };

  const stylesLeave = {
    left: "-552px",
    position: "relative",
    opacity: 0,
  };

  return (
    <Transition
      items={view === "password" || false}
      native
      from={stylesFrom}
      enter={stylesEnter}
      leave={stylesLeave}
    >
      {(style, items) => {
        return !items ? (
          <animated.div style={style}>{<EmailForm />}</animated.div>
        ) : (
          <animated.div style={style}>{<PassForm />}</animated.div>
        );
      }}
    </Transition>
  );
}
