import React, { memo, useEffect } from "react";
import LineChartV3 from "./LineChartV3";

const CallerOfLineChartV3: React.FC = memo(() => {
  console.log("caller v3 re-render");
  let dataSets = [
    {
      name: "Dataset 1",
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 7 },
        { x: 3, y: 2 },
        { x: 4, y: 5 },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      dataSets.forEach((dataset) => {
        dataset.data.push({
          x: dataset.data[dataset.data.length - 1].x + 1,
          y: Math.floor(Math.random() * 10) + 1,
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Line Chart with mutable array update</h1>
      <LineChartV3 width={800} height={400} dataSets={dataSets} />
    </div>
  );
});

export default CallerOfLineChartV3;
