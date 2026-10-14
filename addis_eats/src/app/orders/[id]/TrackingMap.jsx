"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";

const AREAS = {
  Bole: [8.995, 38.7896],
  Kazanchis: [9.014, 38.766],
  "Piassa": [9.035, 38.752],
  Arada: [9.035, 38.761],
  "Mexico": [9.005, 38.746],
  "CMC": [9.025, 38.82],
  "Addis Ketema": [9.03, 38.735],
  "Lideta": [9.01, 38.735],
  "Akaky Kaliti": [8.91, 38.77],
  "Gullele": [9.07, 38.74],
  "Kirkos": [9.0, 38.76],
  "Kolfe Keranio": [9.0, 38.69],
  "Nifas Silk-Lafto": [8.96, 38.72],
  "Yeka": [9.04, 38.81],
  "Other": [9.015, 38.76],
};
const pin = (color) => L.divIcon({
  className: "tracking-pin",
  html: `<span style="--pin-color:${color}" aria-hidden="true"></span>`,
  iconSize: [26, 34],
  iconAnchor: [13, 32],
  popupAnchor: [0, -30],
});
const courierIcon = pin("#047857");
const deliveryIcon = pin("#b45309");

function FitRoute({ points }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(points, { padding: [48, 48], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export default function TrackingMap({ neighborhood, status }) {
  const delivery = AREAS[neighborhood] ?? AREAS.Bole;
  const distance = { placed: 0.014, prepared: 0.009, on_the_way: 0.004, delivered: 0.0005 }[status] ?? 0.014;
  const courier = [delivery[0] + distance, delivery[1] - distance];
  const center = [(delivery[0] + courier[0]) / 2, (delivery[1] + courier[1]) / 2];
  const points = [courier, delivery];

  return (
    <div className="h-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      <MapContainer center={center} zoom={14} scrollWheelZoom={false} zoomControl={false} className="h-full w-full">
        <FitRoute points={points} />
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        />
        <Marker position={courier} icon={courierIcon}><Popup>Courier · estimated demo position</Popup></Marker>
        <Polyline positions={points} pathOptions={{ color: "#047857", dashArray: "6 8", weight: 4 }} />
        <Marker position={delivery} icon={deliveryIcon}><Popup>Delivery area · {neighborhood}, Addis Ababa</Popup></Marker>
      </MapContainer>
    </div>
  );
}
