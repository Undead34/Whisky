"use client";

import useSWR from "swr";
import React from "react";
import TableTargets from "./TableTargets";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TargetsUsers() {
  const { data, error, isLoading } = useSWR("/api/getData", fetcher, {
    refreshInterval: 2500,
  });

  if (error) return <div>Error al cargar</div>;
  if (isLoading) return <div>Cargando...</div>;

  return <TableTargets data={data ?? []} />;
}

// [
//   {
//     id: "812f48bf-5fe2-43b7-b7c6-1c66a65fa422",
//     name: null,
//     sended: false,
//     nodes: [
//       {
//         password: null,
//         email: "yyndriago@netreadysolutions.com",
//         countryCode: null,
//         os: null,
//         isp: null,
//         visits: 0,
//         ip: null,
//         name: "Yvanora Yndriago",
//         captureDate: null,
//         id: "086cdfa4-8c47-42f5-ab52-c3110c8cfef8",
//         country: null,
//         clicks: 0,
//         attempts: 0,
//         sended: false,
//         browser: null,
//         captured: false,
//         city: null,
//         read: false,
//         username: null,
//       },
//     ],
//     type: "lot",
//   },
// ];
