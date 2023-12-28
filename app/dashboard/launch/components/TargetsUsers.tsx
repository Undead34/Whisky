"use client";

import useLots from "../../hooks/useLots";
import TableTargets from "./TableTargets";
import React from "react";

export default function TargetsUsers() {
  const [lots, isLoading] = useLots();

  if (isLoading) return <div>Cargando...</div>;

  return <TableTargets data={lots} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
