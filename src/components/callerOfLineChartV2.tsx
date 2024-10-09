import React, { memo } from "react";
import LineChartV2 from "./LineChartV2";

const initialDataSets = [
  {
    name: "Dataset 1",
    data: [
      { x: 1, y: 3 },
      { x: 2, y: 7 },
      { x: 3, y: 2 },
      { x: 4, y: 5 },
    ],
  }
];
const CallerOfLineChartV2: React.FC = memo(() => {
  console.log("caller v2 re-render");

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
      <h1>Line Chart with update array inside component</h1>
      <LineChartV2 width={800} height={400} initialDataSets={initialDataSets} />
    </div>
  );
});

export default CallerOfLineChartV2;
