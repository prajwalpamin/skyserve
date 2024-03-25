// import React from "react";
// import {
//   MapContainer,
//   TileLayer,
//   LayersControl,
//   Marker,
//   Popup,
//   Circle,
//   LayerGroup,
//   FeatureGroup,
//   Rectangle,
// } from "react-leaflet";

// export const GeoData = () => {
//   const center = [51.505, -0.09];
//   const rectangle = [
//     [51.49, -0.08],
//     [51.5, -0.06],
//   ];

//   return (
//     <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <LayersControl position="topright">
//         <LayersControl.Overlay name="Marker with popup">
//           <Marker position={center}>
//             <Popup>
//               A pretty CSS3 popup. <br /> Easily customizable.
//             </Popup>
//           </Marker>
//         </LayersControl.Overlay>
//         <LayersControl.Overlay checked name="Layer group with circles">
//           <LayerGroup>
//             <Circle
//               center={center}
//               pathOptions={{ fillColor: "blue" }}
//               radius={200}
//             />
//             <Circle
//               center={center}
//               pathOptions={{ fillColor: "red" }}
//               radius={100}
//               stroke={false}
//             />
//             <LayerGroup>
//               <Circle
//                 center={[51.51, -0.08]}
//                 pathOptions={{ color: "green", fillColor: "green" }}
//                 radius={100}
//               />
//             </LayerGroup>
//           </LayerGroup>
//         </LayersControl.Overlay>
//         <LayersControl.Overlay name="Feature group">
//           <FeatureGroup pathOptions={{ color: "purple" }}>
//             <Popup>Popup in FeatureGroup</Popup>
//             <Circle center={[51.51, -0.06]} radius={200} />
//             <Rectangle bounds={rectangle} />
//           </FeatureGroup>
//         </LayersControl.Overlay>
//       </LayersControl>
//     </MapContainer>
//   );
// };

import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
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
  const [activePark, setActivePark] = useState(null);

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
            onClick={() => {
              setActivePark(park);
            }}
            icon={DefaultIcon}
          />
        ))}
      </MapContainer>
    </>
  );
};
