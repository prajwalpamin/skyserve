import React, { useState, useEffect } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import axios from "axios";
import "../styles/FileUpload.css";

const DrawTools = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL || `http://localhost:8080`;

  const [drawnData, setDrawnData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [token, setToken] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
  useEffect(() => {
    const storedItem = localStorage.getItem("token");
    console.log(storedItem);
    if (storedItem) {
      setToken(JSON.parse(JSON.stringify(storedItem)));
    }
  }, []);
  const handleInputChange = (e) => {
    setFileName(e.target.value);
    setIsButtonDisabled(e.target.value === "");
  };
  const handleSave = () => {
    console.log(drawnData);
    axios
      .post(
        `${baseUrl}/file/create`,
        { file_name: fileName, file_data: JSON.stringify(drawnData) },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log("Data saved successfully");
        setFileName("");
        setDrawnData(null);
      })
      .catch((error) => {
        console.error("Failed to save data:", error);
      });
  };

  const _onEdited = (e) => {
    setDrawnData(e.layers.toGeoJSON());
    let numEdited = 0;
    e.layers.eachLayer((layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);

    // this._onChange();
  };

  const _onCreated = (e) => {
    setDrawnData(e.layer.toGeoJSON());
    let type = e.layerType;
    let layer = e.layer;
    if (type === "marker") {
      console.log("_onCreated: marker created", e);
    } else {
      console.log("_onCreated: something else created:", type, e);
    }

    console.log("Geojson", layer.toGeoJSON());
    console.log("coords", layer);
  };

  const _onDeleted = (e) => {
    setDrawnData(null);
    let numDeleted = 0;
    e.layers.eachLayer((layer) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);
  };

  const _onDrawStart = (e) => {
    console.log("_onDrawStart", e);
  };

  return (
    <FeatureGroup>
      <EditControl
        onDrawStart={_onDrawStart}
        position="topright"
        onEdited={_onEdited}
        onCreated={_onCreated}
        onDeleted={_onDeleted}
        draw={{
          polyline: {
            icon: new L.DivIcon({
              iconSize: new L.Point(8, 8),
              className: "leaflet-div-icon leaflet-editing-icon",
            }),
            shapeOptions: {
              guidelineDistance: 10,
              color: "navy",
              weight: 3,
            },
          },
          rectangle: false,
          circlemarker: false,
          circle: false,
          polygon: true,
          marker: {
            icon: DefaultIcon, // Use custom icon for the pointer
          },
        }}
      />
      <div className="save-button-wrapper">
        <input
          type="text"
          placeholder="File Name"
          class="styled-input"
          value={fileName}
          onChange={handleInputChange}
        />
        <button
          className="save-button"
          onClick={handleSave}
          disabled={isButtonDisabled}
        >
          Save Data
        </button>
      </div>
    </FeatureGroup>
  );
};

export default DrawTools;
