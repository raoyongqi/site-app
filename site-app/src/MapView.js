import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView({ points }) {
  const customIcon = new L.divIcon({
    className: 'custom-icon',
    html: '<div style="background-color: yellow; width: 12px; height: 12px; border-radius: 50%;"></div>',
  });

  return (
    <MapContainer center={[0, 0]} zoom={2} className="map">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point, index) => (
        <Marker key={index} position={[point.lat, point.lon]} icon={customIcon}>
          <Popup>
            Latitude: {point.lat}, Longitude: {point.lon}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
