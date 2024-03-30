import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import parkData from "../inputfiles/skateboard-parks.json";
import { useState } from "react";
import Navbar from "./navbar";

export const GeoData = () => {
  const center = [51.505, -0.09];

  let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });
  // const [activePark, setActivePark] = useState(null);

  return (
    <>
      <Navbar />
      <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {parkData.features.map((park) => (
          <Marker
            key={park.properties.PARK_ID}
            position={[
              park.geometry.coordinates[1],
              park.geometry.coordinates[0],
            ]}
            // onClick={() => {
            //   setActivePark(park);
            // }}
            icon={DefaultIcon}
          />
        ))}
      </MapContainer>
    </>
  );
};
