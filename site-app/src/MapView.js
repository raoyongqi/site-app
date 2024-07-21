import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define the custom icon for markers
const customIcon = new L.DivIcon({
  className: 'custom-icon',
  html: '<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%;"></div>',
});

function MapView() {
  const [points, setPoints] = useState([]);
  const [geojsonData, setGeojsonData] = useState(null);
  const [showPoints, setShowPoints] = useState(true); // State for marker visibility

  // Fetch points data from FastAPI server
  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/points');
        const data = await response.json();
        setPoints(data.points || []); // Ensure points is always an array
      } catch (error) {
        console.error('Error fetching points data:', error);
      }
    };

    fetchPointsData();
  }, []);

  // Fetch GeoJSON data from FastAPI server
  useEffect(() => {
    const fetchGeojsonData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/geojson');
        const data = await response.json();
        setGeojsonData(data || {}); // Ensure geojsonData is always an object
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };

    fetchGeojsonData();
  }, []);

  // Toggle marker visibility
  const toggleMarkers = () => {
    setShowPoints(!showPoints);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, position: 'relative' }}>
      <MapContainer 
        center={[35.0, 105.0]} // Centered on China
        zoom={5} // Adjust zoom level to fit China
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {showPoints && points && points.length > 0 && points.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lon]} icon={customIcon}>
            <Popup>
              <b>Site</b><br />
              {point.name || `Latitude: ${point.lat}, Longitude: ${point.lon}`}
            </Popup>
          </Marker>
        ))}
        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            pointToLayer={(feature, latlng) => L.marker(latlng, { icon: customIcon })}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(`<b>Site</b><br /><b>${feature.properties.name}</b>`);
              }
            }}
          />
        )}
      </MapContainer>
      <button 
        onClick={toggleMarkers}
        style={{
          position: 'fixed', // Fixes the button position relative to the viewport
          top: '10px', // Distance from the top of the viewport
          left: '10px', // Distance from the left of the viewport
          padding: '10px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000, // Ensures the button is above the map
        }}
      >
        {showPoints ? 'Hide Markers' : 'Show Markers'}
      </button>
      {points.length > 0 && (
        <div className="legend">
          <div className="legend-icon"></div>
          Site
        </div>
      )}
    </div>
  );
}

export default MapView;
