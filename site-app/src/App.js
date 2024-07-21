import React, { useState } from 'react';
import UploadForm from './UploadForm';
import MapView from './MapView';
import './App.css';

function App() {
  const [points, setPoints] = useState([]);

  return (
    <div className="App">
      <div className="upload-form">
        <h1>Upload Excel and View Points</h1>
        <UploadForm setPoints={setPoints} />
      </div>
      <div className="map-container">
        <MapView points={points} />
      </div>
    </div>
  );
}

export default App;
