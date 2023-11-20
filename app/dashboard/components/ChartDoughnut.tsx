"use client";

import { ArcElement, Tooltip, Legend, Plugin } from "chart.js";
import { Chart as ChartJS } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { v4 as uuid } from "uuid";
import React from "react";

export default function ChartDoughnut({
  data = { sent: 0, failed: 0 },
  color = "green",
  text = null,
  labels = [],
}: {
  data: { sent: number; failed: number };
  color?: "red" | "blue" | "green";
  text?: null | string;
  labels?: string[];
}) {
  const doughnutlabel: Plugin = {
    id: "doughnutlabel",
    beforeDatasetDraw: (chart, args, options) => {
      if (options.text) {
        const { ctx } = chart;
        ctx.save();
        const xCord = chart.getDatasetMeta(0).data[0].x;
        const yCord = chart.getDatasetMeta(0).data[0].y;
        ctx.font = "blob 30px sans-serif";
        ctx.fillStyle = "rgba(54, 162, 235, 1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(options.text, xCord, yCord);
      }
    },
  };

  ChartJS.register(ArcElement, Tooltip, Legend, doughnutlabel);

  return (
    <Doughnut
      className="w-full"
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: data.sent !== 0 && data.failed !== 0 },
          // @ts-ignore
          doughnutlabel: {
            text: text,
          },
        },
        cutout: "90%",
        radius: "90%",
      }}
      data={{
        labels: labels,
        datasets: [
          {
            data: [
              data.sent === 0 && data.failed === 0 ? 100 : data.failed,
              data.sent,
            ],
            backgroundColor:
              color === "green"
                ? ["rgba(34, 197, 94, 1)", "rgba(134, 239, 172, 1)"]
                : color === "red"
                ? ["rgba(239, 68, 68, 1)", "rgba(248, 162, 162, 1)"]
                : ["rgba(59, 130, 246, 1)", "rgba(147, 197, 253, 1)"],
            borderWidth: 0,
          },
        ],
      }}
    />
  );
}
