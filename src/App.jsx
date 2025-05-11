import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import './index.css';

const App = () => {
  const [extended, setExtended] = useState(false);

  return (
    <div className="app">
      <Sidebar extended={extended} setExtended={setExtended} />
      <Main extended={extended} />
    </div>
  );
};

export default App;
