import React from 'react';
import CallerOfLineChartV2 from './components/callerOfLineChartV2';
import CallerOfLineChartV1 from './components/callerOfLineChartV1';
import CallerOfLineChartV3 from './components/callerOfLineChartV3';

const App: React.FC = () => {

  return (
    <div className="App" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <CallerOfLineChartV1/>
      <CallerOfLineChartV2/>
      <CallerOfLineChartV3/>
    </div>
  );
};

export default App;