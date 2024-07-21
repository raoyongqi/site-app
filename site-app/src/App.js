import React, { useState } from 'react';
import MapView from './MapView';
import './App.css';

function App() {
  const [points, setPoints] = useState([]);

  return (
    <div className="App">
      <div className="map-container">
        <MapView points={points} />
      </div>
    </div>
  );
}

export default App;
