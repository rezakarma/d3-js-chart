import React, { useState, useEffect, memo } from "react";
import LineChartV1 from "./LineChartV1";

const CallerOfLineChartV1: React.FC = memo(() => {
  console.log("caller v1 re-render");

  const [dataSets, setDataSets] = useState([
    {
      name: "Dataset 1",
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 7 },
        { x: 3, y: 2 },
        { x: 4, y: 5 },
      ],
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataSets((prevDataSets) =>
        prevDataSets.map((dataset) => ({
          ...dataset,
          data: [
            ...dataset.data,
            {
              x: dataset.data[dataset.data.length - 1].x + 1,
              y: Math.floor(Math.random() * 10) + 1,
            },
          ],
        }))
      );
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
      <h1>Line Chart with update data props by changing state</h1>
      <LineChartV1 width={800} height={400} dataSets={dataSets} />
    </div>
  );
});

export default CallerOfLineChartV1;
