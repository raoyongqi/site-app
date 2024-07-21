import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UploadForm from './UploadForm';

// Define the custom icon for markers
const customIcon = new L.DivIcon({
  className: 'custom-icon',
  html: '<div style="background-color: red; width: 8px; height: 8px; border-radius: 50%;"></div>',
});

function MapView() {
  const [points, setPoints] = useState([]);
  const [geojsonData, setGeojsonData] = useState(null);

  // Fetch GeoJSON data from FastAPI server
  useEffect(() => {
    fetch('http://127.0.0.1:8000/geojson')
      .then(response => response.json())
      .then(data => setGeojsonData(data))
      .catch(error => console.error('Error fetching GeoJSON:', error));
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <UploadForm setPoints={setPoints} />
      <MapContainer center={[40.0, 117.0]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {points.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lon]} icon={customIcon}>
            <Popup>
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
                layer.bindPopup(`<b>${feature.properties.name}</b>`);
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
