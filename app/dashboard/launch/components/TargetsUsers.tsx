"use client";

import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import TableTargets from "./TableTargets";
import { db } from "@/config";

export default function TargetsUsers() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lots"), (querySnapshot) => {
      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!data) return <div>Cargando...</div>;

  return <TableTargets data={data ?? []} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
