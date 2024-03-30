import Navbar from "./navbar";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "../styles/FileUpload.css";
import axios from "axios";

export const FileUpload = () => {
  // const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL || `http://localhost:8080`;
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState("");
  const [fileRecords, setFileRecords] = useState([]);

  useEffect(() => {
    // Retrieve item from local storage
    const storedItem = localStorage.getItem("token");
    console.log(storedItem);
    if (storedItem) {
      setToken(JSON.parse(JSON.stringify(storedItem)));
    }

    // Fetch file records from the database
    axios
      .get(`${baseUrl}/file/get_all`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("Fetched records:", response.data);
        setFileRecords(response.data.files);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
      });
  }, [baseUrl, token]);

  //   const handleFileChange = (event) => {
  //     const files = event.target.files;
  //     setSelectedFile(files);
  //   };
  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0]; // Get the first selected file
    setSelectedFile(file); // Set the selected file in state
  };

  const handleUpload = () => {
    if (!selectedFile) {
      console.error("No file selected for upload");
      return;
    }

    const formData = new FormData();
    if (selectedFile instanceof Blob) {
      // Append selectedFile directly to FormData
      formData.append("file", selectedFile);
    } else {
      console.error("Selected file is not a valid Blob object");
      return;
    }
    axios
      .post(`${baseUrl}/file/upload`, formData, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("Upload successful", response.data);
        // setUploadedFiles(selectedFile);
        setSelectedFile();
      })
      .catch((error) => {
        console.error("Upload failed", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="file-upload-container">
        <h2>Upload Files</h2>
        {/* File selection input */}
        <input type="file" onChange={handleFileChange} />

        {/* Upload button */}
        <button onClick={handleUpload} disabled={selectedFile == null}>
          Upload
        </button>

        {/* Display uploaded files */}
        {/* <div className="uploaded-files-container">
          {uploadedFiles.map((file, index) => (
            <div className="file-item" key={index}>
              <span>{file.name}</span>
            </div>
          ))}
        </div> */}

        {/* Display file records */}
        <div className="file-records-container">
          <h2>File Records</h2>
          <ul>
            {fileRecords ? (
              fileRecords.map((record) => (
                <li key={record.id}>
                  Name: {record.file_name}, Type: {record.file_type}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
