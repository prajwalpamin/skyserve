import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
} from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import parkData from "../inputfiles/skateboard-parks.json";
import Navbar from "./navbar";

import DrawTools from "./drawtools";
import "../styles/geodata.css";
import { useState } from "react";

export const GeoData = () => {
  const indiaCoordinates = [20.5937, 78.9629];
  const [loadedJson, setLoadedJson] = useState(null);

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

  const renderGeometry = (object) => {
    console.log(object.geometry.type);
    switch (object.geometry.type) {
      case "Polygon":
        return (
          <Polygon
            key="polygon"
            positions={getPolygonCoordinates(object.geometry)}
            pathOptions={{ color: "blue" }}
          />
        );
      case "LineString":
        return (
          <Polyline
            key="polyline"
            positions={getPolylineCoordinates(object.geometry)}
            pathOptions={{ color: "red" }}
          />
        );
      case "Point":
        return (
          <Marker
            key="marker"
            position={getMarkerCoordinates(object.geometry)}
            icon={DefaultIcon}
          />
        );
      default:
        return null;
    }
  };

  const getPolygonCoordinates = (geometry) => {
    return geometry.coordinates.map((coords) =>
      coords.map((coord) => [coord[1], coord[0]])
    );
  };

  const getPolylineCoordinates = (geometry) => {
    return geometry.coordinates.map((coord) => [coord[1], coord[0]]);
  };

  const getMarkerCoordinates = (geometry) => {
    return [geometry.coordinates[1], geometry.coordinates[0]];
  };

  const handleFileLoad = (data) => {
    console.log("handlefileloadd", data);
    setLoadedJson(data);
  };

  console.log(loadedJson);

  return (
    <div className="main_map_container">
      <Navbar />
      <MapContainer center={indiaCoordinates} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {loadedJson &&
          loadedJson.map((object, index) => renderGeometry(object, index))}{" "}
        <DrawTools className="drawtools" onFileLoad={handleFileLoad} />
      </MapContainer>
    </div>
  );
};
