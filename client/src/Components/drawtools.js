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

const DrawTools = ({ onFileLoad }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || `http://localhost:8080`;

  const [drawnData, setDrawnData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [token, setToken] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [loadFileData, setLoadFileData] = useState([]);

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
    const fetchFileData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const parsedToken = storedToken ? JSON.parse(storedToken) : null;
        setToken(parsedToken);

        const response = await axios.get(`${baseUrl}/file/get_all`, {
          headers: {
            Authorization: parsedToken,
          },
        });

        setLoadFileData(response.data.files);
      } catch (error) {
        console.error("Failed to fetch file data:", error);
      }
    };
    fetchFileData();
  }, [baseUrl]);

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
        setFileName("");
        setDrawnData([]);
        alert("Data uploaded successfully");
      })
      .catch((error) => {
        console.error("Failed to save data:", error);
      });
  };

  const _onCreated = (e) => {
    const newLayer = e.layer.toGeoJSON();
    setDrawnData((prevData) => [...prevData, newLayer]);
  };

  const _onEdited = (e) => {
    const editedLayers = e.layers.toGeoJSON();
    setDrawnData(editedLayers.features);
  };

  const _onDeleted = (e) => {
    setDrawnData(null);
    let numDeleted = 0;
    e.layers.eachLayer((layer) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);
  };
  const handleLoadData = () => {
    console.log("clicked handle load data", loadFileData);
    console.log("selectedFileId", selectedFileId);
    const selectedFile = loadFileData.find((file) => file.id == selectedFileId);
    console.log(selectedFile);
    if (selectedFile) {
      onFileLoad(JSON.parse(JSON.parse(selectedFile.file_data)));
    }
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
        <select
          className="styled-input"
          onChange={(e) => setSelectedFileId(e.target.value)}
        >
          {loadFileData && loadFileData.length === 0 && (
            <option value="" disabled>
              No files available
            </option>
          )}
          {loadFileData &&
            loadFileData.map((file) => (
              <option key={file.id} value={file.id}>
                {file.file_name}
              </option>
            ))}
        </select>
        <button
          className="save-button"
          onClick={handleLoadData}
          // disabled={isButtonDisabled}
        >
          Load Data
        </button>
      </div>
    </FeatureGroup>
  );
};

export default DrawTools;
